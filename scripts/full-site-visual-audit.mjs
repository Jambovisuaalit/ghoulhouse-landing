import { spawn, execFileSync } from 'node:child_process';
import { mkdir, writeFile, rm } from 'node:fs/promises';

const BASE = 'https://ghoulhouse.fi';
const ROOT = 'qa-artifacts/site18';
const WIDTHS = [{w:390,h:844},{w:768,h:1024},{w:1440,h:900}];
const SLUGS = ['', 'rakennusyrityksille','lvi-yrityksille','some-sisallontuotanto',
'instagram-sisallontuotanto','referenssit','some-12','verkkosivut-yritykselle',
'verkkosivut/hinta','verkkosivut/rakennus','verkkosivut/lvi','verkkosivut/sahko',
'resurssit','oppaat/verkkosivut-itse-vai-ammattilaiselta','saneerausyrityksille',
'some-sisallontuotanto/hinta','oppaat/rakennusyrityksen-some',
'oppaat/tyomaakuvat-sosiaaliseen-mediaan'];
const safe=(s)=>s.replaceAll('/','--')||'etusivu';
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
const chromePath=execFileSync('bash',['-lc','command -v google-chrome || command -v google-chrome-stable || command -v chromium || command -v chromium-browser'],{encoding:'utf8'}).trim();
await mkdir(ROOT,{recursive:true});
const dataDir='/tmp/ghoulhouse18-'+process.pid;const port=22000+(process.pid%2000);
const chrome=spawn(chromePath,['--headless=new','--no-sandbox','--disable-setuid-sandbox','--disable-gpu',
'--disable-dev-shm-usage','--disable-background-networking','--no-first-run','--hide-scrollbars',
'--window-size=1440,1024','--remote-debugging-port='+port,'--remote-debugging-address=127.0.0.1',
'--user-data-dir='+dataDir,'about:blank'],{stdio:['ignore','ignore','pipe']});
let stderr='';chrome.stderr.on('data',c=>{stderr+=String(c).slice(-500)});
class CDP {
  constructor(url){this.ws=new WebSocket(url);this.pending=new Map();this.seq=1;}
  async init(){
    await new Promise((res,rej)=>{this.ws.addEventListener('open',res,{once:true});this.ws.addEventListener('error',rej,{once:true});});
    this.ws.addEventListener('message',event=>{
      let m=JSON.parse(String(event.data));if(!m.id)return;let p=this.pending.get(m.id);if(!p)return;
      this.pending.delete(m.id);m.error?p.reject(new Error(JSON.stringify(m.error))):p.resolve(m.result);
    });
  }
  call(method,params={}){let id=this.seq++;return new Promise((resolve,reject)=>{this.pending.set(id,{resolve,reject});this.ws.send(JSON.stringify({id,method,params}));});}
  close(){this.ws.close();}
}
async function evalJS(c,expression){let r=await c.call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.text);return r.result.value;}
async function screenshot(c,file,full=false){
  let opts={format:'png',captureBeyondViewport:full};
  if(full){
    let m=await c.call('Page.getLayoutMetrics');
    let z=m.cssContentSize||m.contentSize;
    opts.clip={x:0,y:0,width:Math.ceil(z.width),height:Math.min(12000,Math.ceil(z.height)),scale:1};
  }
  let p=await c.call('Page.captureScreenshot',opts);
  await writeFile(ROOT+'/'+file,Buffer.from(p.data,'base64'));
}
let client;let results=[];let failures=[];
try {
  let page;
  for(let i=0;i<240;i++){
    try{const v=await fetch('http://127.0.0.1:'+port+'/json/version');if(v.ok){page=await fetch('http://127.0.0.1:'+port+'/json/new?about:blank',{method:'PUT'}).then(r=>r.json());break;}}catch{}
    if(chrome.exitCode!==null)throw Error('Chrome quit: '+stderr);
    await sleep(150);
  }
  if(!page)throw Error('Chrome debug port unreachable: '+stderr);
  client=new CDP(page.webSocketDebuggerUrl);await client.init();
  await client.call('Page.enable');await client.call('Runtime.enable');
  let n=0;
  for (const slug of SLUGS){
    for(const vp of WIDTHS){
      n++;
      const url=BASE+(slug?'/'+slug:'/');
      const record={slug:slug||'/',viewport:vp.w,url};
      try{
        const response=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(15000)});
        record.http=response.status;
        record.redirect=response.headers.get('location');
        await client.call('Emulation.setDeviceMetricsOverride',{width:vp.w,height:vp.h,deviceScaleFactor:1,mobile:vp.w<768});
        await client.call('Emulation.setEmulatedMedia',{media:'',features:[{name:'prefers-reduced-motion',value:'reduce'}]});
        await client.call('Page.navigate',{url});
        let ready=false;for(let i=0;i<160;i++){ready=await evalJS(client,'document.readyState==="complete"');if(ready)break;await sleep(100);}
        if(!ready)record.timeout=true;
        await sleep(220);
        record.dom=await evalJS(client,`(() => {
          const rect=e=>{if(!e)return null;const r=e.getBoundingClientRect();return {x:Math.round(r.x),y:Math.round(r.y),width:Math.round(r.width),height:Math.round(r.height),bottom:Math.round(r.bottom)};};
          const txt=e=>(e?.innerText||e?.textContent||'').replace(/\\s+/g,' ').trim();
          const visible=e=>{if(!e)return false;let r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden';};
          const localLinks=[...document.querySelectorAll('a[href^="/"]')].map(a=>({href:a.getAttribute('href'),text:txt(a).slice(0,80)}));
          const badAnchor=localLinks.filter(a=>a.href.includes('#')&&a.href.split('#')[0]===''&&!document.getElementById(decodeURIComponent(a.href.split('#')[1]))).slice(0,8);
          const h1=[...document.querySelectorAll('h1')].map(e=>({text:txt(e),rect:rect(e)}));
          const cta=[...document.querySelectorAll('a.button, a.ghButton,button[type="submit"]')].filter(visible).slice(0,8).map(e=>({text:txt(e),href:e.getAttribute('href'),rect:rect(e)}));
          const images=[...document.images].map(e=>({src:e.getAttribute('src'),alt:e.alt,loaded:e.complete&&e.naturalWidth>0,visible:visible(e)}));
          const overflow=[...document.body.querySelectorAll('*')].filter(e=>visible(e)&&getComputedStyle(e).position!=='fixed').map(e=>({tag:e.tagName,className:typeof e.className==='string'?e.className.slice(0,70):'',text:txt(e).slice(0,40),rect:rect(e)})).filter(x=>x.rect.x < -2 || x.rect.x+x.rect.width > innerWidth+2).slice(0,12);
          const smallTargets=[...document.querySelectorAll('header a,header button,button[type="submit"],a.button,a.ghButton')].filter(visible).map(e=>({text:txt(e),r:rect(e)})).filter(x=>x.r.width<44||x.r.height<44).slice(0,12);
          const headings=[...document.querySelectorAll('h1,h2,h3')].map(e=>({tag:e.tagName,text:txt(e).slice(0,100)}));
          const canonical=document.querySelector('link[rel="canonical"]')?.href||'';
          const metaDescription=document.querySelector('meta[name="description"]')?.content||'';
          const robots=document.querySelector('meta[name="robots"]')?.content||'';
          const hasForm=document.querySelectorAll('form[action="/api/leads"]').length;
          const formInputs=[...document.querySelectorAll('form[action="/api/leads"] input,form[action="/api/leads"] select')].map(e=>({name:e.name,required:e.required,type:e.type}));
          const errors=[...document.querySelectorAll('img')].filter(e=>e.complete&&e.naturalWidth===0).map(e=>e.currentSrc);
          const color=getComputedStyle(document.body).color;
          return {title:document.title,canonical,metaDescription,robots,h1,headings,cta,images,brokenImages:errors,localLinks,missingAnchors:badAnchor,overflow,smallTargets,
          scrollWidth:document.documentElement.scrollWidth,innerWidth,documentHeight:document.documentElement.scrollHeight,
          formCount:hasForm,formInputs,background:getComputedStyle(document.body).backgroundColor,color,header:rect(document.querySelector('header')),
          top:txt(document.querySelector('main')).slice(0,650)};
        })()`);
        const id=safe(slug)+'-'+vp.w;
        await screenshot(client,id+'-viewport.png');
        if(vp.w!==768)await screenshot(client,id+'-full.png',true);
        record.screenshots={viewport:id+'-viewport.png',full:vp.w===768?null:id+'-full.png'};
      }catch(e){record.error=String(e);failures.push({slug,vp:vp.w,error:String(e)});}
      results.push(record);console.log(n+'/'+(SLUGS.length*WIDTHS.length)+' '+url+' '+vp.w+' '+(record.error||record.http));
    }
  }
}finally{
  await writeFile(ROOT+'/metrics.json',JSON.stringify({base:BASE,slugs:SLUGS,widths:WIDTHS,generatedAt:new Date().toISOString(),results,failures},null,2));
  client?.close();chrome.kill('SIGTERM');await sleep(300);if(chrome.exitCode===null)chrome.kill('SIGKILL');await rm(dataDir,{recursive:true,force:true});
}
console.log('Completed '+results.length+' page-width records; errors='+failures.length);
if(failures.length)process.exitCode=1;
