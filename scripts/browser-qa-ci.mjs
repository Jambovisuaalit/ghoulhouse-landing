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
  { width: 1363, height: 768 },
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
          (el) => visible(el) && el.textContent?.includes('PYYDÄ 2 SISÄLTÖESIMERKKIÄ')
        );
        const price = [...(hero?.querySelectorAll('*') || [])].find(
          (el) => visible(el) && el.children.length === 0 && el.textContent?.includes('490 €')
        );
        const offerCard = document.querySelector('[data-offer-card]');
        const pricingTitle = document.querySelector('#pricing-title');
        const rawSection = document.querySelector('[data-scroll-raw]');
        const rawStage = rawSection?.querySelector('.mechanism-raw__stage');
        const rawHeading = rawSection?.querySelector('.mechanism-raw__copy--raw h3');
        const finalHeading = rawSection?.querySelector('.mechanism-raw__copy--final h3');
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
          bodyFont: getComputedStyle(document.body).fontFamily,
          bodyText: document.body.innerText.replace(/\\s+/g, ' ').trim(),
          brandText: brand?.textContent?.replace(/\\s+/g, ' ').trim() || '',
          brandRect: rect(brand),
          h1Rect: rect(h1),
          ctaRect: rect(cta),
          priceRect: rect(price),
          pricingTitleRect: rect(pricingTitle),
          pricingTitleVisualRight: pricingTitle
            ? pricingTitle.getBoundingClientRect().left + pricingTitle.scrollWidth
            : null,
          offerCardRect: rect(offerCard),
          rawStageRect: rect(rawStage),
          rawHeadingVisualRight: rawHeading
            ? rawHeading.getBoundingClientRect().left + rawHeading.scrollWidth
            : null,
          finalHeadingVisualRight: finalHeading
            ? finalHeading.getBoundingClientRect().left + finalHeading.scrollWidth
            : null,
          innerWidth,
          innerHeight,
          scrollWidth: document.documentElement.scrollWidth,
        };
      })()`
    );

    assert(metrics.h1Count === 1, `${viewport.width}px: expected exactly one H1.`);
    assert(
      metrics.h1Text.includes('TYÖMAAKUVAT SISÄÄN.') &&
        metrics.h1Text.includes('VALMIS SOME ULOS.'),
      `${viewport.width}px: canonical headline missing.`
    );
    assert(
      metrics.heroText.includes('Teette hyvää työtä.') &&
        metrics.heroText.includes('Me pidämme huolen, että asiakkaat myös näkevät sen.'),
      `${viewport.width}px: canonical value proposition missing.`
    );
    assert(
      metrics.brandText.toUpperCase() === 'GHOULHOUSE',
      `${viewport.width}px: full GhoulHouse wordmark is missing.`
    );
    assert(
      metrics.ctaText.includes('PYYDÄ 2 SISÄLTÖESIMERKKIÄ'),
      `${viewport.width}px: CTA missing.`
    );
    assert(metrics.priceText.includes('490 €'), `${viewport.width}px: SOME 12 price missing.`);
    assert(
      !metrics.bodyFont.toLowerCase().includes('system-ui'),
      `${viewport.width}px: generic system UI font is still active: ${metrics.bodyFont}.`
    );
    assert(
      metrics.bodyText.toUpperCase().includes('TYÖMAAMATERIAALI') &&
        metrics.bodyText.toUpperCase().includes('VALMIS JULKAISUUN.') &&
        !metrics.bodyText.toLowerCase().includes('worksite material'),
      `${viewport.width}px: Finnish mechanism message is missing.`
    );
    assert(
      metrics.offerName === 'SOME 12',
      `${viewport.width}px: pricing card offer name must be SOME 12, got "${metrics.offerName}".`
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
      `${viewport.width}px: horizontal overflow ${metrics.scrollWidth}px > ${metrics.innerWidth}px.`
    );
    assert(metrics.ctaRect?.height >= 44, `${viewport.width}px: CTA target below 44px.`);
    assert(
      metrics.ctaRect?.bottom <= metrics.innerHeight,
      `${viewport.width}px: CTA below first viewport.`
    );
    assert(
      metrics.priceRect?.bottom <= metrics.innerHeight,
      `${viewport.width}px: price below first viewport.`
    );

    if (viewport.width >= 1024) {
      assert(
        metrics.pricingTitleVisualRight <= metrics.offerCardRect?.left + 1,
        `${viewport.width}px: pricing title overlaps offer card.`
      );
      assert(
        metrics.rawHeadingVisualRight <= metrics.rawStageRect?.left + 1,
        `${viewport.width}px: RAW heading overlaps the visual stage.`
      );
      assert(
        metrics.finalHeadingVisualRight <= metrics.innerWidth + 1,
        `${viewport.width}px: FINAL heading exits the viewport.`
      );
    }

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

  // Mobile navigation accessibility regression.
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
  });
  await client.send('Page.navigate', { url: BASE_URL });
  await waitForDocument(client);

  const menuOpened = await evaluate(
    client,
    `(() => {
      const button = document.querySelector('button[aria-controls="mobile-navigation"]');
      button?.click();
      return Boolean(button);
    })()`
  );
  assert(menuOpened, 'Mobile menu button was not found.');

  const mobileMenuReady = await waitForCondition(
    client,
    "Boolean(document.querySelector('#mobile-navigation'))",
    2_000
  );
  assert(mobileMenuReady !== null, 'Mobile menu did not open.');

  const mobileMenu = await evaluate(
    client,
    `(() => {
      const firstLink = document.querySelector('#mobile-navigation a[href]');
      const main = document.querySelector('main');
      const footer = document.querySelector('footer');
      const skipLink = document.querySelector('a.skip-link');
      const button = document.querySelector('button[aria-controls="mobile-navigation"]');
      const cta = document.querySelector('#mobile-navigation button');
      return {
        expanded: button?.getAttribute('aria-expanded'),
        activeText: document.activeElement?.textContent?.replace(/\\s+/g, ' ').trim() || '',
        firstText: firstLink?.textContent?.replace(/\\s+/g, ' ').trim() || '',
        mainInert: main?.hasAttribute('inert') || false,
        footerInert: footer?.hasAttribute('inert') || false,
        skipInert: skipLink?.hasAttribute('inert') || false,
        ctaText: cta?.textContent?.replace(/\\s+/g, ' ').trim() || '',
      };
    })()`
  );

  assert(mobileMenu.expanded === 'true', 'Mobile menu aria-expanded is not true.');
  assert(
    mobileMenu.activeText === mobileMenu.firstText,
    `Mobile menu did not focus its first link: ${JSON.stringify(mobileMenu)}.`
  );
  assert(
    mobileMenu.mainInert && mobileMenu.footerInert && mobileMenu.skipInert,
    `Mobile menu background is not fully inert: ${JSON.stringify(mobileMenu)}.`
  );
  assert(mobileMenu.ctaText.includes('PYYDÄ 2 SISÄLTÖESIMERKKIÄ'), 'Mobile menu CTA is missing.');

  await evaluate(
    client,
    `(() => {
      document.querySelector('button[aria-controls="mobile-navigation"]')?.focus();
      return true;
    })()`
  );
  await client.send('Input.dispatchKeyEvent', {
    type: 'keyDown',
    key: 'Tab',
    code: 'Tab',
    modifiers: 8,
  });
  await client.send('Input.dispatchKeyEvent', {
    type: 'keyUp',
    key: 'Tab',
    code: 'Tab',
    modifiers: 8,
  });
  await sleep(80);

  const shiftTabTrap = await evaluate(
    client,
    `(() => ({
      insideMenu: Boolean(document.activeElement?.closest?.('#mobile-navigation')),
      activeText: document.activeElement?.textContent?.replace(/\\s+/g, ' ').trim() || '',
    }))()`
  );
  assert(
    shiftTabTrap.insideMenu && shiftTabTrap.activeText.includes('PYYDÄ 2 SISÄLTÖESIMERKKIÄ'),
    `Shift+Tab escaped the mobile menu focus trap: ${JSON.stringify(shiftTabTrap)}.`
  );

  await client.send('Input.dispatchKeyEvent', {
    type: 'keyDown',
    key: 'Tab',
    code: 'Tab',
  });
  await client.send('Input.dispatchKeyEvent', {
    type: 'keyUp',
    key: 'Tab',
    code: 'Tab',
  });
  await sleep(80);

  const tabTrap = await evaluate(
    client,
    `(() => ({
      isMenuButton: document.activeElement?.getAttribute('aria-controls') === 'mobile-navigation',
    }))()`
  );
  assert(tabTrap.isMenuButton, 'Tab did not wrap from mobile CTA back to menu button.');

  await client.send('Input.dispatchKeyEvent', {
    type: 'keyDown',
    key: 'Escape',
    code: 'Escape',
  });
  await client.send('Input.dispatchKeyEvent', {
    type: 'keyUp',
    key: 'Escape',
    code: 'Escape',
  });
  await sleep(100);

  const mobileMenuClosed = await evaluate(
    client,
    `(() => ({
      exists: Boolean(document.querySelector('#mobile-navigation')),
      focusReturned:
        document.activeElement?.getAttribute('aria-controls') === 'mobile-navigation',
      mainInert: document.querySelector('main')?.hasAttribute('inert') || false,
      footerInert: document.querySelector('footer')?.hasAttribute('inert') || false,
      skipInert: document.querySelector('a.skip-link')?.hasAttribute('inert') || false,
    }))()`
  );
  assert(!mobileMenuClosed.exists, 'Escape did not close mobile menu.');
  assert(mobileMenuClosed.focusReturned, 'Escape did not restore focus to mobile menu button.');
  assert(
    !mobileMenuClosed.mainInert && !mobileMenuClosed.footerInert && !mobileMenuClosed.skipInert,
    `Mobile menu background inert state was not restored: ${JSON.stringify(mobileMenuClosed)}.`
  );

  const mobileFilmStart = await evaluate(
    client,
    `(() => {
      const section = document.querySelector('[data-scroll-film]');
      const viewport = section?.querySelector('.mechanism-film__viewport');
      if (!section || !viewport) return null;
      const travel = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
      viewport.scrollTo({ left: travel * 0.5, behavior: 'auto' });
      return {
        travel,
        snapType: getComputedStyle(viewport).scrollSnapType,
      };
    })()`
  );
  assert(mobileFilmStart?.travel > 100, 'Mobile filmstrip has insufficient horizontal travel.');
  assert(
    mobileFilmStart.snapType.includes('x') && mobileFilmStart.snapType.includes('mandatory'),
    `Mobile filmstrip scroll snap is not active: ${mobileFilmStart?.snapType}.`
  );
  await sleep(180);

  const mobileFilm = await evaluate(
    client,
    `(() => {
      const section = document.querySelector('[data-scroll-film]');
      const viewport = section?.querySelector('.mechanism-film__viewport');
      return {
        progress: parseFloat(getComputedStyle(section).getPropertyValue('--film-progress')) || 0,
        scrollLeft: viewport?.scrollLeft || 0,
      };
    })()`
  );
  assert(
    mobileFilm.progress > 0.1 && mobileFilm.progress < 0.9,
    `Mobile filmstrip progress did not follow horizontal scroll: ${JSON.stringify(mobileFilm)}.`
  );

  // Desktop scroll-effect regression: progress must track actual geometry.
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

  const pacing = await evaluate(
    client,
    `(() => {
      const mechanism = document.querySelector('#mechanism');
      const examples = document.querySelector('#examples');
      const deliverables = document.querySelector('#deliverables');
      const totalHeight = document.documentElement.scrollHeight;
      const absoluteTop = (el) => el ? el.getBoundingClientRect().top + scrollY : null;
      return {
        totalHeight,
        mechanismHeight: mechanism?.getBoundingClientRect().height || 0,
        examplesHeight: examples?.getBoundingClientRect().height || 0,
        deliverablesTop: absoluteTop(deliverables),
        combinedShare:
          ((mechanism?.getBoundingClientRect().height || 0) +
            (examples?.getBoundingClientRect().height || 0)) /
          totalHeight,
      };
    })()`
  );
  assert(
    pacing.deliverablesTop <= 900 * 2.5,
    `Detailed service content appears too late: ${pacing.deliverablesTop}px.`
  );
  assert(
    pacing.combinedShare <= 0.52,
    `Mechanism and examples still dominate page length: ${(pacing.combinedShare * 100).toFixed(1)}%.`
  );

  const sampleRawAt = async (fraction) => {
    const target = await evaluate(
      client,
      `(() => {
        document.documentElement.style.scrollBehavior = 'auto';
        const section = document.querySelector('[data-scroll-raw]');
        const sticky = section?.querySelector('.mechanism-raw__sticky');
        if (!section || !sticky) return null;
        const stickyTop = parseFloat(getComputedStyle(sticky).top) || 0;
        const sectionTop = section.getBoundingClientRect().top + scrollY;
        const travel = Math.max(1, section.offsetHeight - sticky.offsetHeight);
        const target = sectionTop - stickyTop + travel * ${fraction};
        window.scrollTo(0, target);
        return { target, travel };
      })()`
    );

    assert(target, `Desktop RAW scroll geometry is missing at ${fraction}.`);
    await sleep(180);

    return evaluate(
      client,
      `(() => {
        const section = document.querySelector('[data-scroll-raw]');
        const sticky = section?.querySelector('.mechanism-raw__sticky');
        const stage = section?.querySelector('.mechanism-raw__stage');
        const finalImage = section?.querySelector('.mechanism-raw__image--final');
        const divider = section?.querySelector('.mechanism-raw__divider');
        if (!section || !sticky || !stage || !finalImage || !divider) return null;
        const stickyRect = sticky.getBoundingClientRect();
        const stageRect = stage.getBoundingClientRect();
        return {
          progress: parseFloat(getComputedStyle(section).getPropertyValue('--raw-progress')) || 0,
          clipPath: getComputedStyle(finalImage).clipPath,
          dividerLeft: parseFloat(getComputedStyle(divider).left) || 0,
          stickyTop: stickyRect.top,
          stickyBottom: stickyRect.bottom,
          stageTop: stageRect.top,
          stageBottom: stageRect.bottom,
          stageHeight: stageRect.height,
        };
      })()`
    );
  };

  const rawQuarter = await sampleRawAt(0.25);
  const rawThreeQuarter = await sampleRawAt(0.75);

  assert(rawQuarter, 'Desktop RAW quarter-point metrics are missing.');
  assert(rawThreeQuarter, 'Desktop RAW three-quarter metrics are missing.');
  assert(
    rawQuarter.progress > 0.15 && rawQuarter.progress < 0.35,
    `Desktop RAW quarter progress should be near 0.25, got ${rawQuarter.progress}.`
  );
  assert(
    rawThreeQuarter.progress > 0.65 && rawThreeQuarter.progress < 0.85,
    `Desktop RAW three-quarter progress should be near 0.75, got ${rawThreeQuarter.progress}.`
  );
  assert(
    rawQuarter.clipPath &&
      rawQuarter.clipPath !== 'none' &&
      rawThreeQuarter.clipPath &&
      rawThreeQuarter.clipPath !== 'none' &&
      rawQuarter.clipPath !== rawThreeQuarter.clipPath,
    `Desktop RAW clip-path did not change with scroll: ${rawQuarter.clipPath} → ${rawThreeQuarter.clipPath}.`
  );
  assert(
    rawThreeQuarter.dividerLeft > rawQuarter.dividerLeft + 100,
    `Desktop RAW divider did not advance with scroll: ${rawQuarter.dividerLeft}px → ${rawThreeQuarter.dividerLeft}px.`
  );

  for (const [label, sample] of [
    ['quarter', rawQuarter],
    ['three-quarter', rawThreeQuarter],
  ]) {
    assert(
      sample.stickyTop >= 55 && sample.stickyTop <= 80,
      `Desktop RAW ${label} sticky stage is not pinned below the header: top ${sample.stickyTop}px.`
    );
    assert(
      sample.stickyBottom >= 860 && sample.stickyBottom <= 905,
      `Desktop RAW ${label} sticky stage does not fill the usable viewport: bottom ${sample.stickyBottom}px.`
    );
    assert(
      sample.stageHeight >= 400 &&
        sample.stageTop >= sample.stickyTop &&
        sample.stageBottom <= sample.stickyBottom + 1,
      `Desktop RAW ${label} visual stage is clipped or outside sticky viewport: ${JSON.stringify(sample)}.`
    );
  }

  const rawShot = await client.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false,
  });
  await writeFile(
    `${SCREENSHOT_DIR}/scroll-raw-three-quarter-1440x900.png`,
    Buffer.from(rawShot.data, 'base64')
  );

  const filmTarget = await evaluate(
    client,
    `(() => {
      const section = document.querySelector('[data-scroll-film]');
      const sticky = section?.querySelector('.mechanism-film__sticky');
      if (!section || !sticky) return null;
      const stickyTop = parseFloat(getComputedStyle(sticky).top) || 0;
      const sectionTop = section.getBoundingClientRect().top + scrollY;
      const travel = Math.max(1, section.offsetHeight - sticky.offsetHeight);
      const target = sectionTop - stickyTop + travel * 0.5;
      window.scrollTo(0, target);
      return { target, travel };
    })()`
  );
  assert(filmTarget, 'Desktop filmstrip scroll geometry is missing.');
  await sleep(180);

  const filmMid = await evaluate(
    client,
    `(() => {
      const section = document.querySelector('[data-scroll-film]');
      const sticky = section?.querySelector('.mechanism-film__sticky');
      const heading = section?.querySelector('.mechanism-film__header h3');
      const viewport = section?.querySelector('.mechanism-film__viewport');
      const track = section?.querySelector('.mechanism-film__track');
      const frame = section?.querySelector('.mechanism-film__frame');
      if (!section || !sticky || !heading || !viewport || !track || !frame) return null;
      const matrix = new DOMMatrixReadOnly(getComputedStyle(track).transform);
      const horizontalTravel = Math.max(0, track.scrollWidth - viewport.clientWidth);
      const stickyRect = sticky.getBoundingClientRect();
      const viewportRect = viewport.getBoundingClientRect();
      const frameRect = frame.getBoundingClientRect();
      return {
        progress: parseFloat(getComputedStyle(section).getPropertyValue('--film-progress')) || 0,
        translateX: matrix.m41,
        horizontalTravel,
        stickyTop: stickyRect.top,
        stickyBottom: stickyRect.bottom,
        stickyHeight: stickyRect.height,
        viewportTop: viewportRect.top,
        viewportBottom: viewportRect.bottom,
        frameTop: frameRect.top,
        frameBottom: frameRect.bottom,
        frameHeight: frameRect.height,
        headingClientWidth: heading.clientWidth,
        headingScrollWidth: heading.scrollWidth,
      };
    })()`
  );
  assert(filmMid, 'Desktop filmstrip midpoint metrics are missing.');
  assert(
    filmMid.horizontalTravel > 200,
    `Desktop filmstrip has insufficient horizontal travel: ${filmMid.horizontalTravel}px.`
  );
  assert(
    filmMid.progress > 0.35 && filmMid.progress < 0.65,
    `Desktop filmstrip progress should be near 0.5, got ${filmMid.progress}.`
  );
  assert(
    filmMid.translateX < 0 &&
      Math.abs(filmMid.translateX) > filmMid.horizontalTravel * 0.3 &&
      Math.abs(filmMid.translateX) < filmMid.horizontalTravel * 0.7,
    `Desktop filmstrip must translate left in sync with scroll: ${filmMid.translateX}px of ${filmMid.horizontalTravel}px.`
  );
  assert(
    filmMid.stickyTop >= 55 && filmMid.stickyTop <= 80,
    `Desktop filmstrip sticky stage is not pinned below the header: top ${filmMid.stickyTop}px.`
  );
  assert(
    filmMid.stickyBottom >= 860 && filmMid.stickyBottom <= 905,
    `Desktop filmstrip sticky stage does not fill the usable viewport: bottom ${filmMid.stickyBottom}px.`
  );
  assert(
    filmMid.viewportTop >= filmMid.stickyTop &&
      filmMid.viewportBottom <= filmMid.stickyBottom + 16 &&
      filmMid.frameTop >= filmMid.stickyTop &&
      filmMid.frameBottom <= filmMid.stickyBottom + 1 &&
      filmMid.frameHeight >= 300,
    `Desktop filmstrip content is clipped or outside sticky viewport: ${JSON.stringify(filmMid)}.`
  );
  assert(
    filmMid.headingScrollWidth <= filmMid.headingClientWidth + 1,
    `Desktop filmstrip heading overflows its box: ${filmMid.headingScrollWidth}px > ${filmMid.headingClientWidth}px.`
  );

  const filmShot = await client.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false,
  });
  await writeFile(
    `${SCREENSHOT_DIR}/scroll-film-mid-1440x900.png`,
    Buffer.from(filmShot.data, 'base64')
  );

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
        el.textContent?.includes('PYYDÄ 2 SISÄLTÖESIMERKKIÄ')
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
    analyticsNames.includes('primary_cta_click') && analyticsNames.includes('lead_form_open'),
    `CTA analytics events were not forwarded to Vercel Analytics: ${JSON.stringify(dialog.analyticsEvents)}.`
  );
  assert(pageExceptions.length === 0, `Page exceptions: ${pageExceptions.join(' | ')}`);

  await writeFile(
    `${SCREENSHOT_DIR}/results.json`,
    JSON.stringify(
      {
        chromePath,
        results,
        pacing,
        mobileFilm,
        scrollEffects: { rawQuarter, rawThreeQuarter, filmMid },
        reducedMotion,
        dialog,
      },
      null,
      2
    )
  );

  console.log(
    JSON.stringify(
      {
        chromePath,
        results,
        pacing,
        mobileFilm,
        scrollEffects: { rawQuarter, rawThreeQuarter, filmMid },
        reducedMotion,
        dialog,
      },
      null,
      2
    )
  );
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
