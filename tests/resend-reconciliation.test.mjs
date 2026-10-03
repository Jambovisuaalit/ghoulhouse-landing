import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('Resend webhook verifies signatures before reconciling delivery state', () => {
  const source = readFileSync(
    new URL('../supabase/functions/ghoulhouse-resend-events/index.ts', import.meta.url),
    'utf8'
  );

  assert.match(source, /new Webhook\(secret\)/);
  assert.match(source, /webhook\.verify\(/);
  assert.match(source, /svix-id/);
  assert.match(source, /email\.delivered/);
  assert.match(source, /email\.failed/);
  assert.match(source, /apply_ghoulhouse_resend_event/);
  assert.match(source, /source.*ghoulhouse_lead/s);
});

test('delivery reconciliation is idempotent and scheduled', () => {
  const reconciliation = readFileSync(
    new URL('../supabase/migrations/20261002230608_resend_delivery_reconciliation.sql', import.meta.url),
    'utf8'
  );
  const sendResponse = readFileSync(
    new URL('../supabase/migrations/20261002231115_resend_send_response_reconciliation.sql', import.meta.url),
    'utf8'
  );

  assert.match(reconciliation, /on conflict \(svix_id\) do nothing/i);
  assert.match(reconciliation, /delivery_status/i);
  assert.match(reconciliation, /email\.bounced/);
  assert.match(reconciliation, /email\.suppressed/);
  assert.match(sendResponse, /reconcile_ghoulhouse_resend_requests/);
  assert.match(sendResponse, /cron\.schedule/);
  assert.match(sendResponse, /notification\.send_failed/);
  assert.match(sendResponse, /notification\.accepted/);
});
