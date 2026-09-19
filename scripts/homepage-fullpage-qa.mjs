import { execFileSync, spawn } from 'node:child_process';
import { mkdir, rm, writeFile } from 'node:fs/promises';

const BASE_URL = process.env.QA_BASE_URL || 'http://127.0.0.1:3000';
const SCREENSHOT_DIR = process.env.QA_SCREENSHOT_DIR || 'qa-artifacts';
const PORT = Number(process.env.QA_FULLPAGE_CDP_PORT || 9555);
const USER_DIR = '/tmp/ghoulhouse-fullpage-qa-' + process.pid;
const widths = [
  { width: 320, height: 568 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
];
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
function assert(ok, message) { if (!ok) throw Error(message); }
function rect(el) { if (!el) return null; const r = el.getBoundingClientRect(); return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}; }
class CDP {
  constructor(url) { this.id=0; this.waiting=new Map(); this.ws=new WebSocket(url); }
  async open() {
    await new Promise((ok,bad) => { this.ws.addEventListener('open',ok,{once:true}); this.ws.addEventListener('error',bad,{once:true}); });
    this.ws.addEventListener('message',(event) => {
      const m=JSON.parse(String(event.data)); if(!m.id)return; const p=this.waiting.get(m.id);
      if(!p)return; this.waiting.delete(m.id); m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);
    });
  }
  send(method,params={}) { const id=++this.id; return new Promise((resolve,reject)=>{this.waiting.set(id,{resolve,reject});this.ws.send(JSON.stringify({id,method,params}));}); }
  async eval(expression) {
    const result=await this.send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
    if(result.exceptionDetails)throw Error(result.exceptionDetails.exception?.description||result.exceptionDetails.text||'Browser script failed');
    return result.result.value;
  }
  close() { this.ws.close(); }
}

// This function is serialized and executed in the real browser; no backend writes.
async function auditViewport() {
  const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
  const rect=(el)=>{if(!el)return null; const r=el.getBoundingClientRect();return{left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height};};
  const intersects=(a,b)=>!!(a&&b&&Math.min(a.right,b.right)>Math.max(a.left,b.left)+2&&Math.min(a.bottom,b.bottom)>Math.max(a.top,b.top)+2);
  const hit=(el)=>{const r=rect(el);if(!r)return false; const above=document.elementFromPoint((r.left+r.right)/2,(r.top+r.bottom)/2);return above===el||el.contains(above);};
  const errors=[], findings=[], header=document.querySelector('.ghHeader');
  const headerRect=rect(header);
  const sections=[...document.querySelectorAll('main>section,main>.ghConsentSlot,footer')].map(el=>({id:el.id||el.className,box:rect(el)}));
  for(let i=1;i<sections.length;i++){
    const prev=sections[i-1],cur=sections[i];
    if(prev.box&&cur.box&&prev.box.bottom>cur.box.top+3)errors.push('Layout sections intersect: '+prev.id+' / '+cur.id);
  }
  const introOverlaps=[];
  for(const block of document.querySelectorAll('.ghSectionIntro')){
    const h=rect(block.querySelector('h2'));if(!h)continue;
    for(const child of block.querySelectorAll('p:not(.ghEyebrow),a.ghTextLink')) {
      if(intersects(h,rect(child)))introOverlaps.push({section:block.closest('section')?.id||'',heading:block.querySelector('h2')?.textContent?.slice(0,50)});
    }
  }
  for(const x of introOverlaps)errors.push('Heading/body overlap: '+JSON.stringify(x));
  const serviceCards=[...document.querySelectorAll('.ghServiceCard')];
  if(serviceCards.length!==3)errors.push('Expected exactly 3 service cards');
  for(const card of serviceCards){
    if(intersects(rect(card.querySelector('h3')),rect(card.querySelector('a.ghTextLink'))))
      errors.push('Service title/link overlap: '+card.querySelector('h3')?.textContent);
  }
  const elementsOutside=[...document.querySelectorAll('main>section,.ghServiceCard,.ghEditorialCard,.ghGuideRow,.ghSelectedCase,.ghForm,.ghFooterMain')]
    .filter(el=>{const r=rect(el);return r&&r.width>0&&(r.left < -1||r.right>innerWidth+1)})
    .map(el=>({element:el.id||el.className,rect:rect(el)}));
  if(elementsOutside.length)errors.push('Horizontal element overflow: '+JSON.stringify(elementsOutside));
  const rootWidth=document.documentElement.scrollWidth,bodyWidth=document.body.scrollWidth;
  const widthOffenders=bodyWidth>innerWidth+1?[...document.querySelectorAll('body *')].map(el=>({tag:el.tagName,cls:typeof el.className==='string'?el.className.slice(0,70):'',id:el.id||'',rect:rect(el),scrollWidth:el.scrollWidth,clientWidth:el.clientWidth})).filter(x=>x.rect&&x.rect.width>0&&(x.rect.right>innerWidth+1||x.rect.left < -1||x.scrollWidth>x.clientWidth+8)).sort((a,b)=>b.rect.right-a.rect.right).slice(0,22):[];
  if(rootWidth>innerWidth+1)errors.push('Actual root horizontal scroll: '+rootWidth+' > '+innerWidth);
  const consent=document.querySelector('.ghConsentSlot .analyticsConsent');
  const slot=document.querySelector('#gh-consent-inflow');
  if(!slot||!consent)errors.push('Consent missing from homepage in-flow slot');
  else {
    const style=getComputedStyle(consent),r=rect(consent);
    if(style.position==='fixed'||style.position==='absolute')errors.push('Consent is overlaid: position='+style.position);
    if(r.left < -1||r.right>innerWidth+1)errors.push('Consent overflows horizontally');
    const heroCTA=rect(document.querySelector('#top .ghHeroActions a'));
    if(intersects(r,heroCTA))errors.push('Consent overlaps hero CTA');
    const controls=[...consent.querySelectorAll('button')];
    if(controls.length!==2||!consent.querySelector('a[href="/tietosuoja"]'))errors.push('Consent actions or privacy link missing');
    if(controls.length===2&&intersects(rect(controls[0]),rect(controls[1])))errors.push('Consent buttons overlap');
    consent.scrollIntoView({behavior:'instant',block:'center'});
    await sleep(75);
    for(const control of [...controls,...consent.querySelectorAll('a[href="/tietosuoja"]')])
      if(!hit(control))errors.push('Consent action not clickable: '+control.textContent.trim());
  }
  const menu=document.querySelector('.ghMobileNav');
  const mobile=menu&&getComputedStyle(menu).display!=='none';
  const nav={mobile:!!mobile};
  if(mobile){
    window.scrollTo(0,0);await sleep(100);menu.querySelector('summary')?.click();await sleep(90);
    nav.open=menu.open;
    nav.links=[...menu.querySelectorAll('nav a')].map(el=>({href:el.getAttribute('href'),bounds:rect(el),hit:hit(el)}));
    if(!nav.open||nav.links.length!==5||nav.links.some(x=>!x.hit||x.bounds.left< -1||x.bounds.right>innerWidth+1))
      errors.push('Mobile nav open/link hit test failed: '+JSON.stringify(nav));
    menu.querySelector('summary')?.click();
  }
  // Only test fully visible links. An element passing behind a sticky header
  // while scrolling is expected; it must be targetable after scrollIntoView.
  const selectors=['#top .ghHeroActions a.ghButton','.ghServiceCard a.ghTextLink','.ghSelectedCase','.ghEditorialCard','.ghGuideRow','.ghSectionLink','#yhteys button[type="submit"]'];
  const targets=selectors.flatMap(s=>[...document.querySelectorAll(s)]);
  let scrollSteps=0, midPageRootMax=rootWidth;
  for(let y=0;y<document.documentElement.scrollHeight;y+=Math.max(180,Math.floor(innerHeight*.68))){
    window.scrollTo(0,y);await sleep(25);scrollSteps++;
    midPageRootMax=Math.max(midPageRootMax,document.documentElement.scrollWidth);
    if(document.documentElement.scrollWidth>innerWidth+1)errors.push('Root horizontal scroll at '+y);
    for(const el of targets){
      const r=rect(el),hdr=rect(header);
      if(!r||r.width<1||r.height<1||r.top<(hdr?.bottom??0)+8||r.bottom>innerHeight-8)continue;
      const cookie=rect(document.querySelector('.analyticsConsent'));
      if(intersects(r,cookie))errors.push('Consent covers CTA: '+el.textContent.trim().slice(0,60)+' at y='+y);
      if(!hit(el))findings.push({label:el.textContent.trim().slice(0,60),y,rect:r});
    }
  }
  if(findings.length)errors.push('Visible CTA blocked: '+JSON.stringify(findings));
  const centered=[];
  for(const el of targets){
    el.scrollIntoView({behavior:'instant',block:'center'});await sleep(42);
    const r=rect(el);
    const visible=!!r&&r.width>=1&&r.height>=1&&r.top>=(rect(header)?.bottom??0)-1&&r.bottom<=innerHeight+1;
    const clickable=visible&&hit(el);
    centered.push({label:el.textContent.trim().slice(0,65),visible,clickable,rect:r});
    if(!clickable)errors.push('Cannot use CTA after scrolling into view: '+JSON.stringify(centered.at(-1)));
  }
  // On-page #yhteys must remain below the sticky navigation when activated.
  const heroLink=document.querySelector('#top .ghHeroActions a');
  document.documentElement.style.scrollBehavior='auto';
  heroLink?.click();await sleep(180);
  const target=document.querySelector('#yhteys'),targetR=rect(target);
  const headingR=rect(target?.querySelector('h2'));
  const anchor={hash:location.hash,sectionTop:targetR?.top,headingTop:headingR?.top,headerBottom:rect(header)?.bottom};
  if(anchor.hash!=='#yhteys'||(targetR&&targetR.top<anchor.headerBottom-2)||(headingR&&headingR.bottom<=anchor.headerBottom))
    errors.push('Contact anchor hidden behind sticky header: '+JSON.stringify(anchor));
  // Leave consent visible in the full-page screenshot; then test reject and reopening.
  const screenshot={documentHeight:document.documentElement.scrollHeight,scrollWidth:document.documentElement.scrollWidth};
  const reject=document.querySelector('.ghConsentSlot .analyticsConsent__reject');
  reject?.click();await sleep(130);
  const rejected=localStorage.getItem('ghoulhouse_analytics_consent')==='rejected'&&!document.querySelector('.analyticsConsent')&&!!document.querySelector('.ghConsentSlot .analyticsSettings');
  if(!rejected)errors.push('Reject consent does not persist/dismiss banner');
  const settings=document.querySelector('.ghConsentSlot .analyticsSettings');
  settings?.click();await sleep(100);
  if(!document.querySelector('.ghConsentSlot .analyticsConsent')||!document.querySelector('.ghConsentSlot .analyticsConsent__actions button'))
    errors.push('Consent cannot be reopened');
  return {viewport:innerWidth+'x'+innerHeight,documentHeight:screenshot.documentHeight,rootWidth,bodyWidth,midPageRootMax,
    sections:sections.length,serviceCards:serviceCards.length,targets:centered.length,scrollSteps,widthOffenders,
    errors,consentPosition:consent?getComputedStyle(consent).position:null,nav,anchor,rejected,firstHeroCTA:rect(document.querySelector('#top .ghHeroActions a'))};
}

await mkdir(SCREENSHOT_DIR,{recursive:true});
await rm(USER_DIR,{recursive:true,force:true});
const bin=execFileSync('bash',['-lc','command -v google-chrome || command -v google-chrome-stable || command -v chromium || command -v chromium-browser'],{encoding:'utf8'}).trim();
assert(!!bin,'Chromium browser unavailable');
const chrome=spawn(bin,['--headless','--remote-debugging-port='+PORT,'--remote-debugging-address=127.0.0.1','--no-sandbox','--disable-setuid-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--disable-default-apps','--disable-extensions','--no-first-run','--hide-scrollbars','--user-data-dir='+USER_DIR,'about:blank'],{stdio:['ignore','ignore','pipe']});
const stderr=[];chrome.stderr?.on('data',s=>stderr.push(String(s)));
const report={base:BASE_URL,results:[],routes:[],errors:[]};
let browser;
try {
  let ok=false;
  for(let i=0;i<180;i++){
    if(chrome.exitCode!==null)throw Error('Chrome exited: '+stderr.join('').slice(-1000));
    try{const r=await fetch('http://127.0.0.1:'+PORT+'/json/version');if(r.ok){ok=true;break}}catch{}
    await sleep(120);
  }
  assert(ok,'Chromium CDP did not initialize');
  const tab=await fetch('http://127.0.0.1:'+PORT+'/json/new?'+encodeURIComponent(BASE_URL),{method:'PUT'}).then(r=>r.json());
  browser=new CDP(tab.webSocketDebuggerUrl);await browser.open();await browser.send('Page.enable');
  for(const size of widths){
    await browser.send('Emulation.setDeviceMetricsOverride',{width:size.width,height:size.height,deviceScaleFactor:1,mobile:size.width<768});
    await browser.send('Page.navigate',{url:BASE_URL+'/?fullpageqa='+size.width});
    for(let i=0;i<80;i++){
      if(await browser.eval('document.readyState==="complete" && !!document.querySelector(".homePage")'))break;
      await sleep(130);
    }
    await browser.eval('localStorage.removeItem("ghoulhouse_analytics_consent")');
    await browser.send('Page.reload',{ignoreCache:true});
    for(let i=0;i<100;i++){
      if(await browser.eval('document.readyState==="complete" && !!document.querySelector(".ghConsentSlot .analyticsConsent")'))break;
      await sleep(120);
    }
    await sleep(120);
    const result=await browser.eval('('+auditViewport.toString()+')()');
    report.results.push(result);
    console.log('FULL PAGE '+size.width+'x'+size.height+': '+JSON.stringify({
      documentHeight:result.documentHeight,rootWidth:result.rootWidth,bodyWidth:result.bodyWidth,
      scrollSteps:result.scrollSteps,targets:result.targets,consentPosition:result.consentPosition,widthOffenders:result.widthOffenders,errors:result.errors
    }));
    // Screenshot with consent open and in flow, from page top to footer.
    await browser.eval('window.scrollTo(0,0)');
    const metrics=await browser.send('Page.getLayoutMetrics');
    const fullHeight=Math.ceil(metrics.cssContentSize?.height||result.documentHeight);
    const shot=await browser.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:0,width:size.width,height:Math.min(fullHeight,16000),scale:1}});
    await writeFile(SCREENSHOT_DIR+'/fullpage-'+size.width+'x'+size.height+'.png',Buffer.from(shot.data,'base64'));
  }
  // All homepage-internal destinations (deduplicated and query/hash stripped).
  const routeList=await browser.eval('([...new Set([...document.querySelectorAll(".homePage a[href]")].map(a=>a.getAttribute("href")).filter(h=>h&&h.startsWith("/")).map(h=>new URL(h,location.origin).pathname))])');
  for(const pathname of routeList) {
    const response=await fetch(new URL(pathname,BASE_URL),{redirect:'follow'});
    report.routes.push({pathname,status:response.status,ok:response.ok});
  }
  if(report.routes.some(x=>!x.ok))report.errors.push('Internal destination HTTP failure');
  if(report.results.some(x=>x.errors.length))report.errors.push('At least one viewport failed');
  console.log('INTERNAL DESTINATIONS '+JSON.stringify(report.routes));
} catch(error) {
  report.errors.push(String(error.stack||error));
} finally {
  await writeFile(SCREENSHOT_DIR+'/fullpage-qa-results.json',JSON.stringify(report,null,2));
  browser?.close();chrome.kill('SIGTERM');await sleep(220);
  if(chrome.exitCode===null)chrome.kill('SIGKILL');
  await rm(USER_DIR,{recursive:true,force:true});
}
if(report.errors.length) {console.error('FULL PAGE QA FAILED '+JSON.stringify(report.errors));process.exitCode=1;}
else console.log('FULL PAGE QA PASS: '+report.results.map(x=>x.viewport).join(', '));
