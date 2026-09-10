# GhoulHouse Landing Page

Official GhoulHouse website source.

## Source of truth

- Repository: `Jambovisuaalit/ghoulhouse-landing`
- Production branch: `main`
- Canonical host: `https://ghoulhouse.fi`
- Active Vercel project: `ghoulhouse-home`
- Node.js: `24.x`
- Canonical message: **TYÖMAAKUVAT SISÄÄN. VALMIS SOME ULOS.**
- Offer: **490 € + ALV / 30 päivää. Ei sitoumusta jatkosta.**

Do not treat old previews, archived projects or previous GhoulHouse brand variants as source code.

> Production provenance note: the live `ghoulhouse-home` Vercel project has historically carried a Git integration to the private `vido-social/ghoulhouse-home` clone. That clone is **not** the source of truth. Production releases must use this repository/`main` until the Vercel Git integration itself has been relinked to `Jambovisuaalit/ghoulhouse-landing`. Do not trigger a Git-based redeploy from the old clone, because it can restore stale UI/code.

## Stack

- Next.js 15 / App Router
- React 18
- TypeScript
- Tailwind CSS + `src/app/globals.css`
- Anton + Montserrat through `next/font`
- Vercel
- Supabase Postgres / RPC for lead storage
- Resend for lead notification email
- Plausible integration prepared; tracker activates only when its production script URL is configured

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
    lead-storage.ts
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

`POST /api/leads` validates the request and calls the restricted Supabase RPC `submit_ghoulhouse_lead` using the public Supabase publishable key. Row-level security prevents anonymous table reads or edits.

The RPC is an intentional anonymous **ingest-only** boundary. `anon` has no direct `SELECT`/`INSERT` access to `public.leads`, no access to the private rate-limit table, and cannot use the `private` schema. The RPC validates all input lengths, rejects unsafe line breaks in identity fields, uses an empty `search_path`, and applies a database transaction advisory lock plus a 5 submissions / 10 minutes per-IP rate limit so concurrent requests cannot race around the limiter.

The database stores the lead and sends the notification through Resend with a restricted Resend API key stored in Supabase Vault. Production does not require a Supabase service-role key, database password, JWT secret or Resend API key in the browser bundle.

Production flow:

```text
Browser
→ POST /api/leads
→ Supabase RPC
→ public.leads
→ database notification trigger
→ Resend
→ hello@ghoulhouse.fi
```

## Plausible Analytics

The Plausible component and CSP allow-list are present. Tracking remains disabled until the exact Plausible production script URL is configured.

Do not reintroduce Vercel Analytics into the runtime stack.

## SEO and canonical routing

- `ghoulhouse.fi` is canonical.
- `www.ghoulhouse.fi` redirects permanently to apex with **308** at application level.
- Preview and non-production deployments remain `noindex`.
- Vercel Production serves canonical metadata as `index, follow`.
- `robots.txt` allows production crawling and `sitemap.xml` exposes approved canonical URLs.
- `/tietosuoja` remains explicitly `noindex` in page metadata.

## Production status — 10.9.2026

Verified on the active `ghoulhouse-home` Vercel project:

- production deployment READY
- `ghoulhouse.fi` attached and returns 200
- `www.ghoulhouse.fi` resolves to canonical apex
- production CSP enforced
- canonical metadata is index/follow
- robots allows crawling
- sitemap is live
- privacy page is live and contains current company master data
- production lead POST returns 201
- lead is stored in Supabase
- Resend notification reaches `hello@ghoulhouse.fi`
- no Vercel runtime errors observed after launch smoke tests
- responsive/browser QA passes from 320px mobile through 1920px desktop, including 1366×768 and 1440×900 laptop viewports
- lead RPC hardening verified with an `anon` execution smoke test and Resend `delivered` status

Remaining non-blocking launch assets: verified Hanna Nyholm founder portrait, verified real customer RAW → FINAL material, Plausible account-side tracker activation, and permanent Vercel Git relinking from the stale private clone to this canonical repository.
