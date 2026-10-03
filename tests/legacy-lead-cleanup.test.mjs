import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';

const migration = readFileSync(new URL('../supabase/migrations/20261003094003_remove_legacy_ghoulhouse_lead_ingest.sql', import.meta.url), 'utf8');
const v4Migration = readFileSync(new URL('../supabase/migrations/20261002224042_trusted_ghoulhouse_lead_ingest_v4.sql', import.meta.url), 'utf8');

async function fixture() {
  const db = new PGlite();
  await db.exec(`
    create role anon; create role authenticated; create role service_role;
    create schema private; create schema cron;
    create table cron.job(active boolean, command text);
    create table private.lead_rate_limits(ip text, created_at timestamptz);
    insert into private.lead_rate_limits values ('fixture', now() - interval '1 day');
    create table public.leads (
      id uuid primary key default gen_random_uuid(), source text, intent text,
      company text, name text, email text, profile text, phone text, website text,
      instagram text, message text, service text, no_profile boolean
    );
    insert into public.leads(company) values ('existing lead');
    create function public.submit_ghoulhouse_lead(text,text,text,text,text,text,text,text,text)
      returns void language plpgsql as $$ begin perform 1 from private.lead_rate_limits; end $$;
    create function public.submit_ghoulhouse_lead_v2(text,text,text,text,text,text,text,text,text,text,boolean)
      returns void language plpgsql as $$ begin perform 1 from private.lead_rate_limits; end $$;
    create function public.submit_ghoulhouse_lead_v3(text,text,text,text,text,text,text,text,text,text,boolean)
      returns void language plpgsql as $$ begin perform 1 from private.lead_rate_limits; end $$;
  `);
  await db.exec(v4Migration);
  return db;
}

async function assertLegacyIntact(db) {
  const { rows } = await db.query(`select
    (select count(*)::int from pg_proc where proname in
      ('submit_ghoulhouse_lead','submit_ghoulhouse_lead_v2','submit_ghoulhouse_lead_v3')) as functions,
    (select count(*)::int from private.lead_rate_limits) as counters,
    (select count(*)::int from public.leads) as leads`);
  assert.deepEqual(rows[0], { functions: 3, counters: 1, leads: 1 });
}

test('cleanup removes legacy objects, preserves v4 and leads, and can be reapplied', async () => {
  const db = await fixture();
  try {
    const before = await db.query("select pg_get_functiondef(oid) as definition from pg_proc where proname='submit_ghoulhouse_lead_v4'");
    await db.exec(migration);
    await db.exec(migration);
    const after = await db.query("select pg_get_functiondef(oid) as definition from pg_proc where proname='submit_ghoulhouse_lead_v4'");
    assert.deepEqual(after.rows, before.rows);
    const removed = await db.query(`select to_regclass('private.lead_rate_limits') as legacy,
      (select count(*)::int from pg_proc where proname in
       ('submit_ghoulhouse_lead','submit_ghoulhouse_lead_v2','submit_ghoulhouse_lead_v3')) as functions`);
    assert.deepEqual(removed.rows[0], { legacy: null, functions: 0 });
    await db.query(`select public.submit_ghoulhouse_lead_v4(
      repeat('a',64),'booking','fixture company','fixture name','qa@example.invalid','fixture profile')`);
    const counts = await db.query(`select (select count(*)::int from public.leads) as leads,
      (select request_count from private.lead_rate_buckets where rate_key=repeat('a',64)) as requests`);
    assert.deepEqual(counts.rows[0], { leads: 2, requests: 1 });
    await db.exec('set role anon');
    await assert.rejects(db.query(`select public.submit_ghoulhouse_lead_v4(
      repeat('b',64),'booking','fixture company','fixture name','qa@example.invalid','fixture profile')`), /permission denied/);
  } finally { await db.close(); }
});

for (const [name, setup, error] of [
  ['recent legacy activity', "update private.lead_rate_limits set created_at=now()", /recent activity/],
  ['an untracked PL/pgSQL caller', "create function public.still_active() returns void language plpgsql as $$ begin perform 1 from private.lead_rate_limits; end $$", /non-legacy routine/],
  ['an active scheduled caller', "insert into cron.job values(true,'select public.submit_ghoulhouse_lead_v3()')", /active cron/],
  ['a catalog-tracked view dependency', 'create view public.legacy_view as select ip from private.lead_rate_limits', /depend on it/],
  ['public v4 execution', 'grant execute on all functions in schema public to anon', /backend-only/],
  ['missing v4 buckets', 'drop table private.lead_rate_buckets', /v4 ingest must exist/],
]) {
  test(`cleanup aborts atomically for ${name}`, async () => {
    const db = await fixture();
    try {
      await db.exec(setup);
      await assert.rejects(db.exec(migration), error);
      await assertLegacyIntact(db);
    } finally { await db.close(); }
  });
}

test('unexpected legacy overload rolls back the exact-signature drops', async () => {
  const db = await fixture();
  try {
    await db.exec('create function public.submit_ghoulhouse_lead_v3(integer) returns int language sql as $$ select $1 $$');
    await assert.rejects(db.exec(migration), /Unexpected legacy function overload/);
    await db.exec('drop function public.submit_ghoulhouse_lead_v3(integer)');
    await assertLegacyIntact(db);
  } finally { await db.close(); }
});
