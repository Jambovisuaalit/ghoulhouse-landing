import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { summarize, assess } from './lib/performance-summary.mjs';

const candidate=process.env.QA_BASE_URL;
const candidateSha=process.env.QA_HEAD_SHA;
const baselineSha=process.env.QA_BASELINE_SHA;
if(!candidate || !/^[a-f0-9]{40}$/.test(candidateSha||'') || !/^[a-f0-9]{40}$/.test(baselineSha||''))
  throw Error('Exact baseline and Preview SHAs are required');
const identity=async base=>{
  const response=await fetch(base+'/api/qa-version',{cache:'no-store',signal:AbortSignal.timeout(15000)});
  if(!response.ok)throw Error('Deployment identity unavailable');
  const value=await response.json();
  if(!/^ghoulhouse-home-[a-z0-9]+-info-32533854s-projects\.vercel\.app$/.test(value.url||''))throw Error('Unexpected deployment host');
  return value;
};
const live=await identity('https://ghoulhouse.fi');
if(live.sha!==baselineSha || live.environment!=='production')throw Error('Production does not match the PR base; rebase and rerun');
const baseline='https://'+live.url;
async function verify(base,sha,environment){
  const value=await identity(base);
  if(value.sha!==sha || value.environment!==environment || base!=='https://'+value.url)throw Error('Immutable deployment identity changed');
}
await verify(candidate,candidateSha,'preview');
const output='qa-artifacts/performance';mkdirSync(output,{recursive:true});
const results=[];const warmups=[];
const count=5;
const versions={before:{base:baseline,sha:baselineSha,environment:'production'},after:{base:candidate,sha:candidateSha,environment:'preview'}};
const pages=[['home','/'],['websites','/verkkosivut-yritykselle']];
function run(version,page,path,round,warmup=false){
  const target=versions[version];
  const prefix=`${output}/${warmup?'warmup':`run-${round+1}`}-${version}-${page}`;
  execFileSync('npx',['--yes','--package=lighthouse@12.8.2','lighthouse',target.base+path,
    '--only-categories=performance,accessibility','--output=json','--output=html',
    '--save-assets','--output-path='+prefix,
    '--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage','--quiet'],
    {stdio:'inherit',timeout:180000});
  const report=JSON.parse(readFileSync(prefix+'.report.json','utf8'));
  if(report.runtimeError || report.finalDisplayedUrl!==target.base+path)throw Error('Lighthouse navigation/measurement failure');
  const metric=id=>report.audits[id]?.numericValue ?? null;
  const row={version,page,round,warmup,sha:target.sha,url:report.finalDisplayedUrl,fetchTime:report.fetchTime,
    lighthouseVersion:report.lighthouseVersion,userAgent:report.userAgent,
    performance:report.categories.performance.score*100,accessibility:report.categories.accessibility.score*100,
    lcpMs:metric('largest-contentful-paint'),cls:metric('cumulative-layout-shift'),
    totalBlockingTimeMs:metric('total-blocking-time'),transferBytes:metric('total-byte-weight'),
    resources:report.audits['resource-summary']?.details?.items,conditions:report.configSettings,
    lcpBreakdown:report.audits['lcp-breakdown-insight']?.details};
  (warmup?warmups:results).push(row);
  console.log(JSON.stringify({version,page,round,warmup,lcpMs:row.lcpMs,performance:row.performance}));
}
// Warm server/CDN paths once per page/version. Measured trials still use fresh
// browser storage/cache (Lighthouse default); warmups are excluded from statistics.
for(const [version,target] of Object.entries(versions)){
  await verify(target.base,target.sha,target.environment);
  for(const [page,path] of pages)run(version,page,path,-1,true);
}
for(let round=0;round<count;round++){
  const order=round%2?['after','before']:['before','after'];
  for(const [page,path] of pages) for(const version of order){
    const target=versions[version];await verify(target.base,target.sha,target.environment);
    run(version,page,path,round);
  }
}
for(const target of Object.values(versions))await verify(target.base,target.sha,target.environment);
const aggregates=summarize(results,count);const decision=assess(aggregates);
const summary={method:'Five fresh-browser mobile simulated-throttling runs per page/version; interleaved AB/BA order, one excluded CDN warmup per page/version, immutable SHA-bound URLs; raw Lighthouse trace/devtoolslog/report retained.',
  limitations:'Different Production and Preview deployments still have infrastructure variance, including Preview instrumentation. This is lab data, not field p75 or INP. TBT is not INP. Accessibility score is automated coverage, not WCAG certification. A safety PASS is not an LCP-target PASS.',
  versions,aggregates,decision,warmups,results};
writeFileSync(output+'/summary.json',JSON.stringify(summary,null,2));
console.log(JSON.stringify({aggregates,decision},null,2));
if(!decision.safetyGatePassed)throw Error('Performance safety gate failed; inspect medians, ranges and traces before release');
