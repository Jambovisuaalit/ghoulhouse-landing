# Initial resource delivery — 20 October 2026

Base: 66eb5db74efd989c0c00f8f6daa8eaeaab6496d3. This is a font-delivery experiment
plus a reproducible measurement method. Its release results belong in the exact PR
and CI artifacts, not an advance performance-success claim in this document.

## Evidence and scope

The current 216,236-byte locally bundled Montserrat was the largest single resource
in the earlier Lighthouse reports. The website-service H1 uses Georgia; a large
font request is not proof of a font-dependent H1 paint. Local font-blocking experiments
did not consistently improve LCP and do not establish a single root cause.

The outbound proxy in the local analysis environment added roughly 12 seconds before
HTML completion in remote raw-CDP probes. Those absolute figures are excluded from
release/target comparisons. Local-build raw-CDP trials are diagnostic only; they use
different conditions from CI's simulated mobile profile and cannot be combined with it.

The candidate only subsets the font's character coverage for this Finnish-language
site. It does not change the selected typeface, current glyph geometry, CSS, content,
image treatment or CTA behavior. Full source stays in Git. The candidate saves 133,880
bytes (61.9%) per full cold font transfer. Browser compression/caching and total-page
transfer must be measured separately. See [font provenance and reproduction](../src/app/fonts/README.md).
The resource manifest retains the documented OFL license; unrelated media-rights
evidence is still pending. No real lead is submitted by this experiment.

## Repeated deployed comparison

scripts/lighthouse-comparison.mjs now:

1. Resolves the current Production identity and requires it to match the exact PR
   base SHA; resolves both versions to immutable Vercel deployment hosts.
2. Verifies SHA/environment before and after the experiment, and before measured
   trials. A moved or unexpected identity fails rather than mixing versions.
3. Warms each page/version CDN path once, excludes those four runs from statistics,
   then runs five fresh-browser mobile Lighthouse 12.8.2 trials per page/version.
4. Alternates before/after order between rounds, on the same CI runner/browser.
   Measurements use Lighthouse's recorded simulated mobile network/CPU configuration.
   New browser storage has no analytics consent; defaults reset browser caches.
5. Retains raw HTML/JSON, CDP traces/devtools logs, conditions, timestamps, exact SHAs,
   five-sample medians, minima/maxima and median absolute deviations in browser-qa.

The safety gate requires candidate median Performance ≥90, all sampled Accessibility
scores ≥95, CLS ≤0.1 and no median LCP regression above 200 ms on either page.
The ≤2500 ms LCP target is reported separately: safety PASS does not mean target PASS.
The report distinguishes ≥200 ms median LCP improvement, ≥100,000-byte savings on
both pages without a demonstrated LCP improvement, and no demonstrated benefit.
Missing/invalid samples and mixed SHAs fail closed. Unit tests cover these decisions.

This remains laboratory data from distinct deployments; Preview instrumentation and
infrastructure can differ from Production. No field p75/INP or conversion uplift is
claimed. An unchanged or unresolved LCP remains open even if payload savings are real.

## Next decision

Inspect all repetitions and traces before release. Keep the smaller font only with
verified glyph fidelity, complete existing responsive/form/SEO/consent QA and acceptable
deployed results. Do not turn on global experimental CSS inlining or redesign the
site solely to improve a synthetic score. Missing image rights/master originals are
tracked in [the resource register](RESOURCE_REGISTER.md) and are not resolved here.
