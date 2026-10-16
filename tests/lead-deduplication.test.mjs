import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';

test('database ingest deduplicates retries atomically without duplicate notifications', async () => {
  const db = new PGlite();
  try {
    await db.exec(`create role anon; create role authenticated; create role service_role;
      create schema private;
      create table public.leads (id uuid primary key default gen_random_uuid(),
        source text, intent text, company text, name text, email text, profile text,
        phone text, website text, instagram text, message text, service text, no_profile boolean);
      create table private.test_notifications (lead_id uuid);
      create function private.test_notify() returns trigger language plpgsql as $$
        begin insert into private.test_notifications values(new.id); return new; end $$;
      create trigger test_notification after insert on public.leads for each row execute function private.test_notify();`);
    for (const file of ['20261002224042_trusted_ghoulhouse_lead_ingest_v4.sql', '20261016184511_lead_validation_deduplication.sql']) {
      await db.exec(readFileSync(new URL('../supabase/migrations/' + file, import.meta.url), 'utf8'));
    }
    const submit = async (rate = 'a'.repeat(64), message = 'Original', service = 'social') =>
      (await db.query(`select public.submit_ghoulhouse_lead_v4($1,'booking','QA','QA','QA@example.com',
        'Ei vielä verkkosivua tai Instagramia',null,null,null,$2,$3,true) id`, [rate, message, service])).rows[0].id;
    const first = await submit();
    assert.equal(await submit('b'.repeat(64)), first, 'retry works even after IP change');
    const ids = await Promise.all(Array.from({ length: 8 }, () => submit()));
    assert.ok(ids.every(id => id === first));
    assert.equal((await db.query('select count(*)::int n from public.leads')).rows[0].n, 1);
    assert.equal((await db.query('select count(*)::int n from private.test_notifications')).rows[0].n, 1);
    assert.equal((await db.query('select request_count from private.lead_rate_buckets')).rows[0].request_count, 1);
    assert.notEqual(await submit('c'.repeat(64), 'Changed'), first);
    for (const service of [null, '', 'unknown']) await assert.rejects(submit('d'.repeat(64), 'Invalid', service), /invalid_service/);
    await assert.rejects(db.query(`select public.submit_ghoulhouse_lead_v4($1,'photos','QA','QA',
      'qa@example.com','example.com',null,'https://example.com',null,null,'seo',false)`, ['e'.repeat(64)]), /invalid_service/);
    await db.exec("update private.lead_submission_fingerprints set expires_at=now()-interval '1 second'");
    assert.notEqual(await submit(), first, 'identical new inquiry allowed after 24h window');
    await db.exec('begin;');
    await submit('f'.repeat(64), 'Rolled back');
    await db.exec('rollback;');
    assert.equal((await db.query('select count(*)::int n from public.leads')).rows[0].n, 3);
    assert.equal((await db.query('select count(*)::int n from private.test_notifications')).rows[0].n, 3);
    const perms = (await db.query(`select
      has_table_privilege('anon','private.lead_submission_fingerprints','select') anon_read,
      has_table_privilege('service_role','private.lead_submission_fingerprints','insert') direct_write,
      has_function_privilege('anon','public.submit_ghoulhouse_lead_v4(text,text,text,text,text,text,text,text,text,text,text,boolean)','execute') anon_execute`)).rows[0];
    assert.deepEqual(perms, { anon_read: false, direct_write: false, anon_execute: false });
  } finally { await db.close(); }
});
