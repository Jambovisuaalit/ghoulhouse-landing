import test from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server.js';
import { loadTs } from './helpers/load-ts.mjs';

test('lead POST returns 400 for non-object JSON without touching storage', async () => {
  let calls = 0;
  const { POST } = loadTs('src/app/api/leads/route.ts', {
    '@/lib/lead-storage': { storeLead: async () => { calls++; }, LeadStorageError: class extends Error {} },
  });
  for (const body of ['null', '[]', '"text"', '42', 'true', '{', '{}']) {
    const response = await POST(new NextRequest('https://ghoulhouse.fi/api/leads', {
      method: 'POST', headers: { 'content-type': 'application/json' }, body,
    }));
    assert.equal(response.status, 400, body);
  }
  assert.equal(calls, 0);
});

test('upstream validation errors remain 400 and native forms return to the correct intent', async () => {
  const { LeadStorageError } = loadTs('src/lib/lead-storage.ts');
  const { POST } = loadTs('src/app/api/leads/route.ts', {
    '@/lib/lead-storage': { LeadStorageError, storeLead: async () => {
      throw new LeadStorageError('invalid_payload', 'invalid_company');
    } },
  });
  const payload = { intent: 'photos', service: 'social', company: 'QA', name: 'QA', contact: 'qa@example.com' };
  const json = await POST(new NextRequest('https://ghoulhouse.fi/api/leads', {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload),
  }));
  assert.equal(json.status, 400);
  assert.equal((await json.json()).code, 'validation_error');
  const html = await POST(new NextRequest('https://ghoulhouse.fi/api/leads', {
    method: 'POST', body: new URLSearchParams(payload),
  }));
  assert.equal(html.status, 303);
  const destination = new URL(html.headers.get('location'));
  assert.equal(destination.hash, '#yhteys');
  assert.equal(destination.searchParams.get('intent'), 'photos');
  assert.equal(destination.searchParams.get('lead'), 'validation');
});
