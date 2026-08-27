# GhoulHouse Oy — official website

Production website source for **GhoulHouse Oy**.

- Production domain: `https://ghoulhouse.fi`
- Repository: `Jambovisuaalit/ghoulhouse-landing`
- Deployment target: GitHub `main` → Vercel → `ghoulhouse.fi`
- Framework: Next.js 15 App Router + TypeScript + Tailwind CSS

## Brand source of truth

The repository uses canonical red GhoulHouse assets from **Full Logo Pack v1.0 / 24 AUG 2026**:

- Ink `#111111`
- Signal Red `#C9282D`
- Ghost `#F7F4EF`
- Bone `#E6DFD5`

Official SVG logo assets live under `public/brand/`. Do not recreate or re-typeset the logo.

## Local setup

Requirements:

- Node.js 20.9+
- npm 10+

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Quality checks

Run the exact project scripts:

```bash
npm run lint
npm run typecheck
npm run build
```

Or all gates together:

```bash
npm run check
```

## Lead form integration

The frontend form posts to `POST /api/demo-request`.

The route is production-safe by default: if email delivery has not been configured it returns `503` instead of showing a false success state.

To activate email delivery, configure these Vercel environment variables:

```text
RESEND_API_KEY=...
LEAD_TO_EMAIL=...
LEAD_FROM_EMAIL=...
```

`LEAD_FROM_EMAIL` must be a sender address/domain verified in Resend. No credentials belong in Git.

The route contains basic validation, a honeypot field and a minimum-submit-time check. For higher-volume traffic, add rate limiting at the edge or via a dedicated store.

## Content rules

- Primary CTA: **PYYDÄ 2 SISÄLTÖESIMERKKIÄ**
- START: **490 € + ALV / 30 days**, service periods 1–3
- MANAGED: **790 € + ALV / 30 days**, from service period 4
- No guaranteed leads, sales, reach, followers, revenue or conversion claims
- Any non-client demonstration must state **KONSEPTIESIMERKKI — EI ASIAKASTYÖ.**

## SEO

Implemented in App Router:

- metadata title + description
- canonical URL
- Open Graph / Twitter image
- SVG favicon + web manifest
- `robots.txt`
- `sitemap.xml`
- Organization JSON-LD

## Deployment

1. Merge approved work to `main`.
2. Vercel should build from `Jambovisuaalit/ghoulhouse-landing`.
3. Configure required lead form environment variables before public launch.
4. Run production smoke tests on desktop and mobile.
5. Point/verify `ghoulhouse.fi` only after the deployment is green.

## Responsive QA matrix

Verify at minimum:

`320 / 375 / 390 / 430 / 768 / 1024 / 1280 / 1440 / 1920 px`

Check horizontal overflow, header/menu, hero, mechanism cards, examples, pricing, FAQ, form and footer.


## Art direction

The production visual system is intentionally editorial rather than template-driven:

- Ink/Ghost/Bone form the large compositional fields; Signal Red is reserved for high-information accents and conversion.
- Preserve the RAW → GHOULHOUSE → READY cinematic mechanism.
- Prefer editorial ledgers, proof sheets, registers and asymmetric composition over repeated card grids.
- Avoid decorative gradients, glass effects, excessive rounding and generic SaaS patterns.
- Mobile keeps the hierarchy and tension but removes offsets that impair reading or interaction.
