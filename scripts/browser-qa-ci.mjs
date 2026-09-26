import { execFileSync, spawn } from 'node:child_process';
import { mkdir, rm, writeFile } from 'node:fs/promises';

const BASE_URL = process.env.QA_BASE_URL || 'http://127.0.0.1:3000';
const SCREENSHOT_DIR = process.env.QA_SCREENSHOT_DIR || 'qa-artifacts';
const CDP_PORT = Number(process.env.QA_CDP_PORT || 9222);
const USER_DATA_DIR = `/tmp/ghoulhouse-browser-qa-${process.pid}`;

const viewports = [
  { width: 320, height: 568 },
  { width: 390, height: 844, firstView: true },
  { width: 640, height: 900 },
  { width: 768, height: 1024, firstView: true },
  { width: 1024, height: 768 },
  { width: 1280, height: 800 },
  { width: 1440, height: 900, firstView: true },
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function findChrome() {
  const binary = execFileSync(
    'bash',
    ['-lc', 'command -v google-chrome || command -v google-chrome-stable || command -v chromium || command -v chromium-browser'],
    { encoding: 'utf8' }
  ).trim();
  if (!binary) throw new Error('Chrome/Chromium binary not found on runner.');
  return binary;
}

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForJson(url, chrome, stderr, timeoutMs = 40_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (chrome.exitCode !== null) throw new Error(`Chrome exited before CDP became ready.\n${stderr.join('')}`);
    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (response.ok) return response.json();
    } catch {}
    await sleep(150);
  }
  throw new Error(`Timed out waiting for Chrome CDP at ${url}.`);
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
      const timer = setTimeout(() => reject(new Error('CDP open timeout.')), 10_000);
      this.ws.addEventListener('open', () => { clearTimeout(timer); resolve(); }, { once: true });
      this.ws.addEventListener('error', () => { clearTimeout(timer); reject(new Error('CDP websocket failed to open.')); }, { once: true });
    });
    this.ws.addEventListener('message', (event) => {
      const message = JSON.parse(String(event.data));
      if (message.id) {
        const pending = this.pending.get(message.id);
        if (!pending) return;
        this.pending.delete(message.id);
        if (message.error) pending.reject(new Error(JSON.stringify(message.error)));
        else pending.resolve(message.result);
        return;
      }
      for (const callback of this.listeners.get(message.method) || []) callback(message.params);
    });
  }
  on(method, callback) {
    const callbacks = this.listeners.get(method) || [];
    callbacks.push(callback);
    this.listeners.set(method, callbacks);
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
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text || 'Runtime evaluation failed.');
  return result.result.value;
}

async function waitForDocument(client, timeoutMs = 15_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await evaluate(client, 'document.readyState === "complete"')) { await sleep(120); return; }
    await sleep(100);
  }
  throw new Error('Page did not reach complete readyState.');
}

async function stopProcess(process) {
  if (process.exitCode !== null) return;
  process.kill('SIGTERM');
  await sleep(250);
  if (process.exitCode === null) process.kill('SIGKILL');
}

await mkdir(SCREENSHOT_DIR, { recursive: true });
await rm(USER_DATA_DIR, { recursive: true, force: true });

const chromePath = findChrome();
const stderr = [];
const chrome = spawn(chromePath, [
  '--headless', `--remote-debugging-port=${CDP_PORT}`, '--remote-debugging-address=127.0.0.1',
  '--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage',
  '--disable-background-networking', '--disable-default-apps', '--disable-extensions', '--no-first-run',
  '--no-default-browser-check', '--hide-scrollbars', '--window-size=1440,1024', `--user-data-dir=${USER_DATA_DIR}`, 'about:blank',
], { stdio: ['ignore', 'ignore', 'pipe'], env: { ...process.env, DBUS_SYSTEM_BUS_ADDRESS: 'unix:path=/run/dbus/system_bus_socket' } });
chrome.stderr?.on('data', (chunk) => stderr.push(String(chunk)));

let client;
try {
  await waitForJson(`http://127.0.0.1:${CDP_PORT}/json/version`, chrome, stderr);
  const page = await fetch(`http://127.0.0.1:${CDP_PORT}/json/new?${encodeURIComponent(BASE_URL)}`, { method: 'PUT' }).then((response) => response.json());
  client = new CdpClient(page.webSocketDebuggerUrl);
  await client.open();
  await client.send('Page.enable');
  await client.send('Runtime.enable');

  const pageExceptions = [];
  client.on('Runtime.exceptionThrown', (params) => pageExceptions.push(params.exceptionDetails?.exception?.description || params.exceptionDetails?.text || 'Unknown page exception'));

  const results = [];
  for (const viewport of viewports) {
    await client.send('Emulation.setDeviceMetricsOverride', { width: viewport.width, height: viewport.height, deviceScaleFactor: 1, mobile: viewport.width < 768 });
    await client.send('Emulation.setEmulatedMedia', { media: '', features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
    await client.send('Page.navigate', { url: BASE_URL });
    await waitForDocument(client);

    const metrics = await evaluate(client, `(() => {
      const visible = (el) => {
        if (!el) return false;
        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden';
      };
      const rect = (el) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { top:r.top, right:r.right, bottom:r.bottom, left:r.left, width:r.width, height:r.height };
      };
      const hero = document.querySelector('#top');
      const dotGrid = hero?.querySelector('.ghHeroDotGrid');
      const dotCanvas = dotGrid?.querySelector('canvas');
      const h1 = hero?.querySelector('h1');
      const brandHeadline = h1;
      const heroCta = hero?.querySelector('a.ghButton[href="#yhteys"]');
      const price = [...(hero?.querySelectorAll('*') || [])].find((el) => visible(el) && el.children.length === 0 && el.textContent?.includes('490 €'));
      const brandLink = document.querySelector('header a.ghBrand');
      const form = document.querySelector('#yhteys form[action="/api/leads"]');
      const submit = form?.querySelector('button[type="submit"]');
      const proof = document.querySelector('.ghSelectedCase');
      const root = getComputedStyle(document.querySelector('.homePage'));
      return {
        h1Count: document.querySelectorAll('h1').length,
        h1Text: h1?.textContent?.replace(/\\s+/g, ' ').trim() || '',
        brandHeadlineText: brandHeadline?.textContent?.replace(/\\s+/g, ' ').trim() || '',
        heroCtaText: heroCta?.textContent?.replace(/\\s+/g, ' ').trim() || '',
        heroCtaHref: heroCta?.getAttribute('href') || '',
        heroCtaRect: rect(heroCta),
        priceRect: rect(price),
        h1Rect: rect(h1),
        brandRect: rect(brandLink),
        formExists: Boolean(form),
        formMethod: form?.getAttribute('method')?.toLowerCase() || '',
        formAction: form?.getAttribute('action') || '',
        submitRect: rect(submit),
        requiredFields: ['company','name','email','profile'].every((name) => Boolean(form?.querySelector('[name="' + name + '"][required]'))),
        proofExists: Boolean(proof),
        proofImageLoaded: document.querySelector('.ghSelectedScreenshot')?.naturalWidth > 100,
        seoSelected: form?.querySelector('select[name="service"]') !== null,
        serviceLinks: ['/verkkosivut-yritykselle','/some-sisallontuotanto','/?service=seo#yhteys'].every((href) => document.querySelector('.ghServiceCard a[href="' + href + '"]')),
        serviceCards: document.querySelectorAll('.ghServiceCard').length,
        carouselCards: document.querySelectorAll('.gh3dCarousel .gh3dCard').length,
        carouselLinks: [...document.querySelectorAll('.gh3dCarousel .gh3dCardLink')].map((a) => a.getAttribute('href')),
        carouselRegion: document.querySelector('.gh3dCarousel')?.getAttribute('aria-roledescription') || '',
        resourceLinks: document.querySelectorAll('.ghGuideRow').length,
        proposalIntent: form?.querySelector('[name="intent"]')?.value === 'booking',
        schemaTypes: [...document.querySelectorAll('script[type="application/ld+json"]')].map((script) => script.textContent || '').join(' '),
        logoLoaded: document.querySelector('header .ghBrand img')?.getAttribute('src') === '/favicon.svg',
        disclosure: /Oma sivusto — ei asiakasreferenssi/i.test(document.body.innerText),
        bodyText: document.body.innerText.replace(/\\s+/g, ' ').trim(),
        viewportMeta: document.querySelector('meta[name="viewport"]')?.getAttribute('content') || '',
        bodyOverflowX: getComputedStyle(document.body).overflowX,
        innerWidth,
        innerHeight,
        scrollWidth: document.documentElement.scrollWidth,
        dotGrid: {
          image: hero ? getComputedStyle(hero).backgroundImage : '',
          heroRect: rect(hero),
          overlayRect: rect(dotGrid),
          canvasWidth: dotCanvas?.width || 0,
          canvasHeight: dotCanvas?.height || 0,
        },
        colors: {
          ink: root.getPropertyValue('--ink').trim(),
          paper: root.getPropertyValue('--paper').trim(),
          signal: root.getPropertyValue('--signal').trim(),
          white: root.getPropertyValue('--white').trim(),
          muted: root.getPropertyValue('--muted').trim(),
        },
      };
    })()`);

    assert(metrics.dotGrid.image.includes('hero-dot-grid.svg'), `${viewport.width}x${viewport.height}: the visible hero must retain its static dot pattern regardless of JS.`);
    assert(metrics.dotGrid.overlayRect?.width >= metrics.dotGrid.heroRect?.width - 1 && metrics.dotGrid.overlayRect?.height >= metrics.dotGrid.heroRect?.height - 1,
      `${viewport.width}x${viewport.height}: the interactive dot layer does not cover the hero: ${JSON.stringify(metrics.dotGrid)}`);
    assert(metrics.h1Count === 1, `${viewport.width}x${viewport.height}: expected exactly one H1.`);
    assert(metrics.brandHeadlineText.includes('HYVÄ TYÖ') && metrics.brandHeadlineText.includes('PITÄÄ NÄKYÄ.'), `${viewport.width}x${viewport.height}: company headline missing.`);
    assert(metrics.h1Text.includes('HYVÄ TYÖ') && metrics.h1Text.includes('PITÄÄ NÄKYÄ'), `${viewport.width}x${viewport.height}: H1 copy changed unexpectedly.`);
    assert(metrics.heroCtaHref === '#yhteys', `${viewport.width}x${viewport.height}: primary CTA must target #yhteys.`);
    assert(/pyydä ehdotus/i.test(metrics.heroCtaText), `${viewport.width}x${viewport.height}: company CTA missing.`);
    assert(metrics.serviceLinks && metrics.serviceCards === 3, `${viewport.width}x${viewport.height}: three service links missing.`);
    assert(metrics.carouselCards === 3 && metrics.carouselRegion === 'karuselli', `${viewport.width}x${viewport.height}: 3D carousel cards or semantics missing.`);
    assert(['/verkkosivut-yritykselle','/some-sisallontuotanto','/verkkosivut/rakennus'].every((href) => metrics.carouselLinks.includes(href)), `${viewport.width}x${viewport.height}: a carousel link is missing.`);
    assert(metrics.resourceLinks === 3 && metrics.proposalIntent, `${viewport.width}x${viewport.height}: resources or general proposal intent missing.`);
    assert(metrics.formExists && metrics.formMethod === 'post' && metrics.formAction === '/api/leads', `${viewport.width}x${viewport.height}: native lead form contract missing.`);
    assert(metrics.requiredFields, `${viewport.width}x${viewport.height}: required lead fields missing.`);
    assert(metrics.submitRect?.height >= 44, `${viewport.width}x${viewport.height}: submit target below 44px.`);
    assert(metrics.proofExists && metrics.logoLoaded, `${viewport.width}x${viewport.height}: company proof or logo missing.`);
    assert(metrics.seoSelected, `${viewport.width}x${viewport.height}: service-interest selector missing.`);
    assert(metrics.disclosure, `${viewport.width}x${viewport.height}: honest own-work disclosure missing.`);
    assert(!metrics.schemaTypes.includes('some-12-service') && !metrics.schemaTypes.includes('some-12-offer'), `${viewport.width}x${viewport.height}: product-specific schema remains on homepage.`);
    assert(metrics.viewportMeta.includes('viewport-fit=cover'), `${viewport.width}x${viewport.height}: viewport-fit=cover missing.`);
    assert(metrics.bodyOverflowX === 'clip' || metrics.bodyOverflowX === 'hidden', `${viewport.width}x${viewport.height}: horizontal overflow suppression missing.`);
    assert(metrics.scrollWidth <= metrics.innerWidth + 1, `${viewport.width}x${viewport.height}: horizontal overflow ${metrics.scrollWidth}px > ${metrics.innerWidth}px.`);
    assert(metrics.colors.ink === '#111111' && metrics.colors.paper === '#F7F4EF' && metrics.colors.signal.toUpperCase() === '#C9282D' && metrics.colors.white === '#FFFFFF' && metrics.colors.muted === '#8C8278', `${viewport.width}x${viewport.height}: core brand primitives do not match.`);
    assert(!metrics.bodyText.includes('790 €') && !metrics.bodyText.includes('MANAGED'), `${viewport.width}x${viewport.height}: obsolete offer copy reappeared.`);

    for (const [name, value] of [['brand', metrics.brandRect], ['headline', metrics.h1Rect], ['hero CTA', metrics.heroCtaRect]]) {
      assert(value, `${viewport.width}x${viewport.height}: ${name} missing.`);
      assert(value.left >= -1 && value.right <= metrics.innerWidth + 1, `${viewport.width}x${viewport.height}: ${name} overflows horizontally.`);
    }

    if (viewport.firstView) {
      assert(metrics.heroCtaRect.bottom <= metrics.innerHeight, `${viewport.width}x${viewport.height}: primary CTA below first viewport.`);
      assert(!metrics.h1Text.includes('TYÖMAAKUVAT'), `${viewport.width}x${viewport.height}: legacy Social-only H1 remains.`);
    }

    const screenshot = await client.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    await writeFile(`${SCREENSHOT_DIR}/homepage-${viewport.width}x${viewport.height}.png`, Buffer.from(screenshot.data, 'base64'));
    results.push({ viewport: `${viewport.width}x${viewport.height}`, status: 'PASS' });
  }

  // Capture proof section as well as the first view at all three approval widths.
  for (const viewport of [viewports[1], viewports[3], viewports[6]]) {
    await client.send('Emulation.setDeviceMetricsOverride', { width: viewport.width, height: viewport.height, deviceScaleFactor: 1, mobile: viewport.width < 768 });
    await client.send('Page.navigate', { url: BASE_URL });
    await waitForDocument(client);
    await evaluate(client, 'document.querySelector("#esimerkit")?.scrollIntoView({behavior:"instant",block:"start"})');
    const proofImageLoaded = await evaluate(client, `new Promise((resolve) => {
      const img = document.querySelector('.ghSelectedScreenshot');
      if (!img) return resolve(false);
      if (img.complete) return resolve(img.naturalWidth > 100);
      img.addEventListener('load', () => resolve(img.naturalWidth > 100), { once:true });
      img.addEventListener('error', () => resolve(false), { once:true });
      setTimeout(() => resolve(false), 10000);
    })`);
    assert(proofImageLoaded, `${viewport.width}x${viewport.height}: published-site proof image failed after scrolling into view.`);
    await sleep(180);
    const image = await client.send('Page.captureScreenshot', { format:'png', captureBeyondViewport:false });
    await writeFile(`${SCREENSHOT_DIR}/proof-${viewport.width}x${viewport.height}.png`, Buffer.from(image.data,'base64'));
  }

  await client.send('Page.navigate', { url: BASE_URL + '/?service=seo#yhteys' });
  await waitForDocument(client);
  assert(await evaluate(client, 'document.querySelector(\'#yhteys select[name="service"]\')?.value === "seo"'), 'SEO CTA failed to preselect the service in the proposal form.');

  await client.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await client.send('Page.navigate', { url: BASE_URL });
  await waitForDocument(client);
  const interaction = await evaluate(client, `(() => {
    const cta = document.querySelector('#top a.ghButton[href="#yhteys"]');
    cta?.focus();
    const focused = document.activeElement === cta;
    cta?.click();
    const form = document.querySelector('#yhteys form[action="/api/leads"]');
    return { focused, hash: location.hash, formExists: Boolean(form), submitTabIndex: form?.querySelector('button[type="submit"]')?.tabIndex ?? -1 };
  })()`);
  assert(interaction.focused, 'Primary CTA is not keyboard-focusable.');
  assert(interaction.hash === '#yhteys', 'Primary CTA did not navigate to #yhteys.');
  assert(interaction.formExists && interaction.submitTabIndex >= 0, 'Lead form or submit keyboard access missing.');

  // An infinite carousel must wrap in both directions without changing links.
  const carouselInteraction = await evaluate(client, `(() => {
    const region = document.querySelector('.gh3dCarousel');
    const next = region?.querySelector('[aria-label="Seuraava palveluesittely"]');
    const previous = region?.querySelector('[aria-label="Edellinen palveluesittely"]');
    const counter = () => region?.querySelector('.gh3dCounter')?.textContent?.replace(/\\s+/g,' ').trim();
    const before = counter();
    next?.click();
    return { before, nextExists: Boolean(next), previousExists: Boolean(previous) };
  })()`);
  assert(carouselInteraction.nextExists && carouselInteraction.previousExists, 'Carousel navigation controls missing after hydration.');
  await sleep(120);
  const nextCounter = await evaluate(client, 'document.querySelector(".gh3dCounter")?.textContent?.replace(/\\s+/g," ").trim()');
  assert(nextCounter === '02 / 03', `3D carousel did not advance: ${nextCounter}`);
  await evaluate(client, 'document.querySelector("[aria-label=\\"Edellinen palveluesittely\\"]")?.click()');
  await sleep(120);
  const wrappedCounter = await evaluate(client, 'document.querySelector(".gh3dCounter")?.textContent?.replace(/\\s+/g," ").trim()');
  assert(wrappedCounter === '01 / 03', `3D carousel did not navigate backward: ${wrappedCounter}`);

  await client.send('Emulation.setEmulatedMedia', { media: '', features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await client.send('Page.navigate', { url: BASE_URL });
  await waitForDocument(client);
  const reducedMotion = await evaluate(client, `(() => ({
    scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
    activeMotion: [...document.querySelectorAll('*')].filter((el) => {
      const s = getComputedStyle(el);
      const durations = (s.animationDuration + ',' + s.transitionDuration).split(',').map((v) => v.trim());
      return durations.some((v) => !['0s','0ms','0.01ms'].includes(v));
    }).length,
    proof: Boolean(document.querySelector('.ghSelectedCase')),
    form: Boolean(document.querySelector('#yhteys form[action="/api/leads"]')),
  }))()`);
  assert(reducedMotion.scrollBehavior === 'auto', 'Reduced motion must disable smooth scrolling.');
  assert(reducedMotion.activeMotion === 0, 'Reduced motion left active motion running.');
  assert(reducedMotion.proof && reducedMotion.form, 'Reduced motion removed critical content.');
  assert(pageExceptions.length === 0, `Page exceptions: ${pageExceptions.join(' | ')}`);

  const payload = { chromePath, results, interaction, reducedMotion };
  await writeFile(`${SCREENSHOT_DIR}/results.json`, JSON.stringify(payload, null, 2));
  console.log(JSON.stringify(payload, null, 2));
} finally {
  client?.close();
  await stopProcess(chrome);
  await rm(USER_DATA_DIR, { recursive: true, force: true });
}
