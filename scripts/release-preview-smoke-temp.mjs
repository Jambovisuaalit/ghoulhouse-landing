import { execFileSync, spawn } from 'node:child_process';
import { rm } from 'node:fs/promises';

const BASE_URL = process.env.QA_BASE_URL;
if (!BASE_URL) throw new Error('QA_BASE_URL is required');
const CDP_PORT = 9333;
const USER_DATA_DIR = `/tmp/ghoulhouse-release-smoke-${process.pid}`;
const widths = [639, 640, 767, 768, 1023, 1024, 1279, 1280, 1439, 1440];

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
      this.ws.addEventListener('error', () => { clearTimeout(timer); reject(new Error('CDP websocket failed')), { once: true });
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
  for (let i = 0; i < 150; i += 1) {
    if (await evaluate(client, 'document.readyState === "complete"')) {
      await sleep(150);
      return;
    }
    await sleep(100);
  }
  throw new Error('document.readyState did not become complete');
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

  const exceptions = [];
  client.on('Runtime.exceptionThrown', (params) => exceptions.push(params.exceptionDetails?.exception?.description || params.exceptionDetails?.text || 'unknown exception'));

  const boundaryResults = [];
  for (const width of widths) {
    await client.send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 });
    await client.send('Page.navigate', { url: BASE_URL });
    await waitForDocument(client);
    const state = await evaluate(client, `(() => {
      const visible = (el) => {
        if (!el) return false;
        const s = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return s.display !== 'none' && s.visibility !== 'hidden' && r.width > 0 && r.height > 0;
      };
      const images = [...document.querySelectorAll('#top img')];
      return {
        width: innerWidth,
        overflow: document.documentElement.scrollWidth - innerWidth,
        mobileNavVisible: visible(document.querySelector('.mobileNav')),
        desktopNavVisible: visible(document.querySelector('.desktopNav')),
        heroVisible: visible(document.querySelector('#top h1')),
        rawFinal: document.querySelectorAll('.proofFrame').length === 2 && Boolean(document.querySelector('.editSeam')),
        imagesLoaded: images.length >= 2 && images.every((img) => img.complete && img.naturalWidth > 0),
      };
    })()`);
    assert(state.width === width, `${width}: emulated width mismatch (${state.width})`);
    assert(state.overflow <= 1, `${width}: horizontal overflow ${state.overflow}px`);
    assert(state.heroVisible && state.rawFinal && state.imagesLoaded, `${width}: hero/RAW-FINAL/images not fully rendered`);
    if (width < 768) {
      assert(state.mobileNavVisible && !state.desktopNavVisible, `${width}: mobile/desktop navigation visibility incorrect`);
    } else {
      assert(!state.mobileNavVisible && state.desktopNavVisible, `${width}: desktop/mobile navigation visibility incorrect`);
    }
    boundaryResults.push({ width, status: 'PASS' });
  }

  await client.send('Emulation.setDeviceMetricsOverride', { width: 767, height: 900, deviceScaleFactor: 1, mobile: true });
  await client.send('Page.navigate', { url: BASE_URL });
  await waitForDocument(client);
  const opened = await evaluate(client, `(() => { const d=document.querySelector('.mobileNav'); d?.querySelector('summary')?.click(); return Boolean(d?.open); })()`);
  assert(opened, '767: mobile navigation did not open');
  const closed = await evaluate(client, `(() => { const d=document.querySelector('.mobileNav'); d?.querySelector('summary')?.click(); return !d?.open; })()`);
  assert(closed, '767: mobile navigation did not close');

  await evaluate(client, `document.querySelector('.mobileNav summary')?.click()`);
  await client.send('Emulation.setDeviceMetricsOverride', { width: 768, height: 900, deviceScaleFactor: 1, mobile: false });
  await sleep(250);
  const desktopResize = await evaluate(client, `(() => { const d=document.querySelector('.mobileNav'); return { open:Boolean(d?.open), display:d ? getComputedStyle(d).display : '' }; })()`);
  assert(desktopResize.display === 'none', '768: mobile navigation must be hidden after resize');
  assert(desktopResize.open === false, '768: open mobile navigation state persisted into desktop breakpoint');

  await client.send('Emulation.setDeviceMetricsOverride', { width: 767, height: 900, deviceScaleFactor: 1, mobile: true });
  await sleep(250);
  const reopened = await evaluate(client, `Boolean(document.querySelector('.mobileNav')?.open)`);
  assert(reopened === false, '767: stale mobile navigation open state returned after desktop resize');

  await client.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await client.send('Page.navigate', { url: BASE_URL });
  await waitForDocument(client);
  await evaluate(client, `document.querySelector('#yhteys')?.scrollIntoView()`);
  await sleep(100);
  await evaluate(client, `document.querySelector('#yhteys button[type="submit"]')?.click()`);
  await sleep(700);
  const validation = await evaluate(client, `(() => {
    const toast=document.querySelector('.toast--error');
    const invalid=[...document.querySelectorAll('#yhteys [aria-invalid="true"]')];
    const first=invalid[0];
    return {
      toast: Boolean(toast),
      role: toast?.getAttribute('role') || '',
      live: toast?.getAttribute('aria-live') || '',
      invalidCount: invalid.length,
      described: first?.getAttribute('aria-describedby') || '',
      errorMessage: first?.getAttribute('aria-errormessage') || '',
      focused: document.activeElement === first,
    };
  })()`);
  assert(validation.toast && validation.role === 'alert' && validation.live === 'assertive', 'Lead validation error notification contract failed');
  assert(validation.invalidCount >= 1 && validation.described && validation.errorMessage, 'Lead validation aria-invalid/description/errormessage failed');
  assert(validation.focused, 'Lead validation did not focus first invalid field');
  await sleep(700);
  assert(await evaluate(client, `Boolean(document.querySelector('.toast--error'))`), 'Lead validation error notification did not persist');
  await evaluate(client, `document.querySelector('.toast--error button')?.click()`);
  await sleep(100);
  assert(await evaluate(client, `document.activeElement?.getAttribute('aria-invalid') === 'true'`), 'Dismissed error did not restore focus to invalid field');

  await client.send('Emulation.setEmulatedMedia', { media: '', features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await client.send('Page.navigate', { url: BASE_URL });
  await waitForDocument(client);
  const reduced = await evaluate(client, `(() => ({
    scroll: getComputedStyle(document.documentElement).scrollBehavior,
    moving: [...document.querySelectorAll('*')].filter((el) => {
      const s=getComputedStyle(el);
      return (s.animationDuration + ',' + s.transitionDuration).split(',').some((v) => !['0s','0ms','0.01ms'].includes(v.trim()));
    }).length,
  }))()`);
  assert(reduced.scroll === 'auto' && reduced.moving === 0, `Reduced motion failed: ${JSON.stringify(reduced)}`);
  assert(exceptions.length === 0, `Runtime exceptions: ${exceptions.join(' | ')}`);

  console.log(JSON.stringify({ boundaryResults, navigationResize: 'PASS', leadValidation: 'PASS', reducedMotion: 'PASS', runtimeExceptions: 0 }, null, 2));
} finally {
  client?.close();
  if (chrome.exitCode === null) chrome.kill('SIGTERM');
  await sleep(200);
  if (chrome.exitCode === null) chrome.kill('SIGKILL');
  await rm(USER_DATA_DIR, { recursive: true, force: true });
}
