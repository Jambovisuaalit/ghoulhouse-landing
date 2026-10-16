# GhoulHouse UI/UX audit and refinement — 16 October 2026

## Executive assessment

Audit before redesign: retain the existing editorial layout, local Montserrat font, deliberate Georgia display typography, official logos, approved founder portrait, brand palette, service content, pricing, SEO metadata, consent system and lead backend. The existing component architecture supports targeted fixes; a rebuild is not justified.

Source baseline: `main` / `b87dae73d706bdaa75fb768f361f3501059033a4`.
Production baseline: Vercel `ghoulhouse-home`, deployment `dpl_Mekxsa6ozgPe4d2a8cvvUgc6C7LX`, READY, same SHA; canonical domain returned HTTP 200. The similarly named `ghoulhouse-landing` Vercel project is obsolete for this release.

The attached business brief confirms the 490 € + VAT / 30-day Social offer and 12 original contents for Instagram and Facebook. It does not authorize publishing internal financing/advisor material. No price, ownership, reference, review or performance claim was added to the website.

## Findings and implementation

| Priority | Page/component | Evidence and user impact | Implementation | Verification |
| --- | --- | --- | --- | --- |
| P1 | All five website routes / contact, hero and pricing grids | CI real Chromium at 320px found contact heading and form outside the viewport while root overflow was hidden. Long Finnish headings expand implicit min-content grid tracks. Follow-up browser coverage also identified the same issue in the website pricing hero and pricing section. | Use minmax(0,1fr) tracks, shrinkable form fields and wrapping contact typography; preserve two columns from 768px. | New browser assertion detected the defect; exact-commit rerun is required. |
| P1 | All five website routes / overlay menu | Production browser: “Hinnat” points to Social pricing; “Yhteys” points to homepage general form. Visitor loses service context. | Use the service-specific price destination and contact CTA for both menu links. | Rendered menu regression tests; six-width browser suite records before/after. |
| P1 | Website menu and SOME 12 menu | Production browser: website inquiry is followed by “Maksuttomat esimerkit omista kuvistanne.” Misstates the next step; paid Social start also has this generic note. | Centralize service-specific supporting copy with existing inquiry configuration. | Rendered website menu and Social context tests. |
| P1 | Overlay menu small numbering | Signal Red on Ink contrast = 3.439:1, below 4.5:1 for small normal text. | Use approved Bone on Ink = 14.280:1. CTA red is retained. | WCAG relative-luminance calculation. This is a targeted fix, not full WCAG certification. |
| P1 | Shared LeadForm | Button disabled state depends on React rendering; repeated submit events in the same tick can start more than one request. Backend deduplication already exists. | Synchronous ref guard before fetch; release on error/completion; expose aria-busy. | Actual submit-handler test: two pending submits issue one request; failed request permits retry. No production lead sent. |
| P2 | Service navigation | Social sibling/child pages lack selected state while website/resources/cases have partial selected states. | Share selected-route logic for desktop, no-JS fallback and service links in overlay. | Service family, resources and case routing tests. |
| QA gap | Homepage and website routes | Existing fullpage homepage suite omitted 1024 and 1920; website menu context lacked browser assertions. | Add both homepage widths; add 30 website route/width combinations against baseline and candidate. | CI captures JSON and screenshots; do not interpret suite code as a passed execution. |

## Scope and unchanged behavior

No rewrite, new design system, component library, image generation, logo changes, fabricated testimonials or customer work. No changes to service prices, API contract, Supabase schema, Resend recipients, analytics event ownership, canonical routing or consent choices. Existing form labels, error messages, modal focus trap, Escape behavior, body scroll locking and reduced-motion support are retained.

## QA and evidence

- Local baseline: 59/59 tests passed. Candidate after fixes: 65/65 passed.
- Local typecheck and lint passed; production build passed after initial menu changes. Final exact-commit CI remains the release authority.
- Local Chromium unavailable; Playwright Chromium download repeatedly returned a truncated/empty archive. Do not claim local responsive screenshots or Lighthouse scores.
- Production was inspected in a real cloud browser at its available desktop viewport; website menu routing/copy defects were directly confirmed. This is not a six-width test.
- Existing CI tests homepage, Social pages, service-specific confirmation, consent, navigation, reduced motion, no-JS behavior, SEO, brand and API boundary behavior.
- `website-responsive-qa.mjs` checks five website routes at 320/390/768/1024/1440/1920; requires one H1, no detected content overflow, website form service/intent, active service and service-aware menu.
- `homepage-fullpage-qa.mjs` checks all six requested widths; screenshots and JSON are uploaded in the CI `browser-qa` artifact.
- `lighthouse-comparison.mjs` runs Lighthouse 12.8.2 on production baseline and exact Preview for homepage and website landing. One mobile simulated-throttling lab run per URL on the same runner. JSON includes conditions, scores, LCP, CLS, TBT, resource sizes, total transfer and version. Raw HTML/JSON reports are artifacts. Production and Preview are different deployments and single runs have variance. TBT is not INP. Field INP is unavailable in this audit.
- Pending exact-commit CI/Preview results must be recorded in the PR/release report; this source report intentionally does not pre-claim results.

## Release gate and remaining work

PR: https://github.com/Jambovisuaalit/ghoulhouse-landing/pull/125

Merge only after the exact candidate build, CI and Preview gates succeed and release-blocking findings are resolved. Confirm production READY, canonical domain, exact merged SHA, menu, service form context, WhatsApp/social links and read-only lead health. Do not submit real inquiries during QA.

This is a targeted implementation and expanded automated audit, not an assertion that every WCAG 2.2 AA criterion or visual property on every route has been manually verified. Full keyboard/zoom/screen-reader review and field INP require separate evidence. Lighthouse targets are goals (90 performance, 95 accessibility, LCP 2.5s, CLS .1), not automatically passed checks. No conversion uplift can be claimed without post-release funnel data.
