import { execFileSync, spawn } from 'node:child_process';
import { rm } from 'node:fs/promises';

const BASE_URL = process.env.QA_BASE_URL;
if (!BASE_URL) throw new Error('QA_BASE_URL is required');
const CDP_PORT = 9444;
const USER_DATA_DIR = `/tmp/ghoulhouse-ga4-release-smoke-${process.pid}`;
const widths = [639, 640, 767, 768, 1023, 1024, 1279, 1280, 1439, 1440];
const piiMarkers = [
  'QA-PERSON-UNIQUE',
  'qa.analytics@example.invalid',
  '+358000000000',
  'SENSITIVE_FREEFORM_TEST_DO_NOT_SEND',
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function findChrome() {
  return execFileSync('bash', ['-lc', 'command -v google-chrome || command -v google-chrome-stable || command -v chromium || command -v chromium-browser'], { encoding: 'utf8' }).trim();
}

class CdpClient {
  constructor(url) {
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = new Map();
    this.ws = new WebSocket(url);
  }
  async open() {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('CDP open timeout')), 10000);
      this.ws.addEventListener('open', () => { clearTimeout(timer); resolve(); }, { once: true });
      this.ws.addEventListener('error', () => { clearTimeout(timer); reject(new Error('CDP websocket failed')); }, { once: true });
    });
    this.ws.addEventListener('message', (event) => {
      const message = JSON.parse(String(event.data));
      if (message.id) {
        const pending = this.pending.get(message.id);
        if (!pending) return;
        this.pending.delete(message.id);
        message.error ? pending.reject(new Error(JSON.stringify(message.error))) : pending.resolve(message.result);
        return;
      }
      for (const callback of this.listeners.get(message.method) || []) callback(message.params);
    });
  }
  on(method, callback) {
    const items = this.listeners.get(method) || [];
    items.push(callback);
    this.listeners.set(method, items);
  }
  send(method, params = {}) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  close() { this.ws.close(); }
}

async function evaluate(client, expression) {
  const result = await client.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text || 'Runtime evaluate failed');
  return result.result.value;
}

async function waitForDocument(client) {
  for (let i = 0; i < 160; i += 1) {
    if (await evaluate(client, 'document.readyState === "complete"')) {
      await sleep(350);
      return;
    }
    await sleep(100);
  }
  throw new Error('document.readyState did not become complete');
}

async function waitFor(client, expression, label, timeoutMs = 12000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await evaluate(client, expression)) return;
    await sleep(150);
  }
  throw new Error(`Timed out waiting for ${label}`);
}

async function waitForCdp(chrome) {
  for (let i = 0; i < 200; i += 1) {
    if (chrome.exitCode !== null) throw new Error('Chrome exited before CDP was ready');
    try {
      const response = await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`);
      if (response.ok) return;
    } catch {}
    await sleep(100);
  }
  throw new Error('CDP did not become ready');
}

await rm(USER_DATA_DIR, { recursive: true, force: true });
const chrome = spawn(findChrome(), [
  '--headless', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage',
  `--remote-debugging-port=${CDP_PORT}`, '--remote-debugging-address=127.0.0.1',
  `--user-data-dir=${USER_DATA_DIR}`, '--window-size=1440,1000', 'about:blank',
], { stdio: ['ignore', 'ignore', 'pipe'], env: { ...process.env, DBUS_SYSTEM_BUS_ADDRESS: 'unix:path=/run/dbus/system_bus_socket' } });

let client;
try {
  await waitForCdp(chrome);
  const page = await fetch(`http://127.0.0.1:${CDP_PORT}/json/new?${encodeURIComponent(BASE_URL)}`, { method: 'PUT' }).then((r) => r.json());
  client = new CdpClient(page.webSocketDebuggerUrl);
  await client.open();
  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('Network.enable');
  await client.send('Page.addScriptToEvaluateOnNewDocument', {
    source: `
      window.__qaEvents = [];
      window.__qaCLS = 0;
      window.addEventListener('ghoulhouse:analytics', (event) => {
        window.__qaEvents.push(event.detail);
        sessionStorage.setItem('ghoulhouse-qa-events', JSON.stringify(window.__qaEvents));
      });
      try {
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) window.__qaCLS += entry.value || 0;
          }
        }).observe({ type: 'layout-shift', buffered: true });
      } catch {}
    `,
  });

  const exceptions = [];
  const consoleErrors = [];
  const networkFailures = [];
  const requests = [];
  client.on('Runtime.exceptionThrown', (params) => exceptions.push(params.exceptionDetails?.exception?.description || params.exceptionDetails?.text || 'unknown exception'));
  client.on('Runtime.consoleAPICalled', (params) => {
    if (params.type === 'error') consoleErrors.push(params.args?.map((arg) => arg.value || arg.description || '').join(' ') || 'console error');
  });
  client.on('Network.loadingFailed', (params) => networkFailures.push(params));
  client.on('Network.requestWillBeSent', (params) => requests.push(params.request));

  const boundaryResults = [];
  for (const width of widths) {
    await client.send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 });
    await client.send('Emulation.setEmulatedMedia', { media: '', features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
    await client.send('Page.navigate', { url: BASE_URL });
    await waitForDocument(client);
    const state = await evaluate(client, `(() => {
      const visible = (el) => {
        if (!el) return false;
        const s = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return s.display !== 'none' && s.visibility !== 'hidden' && r.width > 0 && r.height > 0;
      };
      const hero = document.querySelector('#top');
      const images = [...document.querySelectorAll('#top img')];
      const hiddenFocusable = [...document.querySelectorAll('.desktopNav a, .mobileNav a')].filter((el) => !visible(el) && el.tabIndex >= 0 && getComputedStyle(el).display !== 'none').length;
      const cta = document.querySelector('#top a[href="#yhteys"]');
      const ctaRect = cta?.getBoundingClientRect();
      const footer = document.querySelector('footer');
      return {
        width: innerWidth,
        overflow: document.documentElement.scrollWidth - innerWidth,
        mobileNavVisible: visible(document.querySelector('.mobileNav')),
        desktopNavVisible: visible(document.querySelector('.desktopNav')),
        heroVisible: visible(hero?.querySelector('h1')),
        heroClipped: Boolean(ctaRect && (ctaRect.left < -1 || ctaRect.right > innerWidth + 1)),
        rawFinal: document.querySelectorAll('.proofFrame').length === 2 && Boolean(document.querySelector('.editSeam')),
        imagesLoaded: images.length >= 2 && images.every((img) => img.complete && img.naturalWidth > 0),
        imageAlts: images.map((img) => img.getAttribute('alt')),
        proofRects: [...document.querySelectorAll('.proofFrame')].map((el) => { const r=el.getBoundingClientRect(); return {w:r.width,h:r.height}; }),
        ctaTarget: cta?.getAttribute('href') || '',
        contactExists: Boolean(document.querySelector('#yhteys')),
        footerVisible: visible(footer),
        hiddenFocusable,
        cls: window.__qaCLS || 0,
      };
    })()`);
    assert(state.width === width, `${width}: emulated width mismatch (${state.width})`);
    assert(state.overflow <= 1, `${width}: horizontal overflow ${state.overflow}px`);
    assert(state.heroVisible && !state.heroClipped && state.rawFinal && state.imagesLoaded, `${width}: hero/RAW-FINAL/images not fully rendered`);
    assert(state.ctaTarget === '#yhteys' && state.contactExists, `${width}: CTA target #yhteys missing`);
    assert(state.footerVisible, `${width}: footer is not usable/visible`);
    assert(state.hiddenFocusable === 0, `${width}: hidden-but-focusable nav item found`);
    assert(state.imageAlts.every((alt) => typeof alt === 'string' && alt.trim().length > 0), `${width}: meaningful hero image missing alt text`);
    assert(state.proofRects.every((r) => r.w > 0 && r.h > 0), `${width}: proof image layout has missing dimensions`);
    assert(state.cls < 0.1, `${width}: cumulative layout shift too high (${state.cls})`);
    if (width < 768) {
      assert(state.mobileNavVisible && !state.desktopNavVisible, `${width}: mobile/desktop navigation visibility incorrect`);
    } else {
      assert(!state.mobileNavVisible && state.desktopNavVisible, `${width}: desktop/mobile navigation visibility incorrect`);
    }
    boundaryResults.push({ width, status: 'PASS', cls: state.cls });
  }

  // Explicit mobile -> desktop -> mobile state round trip.
  await client.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await client.send('Page.navigate', { url: BASE_URL });
  await waitForDocument(client);
  assert(await evaluate(client, `(() => { const d=document.querySelector('.mobileNav'); d?.querySelector('summary')?.click(); return Boolean(d?.open); })()`), '390: mobile navigation did not open');
  await client.send('Emulation.setDeviceMetricsOverride', { width: 800, height: 900, deviceScaleFactor: 1, mobile: false });
  await sleep(300);
  const desktopRound = await evaluate(client, `(() => { const d=document.querySelector('.mobileNav'); return { open:Boolean(d?.open), display:d ? getComputedStyle(d).display : '' }; })()`);
  assert(desktopRound.display === 'none' && desktopRound.open === false, '800: mobile menu state leaked into desktop');
  await client.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await sleep(300);
  assert((await evaluate(client, `Boolean(document.querySelector('.mobileNav')?.open)`)) === false, '390: mobile menu returned open after round trip');

  // Fresh page for analytics + form accessibility checks.
  await client.send('Page.navigate', { url: BASE_URL });
  await waitForDocument(client);
  await waitFor(client, `typeof window.gtag === 'function'`, 'GA4 bootstrap');
  await sleep(1200);

  const gaDom = await evaluate(client, `(() => ({
    src: document.querySelector('script[src*="googletagmanager.com/gtag/js"]')?.getAttribute('src') || '',
    dataLayer: Array.isArray(window.dataLayer),
    title: document.title,
  }))()`);
  assert(gaDom.src.includes('id=G-43VQ8505YL'), `GA4 script src incorrect: ${gaDom.src}`);
  assert(gaDom.dataLayer, 'GA4 dataLayer missing');

  // CTA and content example events.
  await evaluate(client, `document.querySelector('#top a.button--signal[href="#yhteys"]')?.click()`);
  await sleep(250);
  await evaluate(client, `document.querySelector('#esimerkit')?.scrollIntoView({block:'center'})`);
  await sleep(700);

  // Empty submit: assert accessibility + submit/error analytics.
  await evaluate(client, `document.querySelector('#yhteys')?.scrollIntoView({block:'center'})`);
  await sleep(150);
  await evaluate(client, `document.querySelector('#yhteys button[type="submit"]')?.click()`);
  await sleep(800);
  const validation = await evaluate(client, `(() => {
    const toast=document.querySelector('.toast--error');
    const invalid=[...document.querySelectorAll('#yhteys [aria-invalid="true"]')];
    const first=invalid[0];
    const described=first?.getAttribute('aria-describedby') || '';
    const errorMessage=first?.getAttribute('aria-errormessage') || '';
    return {
      labels:[...document.querySelectorAll('#yhteys label')].every((label) => label.getAttribute('for') && document.getElementById(label.getAttribute('for'))),
      toast:Boolean(toast), role:toast?.getAttribute('role') || '', live:toast?.getAttribute('aria-live') || '',
      invalidCount:invalid.length, described, errorMessage,
      describedExists:Boolean(described && document.getElementById(described)),
      errorMessageExists:Boolean(errorMessage && document.getElementById(errorMessage)),
      focused:document.activeElement === first,
      events:window.__qaEvents,
    };
  })()`);
  assert(validation.labels, 'Lead form visible label association failed');
  assert(validation.toast && validation.role === 'alert' && validation.live === 'assertive', 'Lead error announcement contract failed');
  assert(validation.invalidCount >= 1 && validation.describedExists && validation.errorMessageExists, 'Lead aria-invalid/describedby/errormessage failed');
  assert(validation.focused, 'Lead validation did not focus first invalid field');
  assert(validation.events.some((e) => e.event === 'lead_form_submit'), 'lead_form_submit did not fire');
  assert(validation.events.some((e) => e.event === 'lead_form_error'), 'lead_form_error did not fire');
  await sleep(700);
  assert(await evaluate(client, `Boolean(document.querySelector('.toast--error'))`), 'Lead error notification did not persist');

  // Fill controlled QA values and submit successfully.
  await evaluate(client, `(() => {
    const setValue = (selector, value) => {
      const el = document.querySelector(selector);
      const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, value);
      el.dispatchEvent(new Event('input', { bubbles:true }));
      el.dispatchEvent(new Event('change', { bubbles:true }));
    };
    setValue('#lead-name', 'QA-PERSON-UNIQUE');
    setValue('#lead-company', 'GhoulHouse Release QA');
    setValue('#lead-email', 'qa.analytics@example.invalid');
    setValue('#lead-phone', '+358000000000');
    setValue('#lead-profile', 'https://ghoulhouse.fi');
    setValue('#lead-message', 'SENSITIVE_FREEFORM_TEST_DO_NOT_SEND');
    return true;
  })()`);
  await sleep(150);
  const startEvents = await evaluate(client, `window.__qaEvents`);
  assert(startEvents.filter((e) => e.event === 'lead_form_start').length === 1, 'lead_form_start must fire exactly once on first meaningful interaction');
  await evaluate(client, `document.querySelector('#yhteys button[type="submit"]')?.click()`);
  await waitFor(client, `location.pathname === '/kiitos' || Boolean(document.querySelector('.toast--error'))`, 'lead success or explicit failure', 15000);
  const path = await evaluate(client, `location.pathname`);
  if (path !== '/kiitos') {
    const failure = await evaluate(client, `document.querySelector('.toast--error')?.textContent || 'unknown lead error'`);
    throw new Error(`Controlled QA lead did not succeed: ${failure}`);
  }
  await waitForDocument(client);
  const thankYou = await evaluate(client, `(() => ({
    title: document.title,
    h1Count: document.querySelectorAll('h1').length,
    h1: document.querySelector('h1')?.textContent?.replace(/\\s+/g,' ').trim() || '',
    events: JSON.parse(sessionStorage.getItem('ghoulhouse-qa-events') || '[]'),
    staleToast: Boolean(document.querySelector('.toast')),
  }))()`);
  assert(thankYou.title === 'Kiitos | GhoulHouse', `Thank-you title incorrect: ${thankYou.title}`);
  assert(thankYou.h1Count === 1 && thankYou.h1.includes('KIITOS'), 'Thank-you success H1 contract failed');
  assert(thankYou.events.some((e) => e.event === 'lead_form_success'), 'lead_form_success did not fire before navigation');
  assert(!thankYou.staleToast, 'Stale form status/error persisted on destination page');

  // Reduced motion.
  await client.send('Emulation.setEmulatedMedia', { media: '', features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await client.send('Page.navigate', { url: BASE_URL });
  await waitForDocument(client);
  const reduced = await evaluate(client, `(() => ({
    scroll:getComputedStyle(document.documentElement).scrollBehavior,
    moving:[...document.querySelectorAll('*')].filter((el) => {
      const s=getComputedStyle(el);
      return (s.animationDuration + ',' + s.transitionDuration).split(',').some((v) => !['0s','0ms','0.01ms'].includes(v.trim()));
    }).length,
  }))()`);
  assert(reduced.scroll === 'auto' && reduced.moving === 0, `Reduced motion failed: ${JSON.stringify(reduced)}`);

  // No-JS native fallback remains usable.
  await client.send('Emulation.setScriptExecutionDisabled', { value: true });
  await client.send('Page.navigate', { url: BASE_URL });
  await sleep(1200);
  const noJs = await evaluate(client, `(() => {
    const form=document.querySelector('#yhteys form[action="/api/leads"]');
    return {
      form:Boolean(form), method:form?.getAttribute('method')?.toLowerCase() || '',
      action:form?.getAttribute('action') || '',
      required:['name','company','email','profile'].every((n)=>Boolean(form?.querySelector('[name="'+n+'"][required]'))),
      submit:Boolean(form?.querySelector('button[type="submit"]')),
    };
  })()`);
  assert(noJs.form && noJs.method === 'post' && noJs.action === '/api/leads' && noJs.required && noJs.submit, 'No-JS native form fallback failed');
  await client.send('Emulation.setScriptExecutionDisabled', { value: false });

  await sleep(1600);
  const googleRequests = requests.filter((request) => /googletagmanager\.com|google-analytics\.com/.test(request.url));
  const googleText = googleRequests.map((request) => `${request.url}\n${request.postData || ''}`).join('\n');
  const decodedGoogleText = decodeURIComponent(googleText.replace(/\+/g, ' '));
  assert(googleRequests.some((request) => request.url.includes('googletagmanager.com/gtag/js') && request.url.includes('G-43VQ8505YL')), 'Google tag script request not observed');
  assert(googleRequests.some((request) => /google-analytics\.com/.test(request.url)), 'GA4 collection request not observed');
  for (const eventName of ['page_view','primary_cta_click','content_example_view','lead_form_start','lead_form_submit','lead_form_error','lead_form_success']) {
    assert(decodedGoogleText.includes(eventName), `GA4 runtime request for ${eventName} not observed`);
  }
  for (const marker of piiMarkers) {
    assert(!decodedGoogleText.includes(marker), `PII marker leaked to Google Analytics request: ${marker}`);
  }

  const googleFailures = networkFailures.filter((failure) => {
    const request = requests.find((item) => item.url === failure.blockedReason);
    return request && /googletagmanager\.com|google-analytics\.com/.test(request.url);
  });
  assert(googleFailures.length === 0, `Google analytics network failures observed: ${JSON.stringify(googleFailures)}`);
  assert(exceptions.length === 0, `Runtime exceptions: ${exceptions.join(' | ')}`);
  assert(consoleErrors.length === 0, `Console errors: ${consoleErrors.join(' | ')}`);

  console.log(JSON.stringify({
    boundaryResults,
    resizeRoundTrip:'PASS',
    leadValidation:'PASS',
    leadSuccessNavigation:'PASS',
    reducedMotion:'PASS',
    noJs:'PASS',
    ga4:{ script:gaDom.src, requests:googleRequests.length, events:'PASS', pii:'PASS' },
    runtimeExceptions:0,
  }, null, 2));
} finally {
  client?.close();
  if (chrome.exitCode === null) chrome.kill('SIGTERM');
  await sleep(200);
  if (chrome.exitCode === null) chrome.kill('SIGKILL');
  await rm(USER_DATA_DIR, { recursive: true, force: true });
}
