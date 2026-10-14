import test from 'node:test';
import assert from 'node:assert/strict';
import { getInquiryCta } from '../src/data/site-navigation.ts';
import { ctaContext } from '../src/lib/cta-context.ts';

test('website menu and homepage preserve website pricing, promise and CTA intent', () => {
  for (const path of ['/', '/verkkosivut-yritykselle', '/verkkosivut/hinta', '/verkkosivut/lvi']) {
    const context = getInquiryCta(path);
    assert.equal(context.label, 'Pyydä verkkosivuarvio');
    assert.equal(context.pricingHref, '/verkkosivut/hinta');
    assert.doesNotMatch(context.note + context.eyebrow, /sisältöesimerk|työmaakuv|valmis some/i);
    assert.deepEqual(ctaContext(context.href, 'https://ghoulhouse.fi' + path, 'booking', 'websites'), {intent:'booking', service:'websites'});
  }
});

test('social service and package keep their distinct existing next steps', () => {
  const social = getInquiryCta('/some-sisallontuotanto');
  assert.equal(social.label, 'Pyydä 2 sisältöesimerkkiä');
  assert.equal(social.pricingHref, '/some-sisallontuotanto/hinta');
  assert.match(social.note, /Maksuttomat esimerkit/);
  const start = getInquiryCta('/some-12');
  assert.equal(start.label, 'Pyydä SOME 12 -aloitusta');
  assert.doesNotMatch(start.note, /Maksuttomat esimerkit/);
});
