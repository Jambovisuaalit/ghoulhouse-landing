# GhoulHouse Launch Checklist

**Canonical:** `https://ghoulhouse.fi`  
**Source:** `Jambovisuaalit/ghoulhouse-landing` / `main`  
**Active Vercel project:** `ghoulhouse-home`  
**Launch date:** 10.9.2026

## 1. Code and brand

- [x] Company master data uses `Maasälväntie 2 A 3`
- [x] Canonical message: `TYÖMAAKUVAT SISÄÄN. VALMIS SOME ULOS.`
- [x] Offer: `490 € + ALV / 30 päivää`
- [x] No continuation commitment
- [x] `www.ghoulhouse.fi` application redirect uses 308
- [x] `/tietosuoja` exists
- [x] Horizontal logos are path-only SVG artwork
- [x] Internal staging copy removed
- [x] Footer contact anchor targets `#laheta-kuvat`
- [x] Vercel Analytics removed
- [x] Google Analytics 4 integration and CSP allow-list implemented
- [x] GA4 Measurement ID is `G-43VQ8505YL`
- [x] Node.js pinned to `24.x`

## 2. Trust assets

- [ ] Add verified Hanna Nyholm founder portrait
- [ ] Replace concept RAW → VALMIS material with verified customer-approved real worksite material when available
- [x] Current concept material is explicitly labelled `KONSEPTIESIMERKKI — EI ASIAKASTYÖ`
- [x] No generated/stock material is presented as customer proof

## 3. CI and responsive/accessibility QA

- [x] exact release source passes typecheck
- [x] lint passes
- [x] production build passes
- [x] dependency audit has no high production vulnerabilities
- [x] 390 px viewport QA passes
- [x] 768 px viewport QA passes
- [x] 1440 px viewport QA passes
- [x] no horizontal overflow
- [x] CTA targets meet minimum touch size
- [x] keyboard/focus QA passes
- [x] reduced-motion QA passes
- [x] no-JavaScript form QA passes
- [x] OG image QA passes

## 4. Lead pipeline

Production flow:

```text
Browser
→ POST /api/leads
→ Supabase RPC submit_ghoulhouse_lead
→ public.leads
→ database notification trigger
→ Resend
→ hello@ghoulhouse.fi
```

- [x] Supabase lead table created with RLS enabled
- [x] anonymous clients cannot read/update/delete lead rows
- [x] restricted public submit RPC enabled
- [x] lead rate limiting enabled
- [x] restricted Resend key stored in Supabase Vault
- [x] live production POST returns HTTP 201
- [x] test lead stored successfully
- [x] Resend API returned success
- [x] production notification delivered to `hello@ghoulhouse.fi`
- [x] QA lead rows removed after verification

## 5. Vercel and domains

- [x] active project is `ghoulhouse-home`
- [x] Node.js runtime is `24.x`
- [x] production deployment READY
- [x] `ghoulhouse.fi` attached to active deployment
- [x] `www.ghoulhouse.fi` attached to active deployment
- [x] apex returns HTTP 200
- [x] www resolves to canonical apex
- [x] canonical metadata points to `https://ghoulhouse.fi`
- [x] production runtime error scan clean after launch

**Maintenance note:** the release was deployed from the validated canonical GitHub commit through a direct Vercel production deployment. Confirm/repair the persistent Vercel Git integration to `Jambovisuaalit/ghoulhouse-landing` before relying on automatic future push deployments.

## 6. Security, privacy and SEO

- [x] production CSP is enforced
- [x] `X-Content-Type-Options: nosniff`
- [x] `Cross-Origin-Opener-Policy: same-origin`
- [x] `X-Frame-Options: DENY`
- [x] privacy page reflects Vercel + Supabase + Resend + Google Analytics 4 architecture
- [x] canonical homepage metadata is `index, follow`
- [x] no `X-Robots-Tag: noindex` on canonical homepage
- [x] robots allows crawling
- [x] sitemap is live
- [x] privacy page contains current address `Maasälväntie 2 A 3`

## 7. Analytics

- [x] Google tag component implemented
- [x] Measurement ID pinned to `G-43VQ8505YL`
- [x] CSP allows Google Tag Manager and Google Analytics collection endpoints
- [x] funnel events contain no user-entered lead fields
- [ ] pageview verified at runtime
- [ ] primary CTA event verified at runtime
- [ ] content_example_view verified at runtime
- [ ] lead_form_start / submit / success / error verified at runtime

Do not reintroduce Plausible or Vercel Analytics into the runtime stack.

## Final sign-off

```text
Code/CI:              PASS
Responsive/A11y:      PASS
Production deploy:    PASS
Domains:              PASS
Lead delivery E2E:    PASS
Security/privacy/SEO: PASS
Runtime errors:       CLEAN
Verified trust media: PENDING — non-blocking
GA4 runtime events:   PENDING — release gate for analytics patch
Persistent Git link:  VERIFY — maintenance item
```
