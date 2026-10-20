import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
function walk(path) {
  return readdirSync(path, { withFileTypes: true }).flatMap(entry => {
    const target = resolve(path, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}
const manifest = JSON.parse(readFileSync(resolve(root, 'docs/resources.json'), 'utf8'));
const expected = [...walk(resolve(root, 'public')), ...walk(resolve(root, 'src/app/fonts')).filter(p => p.endsWith('.woff2'))]
  .map(p => relative(root, p)).sort();
const actual = manifest.assets.map(asset => asset.path).sort();
assert.equal(new Set(actual).size, actual.length, 'Duplicate manifest paths');
assert.deepEqual(actual, expected, 'Every public asset and local font must be registered');
for (const asset of manifest.assets) {
  const file = resolve(root, asset.path);
  assert(file.startsWith(root + '/'), `Asset outside repository: ${asset.path}`);
  const bytes = readFileSync(file);
  assert.equal(asset.bytes, bytes.length, `Stale size: ${asset.path}`);
  assert.equal(asset.sha256, createHash('sha256').update(bytes).digest('hex'), `Unreviewed asset change: ${asset.path}`);
  assert(['current', 'legacy-retained', 'css-reference-only'].includes(asset.status), `Unknown asset status: ${asset.path}`);
  assert(['license-documented', 'evidence-pending'].includes(asset.rightsStatus), `Unknown rights state: ${asset.path}`);
  if (asset.rightsStatus === 'license-documented') {
    assert(asset.rightsEvidence && existsSync(resolve(root, asset.rightsEvidence)), `Missing license evidence: ${asset.path}`);
  }
  if (asset.kind === 'concept') assert(asset.usageConstraint.includes('not-customer-work'), 'Concept disclosure policy missing');
}

// Catch deletions that leave unresolved code imports; package imports are external.
for (const file of walk(resolve(root, 'src')).filter(p => /\.(tsx?|css)$/.test(p))) {
  const text = readFileSync(file, 'utf8');
  for (const [, spec] of text.matchAll(/(?:from\s*|import\s*)['"]([^'"]+)['"]/g)) {
    if (!spec.startsWith('.') && !spec.startsWith('@/')) continue;
    const base = spec.startsWith('@/') ? resolve(root, 'src', spec.slice(2)) : resolve(dirname(file), spec);
    assert(['', '.ts', '.tsx', '.css', '/index.ts', '/index.tsx'].some(ext => existsSync(base + ext)), `Unresolved import ${spec} in ${relative(root, file)}`);
  }
}
// Current documentation must not link to removed/moved local files.
const docs = [resolve(root, 'README.md'), ...walk(resolve(root, 'docs')).filter(p => p.endsWith('.md') && !p.includes('/archive/'))];
for (const file of docs) {
  for (const [, link] of readFileSync(file, 'utf8').matchAll(/\]\(([^)]+)\)/g)) {
    if (/^(?:https?:|mailto:|#)/.test(link)) continue;
    assert(existsSync(resolve(dirname(file), link.split('#')[0])), `Broken documentation link ${link} in ${relative(root, file)}`);
  }
}
console.log(`Resource QA PASS: ${actual.length} hashed assets, local imports and current documentation links`);
