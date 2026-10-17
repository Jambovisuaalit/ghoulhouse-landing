import test from 'node:test';
import assert from 'node:assert/strict';
import { getInquiryCta, isNavigationActive } from '../src/data/site-navigation.ts';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadTs } from './helpers/load-ts.mjs';

for (const pathname of ['/verkkosivut-yritykselle', '/verkkosivut/hinta', '/verkkosivut/lvi']) {
  test(`website menu preserves inquiry and pricing context: ${pathname}`, () => {
    const cta = getInquiryCta(pathname);
    assert.equal(cta.href, '#yhteys');
    assert.equal(cta.priceHref, '/verkkosivut/hinta');
    assert.doesNotMatch(cta.note, /esimerkit|kuvistanne/);
    const { default: Menu } = loadTs('src/components/MotionOverlayMenu.tsx', {
      'next/navigation': { usePathname: () => pathname },
      'next/image': () => null,
      react: { useEffect: () => {}, useRef: () => ({current:null}), useState: () => [false, () => {}] },
    });
    const html = renderToStaticMarkup(Menu({}));
    assert.match(html, /href="\/verkkosivut\/hinta"/);
    assert.doesNotMatch(html, /href="\/some-sisallontuotanto\/hinta"|href="\/#yhteys"|Maksuttomat esimerkit/);
  });
}

test('Social service family retains photos CTA, pricing and selected navigation', () => {
  for (const path of ['/some-sisallontuotanto', '/some-sisallontuotanto/hinta', '/lvi-yrityksille', '/saneerausyrityksille', '/rakennusyrityksille', '/instagram-sisallontuotanto']) {
    assert.equal(getInquiryCta(path).label, 'Pyydä 2 sisältöesimerkkiä');
    assert.equal(getInquiryCta(path).priceHref, '/some-sisallontuotanto/hinta');
    assert.equal(isNavigationActive(path, '/some-sisallontuotanto'), true);
    assert.equal(isNavigationActive(path, '/verkkosivut-yritykselle'), false);
  }
  assert.equal(getInquiryCta('/some-12').label, 'Pyydä SOME 12 -aloitusta');
  assert.doesNotMatch(getInquiryCta('/some-12').note, /Maksuttomat/);
});

test('resource and case navigation remain scoped, unknown paths stay inactive', () => {
  assert.equal(isNavigationActive('/oppaat/tyomaakuvat-sosiaaliseen-mediaan', '/resurssit'), true);
  assert.equal(isNavigationActive('/tyot/ghoulhouse-verkkosivut', '/referenssit'), true);
  assert.equal(isNavigationActive('/verkkosivut/hinta', '/verkkosivut-yritykselle'), true);
  assert.equal(isNavigationActive('/unknown', '/some-sisallontuotanto'), false);
  assert.equal(isNavigationActive(null, '/resurssit'), false);
});
