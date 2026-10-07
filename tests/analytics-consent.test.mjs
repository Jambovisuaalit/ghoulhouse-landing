import test from 'node:test';
import assert from 'node:assert/strict';
import { applyAnalyticsConsent, GA_MEASUREMENT_ID } from '../src/lib/analytics-consent.ts';
import { loadTs } from './helpers/load-ts.mjs';

test('consent changes stop the existing tag before updating consent and allow reacceptance', () => {
  const target = {};
  applyAnalyticsConsent(target, true);
  assert.equal(target[`ga-disable-${GA_MEASUREMENT_ID}`], false);
  assert.equal(target.dataLayer[0][1], 'default');
  const calls = [];
  target.gtag = (...args) => calls.push({ disabled: target[`ga-disable-${GA_MEASUREMENT_ID}`], args });
  applyAnalyticsConsent(target, false);
  assert.equal(calls[0].disabled, true);
  assert.equal(calls[0].args[2].analytics_storage, 'denied');
  applyAnalyticsConsent(target, true);
  assert.equal(calls[1].disabled, false);
  assert.equal(calls[1].args[2].analytics_storage, 'granted');
});

test('blocked storage fails closed without throwing or enabling GA', () => {
  const previous = globalThis.window;
  globalThis.window = { get localStorage() { throw new Error('blocked'); }, dispatchEvent() {} };
  try {
    const { readAnalyticsConsent, saveAnalyticsConsent } = loadTs('src/lib/analytics-consent.ts');
    assert.equal(readAnalyticsConsent(), null);
    assert.equal(saveAnalyticsConsent('accepted'), 'rejected');
    assert.equal(window[`ga-disable-${GA_MEASUREMENT_ID}`], true);
    // A failed write must also override a previously persisted acceptance.
    globalThis.window = { localStorage: { getItem: () => 'accepted', setItem() { throw Error('blocked'); } }, dispatchEvent() {} };
    assert.equal(saveAnalyticsConsent('rejected'), 'rejected');
    assert.equal(window[`ga-disable-${GA_MEASUREMENT_ID}`], true);
  } finally { globalThis.window = previous; }
});

test('late script readiness cannot initialize GA after withdrawal; reacceptance configures once', () => {
  const previous = globalThis.window;
  let consent = 'accepted';
  const calls = [];
  globalThis.window = { localStorage: { getItem: () => consent }, gtag: (...args) => calls.push(args), dispatchEvent() {} };
  try {
    const { default: GoogleAnalytics } = loadTs('src/components/analytics/GoogleAnalytics.tsx', {
      react: { useState: () => [true, () => {}], useEffect: () => {} },
    });
    const script = GoogleAnalytics();
    consent = 'rejected'; script.props.onReady();
    assert.equal(calls.filter(args => args[0] === 'config').length, 0);
    assert.equal(window[`ga-disable-${GA_MEASUREMENT_ID}`], true);
    consent = 'accepted'; script.props.onReady(); script.props.onReady();
    assert.equal(calls.filter(args => args[0] === 'config').length, 1);
    assert.equal(window.ghoulhouseAnalyticsReady, true);
  } finally { globalThis.window = previous; }
});
