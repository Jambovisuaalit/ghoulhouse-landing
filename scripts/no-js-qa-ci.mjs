import { execFileSync } from 'node:child_process';

const BASE_URL = process.env.QA_BASE_URL || 'http://127.0.0.1:3000';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function findChrome() {
  const chrome = execFileSync(
    'bash',
    ['-lc', 'command -v google-chrome || command -v google-chrome-stable || command -v chromium || command -v chromium-browser'],
    { encoding: 'utf8' }
  ).trim();
  if (!chrome) throw new Error('Chrome/Chromium binary not found on runner.');
  return chrome;
}

const response = await fetch(BASE_URL, { redirect: 'manual', cache: 'no-store' });
assert(response.status === 200, `No-JS QA: expected ${BASE_URL} to return 200, got ${response.status}.`);

const chrome = findChrome();
const html = execFileSync(
  chrome,
  [
    '--headless', '--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage',
    '--disable-javascript', '--dump-dom', '--window-size=390,844', BASE_URL,
  ],
  { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }
);

assert(/<h1\b[^>]*>[\s\S]*?<\/h1>/i.test(html), 'No-JS QA: H1 is missing.');
assert(html.includes('HYVÄ TYÖ') && html.includes('PITÄÄ NÄKYÄ.'), 'No-JS QA: canonical headline is missing.');
assert(html.includes('490 €'), 'No-JS QA: Social card pricing is missing.');
for (const href of ['/verkkosivut-yritykselle','/some-sisallontuotanto','/resurssit','/referenssit']) {
  assert(html.includes('href="' + href + '"'), 'No-JS QA: required company navigation missing: ' + href);
}
assert(/<a\b[^>]*href=["']#yhteys["'][^>]*>/i.test(html), 'No-JS QA: #yhteys CTA anchor is missing.');
assert(html.includes('PYYDÄ EHDOTUS') || html.includes('Pyydä ehdotus'), 'No-JS QA: primary CTA copy is missing.');
assert(
  /<form\b[^>]*method=["']POST["'][^>]*action=["']\/api\/leads["'][^>]*>/i.test(html) ||
  /<form\b[^>]*action=["']\/api\/leads["'][^>]*method=["']POST["'][^>]*>/i.test(html),
  'No-JS QA: native POST /api/leads form is missing.'
);
for (const name of ['company', 'name', 'email', 'profile']) {
  assert(html.includes(`name="${name}"`), `No-JS QA: ${name} field is missing.`);
}
assert(/Oma sivusto — ei asiakasreferenssi/i.test(html), 'No-JS QA: honest own-work disclosure is missing.');
assert((html.match(/gh3dCardLink/g) || []).length >= 3, 'No-JS QA: the three carousel items are not rendered as ordinary static service links.');
assert(html.includes('Palvelun havainne-esittely — ei asiakastyö.'), 'No-JS QA: carousel concept disclosure missing.');
assert(html.includes('href="/verkkosivut/rakennus"'), 'No-JS QA: industry carousel link missing.');
assert(!html.includes('Kuva luotu tekoälyllä'), 'No-JS QA: AI concept still dominates company homepage.');
assert(!html.includes('logo-horizontal.svg') && !html.includes('logo-horizontal-white.svg'), 'No-JS QA: unavailable/fabricated logo lockup referenced.');

const seoPage = await fetch(BASE_URL + '/?service=seo#yhteys', { cache: 'no-store' }).then((res) => res.text());
assert(/<option[^>]*value="seo"[^>]*selected/i.test(seoPage), 'No-JS QA: SEO CTA does not preselect the service.');
const invalidPage = await fetch(BASE_URL + '/?lead=validation#yhteys', { cache: 'no-store' }).then((res) => res.text());
assert(invalidPage.includes('Lomaketta ei lähetetty.'), 'No-JS QA: form error message is missing from server-rendered homepage.');
const invalidPost = await fetch(BASE_URL + '/api/leads', {
  method: 'POST', redirect: 'manual',
  headers: { 'content-type': 'application/x-www-form-urlencoded', referer: BASE_URL + '/' },
  body: 'intent=booking&name=&company=&email=&profile=',
});
assert(invalidPost.status === 303 && (invalidPost.headers.get('location') || '').includes('/?lead=validation#yhteys'), 'No-JS QA: invalid native POST does not return to visible homepage form.');
console.log('No-JS QA passed: company hero, three service paths, proposal CTA and native POST lead form remain usable without JavaScript.');
