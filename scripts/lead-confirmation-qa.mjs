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
  ['/kiitos?intent=booking&service=websites', 'VERKKOSIVUARVIO.', 'Verkkosivuarviopyyntösi', 'kahden työkuvan toimitustavan'],
  ['/kiitos?intent=booking&service=social', 'SOME 12.', 'SOME 12 -aloituspyyntösi', 'kahden työkuvan toimitustavan'],
  ['/kiitos?intent=booking&service=seo', 'SEO-ARVIO.', 'SEO-arviopyyntösi', 'kahden työkuvan toimitustavan'],
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
assert.match(websites, /name="service" value="websites"/, 'Website service must be routed in the hidden field');
assert.match(websites, /Nykyinen verkkosivu \(valinnainen\)/, 'Website form must ask for the current website');
assert.match(websites, /PYYDÄ VERKKOSIVUARVIO/, 'Website form CTA must match the page CTA');

const social = await fetch(base + '/some-sisallontuotanto', { cache: 'no-store' }).then((r) => r.text());
assert.match(social, /name="intent" value="photos"/, 'Social page must retain the two-photo example workflow');
assert.match(social, /name="service" value="social"/, 'Social example form must be classified as social');
assert.match(social, /Instagram tai verkkosivu \(valinnainen\)/, 'Social form must accept Instagram or a website');
assert.match(social, /PYYDÄ 2 SISÄLTÖESIMERKKIÄ/, 'Social form CTA must match the page CTA');

const seo = await fetch(base + '/?service=seo', { cache: 'no-store' }).then((r) => r.text());
assert.match(seo, /name="intent" value="booking"/, 'SEO page state must use booking intent');
assert.match(seo, /name="service" value="seo"/, 'SEO service must be routed in the hidden field');
assert.match(seo, /PYYDÄ SEO-ARVIO/, 'SEO form CTA must match the SEO service');
assert.match(seo, /<label for="lead-profile">Verkkosivu/, 'SEO form must ask for a website');

console.log('Lead confirmation QA PASS: 6 confirmation routes and service-specific Social, Website and SEO forms; no real form submissions.');
