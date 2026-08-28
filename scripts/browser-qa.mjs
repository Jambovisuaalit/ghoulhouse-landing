import { execFileSync, spawn } from 'node:child_process';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';

const BASE_URL = process.env.QA_BASE_URL || 'http://127.0.0.1:3000';
const SCREENSHOT_DIR = process.env.QA_SCREENSHOT_DIR || 'qa-artifacts';
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

async function waitForDevToolsPort(timeoutMs = 20_000) {
  const start = Date.now();
  const activePortFile = `${USER_DATA_DIR}/DevToolsActivePort`;

  while (Date.now() - start < timeoutMs) {
    try {
      const contents = await readFile(activePortFile, 'utf8');
      const [port] = contents.trim().split(/\r?\n/);
      const parsed = Number(port);
      if (Number.isInteger(parsed) && parsed > 0) return parsed;
    } catch {
      // Chrome has not written the file yet.
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error('Timed out waiting for Chrome DevToolsActivePort.');
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
    '--remote-debugging-port=0',
    '--remote-debugging-address=127.0.0.1',
    '--no-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--hide-scrollbars',
    `--user-data-dir=${USER_DATA_DIR}`,
    'about:blank',
  ],
  { stdio: 'ignore' }
);

let client;

try {
  await mkdir(SCREENSHOT_DIR, { recursive: true });
  const cdpPort = await waitForDevToolsPort();
  await waitForUrl(`http://127.0.0.1:${cdpPort}/json/version`);

  const newPage = await fetch(
    `http://127.0.0.1:${cdpPort}/json/new?${encodeURIComponent(BASE_URL)}`,
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
        const offerCard = document.querySelector('[data-offer-card]');
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
          bodyText: document.body.innerText.replace(/\\s+/g, ' ').trim(),
          offerName: offerCard?.getAttribute('data-offer-name') || '',
          offerPrice: offerCard?.getAttribute('data-offer-price') || '',
          viewport: { width: innerWidth, height: innerHeight },
          scrollWidth: document.documentElement.scrollWidth,
          h1Rect: rect(h1),
          ctaRect: rect(cta),
          priceRect: rect(price),
          ctaText: cta?.textContent?.replace(/\\s+/g, ' ').trim() || '',
          priceText: price?.textContent?.replace(/\\s+/g, ' ').trim() || '',
          overflowing: [...document.querySelectorAll('body *')]
            .map((element) => {
              const value = element.getBoundingClientRect();
              return {
                tag: element.tagName,
                className: typeof element.className === 'string' ? element.className : '',
                text: (element.textContent || '').replace(/\\s+/g, ' ').trim().slice(0, 90),
                left: Math.round(value.left),
                right: Math.round(value.right),
                width: Math.round(value.width),
                scrollWidth: element.scrollWidth,
                clientWidth: element.clientWidth,
              };
            })
            .filter(
              (item) =>
                item.left < -1 ||
                item.right > innerWidth + 1 ||
                item.scrollWidth > item.clientWidth + 1
            )
            .slice(0, 12),
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
      `${viewport.width}px: SOME 12 price missing from hero.`
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
      metrics.scrollWidth <= metrics.viewport.width + 1,
      `${viewport.width}px: horizontal overflow ${metrics.scrollWidth}px > ${metrics.viewport.width}px. Offenders: ${JSON.stringify(metrics.overflowing)}`
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
      `${viewport.width}px: SOME 12 price is not visible in the first viewport.`
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

  // Desktop cinematic scroll regression QA.
  // This was previously covered, then lost during the server/client QA refactor.
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
  await new Promise((resolve) => setTimeout(resolve, 250));

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
    await new Promise((resolve) => setTimeout(resolve, 200));

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
          progress:
            parseFloat(
              getComputedStyle(section).getPropertyValue('--raw-progress')
            ) || 0,
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
  await new Promise((resolve) => setTimeout(resolve, 200));

  const filmMid = await evaluate(
    client,
    `(() => {
      const section = document.querySelector('[data-scroll-film]');
      const sticky = section?.querySelector('.mechanism-film__sticky');
      const heading = section?.querySelector('.mechanism-film__header h3');
      const viewport = section?.querySelector('.mechanism-film__viewport');
      const track = section?.querySelector('.mechanism-film__track');
      const frame = section?.querySelector('.mechanism-film__frame');

      if (!section || !sticky || !heading || !viewport || !track || !frame) {
        return null;
      }

      const matrix = new DOMMatrixReadOnly(getComputedStyle(track).transform);
      const horizontalTravel = Math.max(
        0,
        track.scrollWidth - viewport.clientWidth
      );
      const stickyRect = sticky.getBoundingClientRect();
      const viewportRect = viewport.getBoundingClientRect();
      const frameRect = frame.getBoundingClientRect();

      return {
        progress:
          parseFloat(
            getComputedStyle(section).getPropertyValue('--film-progress')
          ) || 0,
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
        scrollEffects: { rawQuarter, rawThreeQuarter, filmMid },
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
  console.log('Desktop cinematic scroll: PASS');
  console.log('Reduced motion: PASS');
  console.log('Lead dialog: PASS');
  console.log('Lead fail-safe submission: PASS');
} finally {
  client?.close();
  chrome.kill('SIGTERM');
  await rm(USER_DATA_DIR, { recursive: true, force: true }).catch(() => {});
}
