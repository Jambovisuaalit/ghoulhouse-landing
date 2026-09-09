import { execFileSync, spawn } from 'node:child_process';
import { mkdir, rm, writeFile } from 'node:fs/promises';

const BASE_URL = process.env.QA_BASE_URL || 'http://127.0.0.1:3000';
const SCREENSHOT_DIR = process.env.QA_SCREENSHOT_DIR || 'qa-artifacts';
const CDP_PORT = Number(process.env.QA_VISUAL_CDP_PORT || 9333);
const USER_DATA_DIR = `/tmp/ghoulhouse-launch-visual-qa-${process.pid}`;

const viewports = [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
];

const overflowRoutes = [
  { path: '/', source: 'src/app/page.tsx + landing components' },
  { path: '/tietosuoja', source: 'src/app/tietosuoja/page.tsx' },
  { path: '/kiitos', source: 'src/app/kiitos/page.tsx' },
  { path: '/__launch-qa-not-found__', source: 'src/app/not-found.tsx' },
];

const ctaRoutes = overflowRoutes;

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

async function navigate(client, path) {
  await client.send('Page.navigate', { url: new URL(path, BASE_URL).href });
  await waitForDocument(client);
}

async function setViewport(client, viewport, reducedMotion = false) {
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: viewport.width < 768,
  });
  await client.send('Emulation.setEmulatedMedia', {
    media: '',
    features: [
      {
        name: 'prefers-reduced-motion',
        value: reducedMotion ? 'reduce' : 'no-preference',
      },
    ],
  });
}

async function pressTab(client) {
  const event = {
    key: 'Tab',
    code: 'Tab',
    windowsVirtualKeyCode: 9,
    nativeVirtualKeyCode: 9,
  };
  await client.send('Input.dispatchKeyEvent', { type: 'keyDown', ...event });
  await client.send('Input.dispatchKeyEvent', { type: 'keyUp', ...event });
  await sleep(25);
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
    '--window-size=1440,1024',
    `--user-data-dir=${USER_DATA_DIR}`,
    'about:blank',
  ],
  {
    stdio: ['ignore', 'ignore', 'pipe'],
    env: {
      ...process.env,
      DBUS_SYSTEM_BUS_ADDRESS: 'unix:path=/run/dbus/system_bus_socket',
    },
  }
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

  const overflowResults = [];
  const ctaResults = [];

  for (const viewport of viewports) {
    await setViewport(client, viewport);

    for (const route of overflowRoutes) {
      await navigate(client, route.path);
      const overflow = await evaluate(client, `(() => ({
        innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        offenders: [...document.querySelectorAll('body *')]
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
      }))()`);

      assert(
        overflow.scrollWidth <= overflow.innerWidth + 1,
        `${viewport.width}px ${route.path}: horizontal overflow ${overflow.scrollWidth}px > ${overflow.innerWidth}px. Source: ${route.source}. Offenders: ${JSON.stringify(overflow.offenders.slice(0, 20))}`
      );

      overflowResults.push({
        viewport: viewport.width,
        route: route.path,
        source: route.source,
        offenders: [],
      });
    }

    for (const route of ctaRoutes) {
      await navigate(client, route.path);
      const ctas = await evaluate(client, `(() =>
        [...document.querySelectorAll('.btn')]
          .filter((el) => {
            const r = el.getBoundingClientRect();
            const s = getComputedStyle(el);
            return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden';
          })
          .map((el) => {
            const r = el.getBoundingClientRect();
            return {
              tag: el.tagName,
              text: el.textContent?.replace(/\\s+/g, ' ').trim() || '',
              href: el.getAttribute('href') || '',
              width: Math.round(r.width * 10) / 10,
              height: Math.round(r.height * 10) / 10,
            };
          })
      )()`);

      for (const cta of ctas) {
        assert(
          cta.width >= 44 && cta.height >= 44,
          `${viewport.width}px ${route.path}: CTA below 44x44: ${JSON.stringify(cta)}`
        );
      }

      ctaResults.push({ viewport: viewport.width, route: route.path, ctas });
    }
  }

  const keyboardResults = [];
  for (const viewport of [viewports[0], viewports[2]]) {
    await setViewport(client, viewport);
    await navigate(client, '/');

    const expected = await evaluate(client, `(() => {
      const selector = 'a[href],button:not([disabled]),input:not([type="hidden"]):not([disabled]),textarea:not([disabled]),summary,[tabindex]';
      const visible = (el) => {
        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden';
      };
      const nodes = [...document.querySelectorAll(selector)]
        .filter((el) => visible(el) && el.tabIndex >= 0);
      nodes.forEach((el, index) => { el.dataset.qaTabId = String(index); });
      const positiveTabIndex = nodes.filter((el) => el.tabIndex > 0).map((el) => ({
        tag: el.tagName,
        text: el.textContent?.replace(/\\s+/g, ' ').trim() || '',
        tabIndex: el.tabIndex,
      }));
      document.body.tabIndex = -1;
      document.body.focus();
      document.body.removeAttribute('tabindex');
      return {
        count: nodes.length,
        positiveTabIndex,
        descriptors: nodes.map((el, index) => ({
          id: index,
          tag: el.tagName,
          text: el.textContent?.replace(/\\s+/g, ' ').trim().slice(0, 90) || '',
          href: el.getAttribute('href') || '',
          name: el.getAttribute('name') || '',
        })),
      };
    })()`);

    assert(expected.positiveTabIndex.length === 0, `${viewport.width}px: positive tabindex breaks logical tab order.`);

    const actual = [];
    for (let index = 0; index < expected.count; index += 1) {
      await pressTab(client);
      actual.push(await evaluate(client, `(() => {
        const el = document.activeElement;
        const style = el ? getComputedStyle(el) : null;
        const probe = document.createElement('span');
        probe.style.color = 'var(--color-red)';
        document.body.appendChild(probe);
        const signalColor = getComputedStyle(probe).color;
        probe.remove();
        return {
          qaTabId: el?.dataset?.qaTabId ?? null,
          tag: el?.tagName || '',
          text: el?.textContent?.replace(/\\s+/g, ' ').trim().slice(0, 90) || '',
          outlineColor: style?.outlineColor || '',
          outlineStyle: style?.outlineStyle || '',
          outlineWidth: style?.outlineWidth || '',
          signalColor,
        };
      })()`));
    }

    actual.forEach((item, index) => {
      assert(item.qaTabId === String(index), `${viewport.width}px: tab order mismatch at ${index}: ${JSON.stringify(item)}`);
      assert(item.outlineColor === item.signalColor, `${viewport.width}px: focus ring is not signal token at tab ${index}: ${JSON.stringify(item)}`);
      assert(item.outlineStyle !== 'none' && parseFloat(item.outlineWidth) >= 3, `${viewport.width}px: focus ring is not visibly >=3px at tab ${index}: ${JSON.stringify(item)}`);
    });

    keyboardResults.push({
      viewport: viewport.width,
      expected: expected.descriptors,
      actual,
      status: 'PASS',
    });
  }

  const reducedMotionResults = [];
  for (const viewport of viewports) {
    await setViewport(client, viewport, true);
    await navigate(client, '/');
    const reducedMotion = await evaluate(client, `(() => {
      const parseTimes = (value) => value.split(',').map((part) => part.trim()).filter(Boolean);
      const moving = [...document.querySelectorAll('*')].map((el) => {
        const style = getComputedStyle(el);
        const animations = parseTimes(style.animationDuration).filter((value) => value !== '0s' && value !== '0ms');
        const transitions = parseTimes(style.transitionDuration).filter((value) => value !== '0s' && value !== '0ms');
        return animations.length || transitions.length
          ? {
              tag: el.tagName,
              id: el.id || '',
              className: typeof el.className === 'string' ? el.className : '',
              animationDuration: style.animationDuration,
              transitionDuration: style.transitionDuration,
            }
          : null;
      }).filter(Boolean);
      return {
        scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
        moving,
      };
    })()`);

    assert(reducedMotion.scrollBehavior === 'auto', `${viewport.width}px: reduced motion must disable smooth scroll.`);
    assert(reducedMotion.moving.length === 0, `${viewport.width}px: animations/transitions remain under reduced motion: ${JSON.stringify(reducedMotion.moving.slice(0, 20))}`);
    reducedMotionResults.push({ viewport: viewport.width, status: 'PASS' });
  }

  const ogResponse = await fetch(new URL('/opengraph-image', BASE_URL), { cache: 'no-store' });
  assert(ogResponse.ok, `OG image request failed: ${ogResponse.status}`);
  const ogContentType = ogResponse.headers.get('content-type') || '';
  assert(ogContentType.startsWith('image/png'), `OG image must render as PNG, got ${ogContentType}`);
  const ogBuffer = Buffer.from(await ogResponse.arrayBuffer());
  assert(ogBuffer.byteLength > 10_000, `OG image payload is unexpectedly small: ${ogBuffer.byteLength} bytes`);
  await writeFile(`${SCREENSHOT_DIR}/opengraph-image.png`, ogBuffer);

  assert(pageExceptions.length === 0, `Page exceptions: ${pageExceptions.join(' | ')}`);

  const resultPayload = {
    chromePath,
    overflowResults,
    ctaResults,
    keyboardResults,
    reducedMotionResults,
    ogImage: {
      contentType: ogContentType,
      bytes: ogBuffer.byteLength,
      artifact: 'qa-artifacts/opengraph-image.png',
    },
  };

  await writeFile(
    `${SCREENSHOT_DIR}/launch-visual-a11y-results.json`,
    JSON.stringify(resultPayload, null, 2)
  );
  console.log(JSON.stringify(resultPayload, null, 2));
} finally {
  client?.close();
  await stopProcess(chrome);
  await rm(USER_DATA_DIR, { recursive: true, force: true });
}
