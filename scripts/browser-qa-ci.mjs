import { execFileSync, spawn } from 'node:child_process';
import { mkdir, rm, writeFile } from 'node:fs/promises';

const BASE_URL = process.env.QA_BASE_URL || 'http://127.0.0.1:3000';
const SCREENSHOT_DIR = process.env.QA_SCREENSHOT_DIR || 'qa-artifacts';
const CDP_PORT = Number(process.env.QA_CDP_PORT || 9222);
const USER_DATA_DIR = `/tmp/ghoulhouse-browser-qa-${process.pid}`;

const viewports = [
  { width: 320, height: 800 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1280, height: 800 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
];

function findChrome() {
  const result = execFileSync(
    'bash',
    [
      '-lc',
      'command -v google-chrome || command -v google-chrome-stable || command -v chromium || command -v chromium-browser',
    ],
    { encoding: 'utf8' }
  ).trim();

  if (!result) throw new Error('Chrome/Chromium binary not found on runner.');
  return result;
}

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForProcessExit(process, timeoutMs = 3_000) {
  if (process.exitCode !== null) return true;

  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      process.off('exit', handleExit);
      resolve(false);
    }, timeoutMs);

    const handleExit = () => {
      clearTimeout(timer);
      resolve(true);
    };

    process.once('exit', handleExit);
  });
}

async function removeUserDataDir() {
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
      await rm(USER_DATA_DIR, { recursive: true, force: true });
      return;
    } catch (error) {
      if (
        !error ||
        typeof error !== 'object' ||
        !('code' in error) ||
        !['ENOTEMPTY', 'EBUSY', 'EPERM'].includes(String(error.code)) ||
        attempt === 5
      ) {
        throw error;
      }

      await sleep(100 * attempt);
    }
  }
}

async function waitForJson(url, chrome, stderr, timeoutMs = 20_000) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    if (chrome.exitCode !== null) {
      throw new Error(
        `Chrome exited before CDP became ready (exit ${chrome.exitCode}).\n${stderr.join('')}`
      );
    }

    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (response.ok) return response.json();
    } catch {
      // Keep polling while Chrome starts.
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
      this.ws.addEventListener(
        'open',
        () => {
          clearTimeout(timer);
          resolve();
        },
        { once: true }
      );
      this.ws.addEventListener(
        'error',
        () => {
          clearTimeout(timer);
          reject(new Error('CDP websocket failed to open.'));
        },
        { once: true }
      );
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
    const state = await evaluate(client, 'document.readyState');
    if (state === 'complete') {
      await sleep(250);
      return;
    }
    await sleep(100);
  }
  throw new Error('Page did not reach complete readyState.');
}

async function waitForCondition(client, expression, timeoutMs = 3_000) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    if (await evaluate(client, expression)) {
      return Date.now() - start;
    }

    await sleep(50);
  }

  return null;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
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
  await client.send('Network.enable');

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

    const metrics = await evaluate(
      client,
      `(() => {
        const hero = document.querySelector('#top');
        const h1 = document.querySelector('h1');
        const brand = document.querySelector('header a[aria-label="GhoulHouse — sivun alku"]');
        const visible = (el) => {
          if (!el) return false;
          const r = el.getBoundingClientRect();
          const s = getComputedStyle(el);
          return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden';
        };
        const cta = [...(hero?.querySelectorAll('button') || [])].find(
          (el) => visible(el) && el.textContent?.includes('VARAA 20 MIN KESKUSTELU')
        );
        const price = [...(hero?.querySelectorAll('*') || [])].find(
          (el) => visible(el) && el.children.length === 0 && el.textContent?.includes('490 €')
        );
        const offerCard = document.querySelector('[data-offer-card]');
        const rect = (el) => {
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return { top: r.top, right: r.right, bottom: r.bottom, left: r.left, width: r.width, height: r.height };
        };
        return {
          h1Count: document.querySelectorAll('h1').length,
          h1Text: h1?.textContent?.replace(/\\s+/g, ' ').trim() || '',
          heroText: hero?.textContent?.replace(/\\s+/g, ' ').trim() || '',
          ctaText: cta?.textContent?.replace(/\\s+/g, ' ').trim() || '',
          priceText: price?.textContent?.replace(/\\s+/g, ' ').trim() || '',
          offerName: offerCard?.getAttribute('data-offer-name') || '',
          offerPrice: offerCard?.getAttribute('data-offer-price') || '',
          bodyText: document.body.innerText.replace(/\\s+/g, ' ').trim(),
          brandText: brand?.textContent?.replace(/\\s+/g, ' ').trim() || '',
          brandRect: rect(brand),
          h1Rect: rect(h1),
          ctaRect: rect(cta),
          priceRect: rect(price),
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
                text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80),
                left: Math.round(r.left),
                right: Math.round(r.right),
                width: Math.round(r.width),
              };
            })
            .filter((item) => item.left < -1 || item.right > innerWidth + 1)
            .slice(0, 12),
        };
      })()`
    );

    assert(metrics.h1Count === 1, `${viewport.width}px: expected exactly one H1.`);
    assert(
      metrics.h1Text.includes('TYÖMAAKUVAT SISÄÄN.') && metrics.h1Text.includes('VALMIS SOME ULOS.'),
      `${viewport.width}px: canonical headline missing.`
    );
    assert(
      metrics.heroText.includes('GhoulHouse tekee remontti- ja palveluyritysten työmaakuvista') &&
        metrics.heroText.includes('Instagramiin ja Facebookiin'),
      `${viewport.width}px: canonical value proposition missing.`
    );
    assert(metrics.brandText.toUpperCase() === 'GHOULHOUSE', `${viewport.width}px: full GhoulHouse wordmark is missing.`);
    assert(metrics.ctaText.includes('VARAA 20 MIN KESKUSTELU'), `${viewport.width}px: CTA missing.`);
    assert(metrics.priceText.includes('490 €'), `${viewport.width}px: SOME 12 price missing.`);
    assert(
      metrics.offerName === 'GHOULHOUSE SOME 12',
      `${viewport.width}px: pricing card offer name must be GHOULHOUSE SOME 12, got "${metrics.offerName}".`
    );
    assert(
      metrics.offerPrice === '490',
      `${viewport.width}px: pricing card offer price must be 490, got "${metrics.offerPrice}".`
    );
    assert(
      !metrics.bodyText.includes('790 €') &&
        !metrics.bodyText.includes('MANAGED') &&
        !metrics.bodyText.toLowerCase().includes('palvelujaksosta 4'),
      `${viewport.width}px: obsolete 490→790 pricing lifecycle reappeared in rendered page.`
    );
    assert(
      metrics.scrollWidth <= metrics.innerWidth + 1,
      `${viewport.width}px: horizontal overflow ${metrics.scrollWidth}px > ${metrics.innerWidth}px. Offenders: ${JSON.stringify(metrics.overflowing)}`
    );
    assert(metrics.ctaRect?.height >= 44, `${viewport.width}px: CTA target below 44px.`);
    assert(metrics.ctaRect?.bottom <= metrics.innerHeight, `${viewport.width}px: CTA below first viewport.`);

    for (const [name, rect] of [
      ['brand lockup', metrics.brandRect],
      ['headline', metrics.h1Rect],
      ['CTA', metrics.ctaRect],
      ['price', metrics.priceRect],
    ]) {
      assert(rect, `${viewport.width}px: ${name} is not visible.`);
      assert(
        rect.left >= -1 && rect.right <= metrics.innerWidth + 1,
        `${viewport.width}px: ${name} overflows horizontally.`
      );
    }

    const shot = await client.send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false,
    });
    await writeFile(
      `${SCREENSHOT_DIR}/homepage-${viewport.width}x${viewport.height}.png`,
      Buffer.from(shot.data, 'base64')
    );

    results.push({
      viewport: `${viewport.width}x${viewport.height}`,
      ctaBottom: Math.round(metrics.ctaRect.bottom),
      priceBottom: Math.round(metrics.priceRect.bottom),
      status: 'PASS',
    });
  }

  // Mobile navigation / responsive regression.
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
  });
  await client.send('Page.navigate', { url: BASE_URL });
  await waitForDocument(client);

  const mobileHeader = await evaluate(
    client,
    `(() => {
      const header = document.querySelector('header');
      const brand = header?.querySelector('a[aria-label="GhoulHouse — sivun alku"]');
      const cta = [...(header?.querySelectorAll('button') || [])].find((el) =>
        el.textContent?.includes('20 MIN')
      );
      const rect = (el) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { left:r.left, right:r.right, top:r.top, bottom:r.bottom, width:r.width, height:r.height };
      };
      return {
        brand: rect(brand),
        cta: rect(cta),
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth,
      };
    })()`
  );
  assert(mobileHeader.brand, 'Mobile brand lockup is missing.');
  assert(mobileHeader.cta, 'Mobile booking CTA is missing.');
  assert(mobileHeader.cta.height >= 44, 'Mobile booking CTA target is below 44px.');
  assert(
    mobileHeader.scrollWidth <= mobileHeader.innerWidth + 1,
    `Mobile page overflows horizontally: ${mobileHeader.scrollWidth}px > ${mobileHeader.innerWidth}px.`
  );

  // Before/after slider mobile affordance regression.
  const mobileSlider = await evaluate(
    client,
    `(() => {
      const slider = document.querySelector('.before-after-slider');
      const handle = slider?.querySelector('.before-after-slider__handle');
      const range = slider?.querySelector('input[type="range"]');
      const divider = slider?.querySelector('.before-after-slider__divider');
      const visible = (el) => {
        if (!el) return false;
        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden';
      };
      const rect = (el) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { left:r.left, right:r.right, top:r.top, bottom:r.bottom, width:r.width, height:r.height };
      };
      return {
        sliderVisible: visible(slider),
        handleVisible: visible(handle),
        handleText: handle?.textContent?.replace(/\\s+/g, ' ').trim() || '',
        handleRect: rect(handle),
        rangeExists: Boolean(range),
        rangeLabel: range?.getAttribute('aria-label') || '',
        rangeTouchAction: range ? getComputedStyle(range).touchAction : '',
        dividerRect: rect(divider),
      };
    })()`
  );
  assert(mobileSlider.sliderVisible, 'Mobile before/after slider is missing.');
  assert(mobileSlider.handleVisible, 'Mobile before/after drag handle is not visible.');
  assert(
    mobileSlider.handleText.includes('↔'),
    `Mobile before/after handle lacks explicit drag arrows: "${mobileSlider.handleText}".`
  );
  assert(
    mobileSlider.handleRect?.width >= 44 && mobileSlider.handleRect?.height >= 44,
    `Mobile before/after handle target is below 44px: ${JSON.stringify(mobileSlider.handleRect)}.`
  );
  assert(mobileSlider.rangeExists, 'Before/after range control is missing.');
  assert(
    mobileSlider.rangeLabel === 'Vertaa ennen- ja jälkeen-kuvaa',
    `Before/after range accessible label changed: "${mobileSlider.rangeLabel}".`
  );
  assert(
    mobileSlider.rangeTouchAction === 'pan-y',
    `Before/after mobile touch action should preserve vertical page pan, got "${mobileSlider.rangeTouchAction}".`
  );

  // Desktop sticky-header + hero motion regression.
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await client.send('Emulation.setEmulatedMedia', {
    media: '',
    features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }],
  });
  await client.send('Page.navigate', { url: BASE_URL });
  await waitForDocument(client);
  await sleep(900);

  const heroMotion = await evaluate(
    client,
    `(() => {
      const animated = [...document.querySelectorAll('[data-hero-motion]')];
      const visible = animated.every((el) => {
        const s = getComputedStyle(el);
        return Number(s.opacity) > 0.95 && new DOMMatrixReadOnly(s.transform).m42 > -1;
      });
      window.scrollTo(0, 260);
      return { count: animated.length, visible };
    })()`
  );
  assert(heroMotion.count >= 4, `Expected hero motion sequence, got ${heroMotion.count} nodes.`);
  assert(heroMotion.visible, 'Hero motion sequence did not settle to visible state.');
  await sleep(180);

  const stickyHeader = await evaluate(
    client,
    `(() => {
      const header = document.querySelector('header');
      const r = header?.getBoundingClientRect();
      return {
        fixed: header ? getComputedStyle(header).position === 'fixed' : false,
        top: r?.top ?? null,
        width: r?.width ?? 0,
      };
    })()`
  );
  assert(stickyHeader.fixed, 'Header did not become fixed after scroll.');
  assert(stickyHeader.top !== null && Math.abs(stickyHeader.top) <= 1, `Sticky header top is ${stickyHeader.top}.`);

  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
  });
  await client.send('Emulation.setEmulatedMedia', {
    media: '',
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
  });
  await client.send('Page.navigate', { url: BASE_URL });
  await waitForDocument(client);

  const reducedMotion = await evaluate(
    client,
    `(() => ({
      scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
      animatedElements: [...document.querySelectorAll('*')].filter((el) => {
        const style = getComputedStyle(el);
        return style.animationName !== 'none' && style.animationDuration !== '0s' && style.animationDuration !== '0.01ms';
      }).length,
    }))()`
  );
  assert(reducedMotion.scrollBehavior === 'auto', 'Reduced motion must disable smooth scrolling.');
  assert(reducedMotion.animatedElements === 0, 'Reduced motion left persistent animation running.');

  await client.send('Emulation.setEmulatedMedia', {
    media: '',
    features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }],
  });

  await evaluate(
    client,
    `(() => {
      window.__ghAnalyticsEvents = [];
      window.va = (command, payload) => {
        window.__ghAnalyticsEvents.push({ command, payload });
      };
      return true;
    })()`
  );

  const ctaClicked = await evaluate(
    client,
    `(() => {
      const hero = document.querySelector('#top');
      const button = [...(hero?.querySelectorAll('button') || [])].find((el) =>
        el.textContent?.includes('VARAA 20 MIN KESKUSTELU')
      );
      button?.click();
      return Boolean(button);
    })()`
  );
  assert(ctaClicked, 'Primary CTA button was not found in the hero.');

  const dialogOpenMs = await waitForCondition(
    client,
    'Boolean(document.querySelector(\'[role="dialog"]\'))',
    3_000
  );
  assert(dialogOpenMs !== null, 'Primary CTA did not open lead dialog.');

  const dialog = await evaluate(
    client,
    `(() => {
      const siteContent = document.querySelector('[aria-hidden="true"][inert]');
      return {
        exists: Boolean(document.querySelector('[role="dialog"]')),
        activeName: document.activeElement?.getAttribute('name') || '',
        backgroundInert: Boolean(siteContent),
        skipLinkExists: Boolean(document.querySelector('a.skip-link[href="#main-content"]')),
        openLatencyMs: ${dialogOpenMs},
        analyticsEvents: window.__ghAnalyticsEvents || [],
      };
    })()`
  );
  assert(dialog.exists, 'Primary CTA did not open lead dialog.');
  assert(dialogOpenMs <= 1_500, `Lead dialog took too long to open: ${dialogOpenMs}ms.`);
  assert(dialog.activeName === 'company', 'Lead dialog did not focus first field.');
  assert(dialog.backgroundInert, 'Background content is not inert while dialog is open.');
  assert(dialog.skipLinkExists, 'Skip link to main content is missing.');
  const analyticsNames = dialog.analyticsEvents
    .filter((entry) => entry?.command === 'event')
    .map((entry) => entry?.payload?.name);
  assert(
    analyticsNames.includes('booking_cta_click') &&
      analyticsNames.includes('lead_form_open'),
    `CTA analytics events were not forwarded to Vercel Analytics: ${JSON.stringify(dialog.analyticsEvents)}.`
  );
  assert(pageExceptions.length === 0, `Page exceptions: ${pageExceptions.join(' | ')}`);

  await writeFile(
    `${SCREENSHOT_DIR}/results.json`,
    JSON.stringify({ chromePath, results, heroMotion, stickyHeader, mobileHeader, reducedMotion, dialog }, null, 2)
  );

  console.log(JSON.stringify({ chromePath, results, heroMotion, stickyHeader, mobileHeader, reducedMotion, dialog }, null, 2));
} finally {
  client?.close();

  if (chrome.exitCode === null) {
    chrome.kill('SIGTERM');
    const exited = await waitForProcessExit(chrome);

    if (!exited && chrome.exitCode === null) {
      chrome.kill('SIGKILL');
      await waitForProcessExit(chrome, 2_000);
    }
  }

  await removeUserDataDir();
}
