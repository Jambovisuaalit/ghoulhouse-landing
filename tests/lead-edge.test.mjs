import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTs } from './helpers/load-ts.mjs';

test('edge health requires credentials, reachable readiness RPC and healthy notifications', async () => {
  const previous = { Deno: globalThis.Deno, fetch: globalThis.fetch };
  let handler, config = {}, calls = 0;
  globalThis.Deno = { env: { get: name => config[name] }, serve: fn => { handler = fn; } };
  try {
    loadTs('supabase/functions/ghoulhouse-lead-ingest/index.ts', {
      'npm:jose@6.2.12': { createRemoteJWKSet: () => ({}), jwtVerify: async () => ({ payload: {
        environment: 'production', owner_id: 'team_zwsvoePoiBeskRuyl2Iar883',
        project_id: 'prj_4St4iNqJbNIbdpsoOaftanarvDLW', project: 'ghoulhouse-home',
      } }) },
    });
    const request = () => new Request('https://example.invalid', { headers: { authorization: 'Bearer test' } });
    globalThis.fetch = async () => { calls++; throw Error('offline'); };
    assert.equal((await handler(request())).status, 503);
    assert.equal(calls, 0);
    config = { SUPABASE_URL: 'https://example.invalid', SUPABASE_SECRET_KEYS: '{"default":"fake"}' };
    assert.equal((await handler(request())).status, 503);
    globalThis.fetch = async () => new Response('RPC missing', { status: 404 });
    assert.equal((await handler(request())).status, 503);
    globalThis.fetch = async () => Response.json({ ok: true });
    assert.equal((await handler(request())).status, 503);
    globalThis.fetch = async (url, init) => {
      assert.match(url, /rpc\/check_ghoulhouse_lead_readiness$/);
      assert.equal(init.headers.apikey, 'fake');
      return Response.json({ ok: true, storage: { ready: true }, notifications: { ready: true } });
    };
    assert.equal((await handler(request())).status, 200);
    assert.equal((await handler(new Request('https://example.invalid'))).status, 401);
  } finally { globalThis.Deno = previous.Deno; globalThis.fetch = previous.fetch; }
});
