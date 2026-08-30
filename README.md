# GhoulHouse Oy Landing Page

Official website for GhoulHouse Oy — a productized social media content service for Finnish renovation and local service businesses.

## Source of Truth

- Repository: `Jambovisuaalit/ghoulhouse-landing`
- Canonical branch: `main`
- Canonical public host: `https://ghoulhouse.fi`
- Canonical Vercel target project: `ghoulhouse-oy`
- Legacy domain-owning Vercel project during infrastructure migration: `ghoulhouse-landing-1ig9`

Do not treat old previews, legacy Vercel projects, or `vido-social/ghoulhouse-landing` as source code.

## Tech Stack

- **Framework:** Next.js 15.5.24 / App Router
- **Runtime:** React 18.3
- **Language:** TypeScript
- **Styling:** Tailwind CSS + `src/app/globals.css`
- **Motion:** native Web Animations API + scroll-driven DOM/CSS in `Mechanism.tsx`
- **Deployment:** Vercel
- **Analytics:** Vercel Analytics integration

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- npm 9 or later

### Installation

```bash
npm ci
```

### Development

```bash
npm run dev
```

Open `http://localhost:3000`.

### Validation

```bash
npm run typecheck
npm run lint
npm run build
npm run qa:browser
```

The browser QA requires Chrome/Chromium and validates the supported viewport matrix, first-viewport CTA visibility, responsive overflow, modal behavior, analytics events, reduced-motion behavior, and the Proof Engine scroll geometry.

## Landing Architecture

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

  components/
    analytics/
    contact/
    layout/
    sections/
      Hero.tsx
      ProofStrip.tsx
      ProblemSolution.tsx
      Mechanism.tsx
      Process.tsx
      Pricing.tsx
      ContentExamples.tsx
      Founder.tsx
      FAQ.tsx
      FinalCTA.tsx
    ui/

  config/
    site.ts

  lib/
    analytics.ts
    lead.ts
    lead-delivery.ts
    seo.ts

  middleware.ts
```

Current landing composition:

```text
Hero
→ ProofStrip
→ ProblemSolution
→ Mechanism
   ├─ RAW → FINAL
   └─ filmstrip workflow
→ Process
→ Pricing
→ ContentExamples
→ Founder
→ FAQ
→ FinalCTA
```

## Proof Engine

`src/components/sections/Mechanism.tsx` is the visual transformation engine.

It renders:

1. a RAW → FINAL worksite-material transformation;
2. a horizontal four-frame workflow;
3. desktop sticky/scroll choreography at `>= 1100px`;
4. direct mobile scrolling below the desktop breakpoint;
5. a static fallback when `prefers-reduced-motion: reduce`.

The homepage also uses:

- `ProofStrip.tsx` for immediate service facts;
- `ContentExamples.tsx` for conceptual content directions.

Reference imagery is not customer work and must remain explicitly labelled as concept/reference material.

## Commercial Source of Truth

Critical offer data is centralized in `src/config/site.ts`.

Current offer:

```text
CTA: VARAA 20 MIN KESKUSTELU
Offer: GHOULHOUSE SOME 12
Price: 490 € + ALV / 30 päivää
```

The obsolete `MANAGED` / `790 €` lifecycle must not reappear.

## Lead Delivery

`POST /api/leads` validates requests and delegates delivery through `src/lib/lead-delivery.ts`.

Supported production delivery modes:

- `LEAD_DELIVERY_MODE=resend`
- `LEAD_DELIVERY_MODE=webhook`

See `.env.example` for the required variables.

## SEO Launch Gate

Indexing is intentionally disabled by default.

- local development: noindex
- Vercel Preview: noindex
- non-canonical Vercel production aliases: noindex
- `www.ghoulhouse.fi`: exactly one permanent `301` redirect to `https://ghoulhouse.fi`
- `ghoulhouse.fi`: indexable only when **all** conditions are true:
  1. deployment environment is Vercel Production;
  2. request host is `ghoulhouse.fi`;
  3. `SITE_INDEXABLE=true`;
  4. an approved `NEXT_PUBLIC_PRIVACY_PATH` is configured.

Keep `SITE_INDEXABLE=false` until final domain cutover and privacy-page QA are complete.

## Production Release

Standard validation gates:

```bash
npm ci
npm audit --omit=dev --audit-level=high
npm run typecheck
npm run lint
npm run build
npm run qa:browser
```

Production releases must use an exact validated `main` commit.

The custom-domain migration is intentionally separate from application deployment. Do not modify DNS during a Vercel project cutover; move the existing project-domain assignments and validate apex/WWW routing before enabling indexing.

## Environment

Copy `.env.example` and configure only the values required for the current environment. Never commit production secrets.
