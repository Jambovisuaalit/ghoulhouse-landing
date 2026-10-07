import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';

test('notification recovery executes the migration against isolated PostgreSQL', async (t) => {
  const db = new PGlite();
  const query = async (sql, params = []) => (await db.query(sql, params)).rows;
  await db.exec(`
    create role anon; create role authenticated; create role service_role;
    create schema private; create schema vault; create schema net; create schema cron;
    create table public.leads (
      id uuid primary key default gen_random_uuid(), created_at timestamptz default now(),
      source text, intent text, company text, name text, email text, profile text,
      phone text, website text, instagram text, message text, service text, no_profile boolean,
      resend_request_id bigint, resend_email_id text, resend_message_id text,
      delivery_status text, delivery_last_event text, delivery_updated_at timestamptz, delivery_detail text
    );
    alter table public.leads enable row level security;
    create table vault.decrypted_secrets(name text, decrypted_secret text);
    insert into vault.decrypted_secrets values ('ghoulhouse_resend_api_key','test-only-fake-key');
    create table cron.job(jobname text, active boolean);
    insert into cron.job values ('ghoulhouse-resend-reconcile',true);
    create table net._http_response(id bigint, status_code int, headers jsonb, content text,
      timed_out boolean default false, error_msg text, created timestamptz default now());
    create table net.http_request_queue(id bigserial primary key, headers jsonb, body jsonb);
    create function net.http_post(url text, headers jsonb, body jsonb, timeout_milliseconds int)
    returns bigint language sql as $$
      insert into net.http_request_queue(headers,body) values(headers,body) returning id;
    $$;
  `);
  await db.exec(readFileSync(new URL('../supabase/migrations/20261002224042_trusted_ghoulhouse_lead_ingest_v4.sql', import.meta.url), 'utf8'));
  await db.exec(readFileSync(new URL('../supabase/migrations/20261007004821_lead_notification_recovery_and_readiness.sql', import.meta.url), 'utf8'));
  await db.exec(`create trigger trg_notify_ghoulhouse_lead after insert on public.leads
    for each row execute function private.notify_ghoulhouse_lead();`);
  const insert = async () => (await query(`insert into public.leads(intent,company,name,email,profile,service)
    values('photos','QA','QA','qa@example.com','Ei vielä verkkosivua tai Instagramia','social') returning id`))[0].id;
  const process = () => query('select private.reconcile_ghoulhouse_resend_requests()');
  const due = id => query("update private.lead_notification_outbox set next_attempt_at=now()-interval '1 second' where lead_id=$1", [id]);
  const row = async id => (await query('select * from private.lead_notification_outbox where lead_id=$1', [id]))[0];
  const response = (id, status, content) => query(`insert into net._http_response(id,status_code,content)
    values($1,$2,$3)`, [id, status, content]);
  const reset = () => db.exec('delete from public.leads; delete from net._http_response; delete from net.http_request_queue;');
  try {
    await t.test('429 retries once with identical payload/key and stops after acceptance', async () => {
      const id = await insert();
      assert.equal((await row(id)).attempts, 0);
      await process();
      const first = await row(id);
      await response(first.request_id, 429, '{}'); await due(id); await process();
      assert.equal((await row(id)).state, 'retry');
      await query("update public.leads set company='changed after enqueue' where id=$1", [id]);
      await due(id); await process();
      const second = await row(id);
      assert.equal(second.attempts, 2);
      const sends = await query('select headers,body from net.http_request_queue order by id');
      assert.equal(sends.length, 2);
      assert.deepEqual(sends[0], sends[1]);
      assert.equal(sends[0].headers['Idempotency-Key'], 'ghoulhouse-lead/' + id);
      await response(second.request_id, 200, '{"id":"email-accepted"}'); await due(id); await process();
      assert.equal((await row(id)).state, 'accepted');
      await process();
      assert.equal((await query('select count(*)::int n from net.http_request_queue'))[0].n, 2);
      assert.equal((await query('select resend_email_id from public.leads where id=$1', [id]))[0].resend_email_id, 'email-accepted');
      await reset();
    });
    await t.test('permanent failure raises an alert and fails readiness without another send', async () => {
      const id = await insert(); await process();
      await response((await row(id)).request_id, 422, '{}'); await due(id); await process();
      assert.equal((await row(id)).state, 'failed');
      assert.equal((await query('select count(*)::int n from private.lead_notification_alerts'))[0].n, 1);
      assert.equal((await query('select public.check_ghoulhouse_lead_readiness() r'))[0].r.ok, false);
      await process();
      assert.equal((await query('select count(*)::int n from net.http_request_queue'))[0].n, 1);
      await reset();
    });
    await t.test('lost response is retried safely and retry budget is four total attempts', async () => {
      const id = await insert(); await process();
      await query("update private.lead_notification_outbox set last_attempt_at=now()-interval '3 minutes' where lead_id=$1", [id]);
      await due(id); await process();
      assert.equal((await row(id)).state, 'retry');
      for (let attempt = 2; attempt <= 4; attempt++) {
        await due(id); await process();
        const item = await row(id);
        assert.equal(item.attempts, attempt);
        await response(item.request_id, 503, '{}'); await due(id); await process();
      }
      assert.equal((await row(id)).state, 'failed');
      assert.equal((await query('select count(*)::int n from net.http_request_queue'))[0].n, 4);
      await reset();
    });
    await t.test('expired idempotency window cannot send and verified webhook prevents duplicates', async () => {
      const expired = await insert();
      await query("update private.lead_notification_outbox set created_at=now()-interval '24 hours' where lead_id=$1", [expired]);
      await process();
      assert.equal((await row(expired)).state, 'failed');
      assert.equal((await query('select count(*)::int n from net.http_request_queue'))[0].n, 0);
      const webhook = await insert(); await process();
      await query("update public.leads set resend_email_id='webhook-email',delivery_status='delivered' where id=$1", [webhook]);
      await due(webhook); await process();
      assert.equal((await row(webhook)).state, 'accepted');
      await process();
      assert.equal((await query('select count(*)::int n from net.http_request_queue'))[0].n, 1);
      await reset();
    });
    await t.test('readiness checks credentials, cron and stalled queue and is backend-only', async () => {
      const ready = async () => (await query('select public.check_ghoulhouse_lead_readiness() r'))[0].r;
      assert.equal((await ready()).ok, true);
      await db.exec("update cron.job set active=false");
      assert.equal((await ready()).notifications.ready, false);
      await db.exec("update cron.job set active=true; delete from vault.decrypted_secrets");
      assert.equal((await ready()).notifications.ready, false);
      await db.exec("insert into vault.decrypted_secrets values('ghoulhouse_resend_api_key','test-only-fake-key')");
      const id = await insert();
      await query("update private.lead_notification_outbox set next_attempt_at=now()-interval '6 minutes' where lead_id=$1", [id]);
      assert.equal((await ready()).notifications.stale, 1);
      const grants = (await query(`select has_function_privilege('anon','public.check_ghoulhouse_lead_readiness()','execute') anon,
        has_function_privilege('authenticated','public.check_ghoulhouse_lead_readiness()','execute') authenticated,
        has_function_privilege('service_role','public.check_ghoulhouse_lead_readiness()','execute') backend`))[0];
      assert.deepEqual(grants, { anon: false, authenticated: false, backend: true });
      await reset();
    });
  } finally { await db.close(); }
});
