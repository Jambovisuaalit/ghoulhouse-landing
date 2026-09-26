import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const BASE = process.env.QA_BASE_URL || 'http://127.0.0.1:3000';
const pages = [
  '/', '/rakennusyrityksille', '/lvi-yrityksille',
  '/some-sisallontuotanto', '/instagram-sisallontuotanto',
  '/referenssit', '/tyot/ghoulhouse-verkkosivut', '/some-12',
  '/verkkosivut-yritykselle', '/verkkosivut/hinta',
  '/verkkosivut/rakennus', '/verkkosivut/lvi', '/verkkosivut/sahko',
  '/resurssit', '/oppaat/verkkosivut-itse-vai-ammattilaiselta',
  '/saneerausyrityksille', '/some-sisallontuotanto/hinta',
  '/oppaat/rakennusyrityksen-some',
  '/oppaat/tyomaakuvat-sosiaaliseen-mediaan',
];

// The 19 canonical HTML pages supplied for the site-wide brand rollout.
const sitemap = readFileSync('src/app/sitemap.ts', 'utf8');
for (const page of pages.slice(1)) {
  assert(sitemap.includes("'" + page.slice(1) + "'"), 'Sitemap missing ' + page);
}
const svg = [
  ['/favicon.svg', '512', '#C83830'],
  ['/ghoulhouse-logo.svg', '1400', '#C83830'],
  ['/ghoulhouse-logo-reverse.svg', '1400', '#FFFFFF'],
  ['/ghoulhouse-mark.svg', '512', '#C83830'],
  ['/ghoulhouse-mark-reverse.svg', '512', '#FFFFFF'],
  ['/ghoulhouse-wordmark-white.svg', '1000', '#FFFFFF'],
];
for (const [path, width, fill] of svg) {
  const response = await fetch(BASE + path);
  assert.equal(response.status, 200, 'Logo unavailable: ' + path);
  assert(response.headers.get('content-type')?.includes('image/svg+xml'),
    'SVG content-type missing: ' + path);
  const source = await response.text();
  assert(source.includes('width="' + width + '"') && source.includes(fill),
    'Wrong official logo asset or colors: ' + path);
}
for (const size of [180, 192, 512]) {
  const response = await fetch(BASE + '/brand-icons/' + size);
  const bytes = await response.arrayBuffer();
  assert.equal(response.status, 200, 'Generated icon unavailable: ' + size);
  assert(response.headers.get('content-type')?.startsWith('image/png'),
    'Generated icon must be a PNG: ' + size);
  assert(bytes.byteLength > 1500, 'Generated official mark is suspiciously small: ' + size);
}
const results = await Promise.all(pages.map(async path => {
  const response = await fetch(BASE + path, { headers: { Accept: 'text/html' } });
  const html = await response.text();
  assert.equal(response.status, 200, 'Page HTTP status: ' + path);
  assert(html.includes('/ghoulhouse-logo.svg'), 'Official primary logo missing from header: ' + path);
  assert(html.includes('/ghoulhouse-logo-reverse.svg'),
    'Official reverse logo missing from shared footer: ' + path);
  assert(html.includes('/ghoulhouse-wordmark-white.svg'),
    'Official white wordmark missing from shared footer: ' + path);
  assert(html.includes('/favicon.svg'), 'Official favicon metadata missing: ' + path);
  assert(html.includes('href="/brand-icons/180"'), 'Official Apple touch icon missing: ' + path);
  return { path, status: response.status };
}));
const manifestResponse = await fetch(BASE + '/manifest.webmanifest');
assert.equal(manifestResponse.status, 200, 'Manifest unavailable');
const manifest = await manifestResponse.json();
assert(['/favicon.svg', '/brand-icons/192', '/brand-icons/512'].every(p =>
  manifest.icons.some(icon => icon.src === p)), 'Manifest does not point to official logo assets.');
console.log('Official brand QA PASS: 19/19 page headers, shared footers, 6 SVGs, Apple/PWA PNGs, metadata, manifest and sitemap coverage.');
console.log(JSON.stringify(results));
