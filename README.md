# GhoulHouse Landing Page

Official GhoulHouse website source.

## Source of truth

- Repository: `Jambovisuaalit/ghoulhouse-landing`
- Production branch: `main`
- Canonical host: `https://ghoulhouse.fi`
- Target Vercel project: `ghoulhouse-oy`
- Canonical message: **TYÖMAAKUVAT SISÄÄN. VALMIS SOME ULOS.**
- Offer: **490 € + ALV / 30 päivää. Ei sitoumusta jatkosta.**

Do not treat old previews, archived projects or previous GhoulHouse brand variants as source code.

## Stack

- Next.js 15 / App Router
- React 18
- TypeScript
- Tailwind CSS + `src/app/globals.css`
- Anton + Montserrat through `next/font`
- Vercel
- Plausible Analytics
- Resend or webhook lead delivery

## Local development

```bash
npm ci
npm run dev
```

Validation:

```bash
npm run typecheck
npm run lint
npm run build
npm run qa:browser
```

CI additionally runs launch visual/accessibility and no-JavaScript QA.

## Application structure

```text
src/
  app/
    api/leads/route.ts
    globals.css
    layout.tsx
    page.tsx
    robots.ts
    sitemap.ts
    opengraph-image.tsx
    tietosuoja/page.tsx
  components/
    analytics/
    contact/
    layout/
    sections/
    ui/
  config/site.ts
  data/landing.ts
  lib/
    analytics.ts
    lead.ts
    lead-delivery.ts
    seo.ts
  middleware.ts
```

Homepage composition:

```text
Hero
→ RAW / VALMIS mechanism
→ Problem / Solution
→ Process
→ Content Examples
→ Pricing
→ Founder
→ FAQ
→ Final CTA
```

## Brand system

Use the existing design tokens only:

- Ink `#111111`
- Signal Red `#C9282D`
- Ghost `#F7F4EF`
- Bone `#E6DFD5`
- Anton for display typography
- Montserrat for body/UI typography

Official logo SVG artwork lives in `public/logo-horizontal.svg` and `public/logo-horizontal-white.svg`. Both wordmarks are path-only and must not depend on runtime fonts.

## Proof policy

Never present stock, generated or unverified material as customer work.

Until verified customer RAW → FINAL material is available, `Mechanism.tsx` must remain explicitly labelled:

`KONSEPTIESIMERKKI — EI ASIAKASTYÖ`

A founder portrait may be enabled only with a verified local asset via `NEXT_PUBLIC_FOUNDER_IMAGE`. The HN fallback is intentional until that asset exists.

## Lead delivery

`POST /api/leads` validates requests and delegates delivery through `src/lib/lead-delivery.ts`.

Supported modes:

```text
LEAD_DELIVERY_MODE=resend
LEAD_DELIVERY_MODE=webhook
```

See `.env.example` for environment variables. Never commit production secrets.

## Plausible Analytics

Create/configure `ghoulhouse.fi` in Plausible and set the exact site-specific tracker URL in Production:

```text
NEXT_PUBLIC_PLAUSIBLE_SCRIPT_SRC=<Plausible site-specific script URL>
```

Do not reintroduce Vercel Analytics into the runtime stack.

## SEO and canonical routing

- `ghoulhouse.fi` is canonical.
- `www.ghoulhouse.fi` redirects permanently to apex with **308**.
- local, Preview and non-canonical deployments remain `noindex`.
- indexing requires Vercel Production, canonical host, `SITE_INDEXABLE=true`, and explicit `NEXT_PUBLIC_PRIVACY_PATH=/tietosuoja`.

Keep `SITE_INDEXABLE=false` until the complete production launch gate has passed.

## Production release gate

Before enabling indexing:

1. CI is green on the exact `main` commit.
2. `ghoulhouse-oy` has all required Production environment variables.
3. Plausible tracker is configured and verified.
4. lead delivery reaches the real inbox.
5. `ghoulhouse.fi` is attached to the intended Vercel project and returns 200.
6. `www.ghoulhouse.fi` returns 308 to apex.
7. privacy, robots, sitemap, CSP and browser QA pass.
8. only then set `SITE_INDEXABLE=true`.

Domain/DNS operations are separate from application source changes.
