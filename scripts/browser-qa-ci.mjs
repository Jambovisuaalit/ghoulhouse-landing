import { execFileSync, spawn } from 'node:child_process';
import { mkdir, rm, writeFile } from 'node:fs/promises';

const BASE_URL = process.env.QA_BASE_URL || 'http://127.0.0.1:3000';
const SCREENSHOT_DIR = process.env.QA_SCREENSHOT_DIR || 'qa-artifacts';
const CDP_PORT = Number(process.env.QA_CDP_PORT || 9222);
const USER_DATA_DIR = `/tmp/ghoulhouse-browser-qa-${process.pid}`;

const viewports = [
  { width: 320, height: 568 },
  { width: 375, height: 667 },
  { width: 390, height: 844, firstView: true },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1366, height: 768, firstView: true },
  { width: 1440, height: 900, firstView: true },
  { width: 1920, height: 1080 },
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

async function waitForJson(url, chrome, stderr, timeoutMs = 20_000) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    if (chrome.exitCode !== null) {
      throw new Error(`Chrome exited before CDP became ready (exit ${chrome.exitCode}).\n${stderr.join('')}`);
    }

    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (response.ok) return response.json();
    } catch {
      // Chrome is still starting.
    }

    await sleep(150);
  }

  throw new Error(`Timed out waiting for Chrome CDP at ${url}.\n${stderr.join('')}`);
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
      this.ws.addEventListener('open', () => {
        clearTimeout(timer);
        resolve();
      }, { once: true });
      this.ws.addEventListener('error', () => {
        clearTimeout(timer);
        reject(new Error('CDP websocket failed to open.'));
      }, { once: true });
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

      for (const callback of this.listeners.get(message.method) || []) {
        callback(message.params);
      }
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

  close() {
    this.ws.close();
  }
}

async function evaluate(client, expression) {
  const result = await client.send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });

  if (result.exceptionDetails) {
    throw new Error(
      result.exceptionDetails.exception?.description ||
      result.exceptionDetails.text ||
      'Runtime evaluation failed.'
    );
  }

  return result.result.value;
}

async function waitForDocument(client, timeoutMs = 15_000) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    if (await evaluate(client, 'document.readyState === "complete"')) {
      await sleep(150);
      return;
    }
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
const chrome = spawn(
  chromePath,
  [
    '--headless',
    `--remote-debugging-port=${CDP_PORT}`,
    '--remote-debugging-address=127.0.0.1',
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--disable-background-networking',
    '--disable-default-apps',
    '--disable-extensions',
    '--no-first-run',
    '--no-default-browser-check',
    '--hide-scrollbars',
    '--window-size=1920,1080',
    `--user-data-dir=${USER_DATA_DIR}`,
    'about:blank',
  ],
  { stdio: ['ignore', 'ignore', 'pipe'] }
);

chrome.stderr?.on('data', (chunk) => stderr.push(String(chunk)));

let client;

try {
  await waitForJson(`http://127.0.0.1:${CDP_PORT}/json/version`, chrome, stderr);

  const page = await fetch(
    `http://127.0.0.1:${CDP_PORT}/json/new?${encodeURIComponent(BASE_URL)}`,
    { method: 'PUT' }
  ).then((response) => {
    if (!response.ok) throw new Error(`Failed to create CDP page: ${response.status}`);
    return response.json();
  });

  client = new CdpClient(page.webSocketDebuggerUrl);
  await client.open();
  await client.send('Page.enable');
  await client.send('Runtime.enable');

  const pageExceptions = [];
  client.on('Runtime.exceptionThrown', (params) => {
    pageExceptions.push(
      params.exceptionDetails?.exception?.description ||
      params.exceptionDetails?.text ||
      'Unknown page exception'
    );
  });

  const results = [];

  for (const viewport of viewports) {
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: viewport.width < 768,
    });
    await client.send('Emulation.setEmulatedMedia', {
      media: '',
      features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }],
    });
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
      const h1 = hero?.querySelector('h1');
      const heroCta = hero?.querySelector('a[href="#laheta-kuvat"]');
      const price = [...(hero?.querySelectorAll('*') || [])].find(
        (el) => visible(el) && el.children.length === 0 && el.textContent?.includes('490 €')
      );
      const brandLink = document.querySelector('header a[aria-label="GhoulHouse — sivun alku"]');
      const brandImage = brandLink?.querySelector('img');
      const form = document.querySelector('#laheta-kuvat form[action="/api/leads"]');
      const submit = form?.querySelector('button[type="submit"]');
      const rawFinal = document.querySelector('.raw-final-grid');

      return {
        h1Count: document.querySelectorAll('h1').length,
        h1Text: h1?.textContent?.replace(/\\s+/g, ' ').trim() || '',
        heroText: hero?.textContent?.replace(/\\s+/g, ' ').trim() || '',
        heroCtaText: heroCta?.textContent?.replace(/\\s+/g, ' ').trim() || '',
        heroCtaHref: heroCta?.getAttribute('href') || '',
        priceText: price?.textContent?.replace(/\\s+/g, ' ').trim() || '',
        heroCtaRect: rect(heroCta),
        priceRect: rect(price),
        h1Rect: rect(h1),
        brandRect: rect(brandLink),
        brandImageRect: rect(brandImage),
        brandNaturalWidth: brandImage?.naturalWidth || 0,
        brandNaturalHeight: brandImage?.naturalHeight || 0,
        formExists: Boolean(form),
        formMethod: form?.getAttribute('method')?.toLowerCase() || '',
        formAction: form?.getAttribute('action') || '',
        submitRect: rect(submit),
        requiredFields: ['company','name','email','profile'].every(
          (name) => Boolean(form?.querySelector(`[name="${name}"][required]`))
        ),
        rawFinalExists: Boolean(rawFinal),
        rawFinalPanels: document.querySelectorAll('.raw-final-panel').length,
        disclosure: document.body.innerText.includes('KONSEPTIESIMERKKI — EI ASIAKASTYÖ'),
        bodyText: document.body.innerText.replace(/\\s+/g, ' ').trim(),
        viewportMeta: document.querySelector('meta[name="viewport"]')?.getAttribute('content') || '',
        bodyOverflowX: getComputedStyle(document.body).overflowX,
        innerWidth,
        innerHeight,
        scrollWidth: document.documentElement.scrollWidth,
        overflowing: [...document.querySelectorAll('body *')]
          .map((el) => {
            const r = el.getBoundingClientRect();
            return {
              tag: el.tagName,
              id: el.id || '',
              className: typeof el.className === 'string' ? el.className : '',
              left: Math.round(r.left),
              right: Math.round(r.right),
              width: Math.round(r.width),
            };
          })
          .filter((item) => item.left < -1 || item.right > innerWidth + 1)
          .slice(0, 12),
      };
    })()`);

    assert(metrics.h1Count === 1, `${viewport.width}x${viewport.height}: expected exactly one H1.`);
    assert(
      metrics.h1Text.includes('TYÖMAAKUVA SISÄÄN.') && metrics.h1Text.includes('VALMIS JULKAISU ULOS.'),
      `${viewport.width}x${viewport.height}: V2 headline missing.`
    );
    assert(
      metrics.heroText.includes('remontti- ja rakennusyritysten työmaakuvista') &&
      metrics.heroText.includes('Instagramiin ja Facebookiin'),
      `${viewport.width}x${viewport.height}: value proposition missing.`
    );
    assert(metrics.heroCtaHref === '#laheta-kuvat', `${viewport.width}x${viewport.height}: primary CTA does not target #laheta-kuvat.`);
    assert(
      metrics.heroCtaText.includes('2 ESIMERKKIÄ') || metrics.heroCtaText.includes('2 MAKSUTONTA SISÄLTÖESIMERKKIÄ'),
      `${viewport.width}x${viewport.height}: primary CTA copy missing.`
    );
    assert(metrics.priceText.includes('490 €'), `${viewport.width}x${viewport.height}: 490 € price missing.`);
    assert(metrics.formExists, `${viewport.width}x${viewport.height}: native lead form missing.`);
    assert(metrics.formMethod === 'post', `${viewport.width}x${viewport.height}: lead form method must be POST.`);
    assert(metrics.formAction === '/api/leads', `${viewport.width}x${viewport.height}: lead form action must be /api/leads.`);
    assert(metrics.requiredFields, `${viewport.width}x${viewport.height}: required lead fields missing.`);
    assert(metrics.submitRect?.height >= 44, `${viewport.width}x${viewport.height}: submit target below 44px.`);
    assert(metrics.rawFinalExists && metrics.rawFinalPanels === 2, `${viewport.width}x${viewport.height}: static RAW → FINAL proof missing.`);
    assert(metrics.disclosure, `${viewport.width}x${viewport.height}: concept disclosure missing.`);
    assert(metrics.brandNaturalWidth > 0 && metrics.brandNaturalHeight > 0, `${viewport.width}x${viewport.height}: logo image failed to load.`);
    assert(metrics.brandImageRect?.width >= 100, `${viewport.width}x${viewport.height}: logo is visually too narrow or clipped.`);
    assert(metrics.viewportMeta.includes('viewport-fit=cover'), `${viewport.width}x${viewport.height}: viewport-fit=cover missing.`);
    assert(
      metrics.bodyOverflowX === 'clip' || metrics.bodyOverflowX === 'hidden',
      `${viewport.width}x${viewport.height}: body must suppress horizontal overflow.`
    );
    assert(
      metrics.scrollWidth <= metrics.innerWidth + 1,
      `${viewport.width}x${viewport.height}: horizontal overflow ${metrics.scrollWidth}px > ${metrics.innerWidth}px. Offenders: ${JSON.stringify(metrics.overflowing)}`
    );
    assert(
      !metrics.bodyText.includes('790 €') && !metrics.bodyText.includes('MANAGED') && !metrics.bodyText.toLowerCase().includes('kuukausittain irtisanottava'),
      `${viewport.width}x${viewport.height}: obsolete pricing copy reappeared.`
    );

    for (const [name, rectValue] of [
      ['brand', metrics.brandRect],
      ['logo image', metrics.brandImageRect],
      ['headline', metrics.h1Rect],
      ['hero CTA', metrics.heroCtaRect],
      ['price', metrics.priceRect],
    ]) {
      assert(rectValue, `${viewport.width}x${viewport.height}: ${name} missing.`);
      assert(
        rectValue.left >= -1 && rectValue.right <= metrics.innerWidth + 1,
        `${viewport.width}x${viewport.height}: ${name} overflows horizontally.`
      );
    }

    if (viewport.firstView) {
      assert(
        metrics.heroCtaRect.bottom <= metrics.innerHeight,
        `${viewport.width}x${viewport.height}: primary CTA is below first viewport (${Math.round(metrics.heroCtaRect.bottom)}px).`
      );
      assert(
        metrics.priceRect.bottom <= metrics.innerHeight,
        `${viewport.width}x${viewport.height}: price is below first viewport (${Math.round(metrics.priceRect.bottom)}px).`
      );
    }

    const screenshot = await client.send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false,
    });
    await writeFile(
      `${SCREENSHOT_DIR}/homepage-${viewport.width}x${viewport.height}.png`,
      Buffer.from(screenshot.data, 'base64')
    );

    results.push({
      viewport: `${viewport.width}x${viewport.height}`,
      heroCtaBottom: Math.round(metrics.heroCtaRect.bottom),
      priceBottom: Math.round(metrics.priceRect.bottom),
      status: 'PASS',
    });
  }

  // Keyboard/accessibility and analytics regression.
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
  });
  await client.send('Page.navigate', { url: BASE_URL });
  await waitForDocument(client);

  await evaluate(client, `(() => {
    window.__ghAnalyticsEvents = [];
    window.va = (command, payload) => window.__ghAnalyticsEvents.push({ command, payload });
    return true;
  })()`);

  const interaction = await evaluate(client, `(() => {
    const cta = document.querySelector('#top a[href="#laheta-kuvat"]');
    cta?.focus();
    const focusedBeforeClick = document.activeElement === cta;
    cta?.click();
    const form = document.querySelector('#laheta-kuvat form[action="/api/leads"]');
    const submit = form?.querySelector('button[type="submit"]');
    return {
      focusedBeforeClick,
      hash: location.hash,
      formExists: Boolean(form),
      submitTabIndex: submit?.tabIndex ?? -1,
    };
  })()`);

  await sleep(100);
  const analyticsEvents = await evaluate(client, `(() =>
    (window.__ghAnalyticsEvents || [])
      .filter((entry) => entry?.command === 'event')
      .map((entry) => entry?.payload?.name)
  )()`);

  assert(interaction.focusedBeforeClick, 'Primary CTA is not keyboard-focusable.');
  assert(interaction.hash === '#laheta-kuvat', 'Primary CTA did not navigate to #laheta-kuvat.');
  assert(interaction.formExists, 'Lead form is missing after CTA navigation.');
  assert(interaction.submitTabIndex >= 0, 'Lead submit button is not keyboard-focusable.');
  assert(analyticsEvents.includes('primary_cta_click'), 'primary_cta_click analytics event missing.');
  assert(analyticsEvents.includes('photo_demo_cta_click'), 'photo_demo_cta_click analytics event missing.');

  // Reduced-motion must not remove content or leave persistent animations.
  await client.send('Emulation.setEmulatedMedia', {
    media: '',
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
  });
  await client.send('Page.navigate', { url: BASE_URL });
  await waitForDocument(client);

  const reducedMotion = await evaluate(client, `(() => ({
    scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
    animatedElements: [...document.querySelectorAll('*')].filter((el) => {
      const style = getComputedStyle(el);
      return style.animationName !== 'none' &&
        style.animationDuration !== '0s' &&
        style.animationDuration !== '0.01ms';
    }).length,
    rawFinal: Boolean(document.querySelector('.raw-final-grid')),
    form: Boolean(document.querySelector('#laheta-kuvat form[action="/api/leads"]')),
  }))()`);

  assert(reducedMotion.scrollBehavior === 'auto', 'Reduced motion must disable smooth scrolling.');
  assert(reducedMotion.animatedElements === 0, 'Reduced motion left a persistent animation running.');
  assert(reducedMotion.rawFinal && reducedMotion.form, 'Reduced motion removed critical content.');

  assert(pageExceptions.length === 0, `Page exceptions: ${pageExceptions.join(' | ')}`);

  const resultPayload = { chromePath, results, interaction, analyticsEvents, reducedMotion };
  await writeFile(
    `${SCREENSHOT_DIR}/results.json`,
    JSON.stringify(resultPayload, null, 2)
  );
  console.log(JSON.stringify(resultPayload, null, 2));
} finally {
  client?.close();
  await stopProcess(chrome);
  await rm(USER_DATA_DIR, { recursive: true, force: true });
}
