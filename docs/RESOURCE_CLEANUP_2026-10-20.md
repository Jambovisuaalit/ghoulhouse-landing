# Resource cleanup — 20 October 2026

Base: b59341e7642e78f1746c70a1c5020b85cc42a99c. Scope: remove ambiguity from the
existing website's code, instructions and material selection.

## Implemented

- Removed 12 unreachable legacy files (859 source lines): HeroDotGrid,
  ProfileChoice, Service3DCarousel, eight sections/* components and data/landing.ts.
  No current App Router import path or test/script consumer was found. Git retains
  the originals. Container remains: support pages still use it.
- Removed the now-unused optional founderImage configuration/environment example.
  The live portrait is explicitly selected in app/page.tsx.
- Archived two superseded design documents; removed the one-word placeholder tmp file.
- Corrected README's typography, paths, composition, contact/proof and release status.
  Kept backend and analytics operational explanations. Marked the earlier launch
  checklist historical rather than claiming its old PASS entries are current.
- Reconciled editorial token/font documentation with existing CSS; preserved CSS.
- Corrected .env.example: OIDC boundary, actual CSP behavior and indexable production
  default; no production environment variables were changed.
- Added the documentation index, current baseline, resource decisions and 18-entry
  hash/rights manifest. Added resource integrity QA to CI.

## Preserved

Current page structure, UI CSS, images/public URLs, canonical/SEO routes, prices,
service claims, forms, analytics and social links. External master/QA originals were
not deleted or renamed. No database migrations or production lead submissions.

## Continue from here

| Order | Work | Completion evidence |
| --- | --- | --- |
| 1 | Close media rights/master gaps | Creator/source, allowed scope and approval evidence for each pending asset; compare located master hashes |
| 2 | Reproduce LCP on one fixed deployed SHA | Repeatable home + website measurements, reported device/network/cache/consent conditions; target ≤2.5 s |
| 3 | Ship one measured performance change | Preview comparison without CTA, form, SEO, consent or visual regression; do not merge on an unsupported causal guess |
| 4 | Replace concepts only when suitable approved work exists | Real material + factual project data + permission, correctly labelled |

Validation results and exact release SHA belong in the PR/checks, not an undated
PASS claim in this file. Resource QA guards file hashes, completeness, rights-state
consistency, local documentation links and relative/alias source import resolution.
