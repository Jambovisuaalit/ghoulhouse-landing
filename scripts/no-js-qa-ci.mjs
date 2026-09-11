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
assert(html.includes('TYÖMAAKUVAT') && html.includes('VALMIS SOME') && html.includes('ULOS.'), 'No-JS QA: canonical headline is missing.');
assert(html.includes('490 €'), 'No-JS QA: 490 € price is missing.');
assert(/<a\b[^>]*href=["']#yhteys["'][^>]*>/i.test(html), 'No-JS QA: #yhteys CTA anchor is missing.');
assert(html.includes('2 SISÄLTÖESIMERKKIÄ') || html.includes('2 ESIMERKKIÄ'), 'No-JS QA: primary CTA copy is missing.');
assert(
  /<form\b[^>]*method=["']POST["'][^>]*action=["']\/api\/leads["'][^>]*>/i.test(html) ||
  /<form\b[^>]*action=["']\/api\/leads["'][^>]*method=["']POST["'][^>]*>/i.test(html),
  'No-JS QA: native POST /api/leads form is missing.'
);
for (const name of ['company', 'name', 'email', 'profile']) {
  assert(html.includes(`name="${name}"`), `No-JS QA: ${name} field is missing.`);
}
assert(html.includes('KONSEPTIESIMERKKI — EI ASIAKASTYÖ'), 'No-JS QA: concept disclosure is missing.');
assert(!html.includes('logo-horizontal.svg') && !html.includes('logo-horizontal-white.svg'), 'No-JS QA: unavailable/fabricated logo lockup referenced.');

console.log('No-JS QA passed: canonical hero, offer, CTA, disclosure and native POST lead form remain usable without JavaScript.');
