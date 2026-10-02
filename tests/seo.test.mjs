import test from 'node:test';
import assert from 'node:assert/strict';
import { isIndexingEnabled, shouldIndexRequest } from '../src/lib/seo.ts';

function restoreEnv(name, value) {
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
}

test('SITE_INDEXABLE acts as an explicit production indexing kill switch', () => {
  const originalVercelEnv = process.env.VERCEL_ENV;
  const originalSiteIndexable = process.env.SITE_INDEXABLE;

  try {
    process.env.VERCEL_ENV = 'production';
    delete process.env.SITE_INDEXABLE;
    assert.equal(isIndexingEnabled(), true);
    assert.equal(shouldIndexRequest('ghoulhouse.fi'), true);

    process.env.SITE_INDEXABLE = 'false';
    assert.equal(isIndexingEnabled(), false);
    assert.equal(shouldIndexRequest('ghoulhouse.fi'), false);

    process.env.SITE_INDEXABLE = 'true';
    assert.equal(shouldIndexRequest('ghoulhouse.fi'), true);
    assert.equal(shouldIndexRequest('www.ghoulhouse.fi'), false);

    process.env.VERCEL_ENV = 'preview';
    assert.equal(shouldIndexRequest('ghoulhouse.fi'), false);
  } finally {
    restoreEnv('VERCEL_ENV', originalVercelEnv);
    restoreEnv('SITE_INDEXABLE', originalSiteIndexable);
  }
});
