import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

function filesUnder(path) {
  return readdirSync(path).flatMap((name) => {
    const child = join(path, name);
    return statSync(child).isDirectory() ? filesUnder(child) : [child];
  });
}

test('SITE_INDEXABLE is wired into the canonical production indexing predicate', () => {
  const source = readFileSync(new URL('../src/lib/seo.ts', import.meta.url), 'utf8');
  const layout = readFileSync(new URL('../src/app/layout.tsx', import.meta.url), 'utf8');

  assert.match(source, /SITE_INDEXABLE\?\.trim\(\)\.toLowerCase\(\) !== 'false'/);
  assert.match(source, /isProductionDeployment\(\) && isIndexingEnabled\(\) && isCanonicalHost\(value\)/);
  assert.match(source, /export function indexableRobots\(\)/);
  assert.match(source, /isProductionDeployment\(\) && isIndexingEnabled\(\)/);
  assert.match(layout, /isProductionDeployment\(\) && isIndexingEnabled\(\)/);
});

test('indexable pages do not bypass the central SITE_INDEXABLE metadata helper', () => {
  const appPath = fileURLToPath(new URL('../src/app/', import.meta.url));
  const pageFiles = filesUnder(appPath)
    .filter((path) => path.endsWith('page.tsx'));

  for (const path of pageFiles) {
    const source = readFileSync(path, 'utf8');
    assert.doesNotMatch(
      source,
      /robots:\s*process\.env\.VERCEL_ENV === 'production'/,
      `Direct VERCEL_ENV robots metadata found in ${path}`
    );
  }
});
