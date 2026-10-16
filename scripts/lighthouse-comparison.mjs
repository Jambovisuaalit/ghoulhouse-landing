import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
const candidate=process.env.QA_BASE_URL;
if(!candidate) throw Error('QA_BASE_URL must identify the exact verified Preview');
const output='qa-artifacts/performance';mkdirSync(output,{recursive:true});
const summary=[];
for(const [version,base] of [['before','https://ghoulhouse.fi'],['after',candidate]]) {
  for(const [name,path] of [['home','/'],['websites','/verkkosivut-yritykselle']]) {
    const prefix=`${output}/${version}-${name}`;
    execFileSync('npx',['--yes','--package=lighthouse@12.8.2','lighthouse',base+path,
      '--only-categories=performance,accessibility','--output=json','--output=html',
      '--output-path='+prefix,'--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage',
      '--quiet'],{stdio:'inherit',timeout:180000});
    const report=JSON.parse(readFileSync(prefix+'.report.json','utf8'));
    if(report.runtimeError) throw Error(JSON.stringify(report.runtimeError));
    const metric=id=>report.audits[id]?.numericValue ?? null;
    summary.push({version,page:name,url:report.finalDisplayedUrl,fetchTime:report.fetchTime,
      lighthouseVersion:report.lighthouseVersion,userAgent:report.userAgent,
      performance:report.categories.performance.score*100,
      accessibility:report.categories.accessibility.score*100,
      lcpMs:metric('largest-contentful-paint'),cls:metric('cumulative-layout-shift'),
      totalBlockingTimeMs:metric('total-blocking-time'),transferBytes:metric('total-byte-weight'),
      resources:report.audits['resource-summary']?.details?.items,
      conditions:report.configSettings});
  }
}
writeFileSync(output+'/summary.json',JSON.stringify({
  limitations:'One mobile simulated-throttling lab run per URL on the same CI runner. Production and Preview use different deployments; results have run variance. TBT is not INP; no field INP is asserted. Accessibility score is automated coverage, not WCAG certification.',
  results:summary},null,2));
console.log(JSON.stringify(summary,null,2));
