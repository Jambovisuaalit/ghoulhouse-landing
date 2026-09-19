# GhoulHouse Homepage v2

Status: preview for visual review. Do not merge to production until reviewed.

## Direction

- 1280px maximum content width, 120–132px main desktop section spacing.
- One dark offer section; remaining content flows through light surfaces.
- Anton restricted to hero, offer and final contact headline. Normal headings use Montserrat.
- 17–18px body copy, readable controls and captions, no proof matrices or HN placeholder.
- Hero shows the same image as source material and as a formatted social post. It does not imply that content production completes a renovation.
- Four required lead fields. Phone and material notes remain available in optional details.
- Native POST form, consent-based analytics, existing SEO routes and canonical/indexing rules retained.

## Asset provenance

Logo master: supplied `GhoulHouse_Web_Brand_Assets_v1.zip`.
- Header/footer/favicon use supplied `ghoulhouse-micro-primary.svg` copied to `/favicon.svg`.
- Founder uses supplied `ghoulhouse-mark-primary.svg`.
- Organization schema points to the supplied horizontal primary lockup.
- 192/512 PNG and Apple icon come unchanged from the same pack.
- Logo colors remain unchanged. Homepage decision accent follows the requested #C83830.

Hero `/bathroom-concept-v2.webp` was made with the built-in image generator for this preview. It is explicitly labeled as an AI concept and not customer work.
Prompt: A single photorealistic portrait of a believable recently completed small Finnish bathroom, grey porcelain tiles, glass shower, chrome fixtures, oak vanity and round mirror; natural daylight, correct perspective, no people, props, text, logos, frames or before/after UI. Used as one source photograph and repeated in an HTML social-post composition.

## Review

Review at 390×844, 768×1024 and 1440×900 before approving production.
Measure the redesign with existing primary_cta_click, lead_form_start and lead_form_success events. Compare CTA click-through and form completion against the prior period; this preview makes no conversion-lift claim.

## Validation results

- Production build, TypeScript and lint pass.
- Layout verified at 320, 390, 640, 768, 1024, 1280 and 1440px; no horizontal overflow.
- At 1440×900 the header + hero ends at about 797px (89% of viewport).
- Form error and mocked success flow checked without creating a production lead.
- Fixed error-toast overlap with analytics settings and the inert consent overlay on JavaScript-disabled pages.
- Existing CI checks include browser, keyboard/accessibility, reduced motion, metadata, native POST and no-JS content.
