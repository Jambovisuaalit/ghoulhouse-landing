# GhoulHouse website

## Start here

The current implementation and resource decisions are indexed in [docs/README.md](docs/README.md).
Read [the website baseline](docs/WEBSITE_BASELINE.md) before changing content or UI and
[the resource register](docs/RESOURCE_REGISTER.md) before selecting or replacing media.
Historical documents live in docs/archive; they are not current implementation instructions.

- Source: Jambovisuaalit/ghoulhouse-landing, main.
- Canonical production: https://ghoulhouse.fi, Vercel project ghoulhouse-home.
- Stack: Next.js 15 App Router, React 18, TypeScript, Node.js 24.x, Tailwind and local CSS.
- Typography: locally bundled Montserrat (SIL OFL); Georgia/Times New Roman display headings.
- Brand: Ink #111111, Signal Red #C9282D, Ghost #F7F4EF, Bone #E6DFD5.
- Message: TYÖMAAKUVAT SISÄÄN. VALMIS SOME ULOS.
- Offer: 12 contents / 30 days / 490 € + ALV; continuation agreed separately.

## Development and validation

```bash
npm ci
npm run dev
```

Before release:

```bash
npm run qa:resources
node --test tests/*.test.mjs
npm run typecheck
npm run lint
npm run build
```

CI also checks the production build in a browser, accessibility, no-JavaScript behavior
and the matching Vercel Preview SHA. npm run qa:browser / qa:no-js require a running
server; see the scripts and CI workflow for environment requirements.

## Runtime structure

- src/app/page.tsx: current homepage, own header, services, concepts, own-work proof,
  process, industry/guide links, Hanna and contact.
- src/app/layout.tsx: local font, metadata/schema, SiteChrome, consent/analytics and WhatsApp.
- src/components/SiteChrome.tsx: shared inner-page header/footer.
- src/components/LeadForm.tsx: Social/photo examples and service-specific proposals.
- src/components/seo/SeoLandingPage.tsx + src/data/seo-cluster.ts: Social/SEO content pages.
- src/components/website/WebsiteLandingPage.tsx + src/data/website.ts: website service pages.
- src/data/site-navigation.ts: shared navigation and inquiry destinations.
- src/config/site.ts: company facts, offer and legal paths.
- src/lib: validation, storage, CTA context, analytics and SEO.
- public: registered media; docs/resources.json records every asset and font.
- supabase: ordered migrations, two Edge Functions and an isolated SQL smoke test.

CSS: layout imports eight shared files; the homepage adds homepage.css,
homepage-swiss.css and editorial-home.css. proof.css styles the own-work pages.
See the baseline for the authoritative file list. Preserve cascade order.

## Media and proof policy

Current header/footer logos: public/ghoulhouse-logo.svg and ghoulhouse-logo-reverse.svg.
Mobile lockup: favicon.svg + ghoulhouse-wordmark-black.svg. Font licensing is in
src/app/fonts/OFL.txt. No logo asset depends on an external runtime font.

worksite-concept-v3.webp and bathroom-concept-v2.webp are visual concepts, not customer
work. Keep their disclosures. ghoulhouse-site-proof.png documents an earlier version
of our own website, not a customer case or current screenshot. The Hanna portrait is
used on the homepage; its separate rights/approval evidence remains unverified in
the resource register. Do not infer reuse permission from a file being in production.

## Deployment provenance

The 20 October 2026 inventory verified production b59341e and deployment
dpl_6yqbdSkgA8WFCJDyoqK2UdVVFJ1M as READY with ghoulhouse.fi aliases and this repository's
metadata. This is a dated observation, not a claim about future releases. Historical
notes mention a stale private clone; verify the project Git connection and exact SHA
on every release. Never deploy from a similarly named old repository.

## Lead delivery

`POST /api/leads` validates the request, derives a SHA-256 rate key from Vercel's trusted client-IP header, and calls the `ghoulhouse-lead-ingest` Supabase Edge Function with Vercel's signed OIDC workload token. The Edge Function verifies the Vercel team/project/environment identity before calling backend-only RPC `submit_ghoulhouse_lead_v4`.

`v4` is the trusted backend ingest boundary and is executable only by the backend role. `anon` has no direct `SELECT`/`INSERT` access to `public.leads` or the private distributed rate-limit bucket. The database applies a transaction advisory lock plus a 5 submissions / 10 minutes rate limit keyed by the server-derived client hash, so separate Vercel instances share one authoritative limiter and concurrent requests cannot race around it. The legacy cleanup migration removes v1-v3 RPCs and their obsolete `private.lead_rate_limits` table after checking dependencies and recent activity. The active `private.lead_rate_buckets` table and stored leads are retained. See [legacy cleanup verification](docs/LEGACY_LEAD_CLEANUP.md).

The database stores the lead and queues an immutable notification in `private.lead_notification_outbox`. The existing minutely reconciliation job sends through Resend with a restricted API key in Vault. New sends use a stable idempotency key and at most four total attempts, with exponential backoff for 429, 5xx and transport failures. Retries stop before the 24-hour idempotency window expires. Permanent failures are recorded in `private.lead_notification_alerts`; pre-cutover leads are never re-enqueued. Resend delivery events are verified with Svix signatures by the `ghoulhouse-resend-events` Edge Function and reconciled back to the originating lead. Production does not require a Supabase service-role key, database password, JWT secret or Resend API key in the browser bundle.

`/api/health/lead-storage` now calls a backend-only read-only readiness RPC. It checks the lead tables, ingest function permission, notification trigger, Vault configuration, active cron, unresolved notification failures and stalled queue items. The `Production lead health` GitHub workflow checks the canonical production URL every 15 minutes and fails after three unsuccessful probes. Configure GitHub Actions notifications for the responsible maintainer. GitHub schedules may run late; this is operational monitoring, not an uptime SLA.

On a notification failure, inspect the private outbox and alert, then correct configuration or payload before manually retrying. Do not re-enqueue an accepted email or retry an uncertain send after its idempotency window. A verified `sent`/`delivered` webhook resolves the corresponding alert automatically.

Production flow:

```text
Browser
→ POST /api/leads
→ Vercel OIDC-authenticated Supabase Edge Function
→ backend-only RPC submit_ghoulhouse_lead_v4
→ public.leads
→ database notification trigger
→ Resend
→ signed Resend delivery webhook
→ lead delivery state reconciliation
→ hanna@ghoulhouse.fi
```

## Google Analytics 4

The site uses the approved public GA4 Measurement ID `G-43VQ8505YL` through the Google tag. Funnel events are routed through `src/lib/analytics.ts`; user-entered lead fields are not passed as analytics event properties.

The tag loads only after consent. Withdrawal updates Google consent and immediately sets the property-specific `ga-disable` flag, including if the external script is still loading. Storage failures keep measurement disabled. Pricing and content-example visibility use explicit `data-analytics-section` targets and begin only once analytics is ready with consent.

The runtime CSP allows only the Google Tag Manager script origin and the Google Analytics collection origins required by this integration. Plausible and Vercel Analytics are not part of the runtime stack.

## SEO and canonical routing

- `ghoulhouse.fi` is canonical.
- `www.ghoulhouse.fi` redirects permanently to apex with **308** at application level.
- Preview and non-production deployments remain `noindex`.
- Vercel Production serves canonical metadata as `index, follow`.
- `robots.txt` allows production crawling and `sitemap.xml` exposes approved canonical URLs.
- `/tietosuoja` remains explicitly `noindex` in page metadata.

## Lead retry protection

The backend requires an explicit supported service; photo examples accept only Social.
Migration `20261016184511_lead_validation_deduplication.sql` updates the existing v4
RPC without changing its signature or the Edge Function. Apply it before releasing
the frontend validation change. Identical normalized lead payloads return the original
lead ID for 24 hours, independent of client IP. A transaction advisory lock serializes
matching submissions; the fingerprint, lead and notification trigger commit together.
Duplicates do not consume another rate-limit slot or queue another notification.
Changing any normalized business field creates a new inquiry. Expired fingerprints
are removed on subsequent successful new submissions; original leads are retained.
The private table stores a SHA-256 fingerprint, lead ID and expiry, with RLS enabled
and no direct access for browser or backend API roles. The existing backend-only
SECURITY DEFINER RPC owns the write boundary. No historical leads are backfilled.

Verify with `node --test tests/*.test.mjs`, `npm run typecheck`, `npm run lint`,
`node scripts/lead-profile-qa.mjs` and `npm run build`. The isolated database test
checks retries, changed content, expiry, rollback, permissions and notification counts;
its embedded connection queues calls, so a real multi-connection production smoke
test remains a release check.

Notification recipient updated to user-confirmed `hanna@ghoulhouse.fi` by migration
`20261016185140_lead_notification_recipient.sql`. Existing outbox payloads retain
their original recipients. Tablet/mobile WhatsApp uses its accessible icon button
to avoid covering the center of service CTAs.
