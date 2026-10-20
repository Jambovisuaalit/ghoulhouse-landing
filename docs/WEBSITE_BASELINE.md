# GhoulHouse website — working baseline

Reviewed 20 October 2026 against main b59341e. This describes the implementation,
not a promise of future release status. See [the documentation index](README.md).

## Product and content

- Main audience: renovation and LVI service companies in Uusimaa.
- Main service: 12 original IG/FB contents in 30 days, 490 € + ALV;
  planning, copy, publication, one revision round and a light report.
- Websites and SEO are separately scoped services. Do not change prices or claims
  during technical cleanup. Price copy exists in several TS/TSX sources; search all
  occurrences before a separately authorized price update.
- Company facts: src/config/site.ts. Public contact: hanna@ghoulhouse.fi.
- Social CTA: two free content examples; SOME 12: start inquiry; website CTA:
  website assessment; SEO: /?service=seo#yhteys. Preserve service and intent.
- LeadForm does not upload photos; photo delivery is agreed in the reply.
- Current proof is our own website, explicitly not a customer reference.

## Routes

19 indexable content URLs: /, /rakennusyrityksille, /lvi-yrityksille,
/saneerausyrityksille, /some-sisallontuotanto, /instagram-sisallontuotanto,
/some-12, /some-sisallontuotanto/hinta, /verkkosivut-yritykselle,
/verkkosivut/hinta, /verkkosivut/rakennus, /verkkosivut/lvi, /verkkosivut/sahko,
/referenssit, /tyot/ghoulhouse-verkkosivut, /resurssit,
/oppaat/verkkosivut-itse-vai-ammattilaiselta, /oppaat/rakennusyrityksen-some,
/oppaat/tyomaakuvat-sosiaaliseen-mediaan. The executable list is src/app/sitemap.ts.

/tietosuoja and /kiitos are noindex support pages. Technical endpoints include
POST /api/leads, GET /api/qa-version, GET /api/health/lead-storage,
/brand-icons/[size], /opengraph-image, /manifest.webmanifest, /robots.txt and /sitemap.xml.

## UI and brand sources

Homepage composition: src/app/page.tsx. Shared inner-page navigation/footer:
SiteChrome, MotionOverlayMenu and LiquidGlassFooter. Keep the existing
CSS cascade until a separate, measured visual cleanup is approved.

| Scope | CSS import order |
| --- | --- |
| Root layout | site.css → global-chrome.css → liquid-glass-footer.css → analytics-consent.css → official-brand.css → social-editorial.css → editorial-system.css → motion-overlay-menu.css |
| Homepage | homepage.css → homepage-swiss.css → editorial-home.css |
| Proof pages | proof.css |

Brand tokens are in site.css; editorial-system.css aliases them. Ink #111111,
Signal Red #C9282D, Ghost #F7F4EF, Bone #E6DFD5. Editorial dark surface #0B0B0B
and auxiliary colors are also present. Display: Georgia/Times New Roman;
body and labels: local Montserrat, declared in layout.tsx, licensed in fonts/OFL.txt.
No Anton font is loaded. No src/app/globals.css exists.

Current original files and rights status: [resource register](RESOURCE_REGISTER.md).
Do not restore older neon-green brands, proof examples or removed components from
archived material without a specific reviewed reason.

## Release and operational gates

Work from this repository/main, on a feature branch. Run resource QA, regression tests,
typecheck, lint and build; check the exact Vercel Preview commit. Browser QA must cover
320/390/768/1024/1440/1920 widths, navigation, consent, contact CTAs and keyboard use.
Never submit a real production lead as an incidental QA check. Mocked/local tests
and read-only health checks are safe; actual delivery testing needs an agreed method.
Merge only with successful required CI and no unresolved critical issues, then verify
Production READY, aliases, /api/qa-version SHA and read-only health.

20 October inventory observations: all 21 HTML routes HTTP 200; production SHA
b59341e7642e78f1746c70a1c5020b85cc42a99c; health returned ok:true. These are dated
HTTP checks, not a fresh responsive or email-delivery test.

Open performance task: the 17 October LCP report measured Preview mobile medians
3182 ms (home) and 2808 ms (website service), three runs/URL, Lighthouse 12.8.2.
Do not treat these as current production field data. Reproduce on a fixed SHA before
choosing a performance change. A cleanup does not justify a redesign.
