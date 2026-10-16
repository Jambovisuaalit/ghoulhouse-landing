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

test('missing or invalid service is rejected for JSON and native forms before storage', async () => {
  let calls = 0;
  const { POST } = loadTs('src/app/api/leads/route.ts', {
    '@/lib/lead-storage': { storeLead: async () => { calls++; }, LeadStorageError: class extends Error {} },
  });
  for (const service of ['', 'unsupported']) {
    const payload = { intent: 'booking', company: 'QA', name: 'QA', contact: 'qa@example.com', service };
    const json = await POST(new NextRequest('https://ghoulhouse.fi/api/leads', {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload),
    }));
    assert.equal(json.status, 400);
    assert.ok((await json.json()).errors.service);
    const html = await POST(new NextRequest('https://ghoulhouse.fi/api/leads', {
      method: 'POST', body: new URLSearchParams(payload),
    }));
    assert.equal(html.status, 303);
    assert.equal(new URL(html.headers.get('location')).searchParams.get('lead'), 'validation');
  }
  assert.equal(calls, 0);
});

test('body limit counts actual bytes for JSON, native forms and chunked bodies', async () => {
  let calls = 0;
  const { POST } = loadTs('src/app/api/leads/route.ts', {
    '@/lib/lead-storage': { storeLead: async () => { calls++; }, LeadStorageError: class extends Error {} },
  });
  for (const [type, body] of [
    ['application/json', JSON.stringify({ padding: 'x'.repeat(50000) })],
    ['application/json', JSON.stringify({ padding: '€'.repeat(17000) })],
    ['application/x-www-form-urlencoded', 'fax=bot&padding=' + 'x'.repeat(50000)],
    ['multipart/form-data; boundary=test', '--test\r\n' + 'x'.repeat(50000)],
  ]) {
    const req = new NextRequest('https://ghoulhouse.fi/api/leads', {
      method: 'POST', headers: { 'content-type': type }, body,
    });
    assert.equal(req.headers.get('content-length'), null);
    assert.equal((await POST(req)).status, 413);
  }
  let cancelled = false;
  const stream = new ReadableStream({ pull(controller) { controller.enqueue(new Uint8Array(10001)); }, cancel() { cancelled = true; } });
  const response = await POST(new NextRequest('https://ghoulhouse.fi/api/leads', {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: stream, duplex: 'half',
  }));
  assert.equal(response.status, 413);
  assert.equal(cancelled, true);
  const exactBody = JSON.stringify({ fax: 'bot', padding: '' });
  for (const size of [50000, 50001]) {
    const body = JSON.stringify({ fax: 'bot', padding: 'x'.repeat(size - exactBody.length) });
    assert.equal(Buffer.byteLength(body), size);
    const response = await POST(new NextRequest('https://ghoulhouse.fi/api/leads', {
      method: 'POST', headers: { 'content-type': 'application/json' }, body,
    }));
    assert.equal(response.status, size === 50000 ? 201 : 413);
  }
  assert.equal(calls, 0);
});
