import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('lead route no longer relies on per-instance in-memory rate buckets', () => {
  const source = readFileSync(new URL('../src/app/api/leads/route.ts', import.meta.url), 'utf8');

  assert.doesNotMatch(source, /new Map</);
  assert.match(source, /x-forwarded-for/);
  assert.doesNotMatch(source, /x-vercel-forwarded-for/);
  assert.match(source, /createHash\('sha256'\)/);
  assert.match(source, /storeLead\(validation\.data, getClientRateKey\(request\)\)/);
});

test('trusted edge ingest verifies Vercel workload identity before v4 RPC', () => {
  const source = readFileSync(
    new URL('../supabase/functions/ghoulhouse-lead-ingest/index.ts', import.meta.url),
    'utf8'
  );

  assert.match(source, /createRemoteJWKSet/);
  assert.match(source, /project_id !== PROJECT_ID/);
  assert.match(source, /owner_id !== TEAM_ID/);
  assert.match(source, /ALLOWED_ENVIRONMENTS/);
  assert.match(source, /submit_ghoulhouse_lead_v4/);
  assert.doesNotMatch(source, /submit_ghoulhouse_lead_v3/);
});
