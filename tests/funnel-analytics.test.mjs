import test from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadTs } from './helpers/load-ts.mjs';

test('rendered homepage marks the price and Social examples rather than the website proof', async () => {
  const { default: Page } = loadTs('src/app/page.tsx', {
    './homepage.css': {}, './homepage-swiss.css': {}, './editorial-home.css': {},
    'next/image': () => null,
    '@/components/MotionOverlayMenu': () => null,
    '@/components/LeadForm': () => null,
    '@/components/LiquidGlassFooter': () => null,
    '@/components/SocialConceptPreview': () => null,
  });
  const html = renderToStaticMarkup(await Page({ searchParams: Promise.resolve({}) }));
  assert.match(html, /data-analytics-section="pricing"[^>]*>12 sisältöä \/ 30 pv \/ 490/);
  assert.match(html, /id="concepts-title" data-analytics-section="content-examples"/);
  const proof = html.slice(html.indexOf('id="esimerkit"'), html.indexOf('id="toiminta"'));
  assert.doesNotMatch(proof, /data-analytics-section="content-examples"/);
});

test('section observer starts after consent/readiness, emits once, and stops on withdrawal', () => {
  const previous = { window: globalThis.window, document: globalThis.document, IntersectionObserver: globalThis.IntersectionObserver };
  let accepted = false, ready = false, effect, callback, cleanup;
  const events = [], observed = new Set(), listeners = new Map();
  const pricing = { getAttribute: () => 'pricing' }, examples = { getAttribute: () => 'content-examples' };
  class Observer {
    constructor(fn) { callback = fn; }
    observe(element) { observed.add(element); }
    unobserve(element) { observed.delete(element); }
    disconnect() { observed.clear(); }
  }
  globalThis.IntersectionObserver = Observer;
  globalThis.window = { IntersectionObserver: Observer,
    addEventListener(name, fn) { if (!listeners.has(name)) listeners.set(name, new Set()); listeners.get(name).add(fn); },
    removeEventListener(name, fn) { listeners.get(name)?.delete(fn); },
  };
  globalThis.document = { addEventListener() {}, removeEventListener() {},
    querySelectorAll: selector => selector.includes('"pricing"') ? [pricing] : [examples] };
  const dispatch = name => { for (const fn of listeners.get(name) || []) fn(); };
  const visible = element => callback([{ target: element, isIntersecting: true, intersectionRatio: 0.5 }]);
  try {
    const { default: Funnel } = loadTs('src/components/analytics/FunnelAnalytics.tsx', {
      react: { useEffect: fn => { effect = fn; } }, 'next/navigation': { usePathname: () => '/' },
      '@/lib/analytics': { trackEvent: event => events.push(event) },
      '@/lib/analytics-consent': { canTrackAnalytics: () => accepted && ready },
    });
    Funnel(); cleanup = effect();
    assert.equal(observed.size, 0);
    visible(examples); assert.equal(events.length, 0);
    accepted = true; dispatch('ghoulhouse:analytics-consent');
    assert.equal(observed.size, 0);
    ready = true; dispatch('ghoulhouse:analytics-ready');
    assert.equal(observed.size, 2);
    visible(examples); visible(examples);
    assert.equal(events.filter(event => event === 'content_example_view').length, 1);
    accepted = false; dispatch('ghoulhouse:analytics-consent');
    assert.equal(observed.size, 0);
    visible(pricing); assert.equal(events.filter(event => event === 'pricing_view').length, 0);
    accepted = true; dispatch('ghoulhouse:analytics-consent');
    assert.deepEqual([...observed], [pricing]);
    visible(pricing); assert.equal(events.filter(event => event === 'pricing_view').length, 1);
    cleanup(); assert.equal([...listeners.values()].flatMap(set => [...set]).length, 0);
  } finally { Object.assign(globalThis, previous); }
});
