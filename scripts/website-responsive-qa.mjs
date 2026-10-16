/** Read-only browser audit: never submits a lead or contacts an external channel. */
export async function checkWebsiteRoutes({ client, evaluate, assert, sleep, writeFile, screenshotDir, base, baseline = false }) {
  const results = [];
  for (const path of ['/verkkosivut-yritykselle', '/verkkosivut/hinta', '/verkkosivut/lvi', '/verkkosivut/rakennus', '/verkkosivut/sahko']) {
    for (const width of [320, 390, 768, 1024, 1440, 1920]) {
      await client.send('Emulation.setDeviceMetricsOverride', {width, height: width < 768 ? 844 : 900, deviceScaleFactor:1, mobile:width < 768});
      await client.send('Page.navigate', {url:base + path});
      let ready = false;
      for (let attempt=0; attempt<100; attempt++) {
        ready = await evaluate(client, 'document.readyState === "complete" && !!document.querySelector(".ghMenuTrigger:not([hidden])")');
        if (ready) break;
        await sleep(100);
      }
      assert(ready, `${base}${path}: website did not hydrate`);
      await evaluate(client, 'document.fonts.ready');
      const layout = await evaluate(client, `(() => {
        const form = document.querySelector('#yhteys form');
        const h1 = document.querySelector('main h1');
        const clipped = [...document.querySelectorAll('main h1, main h2, main h3, main p, main input, main textarea, main button')].filter(el => {
          if (el.getAttribute('aria-hidden') === 'true') return false;
          const r=el.getBoundingClientRect();
          return r.width > 0 && (r.left < -2 || r.right > innerWidth+2 || el.scrollWidth > el.clientWidth+2);
        }).map(el => ({tag:el.tagName,text:el.textContent?.slice(0,80)}));
        return {width:innerWidth, documentWidth:document.documentElement.scrollWidth,
          h1Count:document.querySelectorAll('main h1').length, h1:h1?.textContent,
          clipped, form:!!form, service:form?.querySelector('[name="service"]')?.value,
          intent:form?.querySelector('[name="intent"]')?.value,
          primary:document.querySelector('.websiteHero .button')?.getAttribute('href'),
          active:document.querySelector('.ghGlobalDesktopNav [aria-current="page"]')?.getAttribute('href')};
      })()`);
      const errors=[];
      if(layout.documentWidth>width+1 || layout.clipped.length) errors.push('content overflow');
      if(layout.h1Count!==1 || !layout.form || layout.service!=='websites' || layout.intent!=='booking' || layout.primary!=='#yhteys') errors.push('website lead context');
      if(layout.active!=='/verkkosivut-yritykselle') errors.push('selected navigation');
      await evaluate(client, 'document.querySelector(".ghMenuTrigger").click()');
      await sleep(450);
      const menu = await evaluate(client, `(() => {
        const dialog=document.querySelector('.ghOverlayMenu');
        return {modal:dialog.matches(':modal'),width:dialog.scrollWidth,clientWidth:dialog.clientWidth,
          note:dialog.querySelector('.ghOverlayNote')?.textContent,
          prices:[...dialog.querySelectorAll('.ghOverlayNav a')].find(a=>a.textContent.includes('Hinnat'))?.getAttribute('href'),
          contact:[...dialog.querySelectorAll('.ghOverlayNav a')].find(a=>a.textContent.includes('Yhteys'))?.getAttribute('href'),
          cta:dialog.querySelector('.ghOverlayCta')?.getAttribute('href')};
      })()`);
      if(!menu.modal || menu.width>menu.clientWidth+1) errors.push('menu overflow/modal');
      if(menu.prices!=='/verkkosivut/hinta' || menu.contact!=='#yhteys' || menu.cta!=='#yhteys' || /Maksuttomat esimerkit/.test(menu.note)) errors.push('menu service context');
      if(path==='/verkkosivut-yritykselle') {
        const shot=await client.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
        await writeFile(`${screenshotDir}/${baseline?'before':'after'}-website-menu-${width}.png`,Buffer.from(shot.data,'base64'));
      }
      await evaluate(client, 'document.querySelector(".ghMenuClose").click()');
      await sleep(300);
      const entry={path,width,baseline,layout,menu,errors};results.push(entry);
      if(!baseline) assert(errors.length===0, `Website responsive QA: ${JSON.stringify(entry)}`);
    }
  }
  await writeFile(`${screenshotDir}/website-${baseline?'before':'after'}.json`,JSON.stringify(results,null,2));
  return results;
}
