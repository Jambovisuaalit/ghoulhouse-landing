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
  const item = audit?.details?.items?.[0] ?? {};
  const node = item.node ?? {};
  return { selector: node.selector ?? null, snippet: node.snippet ?? null,
    resourceUrl: item.url ?? item.resource?.url ?? null };
};
const diagnostics = (report) => {
  const metric = id => readAudit(report, id)?.numericValue ?? null;
  const insight = id => {
    const audit = readAudit(report, id);
    return audit ? { displayValue: audit.displayValue ?? null,
      items: (audit.details?.items ?? []).slice(0, 5).map(item => ({
        type: item.type ?? null, phase: item.phase ?? null,
        timing: item.timing ?? null, duration: item.duration ?? null,
        node: item.node?.snippet ?? item.node?.selector ?? null,
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
      execFileSync('npx', ['--yes', '--package=lighthouse@12.8.2', 'lighthouse', base + path,
        '--only-categories=performance,accessibility', '--output=json', '--output=html',
        '--output-path=' + prefix,
        '--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage',
        '--quiet'], { stdio: 'inherit', timeout: 180000 });
      const report = JSON.parse(readFileSync(prefix + '.report.json', 'utf8'));
      if (report.runtimeError) throw Error(JSON.stringify(report.runtimeError));
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
