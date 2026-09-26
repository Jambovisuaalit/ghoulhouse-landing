import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

const BASE = process.env.QA_BASE_URL ?? 'http://127.0.0.1:3000';
function loadPureTs(path) {
  const js = ts.transpileModule(readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const exports = {};
  runInNewContext(js, { exports });
  return exports;
}
function check(condition, message) { assert.ok(condition, message); }

const { seoClusterPages: pages } = loadPureTs('src/data/seo-cluster.ts');
const { getRelatedSocialLinks } = loadPureTs('src/data/social-related-links.ts');
const { websiteDeliverableDescriptions } = loadPureTs('src/data/website.ts');
const sitemap = readFileSync('src/app/sitemap.ts', 'utf8');
const pageComponent = readFileSync('src/components/seo/SeoLandingPage.tsx', 'utf8');
const websiteComponent = readFileSync('src/components/website/WebsiteLandingPage.tsx', 'utf8');

const tailored = ['rakennusyrityksille', 'lvi-yrityksille', 'instagram-sisallontuotanto'];
const fields = ['challenge', 'examples', 'process', 'faq', 'related'];
for (const slug of [...tailored, 'some-sisallontuotanto', 'some-12']) {
  const h = pages[slug].headings;
  check(h && fields.every((field) => h[field]), slug + ': H2 structure is incomplete');
  for (const other of tailored.filter((item) => item !== slug)) {
    check(h.challenge !== pages[other].headings.challenge &&
      h.examples !== pages[other].headings.examples, slug + ': copied industry H2 headings');
  }
}
check(pages['some-12'].h1 !== pages['some-sisallontuotanto'].h1 &&
  pages['some-12'].intro !== pages['some-sisallontuotanto'].intro,
  'General service and SOME 12 must target different user intents.');
check(!JSON.stringify(pages).includes('märkätilätyöstä') &&
  JSON.stringify(pages).includes('märkätilatyöstä'),
  'LVI spelling regression.');

const relatedSlugs = [
  'some-sisallontuotanto', 'some-12', 'rakennusyrityksille',
  'lvi-yrityksille', 'instagram-sisallontuotanto',
  'saneerausyrityksille', 'some-sisallontuotanto/hinta',
];
for (const slug of relatedSlugs) {
  const related = getRelatedSocialLinks(slug);
  check(related.length >= 4, slug + ': empty or insufficient related links');
  check(new Set(related.map((x) => x.href)).size === related.length, slug + ': duplicate links');
  for (const link of related) {
    check(link.href !== '/' + slug, slug + ': self-link in related section');
    check(sitemap.includes("'" + link.href.slice(1) + "'"), slug + ': URL missing from sitemap: ' + link.href);
    check(link.label && link.description, slug + ': link has no meaningful anchor/description');
  }
}
check(!pageComponent.includes('MUUT GHOULHOUSE-SIVUT') &&
  pageComponent.includes('getRelatedSocialLinks'), 'Generic Social link dump still in component.');

const mainDeliverables = [
  'Sivustorakenne ja navigaatio', 'Palvelusivut ja ostamista tukeva copy',
  'Referenssit ja työnäyttö', 'Yhteydenotto ja tarjouspyyntö',
  'Mobiilioptimointi', 'Tekninen SEO ja julkaisu',
];
const descriptions = mainDeliverables.map((name) => websiteDeliverableDescriptions[name]);
check(descriptions.every((text) => typeof text === 'string' && text.length > 70),
  'One of the six website deliverables has no specific text');
check(new Set(descriptions).size === 6, 'Six website deliverables must have distinct copy');
check(!websiteComponent.includes('Suunnitellaan osaksi samaa käyttäjäpolkua, ei irralliseksi ominaisuudeksi.'),
  'Repeated website placeholder returned');

for (const slug of relatedSlugs) {
  const response = await fetch(BASE + '/' + slug);
  check(response.status === 200, '/' + slug + ': non-200 status ' + response.status);
  const html = await response.text();
  const h = pages[slug].headings;
  if (h) {
    check(fields.every((key) => html.includes(h[key])),
      '/' + slug + ': missing route-specific rendered H2');
  }
  const navStart = html.indexOf('aria-label="Aiheeseen liittyvät GhoulHouse-sivut"');
  check(navStart >= 0, '/' + slug + ': related navigation missing in SSR');
  const nav = html.slice(navStart, html.indexOf('</nav>', navStart));
  for (const link of getRelatedSocialLinks(slug)) {
    check(nav.includes('href="' + link.href + '"'),
      '/' + slug + ': expected related link missing: ' + link.href);
  }
  check((nav.match(/href="/g) || []).length === getRelatedSocialLinks(slug).length,
    '/' + slug + ': related-link section contains extra or generic links');
  if (slug === 'lvi-yrityksille') {
    check(html.includes('märkätilatyöstä') && !html.includes('märkätilätyöstä'),
      'Rendered LVI typo was not corrected');
  }
  if (slug === 'some-sisallontuotanto') {
    check(html.includes('SISÄLLÖNTUOTANTO YRITYKSEN OMASTA MATERIAALISTA') &&
      html.includes('PYYDÄ 2 SISÄLTÖESIMERKKIÄ') &&
      html.includes('some-sisallontuotanto#service') &&
      !html.includes('some-sisallontuotanto#offer'),
      'General service page still behaves like a priced product landing');
  }
  if (slug === 'some-12') {
    check(html.includes('PYYDÄ SOME 12 -ALOITUSTA') &&
      html.includes('SOVITAAN ENSIMMÄINEN 30 PÄIVÄÄ.') &&
      html.includes('some-12#offer') &&
      html.includes('name="intent" value="booking"') &&
      html.includes('value="social" selected'),
      'SOME 12 product CTA, schema or preselected lead form was not rendered');
  }
}
const websiteResponse = await fetch(BASE + '/verkkosivut-yritykselle');
check(websiteResponse.status === 200, '/verkkosivut-yritykselle is not reachable');
const websiteHTML = await websiteResponse.text();
check(descriptions.every((value) => websiteHTML.includes(value)),
  'One of the six unique website deliverable paragraphs is missing in SSR');
console.log('Social content QA PASS: curated topic links (7 routes), unique H2s (5 routes), separate service/package intents, LVI typo, six website deliverables and SSR.');
