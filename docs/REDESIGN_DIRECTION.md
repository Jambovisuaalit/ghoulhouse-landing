# GhoulHouse Homepage v2 — company-level editorial direction

Status: PR #71 remains a draft until visual approval. Production must not change before approval.

## Purpose
The root URL `/` presents GhoulHouse Oy as a company, not as the landing page
for its SOME 12 product. Service-specific pricing, demonstrations and in-depth
sales information live on `/some-sisallontuotanto` and related service pages.

## Information architecture (in order)
1. Company hero: “HYVÄ TYÖ PITÄÄ NÄKYÄ.”, Websites / Social / SEO, “Pyydä ehdotus”.
2. One honest published implementation. GhoulHouse’s own live website is
   labelled explicitly as an own implementation, not a customer reference or outcome.
   Replace only when a real approved client case and its factual evidence exist.
3. Three editorial service rows: Websites → `/verkkosivut-yritykselle`,
   Social → `/some-sisallontuotanto`, SEO → `/resurssit` until a dedicated
   SEO page is actually published. The SOME 12 price belongs only to the Social row.
4. Service-agnostic process: Tilanne → Ehdotus → Toteutus → Julkaisu & kehitys.
5. Three neutral proof paths (Websites, Social, industry) + `/referenssit`.
   These paths must not be mistaken for verified client case studies.
6. Three existing resource paths: website price, DIY vs specialist, worksite photos.
7. Company founder/contact, then the proposal form with `intent=booking`.
8. Sitewide Organization/WebSite graph; SOME 12 Service/Offer on the Social page.

## Visual direction
Quiet Finnish editorial design: 1280px max content, generous whitespace,
Anton only for select display statements, Montserrat for body and service
headings as appropriate. GHOST / INK as primary palette; SIGNAL RED only for
an action or sparing emphasis. Avoid dense card/template repetition.
A published page or own material must never be labelled as a customer case.

## Technical guardrails
- Preserve canonical homepage URL, native `POST /api/leads`, no-JS use, privacy
  notice, accessibility, mobile navigation, and consent-based GA4 behavior.
- Keep preview `noindex`; production must not change before manual visual QA.
- Validate 390, 768 and 1440px first view and full-page layout, plus 320, 640,
  1024 and 1280px overflow and keyboard/focus/reduced-motion behavior.
- Do not add an unpublished route as a CTA destination.
- Do not merge PR #71 on a CI pass alone: obtain company-level visual approval.
