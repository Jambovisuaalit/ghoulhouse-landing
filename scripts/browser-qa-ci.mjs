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
          h1Rect: rect(h1),
          ctaRect: rect(cta),
          priceRect: rect(price),
          innerWidth,
          innerHeight,
          scrollWidth: document.documentElement.scrollWidth,
        };
      })()`
    );

    assert(metrics.h1Count === 1, `${viewport.width}px: expected exactly one H1.`);
    assert(
      metrics.h1Text.includes('TYÖMAAKUVAT SISÄÄN.') && metrics.h1Text.includes('VALMIS SOME ULOS.'),
      `${viewport.width}px: canonical headline missing.`
    );
    assert(
      metrics.heroText.includes('Teette hyvää työtä.') &&
        metrics.heroText.includes('Me pidämme huolen, että asiakkaat myös näkevät sen.'),
      `${viewport.width}px: canonical value proposition missing.`
    );
    assert(metrics.ctaText.includes('PYYDÄ 2 SISÄLTÖESIMERKKIÄ'), `${viewport.width}px: CTA missing.`);
    assert(metrics.priceText.includes('490 €'), `${viewport.width}px: START price missing.`);
    assert(
      metrics.scrollWidth <= metrics.innerWidth + 1,
      `${viewport.width}px: horizontal overflow ${metrics.scrollWidth}px > ${metrics.innerWidth}px.`
    );
    assert(metrics.ctaRect?.height >= 44, `${viewport.width}px: CTA target below 44px.`);
    assert(metrics.ctaRect?.bottom <= metrics.innerHeight, `${viewport.width}px: CTA below first viewport.`);
    assert(metrics.priceRect?.bottom <= metrics.innerHeight, `${viewport.width}px: price below first viewport.`);

    for (const [name, rect] of [
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
      const hero = document.querySelector('#top');
      const button = [...(hero?.querySelectorAll('button') || [])].find((el) =>
        el.textContent?.includes('PYYDÄ 2 SISÄLTÖESIMERKKIÄ')
      );
      button?.click();
      return Boolean(button);
    })()`
  );
  await sleep(250);

  const dialog = await evaluate(
    client,
    `(() => ({
      exists: Boolean(document.querySelector('[role="dialog"]')),
      activeName: document.activeElement?.getAttribute('name') || '',
    }))()`
  );
  assert(dialog.exists, 'Primary CTA did not open lead dialog.');
  assert(dialog.activeName === 'company', 'Lead dialog did not focus first field.');
  assert(pageExceptions.length === 0, `Page exceptions: ${pageExceptions.join(' | ')}`);

  await writeFile(
    `${SCREENSHOT_DIR}/results.json`,
    JSON.stringify({ chromePath, results, reducedMotion, dialog }, null, 2)
  );

  console.log(JSON.stringify({ chromePath, results, reducedMotion, dialog }, null, 2));
} finally {
  client?.close();
  if (chrome.exitCode === null) chrome.kill('SIGTERM');
  await rm(USER_DATA_DIR, { recursive: true, force: true });
}
