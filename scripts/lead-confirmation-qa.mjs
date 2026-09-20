import assert from 'node:assert/strict';

const base = process.env.QA_BASE_URL || 'http://127.0.0.1:3000';

async function page(path) {
  const response = await fetch(base + path, { cache: 'no-store' });
  assert.equal(response.status, 200, `${path}: expected HTTP 200`);
  const html = await response.text();
  assert.match(html, /name="robots" content="noindex, nofollow"/, `${path}: confirmation must not be indexed`);
  return html;
}

const cases = [
  ['/kiitos?intent=photos', 'SEURAAVAKSI KUVAT.', 'kahdesta sisältöesimerkistä', null],
  ['/kiitos?intent=booking&service=websites', 'VERKKOSIVUT.', 'Verkkosivuja koskeva ehdotuspyyntösi', 'kahden työkuvan toimitustavan'],
  ['/kiitos?intent=booking&service=social', 'SOME-EHDOTUS.', 'Some-sisällöntuotantoa koskeva ehdotuspyyntösi', 'kahden työkuvan toimitustavan'],
  ['/kiitos?intent=booking&service=seo', 'HAKUNÄKYVYYS.', 'Hakukonenäkyvyyttä koskeva ehdotuspyyntösi', 'kahden työkuvan toimitustavan'],
  ['/kiitos?intent=booking', 'SEURAAVA ASKEL.', 'Yhteydenottopyyntösi', 'kahden työkuvan toimitustavan'],
  ['/kiitos', 'SEURAAVA ASKEL.', 'Yhteydenottopyyntösi', 'kahden työkuvan toimitustavan'],
];

for (const [path, heading, expected, forbidden] of cases) {
  const html = await page(path);
  assert(html.includes(heading), `${path}: missing service-specific heading`);
  assert(html.includes(expected), `${path}: missing service-specific copy`);
  if (forbidden) assert(!html.includes(forbidden), `${path}: wrong photo workflow copy`);
  console.log(`PASS ${path}`);
}

const websites = await fetch(base + '/verkkosivut-yritykselle', { cache: 'no-store' }).then((r) => r.text());
assert.match(websites, /name="intent" value="booking"/, 'Website page must request a proposal, not photo examples');
assert.match(websites, /<option value="websites" selected="">Verkkosivut<\/option>/, 'Website service must be preselected');

const social = await fetch(base + '/some-sisallontuotanto', { cache: 'no-store' }).then((r) => r.text());
assert.match(social, /name="intent" value="photos"/, 'Social page must retain the two-photo example workflow');

console.log('Lead confirmation QA PASS: 6 confirmation routes, website proposal intent and social examples; no real form submissions.');
