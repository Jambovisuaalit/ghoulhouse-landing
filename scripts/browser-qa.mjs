import { execFileSync, spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';

const BASE_URL = process.env.QA_BASE_URL || 'http://127.0.0.1:3000';
const CDP_PORT = 9222;
const SCREENSHOT_DIR = process.env.QA_SCREENSHOT_DIR || 'qa-artifacts';

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
  const command =
    'command -v google-chrome || command -v google-chrome-stable || command -v chromium || command -v chromium-browser';
  const result = execFileSync('bash', ['-lc', command], {
    encoding: 'utf8',
  }).trim();

  if (!result) {
    throw new Error('Chrome/Chromium binary not found on runner.');
  }

  return result;
}

async function waitForUrl(url, timeoutMs = 20_000) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (response.ok) return response;
    } catch {
      // Retry while process boots.
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`Timed out waiting for ${url}`);
}

class CdpClient {
  constructor(url) {
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = new Map();
    this.ws = new WebSocket(url);
  }

  async open() {
    if (this.ws.readyState === WebSocket.OPEN) return;

    await new Promise((resolve, reject) => {
      const timer = setTimeout(
        () => reject(new Error('CDP websocket open timeout.')),
        10_000
      );

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

        if (message.error) {
          pending.reject(new Error(JSON.stringify(message.error)));
        } else {
          pending.resolve(message.result);
        }

        return;
      }

      const callbacks = this.listeners.get(message.method) || [];
      callbacks.forEach((callback) => callback(message.params));
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

async function waitForDocument(client) {
  const start = Date.now();

  while (Date.now() - start < 15_000) {
    const result = await client.send('Runtime.evaluate', {
      expression: 'document.readyState',
      returnByValue: true,
    });

    if (result.result.value === 'complete') {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error('Page did not reach complete readyState.');
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

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const chromePath = findChrome();
const chrome = spawn(
  chromePath,
  [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    '--remote-debugging-address=127.0.0.1',
    '--no-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--hide-scrollbars',
    '--user-data-dir=/tmp/ghoulhouse-browser-qa',
    'about:blank',
  ],
  { stdio: 'ignore' }
);

let client;

try {
  await mkdir(SCREENSHOT_DIR, { recursive: true });
  await waitForUrl(`http://127.0.0.1:${CDP_PORT}/json/version`);

  const newPage = await fetch(
    `http://127.0.0.1:${CDP_PORT}/json/new?${encodeURIComponent(BASE_URL)}`,
    { method: 'PUT' }
  ).then((response) => response.json());

  client = new CdpClient(newPage.webSocketDebuggerUrl);
  await client.open();

  const pageExceptions = [];
  client.on('Runtime.exceptionThrown', (params) => {
    pageExceptions.push(
      params.exceptionDetails?.exception?.description ||
        params.exceptionDetails?.text ||
        'Unknown page exception'
    );
  });

  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('Network.enable');

  const results = [];

  for (const viewport of viewports) {
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: false,
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
        const visible = (element) => {
          if (!element) return false;
          const rect = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
        };
        const hero = document.querySelector('#top');
        const h1 = document.querySelector('h1');
        const heroButtons = [...(hero?.querySelectorAll('button') || [])].filter(visible);
        const cta = heroButtons.find((element) => element.textContent?.includes('PYYDÄ 2 SISÄLTÖESIMERKKIÄ'));
        const price = [...(hero?.querySelectorAll('p') || [])].find(
          (element) => visible(element) && element.textContent?.includes('490 €')
        );
        const rect = (element) => {
          if (!element) return null;
          const value = element.getBoundingClientRect();
          return {
            top: value.top,
            right: value.right,
            bottom: value.bottom,
            left: value.left,
            width: value.width,
            height: value.height,
          };
        };

        return {
          title: document.title,
          h1Count: document.querySelectorAll('h1').length,
          h1Text: h1?.textContent?.replace(/\\s+/g, ' ').trim() || '',
          heroText: hero?.textContent?.replace(/\\s+/g, ' ').trim() || '',
          viewport: { width: innerWidth, height: innerHeight },
          scrollWidth: document.documentElement.scrollWidth,
          h1Rect: rect(h1),
          ctaRect: rect(cta),
          priceRect: rect(price),
          ctaText: cta?.textContent?.replace(/\\s+/g, ' ').trim() || '',
          priceText: price?.textContent?.replace(/\\s+/g, ' ').trim() || '',
        };
      })()`
    );

    assert(
      metrics.viewport.width === viewport.width,
      `${viewport.width}px: browser reported unexpected CSS viewport width ${metrics.viewport.width}px.`
    );
    assert(metrics.h1Count === 1, `${viewport.width}px: expected exactly one H1.`);
    assert(
      metrics.h1Text.includes('TYÖMAAKUVAT SISÄÄN.') &&
        metrics.h1Text.includes('VALMIS SOME ULOS.'),
      `${viewport.width}px: canonical hero headline missing.`
    );
    assert(
      metrics.heroText.includes('Teette hyvää työtä.') &&
        metrics.heroText.includes('Me pidämme huolen, että asiakkaat myös näkevät sen.'),
      `${viewport.width}px: canonical value proposition missing.`
    );
    assert(
      metrics.ctaText.includes('PYYDÄ 2 SISÄLTÖESIMERKKIÄ'),
      `${viewport.width}px: primary CTA missing from hero.`
    );
    assert(
      metrics.priceText.includes('490 €'),
      `${viewport.width}px: START price missing from hero.`
    );
    assert(
      metrics.scrollWidth <= metrics.viewport.width + 1,
      `${viewport.width}px: horizontal overflow ${metrics.scrollWidth}px > ${metrics.viewport.width}px.`
    );

    for (const [name, rect] of [
      ['headline', metrics.h1Rect],
      ['CTA', metrics.ctaRect],
      ['price', metrics.priceRect],
    ]) {
      assert(rect, `${viewport.width}px: ${name} has no visible bounding box.`);
      assert(
        rect.left >= -1 && rect.right <= metrics.viewport.width + 1,
        `${viewport.width}px: ${name} overflows horizontally.`
      );
    }

    assert(
      metrics.ctaRect.height >= 44,
      `${viewport.width}px: primary CTA height is below 44px.`
    );
    assert(
      metrics.ctaRect.bottom <= metrics.viewport.height,
      `${viewport.width}px: primary CTA is not visible in the first viewport.`
    );
    assert(
      metrics.priceRect.bottom <= metrics.viewport.height,
      `${viewport.width}px: START price is not visible in the first viewport.`
    );

    const shot = await client.send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false,
    });

    const file = `${SCREENSHOT_DIR}/homepage-${viewport.width}x${viewport.height}.png`;
    await writeFile(file, Buffer.from(shot.data, 'base64'));

    results.push({
      viewport: `${viewport.width}x${viewport.height}`,
      scrollWidth: metrics.scrollWidth,
      ctaBottom: Math.round(metrics.ctaRect.bottom),
      priceBottom: Math.round(metrics.priceRect.bottom),
      status: 'PASS',
    });
  }

  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: false,
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
      animatedElements: [...document.querySelectorAll('*')].filter((element) => {
        const style = getComputedStyle(element);
        return style.animationName !== 'none' && style.animationDuration !== '0s' && style.animationDuration !== '0.01ms';
      }).length,
    }))()`
  );

  assert(
    reducedMotion.scrollBehavior === 'auto',
    'Reduced-motion mode must disable smooth scrolling.'
  );
  assert(
    reducedMotion.animatedElements === 0,
    'Reduced-motion mode must not leave persistent animations running.'
  );

  await client.send('Emulation.setEmulatedMedia', {
    media: '',
    features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }],
  });

  await evaluate(
    client,
    `(() => {
      const hero = document.querySelector('#top');
      const button = [...(hero?.querySelectorAll('button') || [])].find(
        (element) =>
          element.getBoundingClientRect().width > 0 &&
          element.textContent?.includes('PYYDÄ 2 SISÄLTÖESIMERKKIÄ')
      );
      button?.click();
      return Boolean(button);
    })()`
  );
  await new Promise((resolve) => setTimeout(resolve, 250));

  const dialogState = await evaluate(
    client,
    `(() => {
      const dialog = document.querySelector('[role="dialog"]');
      return {
        exists: Boolean(dialog),
        activeName: document.activeElement?.getAttribute('name') || '',
        text: dialog?.textContent?.replace(/\\s+/g, ' ').trim() || '',
      };
    })()`
  );

  assert(dialogState.exists, 'Primary CTA did not open the lead dialog.');
  assert(
    dialogState.activeName === 'company',
    'Lead dialog did not move focus to the first field.'
  );

  await evaluate(
    client,
    `(() => {
      const setValue = (selector, value) => {
        const input = document.querySelector(selector);
        if (!input) throw new Error('Missing form control: ' + selector);
        const prototype =
          input instanceof HTMLTextAreaElement
            ? HTMLTextAreaElement.prototype
            : HTMLInputElement.prototype;
        const setter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
        setter?.call(input, value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      };

      setValue('input[name="company"]', 'QA Rakennus Oy');
      setValue('input[name="name"]', 'QA Testi');
      setValue('input[name="email"]', 'qa@example.com');

      const form = document.querySelector('[role="dialog"] form');
      form?.requestSubmit();
      return Boolean(form);
    })()`
  );

  await new Promise((resolve) => setTimeout(resolve, 900));

  const submitState = await evaluate(
    client,
    `(() => {
      const dialog = document.querySelector('[role="dialog"]');
      const text = dialog?.textContent?.replace(/\\s+/g, ' ').trim() || '';
      return {
        text,
        hasSuccess: text.includes('Pyyntö vastaanotettu'),
        hasSafeError:
          text.includes('Lomakkeen toimituskanavaa ei ole vielä kytketty.') ||
          text.includes('Pyyntöä ei voitu lähettää.'),
      };
    })()`
  );

  assert(
    !submitState.hasSuccess,
    'Lead form must not display success when delivery is unconfigured.'
  );
  assert(
    submitState.hasSafeError,
    'Lead form must surface a safe failure state when delivery is unavailable.'
  );

  assert(
    pageExceptions.length === 0,
    `Browser exceptions detected: ${pageExceptions.join(' | ')}`
  );

  await writeFile(
    `${SCREENSHOT_DIR}/qa-results.json`,
    JSON.stringify(
      {
        results,
        reducedMotion,
        dialog: {
          opens: dialogState.exists,
          initialFocus: dialogState.activeName,
          failSafeSubmission: submitState.hasSafeError,
        },
        pageExceptions,
      },
      null,
      2
    )
  );

  console.table(results);
  console.log('Reduced motion: PASS');
  console.log('Lead dialog: PASS');
  console.log('Lead fail-safe submission: PASS');
} finally {
  client?.close();
  chrome.kill('SIGTERM');
}
