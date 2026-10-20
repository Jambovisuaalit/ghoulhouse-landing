export function median(values) {
  if (!values.length || values.some(v => !Number.isFinite(v))) throw Error('Invalid numeric samples');
  const sorted = [...values].sort((a,b) => a-b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle-1] + sorted[middle]) / 2;
}

// Retry collection failures only. A valid slow measurement is always retained.
export function traceTrial(measure, onInvalid = () => {}) {
  for (let attempt=1; attempt<=3; attempt++) {
    try { return measure(attempt); }
    catch (error) {
      if (error.code !== 'NO_NAVSTART') throw error;
      onInvalid({attempt,code:error.code});
      if (attempt===3) throw error;
    }
  }
}

export function summarize(results, minimumRuns = 5) {
  const groups = new Map();
  for (const row of results) {
    const key = `${row.version}:${row.page}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }
  return [...groups.values()].map(rows => {
    if (rows.length < minimumRuns) throw Error('Insufficient measurement repetitions');
    if (new Set(rows.map(r => r.sha)).size !== 1) throw Error('Mixed deployment SHAs');
    const metrics = {};
    for (const metric of ['performance','accessibility','lcpMs','cls','totalBlockingTimeMs','transferBytes']) {
      const values = rows.map(r => r[metric]);
      const center = median(values);
      metrics[metric] = { median:center, min:Math.min(...values), max:Math.max(...values),
        mad:median(values.map(v => Math.abs(v-center))) };
    }
    return {version:rows[0].version,page:rows[0].page,sha:rows[0].sha,runs:rows.length,metrics};
  });
}

export function assess(groups) {
  const comparisons = ['home','websites'].map(page => {
    const before = groups.find(g => g.page===page && g.version==='before');
    const after = groups.find(g => g.page===page && g.version==='after');
    if (!before || !after) throw Error(`Missing comparison: ${page}`);
    const deltaLcpMs = after.metrics.lcpMs.median - before.metrics.lcpMs.median;
    const savedBytes = before.metrics.transferBytes.median - after.metrics.transferBytes.median;
    const safetyPassed = after.metrics.performance.median >= 90 &&
      after.metrics.accessibility.min >= 95 && after.metrics.cls.max <= .1 && deltaLcpMs <= 200;
    return {page,deltaLcpMs,savedBytes,safetyPassed,
      lcpImproved:deltaLcpMs <= -200,lcpTargetMet:after.metrics.lcpMs.median <= 2500};
  });
  return {comparisons,safetyGatePassed:comparisons.every(c=>c.safetyPassed),
    lcpTargetMet:comparisons.every(c=>c.lcpTargetMet),
    benefit:comparisons.some(c=>c.lcpImproved)?'lcp':comparisons.every(c=>c.savedBytes>=100000)?'payload-only':'not-demonstrated'};
}
