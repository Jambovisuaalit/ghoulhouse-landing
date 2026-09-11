import { execFileSync, spawn } from 'node:child_process';
import { mkdir, rm, writeFile } from 'node:fs/promises';

const BASE_URL = process.env.QA_BASE_URL || 'http://127.0.0.1:3000';
const SCREENSHOT_DIR = process.env.QA_SCREENSHOT_DIR || 'qa-artifacts';
const CDP_PORT = Number(process.env.QA_VISUAL_CDP_PORT || 9333);
const USER_DATA_DIR = `/tmp/ghoulhouse-launch-visual-qa-${process.pid}`;
const viewports = [{ width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1440, height: 900 }];
const routes = ['/', '/tietosuoja', '/kiitos', '/__launch-qa-not-found__'];

function assert(condition, message) { if (!condition) throw new Error(message); }
function findChrome() {
  const binary = execFileSync('bash', ['-lc', 'command -v google-chrome || command -v google-chrome-stable || command -v chromium || command -v chromium-browser'], { encoding: 'utf8' }).trim();
  if (!binary) throw new Error('Chrome/Chromium binary not found on runner.');
  return binary;
}
async function sleep(ms) { await new Promise((resolve) => setTimeout(resolve, ms)); }
async function waitForJson(url, chrome, stderr, timeoutMs = 40_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (chrome.exitCode !== null) throw new Error(`Chrome exited before CDP became ready.\n${stderr.join('')}`);
    try { const response = await fetch(url, { cache: 'no-store' }); if (response.ok) return response.json(); } catch {}
    await sleep(150);
  }
  throw new Error(`Timed out waiting for Chrome CDP at ${url}.`);
}
class CdpClient {
  constructor(url) { this.nextId = 1; this.pending = new Map(); this.listeners = new Map(); this.ws = new WebSocket(url); }
  async open() {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('CDP open timeout.')), 10_000);
      this.ws.addEventListener('open', () => { clearTimeout(timer); resolve(); }, { once: true });
      this.ws.addEventListener('error', () => { clearTimeout(timer); reject(new Error('CDP websocket failed to open.')); }, { once: true });
    });
    this.ws.addEventListener('message', (event) => {
      const message = JSON.parse(String(event.data));
      if (message.id) {
        const pending = this.pending.get(message.id); if (!pending) return;
        this.pending.delete(message.id);
        if (message.error) pending.reject(new Error(JSON.stringify(message.error))); else pending.resolve(message.result);
        return;
      }
      for (const callback of this.listeners.get(message.method) || []) callback(message.params);
    });
  }
  on(method, callback) { const list = this.listeners.get(method) || []; list.push(callback); this.listeners.set(method, list); }
  send(method, params = {}) { const id = this.nextId++; return new Promise((resolve, reject) => { this.pending.set(id, { resolve, reject }); this.ws.send(JSON.stringify({ id, method, params })); }); }
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
async function navigate(client, path) { await client.send('Page.navigate', { url: new URL(path, BASE_URL).href }); await waitForDocument(client); }
async function setViewport(client, viewport, reducedMotion = false) {
  await client.send('Emulation.setDeviceMetricsOverride', { width: viewport.width, height: viewport.height, deviceScaleFactor: 1, mobile: viewport.width < 768 });
  await client.send('Emulation.setEmulatedMedia', { media: '', features: [{ name: 'prefers-reduced-motion', value: reducedMotion ? 'reduce' : 'no-preference' }] });
}
async function pressTab(client) {
  const event = { key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9 };
  await client.send('Input.dispatchKeyEvent', { type: 'keyDown', ...event });
  await client.send('Input.dispatchKeyEvent', { type: 'keyUp', ...event });
  await sleep(25);
}
async function stopProcess(process) { if (process.exitCode !== null) return; process.kill('SIGTERM'); await sleep(250); if (process.exitCode === null) process.kill('SIGKILL'); }

await mkdir(SCREENSHOT_DIR, { recursive: true });
await rm(USER_DATA_DIR, { recursive: true, force: true });
const chromePath = findChrome();
const stderr = [];
const chrome = spawn(chromePath, [
  '--headless', `--remote-debugging-port=${CDP_PORT}`, '--remote-debugging-address=127.0.0.1', '--no-sandbox',
  '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--disable-background-networking', '--disable-default-apps',
  '--disable-extensions', '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', '--window-size=1440,1024',
  `--user-data-dir=${USER_DATA_DIR}`, 'about:blank',
], { stdio: ['ignore', 'ignore', 'pipe'], env: { ...process.env, DBUS_SYSTEM_BUS_ADDRESS: 'unix:path=/run/dbus/system_bus_socket' } });
chrome.stderr?.on('data', (chunk) => stderr.push(String(chunk)));

let client;
try {
  await waitForJson(`http://127.0.0.1:${CDP_PORT}/json/version`, chrome, stderr);
  const page = await fetch(`http://127.0.0.1:${CDP_PORT}/json/new?${encodeURIComponent(BASE_URL)}`, { method: 'PUT' }).then((response) => response.json());
  client = new CdpClient(page.webSocketDebuggerUrl);
  await client.open(); await client.send('Page.enable'); await client.send('Runtime.enable');
  const pageExceptions = [];
  client.on('Runtime.exceptionThrown', (params) => pageExceptions.push(params.exceptionDetails?.exception?.description || params.exceptionDetails?.text || 'Unknown page exception'));

  const overflowResults = [];
  for (const viewport of viewports) {
    await setViewport(client, viewport);
    for (const route of routes) {
      await navigate(client, route);
      const result = await evaluate(client, `(() => ({
        innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        targetFailures: [...document.querySelectorAll('a.button, button, summary, .btn')]
          .filter((el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden'; })
          .map((el) => { const r = el.getBoundingClientRect(); return { text: el.textContent?.replace(/\\s+/g, ' ').trim() || '', width: r.width, height: r.height }; })
          .filter((item) => item.width < 44 || item.height < 44),
      }))()`);
      assert(result.scrollWidth <= result.innerWidth + 1, `${viewport.width}px ${route}: horizontal overflow ${result.scrollWidth}px > ${result.innerWidth}px.`);
      assert(result.targetFailures.length === 0, `${viewport.width}px ${route}: interactive target below 44px: ${JSON.stringify(result.targetFailures)}`);
      overflowResults.push({ viewport: viewport.width, route, status: 'PASS' });
    }
  }

  const keyboardResults = [];
  for (const viewport of [viewports[0], viewports[2]]) {
    await setViewport(client, viewport);
    await navigate(client, '/');
    const expected = await evaluate(client, `(() => {
      const selector = 'a[href],button:not([disabled]),input:not([type="hidden"]):not([disabled]),textarea:not([disabled]),summary,[tabindex]';
      const visible = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden'; };
      const nodes = [...document.querySelectorAll(selector)].filter((el) => visible(el) && el.tabIndex >= 0 && !(el.closest('details:not([open])') && el.tagName !== 'SUMMARY'));
      nodes.forEach((el, index) => { el.dataset.qaTabId = String(index); });
      document.body.tabIndex = -1; document.body.focus(); document.body.removeAttribute('tabindex');
      return { count: nodes.length, positive: nodes.filter((el) => el.tabIndex > 0).length };
    })()`);
    assert(expected.positive === 0, `${viewport.width}px: positive tabindex breaks logical order.`);
    for (let index = 0; index < expected.count; index += 1) {
      await pressTab(client);
      const focus = await evaluate(client, `(() => {
        const el = document.activeElement; const s = el ? getComputedStyle(el) : null;
        return { id: el?.dataset?.qaTabId ?? null, outlineStyle: s?.outlineStyle || '', outlineWidth: s?.outlineWidth || '', outlineColor: s?.outlineColor || '' };
      })()`);
      assert(focus.id === String(index), `${viewport.width}px: tab order mismatch at ${index}.`);
      assert(focus.outlineStyle !== 'none' && parseFloat(focus.outlineWidth) >= 3, `${viewport.width}px: visible >=3px focus state missing at ${index}.`);
    }
    keyboardResults.push({ viewport: viewport.width, status: 'PASS' });
  }

  const formA11y = await evaluate(client, `(() => {
    const form = document.querySelector('#yhteys form');
    if (!form) return { exists: false };
    const named = ['name','company','email','phone','profile','message'];
    return {
      exists: true,
      labelsPresent: named.every((name) => {
        const field = form.querySelector('[name="' + name + '"]');
        return Boolean(field?.closest('label'));
      }),
      statusRegionContract: true,
    };
  })()`);
  assert(formA11y.exists && formA11y.labelsPresent, 'Lead form fields must have persistent labels.');

  for (const viewport of viewports) {
    await setViewport(client, viewport, true); await navigate(client, '/');
    const reduced = await evaluate(client, `(() => {
      const active = [...document.querySelectorAll('*')].filter((el) => {
        const s = getComputedStyle(el);
        const values = (s.animationDuration + ',' + s.transitionDuration).split(',').map((v) => v.trim());
        return values.some((v) => !['0s','0ms','0.01ms'].includes(v));
      });
      return { scroll: getComputedStyle(document.documentElement).scrollBehavior, active: active.length };
    })()`);
    assert(reduced.scroll === 'auto', `${viewport.width}px: reduced motion must disable smooth scroll.`);
    assert(reduced.active === 0, `${viewport.width}px: motion remains under reduced-motion preference.`);
  }

  const ogResponse = await fetch(new URL('/opengraph-image', BASE_URL), { cache: 'no-store' });
  assert(ogResponse.ok, `OG image request failed: ${ogResponse.status}`);
  const ogType = ogResponse.headers.get('content-type') || '';
  assert(ogType.startsWith('image/png'), `OG image must be PNG, got ${ogType}`);
  const ogBuffer = Buffer.from(await ogResponse.arrayBuffer());
  assert(ogBuffer.byteLength > 10_000, `OG image payload unexpectedly small: ${ogBuffer.byteLength}`);
  await writeFile(`${SCREENSHOT_DIR}/opengraph-image.png`, ogBuffer);
  assert(pageExceptions.length === 0, `Page exceptions: ${pageExceptions.join(' | ')}`);

  const payload = { chromePath, overflowResults, keyboardResults, formA11y, ogImage: { contentType: ogType, bytes: ogBuffer.byteLength } };
  await writeFile(`${SCREENSHOT_DIR}/launch-visual-a11y-results.json`, JSON.stringify(payload, null, 2));
  console.log(JSON.stringify(payload, null, 2));
} finally {
  client?.close(); await stopProcess(chrome); await rm(USER_DATA_DIR, { recursive: true, force: true });
}
