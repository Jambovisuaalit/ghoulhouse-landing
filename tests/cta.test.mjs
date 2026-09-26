import test from 'node:test';
import assert from 'node:assert/strict';
import { ctaContext } from '../src/lib/cta-context.ts';
const home = 'https://ghoulhouse.fi/';
test('SEO card attribution follows its destination', () => {
  assert.deepEqual(ctaContext('/?service=seo#yhteys', home, 'booking', 'websites'), {intent:'booking',service:'seo'});
});
test('photo and proposal anchors have distinct intent and service', () => {
  assert.deepEqual(ctaContext('#yhteys', home, 'photos'), {intent:'photos',service:'social'});
  assert.deepEqual(ctaContext('#yhteys', home, 'booking', 'websites'), {intent:'booking',service:'websites'});
});
test('external links and unrelated anchors are not lead CTAs', () => {
  assert.equal(ctaContext('https://example.com/#yhteys', home), null);
  assert.equal(ctaContext('#palvelut', home), null);
});
