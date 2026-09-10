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
- [x] Plausible integration and CSP allow-list implemented
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
- [x] privacy page reflects Vercel + Supabase + Resend + Plausible architecture
- [x] canonical homepage metadata is `index, follow`
- [x] no `X-Robots-Tag: noindex` on canonical homepage
- [x] robots allows crawling
- [x] sitemap is live
- [x] privacy page contains current address `Maasälväntie 2 A 3`

## 7. Analytics

- [x] Plausible component implemented
- [x] CSP allows Plausible endpoints
- [ ] exact Plausible account-side production script configured
- [ ] pageview verified in Plausible dashboard
- [ ] CTA custom event verified in Plausible dashboard

Plausible is intentionally non-blocking for site availability and lead capture. Do not invent a tracker URL; activate only with the exact account-provided production script.

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
Plausible dashboard:  PENDING — non-blocking
Persistent Git link:  VERIFY — maintenance item
```
