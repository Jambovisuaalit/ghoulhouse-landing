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
        heroLineMetrics: (() => {
          const lines = [...(h1?.querySelectorAll(':scope > span') || [])];
          const style = h1 ? getComputedStyle(h1) : null;
          return {
            lines: lines.map((line) => ({ text: line.textContent?.trim(), rect: rect(line), display: getComputedStyle(line).display })),
            fontSize: style ? parseFloat(style.fontSize) : null,
            lineHeight: style ? parseFloat(style.lineHeight) : null,
          };
        })(),
        brandRect: rect(brandLink),
        formExists: Boolean(form),
        formMethod: form?.getAttribute('method')?.toLowerCase() || '',
        formAction: form?.getAttribute('action') || '',
        submitRect: rect(submit),
        profileChoice: Boolean(form?.querySelector('input[name="profile"][maxlength="300"]')) && Boolean(form?.querySelector('input[name="noProfile"][type="checkbox"]')),
        requiredFields: ['company','name','email'].every((name) => Boolean(form?.querySelector('[name="' + name + '"][required]'))),
        proofExists: Boolean(proof),
        proofImageLoaded: document.querySelector('.ghSelectedScreenshot')?.naturalWidth > 100,
        seoSelected: form?.querySelector('select[name="service"]') !== null,
        serviceLinks: ['/verkkosivut-yritykselle','/some-sisallontuotanto','/?service=seo#yhteys'].every((href) => document.querySelector('.ghServiceCard a[href="' + href + '"]')),
        serviceCards: document.querySelectorAll('.ghServiceCard').length,
        editorialRoutes: [...document.querySelectorAll('.ghArtRouteList .ghArtRoute')].map((a) => a.getAttribute('href')),
        primaryNavDesktop: [...document.querySelectorAll('.ghDesktopNav a')].map((a) => [a.textContent?.trim(),a.getAttribute('href')]),
        primaryNavMobile: [...document.querySelectorAll('.ghMobileNav nav a')].slice(0,4).map((a) => [a.textContent?.trim(),a.getAttribute('href')]),
        proofCardHref: proof?.getAttribute('href'),
        resourceLinks: document.querySelectorAll('.ghGuideRow').length,
        proposalIntent: form?.querySelector('[name="intent"]')?.value === 'booking',
        schemaTypes: [...document.querySelectorAll('script[type="application/ld+json"]')].map((script) => script.textContent || '').join(' '),
        logoLoaded: (() => {
          const compact = document.querySelector('header .ghOfficialMobileLockup');
          const onMobile = compact && getComputedStyle(compact).display !== 'none';
          const logo = document.querySelector(onMobile
            ? 'header .ghOfficialMobileWordmark' : 'header .ghOfficialHeaderLogo');
          const mark = document.querySelector('header .ghOfficialMobileMark');
          return logo?.getAttribute('src') === (onMobile
            ? '/ghoulhouse-wordmark-black.svg' : '/ghoulhouse-logo.svg') &&
            logo.complete && logo.naturalWidth > 200 &&
            (!onMobile || (mark?.getAttribute('src') === '/favicon.svg' && mark.complete));
        })(),
        brandLayout: (() => {
          const compact = document.querySelector('header .ghOfficialMobileLockup');
          const onMobile = compact && getComputedStyle(compact).display !== 'none';
          const logo = document.querySelector(onMobile
            ? 'header .ghOfficialMobileLockup' : 'header .ghOfficialHeaderLogo');
          const footer = document.querySelector('footer .ghOfficialFooterLogo');
          const wordmark = document.querySelector('footer .ghOfficialWordmark');
          const heroMark = document.querySelector('.ghFounderIdentity img');
          return {
            header: rect(logo),
            mobileMark: onMobile ? compact.querySelector('.ghOfficialMobileMark')?.getAttribute('src') : null,
            mobileWordmark: onMobile ? compact.querySelector('.ghOfficialMobileWordmark')?.getAttribute('src') : null,
            footer: footer?.getAttribute('src'),
            footerLoaded: Boolean(footer?.complete && footer.naturalWidth > 200),
            giantWordmark: wordmark?.getAttribute('src'),
            mark: heroMark?.getAttribute('src'),
            markFilter: heroMark ? getComputedStyle(heroMark).filter : '',
          };
        })(),
        glassFooter: (() => {
          const footer = document.querySelector('footer.ghLiquidFooter');
          const rim = footer?.querySelector('.ghLiquidFooterRim');
          const surface = footer?.querySelector('.ghLiquidFooterSurface');
          const inquiry = footer?.querySelector('.ghLiquidFooterButton');
          const cols = footer?.querySelector('.ghLiquidFooterLinks');
          return {
            exists: Boolean(footer),
            rimBackground: rim ? getComputedStyle(rim).backgroundImage : '',
            glassBackdrop: surface ? (getComputedStyle(surface).backdropFilter || getComputedStyle(surface).webkitBackdropFilter) : '',
            inquiry: inquiry?.getAttribute('href'),
            inquiryRect: rect(inquiry),
            brandLink: footer?.querySelector('.ghLiquidFooterBrand')?.getAttribute('href'),
            navItems: footer?.querySelectorAll('.ghLiquidFooterNav[aria-label="Alatunnisteen navigaatio"] a').length || 0,
            privacy: Boolean(footer?.querySelector('a[href="/tietosuoja"]')),
            columns: cols ? getComputedStyle(cols).gridTemplateColumns : '',
            unclippedHeadings: [...(cols?.querySelectorAll('h3') || [])].every((heading) =>
              heading.scrollWidth <= heading.clientWidth + 1 &&
              parseFloat(getComputedStyle(heading).fontSize) <= 13),
            fakeNewsletter: Boolean(footer?.querySelector('form[action="#"], form[action=""]')),
          };
        })(),
        disclosure: /Oma sivusto — ei asiakasreferenssi/i.test(document.body.innerText),
        bodyText: document.body.innerText.replace(/\\s+/g, ' ').trim(),
        viewportMeta: document.querySelector('meta[name="viewport"]')?.getAttribute('content') || '',
        bodyOverflowX: getComputedStyle(document.body).overflowX,
        innerWidth,
        innerHeight,
        scrollWidth: document.documentElement.scrollWidth,
        artDirection: (() => {
          const image = hero?.querySelector('.ghArtHeroImage img');
          const noise = hero?.querySelector('.ghArtGrain');
          const imageBox = hero?.querySelector('.ghArtHeroImage');
          return {
            imageLoaded: Boolean(image?.complete && image.naturalWidth > 100),
            imageBox: rect(imageBox),
            imageDisclosure: Boolean(hero?.querySelector('figcaption')?.textContent?.includes('EI ASIAKASTYÖ')),
            grain: noise ? getComputedStyle(noise).backgroundImage : '',
            background: hero ? getComputedStyle(hero).backgroundColor : '',
            headingFont: h1 ? getComputedStyle(h1).fontFamily : '',
          };
        })(),
        colors: {
          ink: root.getPropertyValue('--ink').trim(),
          paper: root.getPropertyValue('--paper').trim(),
          signal: root.getPropertyValue('--signal').trim(),
          white: root.getPropertyValue('--white').trim(),
          muted: root.getPropertyValue('--muted').trim(),
        },
      };
    })()`);

    assert(metrics.artDirection.grain.includes('data:image/svg+xml') &&
      metrics.artDirection.background === 'rgb(11, 11, 11)' &&
      /Georgia/i.test(metrics.artDirection.headingFont) &&
      metrics.artDirection.imageLoaded && metrics.artDirection.imageDisclosure,
      `${viewport.width}x${viewport.height}: editorial hero missing: ${JSON.stringify(metrics.artDirection)}`);
    assert(metrics.h1Count === 1, `${viewport.width}x${viewport.height}: expected exactly one H1.`);
    assert(metrics.brandHeadlineText.includes('HYVÄ TYÖ') && metrics.brandHeadlineText.includes('PITÄÄ NÄKYÄ.'), `${viewport.width}x${viewport.height}: company headline missing.`);
    assert(metrics.h1Text.includes('HYVÄ TYÖ') && metrics.h1Text.includes('PITÄÄ NÄKYÄ'), `${viewport.width}x${viewport.height}: H1 copy changed unexpectedly.`);
    const heroLines = metrics.heroLineMetrics;
    assert(heroLines.lines.length === 2 &&
      heroLines.lines[0].text === 'HYVÄ TYÖ' && heroLines.lines[1].text === 'PITÄÄ NÄKYÄ.' &&
      heroLines.lines.every((line) => line.display === 'block'),
      `${viewport.width}x${viewport.height}: Finnish hero must render as two separate blocks: ${JSON.stringify(heroLines)}`);
    assert(heroLines.lineHeight / heroLines.fontSize >= 1.10 &&
      heroLines.lines[0].rect.bottom <= heroLines.lines[1].rect.top + 1 &&
      heroLines.lines[1].rect.top - heroLines.lines[0].rect.top >= heroLines.fontSize * 1.10 - 1,
      `${viewport.width}x${viewport.height}: hero Ä/Ö accents risk overlapping due to line spacing: ${JSON.stringify(heroLines)}`);
    assert(metrics.heroCtaHref === '#yhteys', `${viewport.width}x${viewport.height}: primary CTA must target #yhteys.`);
    assert(/pyydä ehdotus/i.test(metrics.heroCtaText), `${viewport.width}x${viewport.height}: company CTA missing.`);
    assert(metrics.serviceLinks && metrics.serviceCards === 3, `${viewport.width}x${viewport.height}: three service links missing.`);
    assert(metrics.editorialRoutes.length === 3 &&
      ['/rakennusyrityksille','/lvi-yrityksille','/instagram-sisallontuotanto']
        .every((href) => metrics.editorialRoutes.includes(href)),
      `${viewport.width}x${viewport.height}: editorial industry links missing.`);
    assert(JSON.stringify(metrics.primaryNavDesktop) === JSON.stringify(metrics.primaryNavMobile),
      `${viewport.width}x${viewport.height}: desktop/mobile primary navigation diverged: ${JSON.stringify(metrics.primaryNavDesktop)} / ${JSON.stringify(metrics.primaryNavMobile)}`);
    assert(metrics.proofCardHref === '/tyot/ghoulhouse-verkkosivut',
      `${viewport.width}x${viewport.height}: own work must open a useful case study instead of the current homepage.`);
    assert(metrics.resourceLinks === 2 && metrics.proposalIntent, `${viewport.width}x${viewport.height}: resources or general proposal intent missing.`);
    assert(metrics.formExists && metrics.formMethod === 'post' && metrics.formAction === '/api/leads', `${viewport.width}x${viewport.height}: native lead form contract missing.`);
    assert(metrics.profileChoice, `${viewport.width}x${viewport.height}: profile or explicit no-profile choice missing.`);
    assert(metrics.requiredFields, `${viewport.width}x${viewport.height}: required lead fields missing.`);
    assert(metrics.submitRect?.height >= 44, `${viewport.width}x${viewport.height}: submit target below 44px.`);
    assert(metrics.proofExists && metrics.logoLoaded, `${viewport.width}x${viewport.height}: company proof or logo missing.`);
    assert(viewport.width >= 768 ||
      (metrics.brandLayout.mobileMark === '/favicon.svg' &&
       metrics.brandLayout.mobileWordmark === '/ghoulhouse-wordmark-black.svg'),
      `${viewport.width}x${viewport.height}: mobile header must use the official compact mark + vector wordmark.`);
    assert(metrics.brandLayout.header?.left >= -1 && metrics.brandLayout.header?.right <= metrics.innerWidth + 1 &&
      metrics.brandLayout.footer === '/ghoulhouse-logo-reverse.svg' &&
      metrics.brandLayout.giantWordmark === '/ghoulhouse-wordmark-white.svg' &&
      metrics.brandLayout.mark === '/ghoulhouse-mark.svg' &&
      metrics.brandLayout.markFilter === 'none',
      `${viewport.width}x${viewport.height}: official logo contrast, load or clipping failed: ${JSON.stringify(metrics.brandLayout)}`);
    assert(metrics.glassFooter.exists && metrics.glassFooter.rimBackground.includes('gradient') &&
      metrics.glassFooter.brandLink === '/' && metrics.glassFooter.navItems === 4 && metrics.glassFooter.privacy,
      `${viewport.width}x${viewport.height}: shared glass footer contents/rim missing: ${JSON.stringify(metrics.glassFooter)}`);
    assert(metrics.glassFooter.unclippedHeadings,
      `${viewport.width}x${viewport.height}: footer column headings are too large or clipped.`);
    assert(metrics.glassFooter.inquiry === '#yhteys' && metrics.glassFooter.inquiryRect?.height >= 44 &&
      !metrics.glassFooter.fakeNewsletter,
      `${viewport.width}x${viewport.height}: glass footer must have working inquiry CTA and no fake signup.`);
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

  // The previously mandatory profile field must support companies with no channels.
  const noProfile = await evaluate(client, `(() => ({
    control: Boolean(document.querySelector('#yhteys .leadProfileNoWebsite')),
    initiallyEmpty: document.querySelector('#yhteys input[name="profile"]')?.value === '',
  }))()`);
  assert(noProfile.control && noProfile.initiallyEmpty, 'Accessible no-profile choice missing from proposal form.');
  await evaluate(client, 'document.querySelector("#yhteys .leadProfileNoWebsite")?.click()');
  await sleep(100);
  const selectedNoProfile = await evaluate(client, `(() => ({
    profile: document.querySelector('#yhteys input[name="profile"]')?.value,
    pressed: document.querySelector('#yhteys .leadProfileNoWebsite')?.getAttribute('aria-pressed'),
  }))()`);
  assert(selectedNoProfile.profile === 'Ei vielä verkkosivua tai Instagramia' && selectedNoProfile.pressed === 'true',
    'No-profile selection did not set the lead value.');

  const routeNavigation = await evaluate(client, `(() => [...document.querySelectorAll('.ghArtRouteList a')]
    .map((a) => ({href:a.getAttribute('href'),focusable:a.tabIndex>=0})))()`);
  assert(routeNavigation.length === 3 && routeNavigation.every((a) => a.focusable),
    'Editorial industry routes missing or not keyboard accessible.');

  // True CDP mobile emulation: Chrome's --window-size 390 screenshots can
  // preserve a ~500px desktop layout and crop the right edge. Measure real
  // CSS viewport metrics and every Social H2 rather than only static PNG size.
  const socialLayoutResults = [];
  await evaluate(client, 'localStorage.setItem("ghoulhouse_analytics_consent","rejected")');
  for (const path of [
    '/some-sisallontuotanto', '/some-12', '/rakennusyrityksille',
    '/lvi-yrityksille', '/instagram-sisallontuotanto',
  ]) {
    for (const width of [320, 390, 768, 1440]) {
      const height = width < 768 ? 844 : 900;
      await client.send('Emulation.setDeviceMetricsOverride', {
        width, height, deviceScaleFactor: 1, mobile: width < 768,
      });
      await client.send('Page.navigate', {url: BASE_URL + path});
      await waitForDocument(client);
      const layout = await evaluate(client, `(() => {
        const hero = document.querySelector('main.seoPage .seoHeroCopy');
        const h1 = hero?.querySelector('h1');
        const brand = document.querySelector('main.seoPage .seoBrandBlock');
        const h2 = [...document.querySelectorAll('main.seoPage h2')];
        const r = (el) => {
          if (!el) return null;
          const b = el.getBoundingClientRect();
          return { left:b.left, right:b.right, top:b.top, bottom:b.bottom };
        };
        return {
          viewport: innerWidth,
          documentWidth: document.documentElement.scrollWidth,
          h1: r(h1),
          h1ScrollWidth: h1?.scrollWidth,
          h1ClientWidth: h1?.clientWidth,
          brand: r(brand),
          brandScrollWidth: brand?.scrollWidth,
          brandClientWidth: brand?.clientWidth,
          brandSpans: [...(brand?.querySelectorAll('span') || [])].map(r),
          h2Count: h2.length,
          overflowHeadings: h2.filter(x => x.scrollWidth > x.clientWidth + 1).map(x => x.textContent?.trim()),
        };
      })()`);
      assert(layout.viewport === width && layout.h1 && layout.brand &&
        layout.documentWidth <= width + 1 && layout.h1ScrollWidth <= layout.h1ClientWidth + 1 &&
        layout.brandScrollWidth <= layout.brandClientWidth + 1,
        `${path} ${width}px: horizontal overflow in Social hero: ${JSON.stringify(layout)}`);
      assert(layout.h1.left >= -1 && layout.h1.right <= width + 1 &&
        layout.brand.left >= -1 && layout.brand.right <= width + 1 &&
        layout.brandSpans.every(rect => rect.left >= -1 && rect.right <= width + 1),
        `${path} ${width}px: Social heading or brand extends offscreen: ${JSON.stringify(layout)}`);
      const disjoint = layout.h1.right < layout.brand.left - 4 ||
        layout.h1.bottom < layout.brand.top - 4 ||
        layout.brand.bottom < layout.h1.top - 4;
      assert(disjoint && layout.overflowHeadings.length === 0 && layout.h2Count >= 5,
        `${path} ${width}px: Social H1/illustration overlap or H2 clipping: ${JSON.stringify(layout)}`);
      if (width === 390 || width === 768) {
        const name = path.split('/').pop();
        const image = await client.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
        await writeFile(`${SCREENSHOT_DIR}/social-${name}-${width}.png`, Buffer.from(image.data, 'base64'));
      }
      socialLayoutResults.push({ path, width, status: 'PASS' });
    }
  }

  // Consent is an accessible branded in-flow strip on the homepage,
  // but a compact fixed notice on inner pages. Verify both at realistic widths.
  const innerConsentResults = [];
  for (const vp of [{ width: 320, height: 568 }, { width: 390, height: 844 }, { width: 1440, height: 900 }]) {
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: vp.width, height: vp.height, deviceScaleFactor: 1, mobile: vp.width < 768,
    });
    await evaluate(client, 'localStorage.removeItem("ghoulhouse_analytics_consent")');
    await client.send('Page.navigate', { url: BASE_URL + '/referenssit' });
    await waitForDocument(client);
    let hasConsent = false;
    for (let i = 0; i < 25; i++) {
      hasConsent = await evaluate(client, '!!document.querySelector(".analyticsConsent")');
      if (hasConsent) break;
      await sleep(120);
    }
    assert(hasConsent, `${vp.width}x${vp.height}: inner-page consent notice missing on first visit.`);
    const styled = await evaluate(client, `(() => {
      const el = document.querySelector('.analyticsConsent');
      const st = getComputedStyle(el);
      const box = el.getBoundingClientRect();
      const title = el.querySelector('h2');
      const titleStyle = getComputedStyle(title);
      const buttons = [...el.querySelectorAll('.analyticsConsent__actions button')];
      const sizes = buttons.map(b => b.getBoundingClientRect().height);
      return {
        position: st.position, background: st.backgroundColor,
        accent: st.borderLeftColor, borderRadius: st.borderRadius,
        box: {left:box.left,right:box.right,height:box.height},
        viewportWidth: innerWidth, viewportHeight: innerHeight,
        headingVisible: titleStyle.position === 'static' &&
          title.getBoundingClientRect().height >= 18,
        brandedControls: buttons.length === 2 &&
          buttons.every(b => b.classList.contains('analyticsConsent__button')),
        buttonHeights: sizes,
        privacy: Boolean(el.querySelector('a[href="/tietosuoja"]')),
        genericStyles: Boolean(el.querySelector('.button,.kicker')),
        prematureGA: Boolean(document.querySelector('#google-analytics-src')),
      };
    })()`);
    assert(styled.position === 'fixed' && styled.background === 'rgb(247, 244, 239)' &&
      styled.accent === 'rgb(201, 40, 45)' && styled.borderRadius === '0px',
      `${vp.width}x${vp.height}: inner consent still inherits a default popup skin: ${JSON.stringify(styled)}`);
    assert(styled.headingVisible && styled.brandedControls && styled.privacy && !styled.genericStyles &&
      !styled.prematureGA, `${vp.width}x${vp.height}: consent copy, controls, privacy or GA gate invalid.`);
    assert(styled.box.left >= -1 && styled.box.right <= styled.viewportWidth + 1 &&
      styled.box.height <= styled.viewportHeight - 20 &&
      styled.buttonHeights.every(h => h >= 44) &&
      Math.max(...styled.buttonHeights) - Math.min(...styled.buttonHeights) <= 2,
      `${vp.width}x${vp.height}: consent overflow or unequal buttons: ${JSON.stringify(styled)}`);
    const shot = await client.send('Page.captureScreenshot', {format:'png',captureBeyondViewport:false});
    await writeFile(`${SCREENSHOT_DIR}/consent-inner-${vp.width}x${vp.height}.png`,Buffer.from(shot.data,'base64'));
    if (vp.width === 390) {
      await evaluate(client, 'document.querySelector(".analyticsConsent__reject").click()');
      await sleep(110);
      const rejected = await evaluate(client, `({
        saved: localStorage.getItem('ghoulhouse_analytics_consent'),
        dismissed: !document.querySelector('.analyticsConsent'),
        settings: !!document.querySelector('.analyticsSettings'),
      })`);
      assert(rejected.saved === 'rejected' && rejected.dismissed && rejected.settings,
        'Inner page: rejection was not saved or the settings control disappeared.');
      await evaluate(client, 'document.querySelector(".analyticsSettings").click()');
      await sleep(100);
      assert(await evaluate(client,'!!document.querySelector(".analyticsConsent__accept")'),
        'Inner page: consent cannot be reopened.');
      await evaluate(client, 'document.querySelector(".analyticsConsent__accept").click()');
      await sleep(130);
      const accepted = await evaluate(client, `({
        saved: localStorage.getItem('ghoulhouse_analytics_consent'),
        dismissed: !document.querySelector('.analyticsConsent'),
        settings: !!document.querySelector('.analyticsSettings'),
      })`);
      assert(accepted.saved === 'accepted' && accepted.dismissed && accepted.settings,
        'Inner page: acceptance was not saved or the settings control disappeared.');
    }
    innerConsentResults.push({viewport:vp.width+'x'+vp.height,status:'PASS'});
  }

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

  const payload = { chromePath, results, socialLayoutResults, interaction, reducedMotion };
  await writeFile(`${SCREENSHOT_DIR}/results.json`, JSON.stringify(payload, null, 2));
  console.log(JSON.stringify(payload, null, 2));
} finally {
  client?.close();
  await stopProcess(chrome);
  await rm(USER_DATA_DIR, { recursive: true, force: true });
}
