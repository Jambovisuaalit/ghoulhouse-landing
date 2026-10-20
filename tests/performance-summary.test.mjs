import test from 'node:test';
import assert from 'node:assert/strict';
import {median,summarize,assess} from '../scripts/lib/performance-summary.mjs';

const rows = () => ['before','after'].flatMap(version=>['home','websites'].flatMap(page=>
  [0,1,2,3,4].map(run=>({version,page,sha:version==='before'?'a':'b',performance:93,
    accessibility:100,lcpMs:3000+run*10,cls:0,totalBlockingTimeMs:50,
    transferBytes:version==='before'?500000:360000}))));
test('summaries use every sample and median, range and median absolute deviation',()=>{
  assert.equal(median([1,2,100,3,4]),3);
  assert.equal(median([1,2,3,4]),2.5);
  const summary=summarize(rows());
  assert.deepEqual(summary[0].metrics.lcpMs,{median:3020,min:3000,max:3040,mad:10});
});
test('missing repetitions, non-finite metrics and mixed SHAs fail closed',()=>{
  assert.throws(()=>summarize(rows().slice(1)),/Insufficient/);
  const invalid=rows();invalid[0].lcpMs=null;assert.throws(()=>summarize(invalid),/Invalid/);
  const mixed=rows();mixed[0].sha='other';assert.throws(()=>summarize(mixed),/Mixed/);
});
test('payload savings do not falsely pass the LCP target',()=>{
  const decision=assess(summarize(rows()));
  assert.equal(decision.safetyGatePassed,true);
  assert.equal(decision.benefit,'payload-only');assert.equal(decision.lcpTargetMet,false);
});
test('an LCP regression, accessibility failure or unstable layout rejects release',()=>{
  for(const change of [r=>r.lcpMs+=201,r=>r.accessibility=94,r=>r.cls=.11]){
    const input=rows();input.filter(r=>r.version==='after').forEach(change);
    assert.equal(assess(summarize(input)).safetyGatePassed,false);
  }
});
test('one unusually fast run does not hide a median regression',()=>{
  const input=rows();const after=input.filter(r=>r.version==='after');
  after.forEach(r=>r.lcpMs+=400);after[0].lcpMs=1000;
  assert.equal(assess(summarize(input)).safetyGatePassed,false);
});
