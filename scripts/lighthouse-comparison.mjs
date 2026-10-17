import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const candidate = process.env.QA_BASE_URL;
if (!candidate) throw Error('QA_BASE_URL must identify the exact verified Preview');
const output = 'qa-artifacts/performance';
mkdirSync(output, { recursive: true });

const summary = [];
const readAudit = (report, id) => report.audits[id] ?? null;
const elementDetails = (report) => {
  const audit = readAudit(report, 'largest-contentful-paint-element');
  const tables = audit?.details?.items ?? [];
  const node = tables[0]?.items?.[0]?.node ?? {};
  return { selector: node.selector ?? null, snippet: node.snippet ?? null,
    phases: tables[1]?.items?.map(({ phase, timing, percent }) => ({ phase, timing, percent })) ?? [] };
};
const diagnostics = (report) => {
  const metric = id => readAudit(report, id)?.numericValue ?? null;
  const insight = id => {
    const audit = readAudit(report, id);
    return audit ? { displayValue: audit.displayValue ?? null,
      items: (audit.details?.items ?? []).slice(0, 5).map(item => ({
        type: item.type ?? null, phase: item.phase ?? null,
        timing: item.timing ?? null, duration: item.duration ?? null,
        node: item.type === 'node' ? item.selector ?? item.snippet ?? null : null,
        timings: item.type === 'table' ? item.items?.map(row => ({
          label: row.label ?? row.phase ?? row.subpart ?? null,
          duration: row.duration ?? row.timing ?? null,
        })) : null,
        checklist: item.type === 'checklist' ? item.items : null,
        url: item.url ?? item.resource?.url ?? null,
      })) } : null;
  };
  return { lcpMs: metric('largest-contentful-paint'), fcpMs: metric('first-contentful-paint'),
    ttfbMs: metric('server-response-time'), speedIndexMs: metric('speed-index'),
    lcpElement: elementDetails(report),
    lcpBreakdown: insight('lcp-breakdown-insight'),
    lcpDiscovery: insight('lcp-discovery-insight'),
    renderBlocking: insight('render-blocking-insight'),
    fontDisplay: insight('font-display-insight') };
};

for (const [version, base] of [['before', 'https://ghoulhouse.fi'], ['after', candidate]]) {
  for (const [name, path] of [['home', '/'], ['websites', '/verkkosivut-yritykselle']]) {
    // Three candidate runs avoid treating a single simulated-throttling outlier as an improvement.
    // Baseline is only a live reference; there is no automatic LCP pass claim.
    for (let attempt = 1; attempt <= (version === 'after' ? 3 : 1); attempt++) {
      const prefix = `${output}/${version}-${name}-${attempt}`;
      // Lighthouse can occasionally lose the navigation trace (NO_NAVSTART).
      // Retry only transient recording failures; never turn missing audit data into PASS.
      let report;
      for (let retry = 0; retry < 3; retry++) {
        try {
          execFileSync('npx', ['--yes', '--package=lighthouse@12.8.2', 'lighthouse', base + path,
            '--only-categories=performance,accessibility', '--output=json', '--output=html',
            '--output-path=' + prefix,
            '--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage',
            '--quiet'], { stdio: 'inherit', timeout: 180000 });
          report = JSON.parse(readFileSync(prefix + '.report.json', 'utf8'));
          if (report.runtimeError) throw Error(JSON.stringify(report.runtimeError));
          break;
        } catch (error) {
          if (retry === 2) throw error;
          console.warn('Lighthouse transient failure; retry ' + (retry + 1) + ': ' + error.message);
        }
      }
      const metric = id => report.audits[id]?.numericValue ?? null;
      const entry = { version, page: name, attempt, url: report.finalDisplayedUrl,
        fetchTime: report.fetchTime, lighthouseVersion: report.lighthouseVersion,
        userAgent: report.userAgent,
        performance: report.categories.performance.score * 100,
        accessibility: report.categories.accessibility.score * 100,
        lcpMs: metric('largest-contentful-paint'),
        cls: metric('cumulative-layout-shift'),
        totalBlockingTimeMs: metric('total-blocking-time'),
        transferBytes: metric('total-byte-weight'),
        resources: report.audits['resource-summary']?.details?.items ?? [],
        diagnostics: diagnostics(report),
        conditions: report.configSettings };
      summary.push(entry);
      console.log('LCP_DIAGNOSTICS ' + JSON.stringify({
        version, page: name, attempt, performance: entry.performance,
        accessibility: entry.accessibility, cls: entry.cls, ...entry.diagnostics
      }));
    }
  }
}
const med = nums => {
  const sorted = nums.filter(Number.isFinite).sort((a, b) => a - b);
  return sorted.length ? sorted[Math.floor(sorted.length / 2)] : null;
};
const medians = Object.fromEntries(['home', 'websites'].map(page => [page, {
  afterLcpMs: med(summary.filter(entry => entry.version === 'after' && entry.page === page).map(entry => entry.lcpMs)),
  afterCls: med(summary.filter(entry => entry.version === 'after' && entry.page === page).map(entry => entry.cls)),
}]));
writeFileSync(output + '/summary.json', JSON.stringify({
  limitations: 'Same CI runner, simulated Lighthouse mobile throttling. Baseline is one run and Preview three runs. Neither is field LCP/INP. GA4 conversion receipt cannot be confirmed by Lighthouse.',
  medians, results: summary,
}, null, 2));
console.log('LCP_MEDIANS ' + JSON.stringify(medians));
