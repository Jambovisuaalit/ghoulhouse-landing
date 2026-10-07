import test from 'node:test';
import assert from 'node:assert/strict';
import { LeadStorageError, checkLeadStorageHealth, storeLead } from '../src/lib/lead-storage.ts';

const lead = {
  intent: 'photos',
  service: 'social',
  company: 'QA Oy',
  name: 'QA',
  email: 'qa@example.com',
  profile: 'Ei vielä verkkosivua tai Instagramia',
  noProfile: true,
  phone: '',
  website: '',
  instagram: '',
  message: 'timeout-test',
};

const workloadToken = 'test-vercel-oidc-token';

test('lead storage forwards request-scoped Vercel workload identity and server-derived rate key', async () => {
  const originalFetch = globalThis.fetch;
  let seen;

  globalThis.fetch = async (url, init) => {
    seen = { url: String(url), init };
    return new Response(JSON.stringify({ ok: true, id: '11111111-1111-4111-8111-111111111111' }), {
      status: 201,
      headers: { 'content-type': 'application/json' },
    });
  };

  try {
    const id = await storeLead(lead, 'a'.repeat(64), workloadToken);
    assert.equal(id, '11111111-1111-4111-8111-111111111111');
    assert.match(seen.url, /\/functions\/v1\/ghoulhouse-lead-ingest$/);
    assert.equal(seen.init.headers.authorization, 'Bearer test-vercel-oidc-token');
    assert.equal(seen.init.headers['x-gh-client-key'], 'a'.repeat(64));
    assert.equal(seen.init.headers.apikey, undefined);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('missing request-scoped workload identity fails closed', async () => {
  await assert.rejects(
    () => storeLead(lead, 'a'.repeat(64), null),
    (error) => error instanceof LeadStorageError && error.code === 'not_configured'
  );
});

test('lead storage preserves distributed rate-limit Retry-After', async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async () =>
    new Response(JSON.stringify({ ok: false, code: 'rate_limited' }), {
      status: 429,
      headers: { 'retry-after': '600' },
    });

  try {
    await assert.rejects(
      () => storeLead(lead, 'b'.repeat(64), workloadToken),
      (error) =>
        error instanceof LeadStorageError &&
        error.code === 'rate_limited' &&
        error.retryAfterSeconds === 600
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('lead storage converts an upstream timeout into a typed failure', async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async () => {
    const error = new Error('timed out');
    error.name = 'TimeoutError';
    throw error;
  };

  try {
    await assert.rejects(
      () => storeLead(lead, 'c'.repeat(64), workloadToken),
      (error) => error instanceof LeadStorageError && error.code === 'storage_timeout'
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('health check uses the same request-scoped OIDC-authenticated edge boundary', async () => {
  const originalFetch = globalThis.fetch;
  let method;

  globalThis.fetch = async (_url, init) => {
    method = init.method;
    return new Response(JSON.stringify({ ok: true, storage: { ready: true }, notifications: { ready: true } }), { status: 200 });
  };

  try {
    await checkLeadStorageHealth(workloadToken);
    assert.equal(method, 'GET');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('health fails closed on a superficial or degraded success response', async () => {
  const originalFetch = globalThis.fetch;
  try {
    for (const body of [{ ok: true }, { ok: true, storage: { ready: false } },
      { ok: true, storage: { ready: true }, notifications: { ready: false } }]) {
      globalThis.fetch = async () => Response.json(body);
      await assert.rejects(() => checkLeadStorageHealth(workloadToken),
        error => error instanceof LeadStorageError && error.code === 'storage_failed');
    }
    globalThis.fetch = async () => Response.json({ code: 'invalid_payload' }, { status: 400 });
    await assert.rejects(() => storeLead(lead, 'a'.repeat(64), workloadToken),
      error => error instanceof LeadStorageError && error.code === 'invalid_payload');
  } finally { globalThis.fetch = originalFetch; }
});
