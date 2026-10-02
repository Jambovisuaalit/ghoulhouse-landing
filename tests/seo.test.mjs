import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('SITE_INDEXABLE is wired into the canonical production indexing predicate', () => {
  const source = readFileSync(new URL('../src/lib/seo.ts', import.meta.url), 'utf8');
  const layout = readFileSync(new URL('../src/app/layout.tsx', import.meta.url), 'utf8');

  assert.match(source, /SITE_INDEXABLE\?\.trim\(\)\.toLowerCase\(\) !== 'false'/);
  assert.match(source, /isProductionDeployment\(\) && isIndexingEnabled\(\) && isCanonicalHost\(value\)/);
  assert.match(layout, /isProductionDeployment\(\) && isIndexingEnabled\(\)/);
});
