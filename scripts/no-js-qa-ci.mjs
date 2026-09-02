import { execFileSync } from 'node:child_process';

const BASE_URL = process.env.QA_BASE_URL || 'http://127.0.0.1:3000';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function findChrome() {
  const chrome = execFileSync(
    'bash',
    [
      '-lc',
      'command -v google-chrome || command -v google-chrome-stable || command -v chromium || command -v chromium-browser',
    ],
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
    '--headless',
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--disable-javascript',
    '--dump-dom',
    '--window-size=390,844',
    BASE_URL,
  ],
  { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }
);

assert(/<h1\b[^>]*>[\s\S]*?<\/h1>/i.test(html), 'No-JS QA: H1 is missing.');
assert(html.includes('TYÖMAAKUVA') && html.includes('VALMIS JULKAISU'), 'No-JS QA: V2 headline is missing.');
assert(html.includes('490 €'), 'No-JS QA: 490 € price is missing.');
assert(
  /<a\b[^>]*href=["']#laheta-kuvat["'][^>]*>/i.test(html),
  'No-JS QA: #laheta-kuvat anchor is missing.'
);
assert(
  html.includes('2 MAKSUTONTA SISÄLTÖESIMERKKIÄ') || html.includes('2 ESIMERKKIÄ'),
  'No-JS QA: primary CTA copy is missing.'
);
assert(
  /<form\b[^>]*method=["']POST["'][^>]*action=["']\/api\/leads["'][^>]*>/i.test(html) ||
  /<form\b[^>]*action=["']\/api\/leads["'][^>]*method=["']POST["'][^>]*>/i.test(html),
  'No-JS QA: native POST /api/leads form is missing.'
);
assert(html.includes('name="company"'), 'No-JS QA: company field is missing.');
assert(html.includes('name="name"'), 'No-JS QA: name field is missing.');
assert(html.includes('name="email"'), 'No-JS QA: email field is missing.');
assert(html.includes('name="profile"'), 'No-JS QA: profile field is missing.');
assert(html.includes('KONSEPTIESIMERKKI — EI ASIAKASTYÖ'), 'No-JS QA: concept disclosure is missing.');

console.log('No-JS QA passed: HTTP 200, V2 hero, 490 € price, CTA, RAW → FINAL disclosure and native POST lead form are available with JavaScript disabled.');
