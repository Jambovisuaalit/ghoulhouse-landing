# GhoulHouse Homepage v2 — company-level editorial layout

Status: company-level Homepage v2 merged via PR #71. Further proof and form corrections are reviewed separately in draft PR #72. No production deployment from PR #72 until owner approves.

## Current direction
- Three distinct services: Websites, Social and SEO. Social's SOME 12 price belongs in its service row.
- Hero: HYVÄ TYÖ PITÄÄ NÄKYÄ. CTA: Pyydä ehdotus.
- Editorial spacing and legible Montserrat body. Anton is limited to large statements and service titles.
- Existing resources are editorial guides, never presented as customer results.
- The services overview is distinct from verified customer references.

## Verified own-work proof
- Main proof uses a real 1440×900 PNG captured directly from the publicly published https://ghoulhouse.fi/ by scripts/capture-production-proof.mjs.
- Screenshot asset: public/ghoulhouse-site-proof.png. The workflow writes only to the review branch; it cannot deploy production.
- Own-work disclosure remains visible: Oma sivusto — ei asiakasreferenssi eikä tulosväite.
- Proof link opens the actual published ghoulhouse.fi, not a generic service description.
- No AI bathroom concept and no invented customer case are used on the homepage.

## Proposal and accessibility
- The SEO service CTA leads to /?service=seo#yhteys and the general proposal form preselects SEO.
- The optional service interest is stored as a labelled prefix to the existing lead message; no new database column or schema change is required.
- Native POST errors (validation, payload, rate limit, delivery) return to #yhteys from the homepage, with server-rendered error text for users without JavaScript.
- Social and other existing service flows retain their original functionality.

## Release gate
- CI build, typecheck, lead API, no-JavaScript failure-path test, browser QA and visual accessibility tests must pass on the same final commit.
- Browser QA must capture 390×844, 768×1024 and 1440×900 PNGs for review, and the real published-site proof must load in each layout.
- PR #72 remains draft until owner reviews the actual screenshots and explicitly approves a merge. No production change is authorized by this document.
