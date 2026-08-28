# GhoulHouse Oy Landing Page

Official website for GhoulHouse Oy — productized social media management for Finnish local service businesses.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### Build & Deployment

```bash
npm run typecheck
npm run lint
npm run build
npm start
```

## Project Structure

src/
├── app/
├── components/
├── lib/
└── public/

## Vercel Deployment

Canonical domain: **ghoulhouse.fi**


## SEO Launch Gate

Canonical production domain: **https://ghoulhouse.fi**

Indexing is intentionally disabled by default.

- Local development: noindex
- Vercel Preview deployments: noindex
- `www.ghoulhouse.fi`: exactly one permanent `301` redirect to `https://ghoulhouse.fi`
- Vercel production aliases: protected with `X-Robots-Tag: noindex`
- `ghoulhouse.fi`: indexable only when all of the following are true:
  1. deployment environment is Vercel Production
  2. request host is `ghoulhouse.fi`
  3. `SITE_INDEXABLE=true`

Keep `SITE_INDEXABLE=false` or unset until final production QA is complete. After QA, set `SITE_INDEXABLE=true` only for the Vercel Production environment and redeploy.
