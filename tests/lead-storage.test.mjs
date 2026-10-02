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

function withOidcToken(value = 'test-vercel-oidc-token') {
  const original = process.env.VERCEL_OIDC_TOKEN;
  process.env.VERCEL_OIDC_TOKEN = value;
  return () => {
    if (original === undefined) delete process.env.VERCEL_OIDC_TOKEN;
    else process.env.VERCEL_OIDC_TOKEN = original;
  };
}

test('lead storage forwards Vercel workload identity and server-derived rate key', async () => {
  const restoreToken = withOidcToken();
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
    const id = await storeLead(lead, 'a'.repeat(64));
    assert.equal(id, '11111111-1111-4111-8111-111111111111');
    assert.match(seen.url, /\/functions\/v1\/ghoulhouse-lead-ingest$/);
    assert.equal(seen.init.headers.authorization, 'Bearer test-vercel-oidc-token');
    assert.equal(seen.init.headers['x-gh-client-key'], 'a'.repeat(64));
    assert.equal(seen.init.headers.apikey, undefined);
  } finally {
    globalThis.fetch = originalFetch;
    restoreToken();
  }
});

test('lead storage preserves distributed rate-limit Retry-After', async () => {
  const restoreToken = withOidcToken();
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async () =>
    new Response(JSON.stringify({ ok: false, code: 'rate_limited' }), {
      status: 429,
      headers: { 'retry-after': '600' },
    });

  try {
    await assert.rejects(
      () => storeLead(lead, 'b'.repeat(64)),
      (error) =>
        error instanceof LeadStorageError &&
        error.code === 'rate_limited' &&
        error.retryAfterSeconds === 600
    );
  } finally {
    globalThis.fetch = originalFetch;
    restoreToken();
  }
});

test('lead storage converts an upstream timeout into a typed failure', async () => {
  const restoreToken = withOidcToken();
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async () => {
    const error = new Error('timed out');
    error.name = 'TimeoutError';
    throw error;
  };

  try {
    await assert.rejects(
      () => storeLead(lead, 'c'.repeat(64)),
      (error) => error instanceof LeadStorageError && error.code === 'storage_timeout'
    );
  } finally {
    globalThis.fetch = originalFetch;
    restoreToken();
  }
});

test('health check uses the same OIDC-authenticated edge boundary', async () => {
  const restoreToken = withOidcToken();
  const originalFetch = globalThis.fetch;
  let method;

  globalThis.fetch = async (_url, init) => {
    method = init.method;
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  };

  try {
    await checkLeadStorageHealth();
    assert.equal(method, 'GET');
  } finally {
    globalThis.fetch = originalFetch;
    restoreToken();
  }
});
