# GhoulHouse Launch Checklist

**Canonical:** `https://ghoulhouse.fi`  
**Source:** `Jambovisuaalit/ghoulhouse-landing` / `main`  
**Target Vercel project:** `ghoulhouse-oy`  
**Indexing gate:** `SITE_INDEXABLE=false` until every production gate below passes.

## 1. Code and brand

- [x] Company master data uses `Maasälväntie 2 A 3`
- [x] Canonical message: `TYÖMAAKUVAT SISÄÄN. VALMIS SOME ULOS.`
- [x] Offer: `490 € + ALV / 30 päivää`
- [x] No continuation commitment
- [x] `www.ghoulhouse.fi` application redirect uses 308
- [x] `/tietosuoja` exists and is excluded from middleware redirect/index header matcher
- [x] `opengraph-image` and `icon` are excluded from middleware matcher
- [x] White and dark horizontal logos are path-only SVG artwork
- [x] Internal V2/staging copy removed from customer-facing sections
- [x] Footer contact anchor targets `#laheta-kuvat`
- [x] Vercel Analytics removed from runtime source
- [x] Plausible integration and CSP allow-list implemented
- [x] obsolete one-off deployment/migration workflows removed
- [x] dead proof data and unused public concept assets removed

## 2. Trust assets

- [ ] Add a verified Hanna Nyholm founder portrait as a local asset and set `NEXT_PUBLIC_FOUNDER_IMAGE`
- [ ] Replace the concept RAW → VALMIS image with verified, publication-approved real worksite material when available
- [x] Until verified material exists, concept imagery is explicitly labelled `KONSEPTIESIMERKKI — EI ASIAKASTYÖ`
- [x] Do not use stock/generated material as customer proof

## 3. CI and visual/accessibility QA

Run on the exact release commit:

```bash
npm ci
npm audit --omit=dev --audit-level=high
npm run typecheck
npm run lint
npm run build
npm run qa:browser
```

CI additionally verifies launch visual/accessibility and no-JavaScript behavior.

Required:

- [ ] final CI run green after the latest design/code cleanup
- [ ] 390 px: no horizontal overflow
- [ ] 768 px: no horizontal overflow
- [ ] 1440 px+: no horizontal overflow
- [ ] all CTA targets at least 44×44 px
- [ ] logical keyboard tab order
- [ ] visible Signal focus ring
- [ ] `prefers-reduced-motion: reduce` removes animations/transitions
- [ ] OG image renders correctly

## 4. Production environment

Set in **Production only** unless explicitly required elsewhere:

```env
LEAD_DELIVERY_MODE=resend
RESEND_API_KEY=<secret>
LEAD_TO_EMAIL=hello@ghoulhouse.fi
LEAD_FROM_EMAIL=noreply@ghoulhouse.fi
NEXT_PUBLIC_PRIVACY_PATH=/tietosuoja
NEXT_PUBLIC_PLAUSIBLE_SCRIPT_SRC=<exact Plausible site-specific script URL>
CSP_ENFORCE=true
SITE_INDEXABLE=false
```

- [ ] Resend API key configured as a secret
- [ ] lead delivery variables configured
- [ ] exact Plausible site-specific script URL configured
- [ ] CSP enforcement verified in production
- [ ] `SITE_INDEXABLE=false` confirmed before cutover

## 5. Vercel project and custom domains

- [ ] `Jambovisuaalit/ghoulhouse-landing` connected to `ghoulhouse-oy`
- [ ] Production Branch = `main`
- [ ] latest validated `main` commit deployed to `ghoulhouse-oy`
- [ ] `ghoulhouse.fi` attached to `ghoulhouse-oy`
- [ ] `www.ghoulhouse.fi` attached to `ghoulhouse-oy`
- [ ] apex domain reports valid configuration
- [ ] www domain reports valid configuration
- [ ] apex returns HTTP 200
- [ ] www returns HTTP 308 to apex

**Do not change registrar DNS as part of the code/deploy step.** DNS cutover is a separate controlled operation.

## 6. Analytics and lead delivery E2E

- [ ] Plausible tracker request succeeds on production
- [ ] pageview appears in Plausible
- [ ] primary CTA custom event appears in Plausible
- [ ] pricing/content-view events appear in Plausible
- [ ] valid lead POST returns success
- [ ] test lead arrives at `hello@ghoulhouse.fi`
- [ ] missing lead-delivery configuration returns controlled JSON error, not an unhandled 500

## 7. Security, privacy and SEO

Before indexing:

- [ ] production CSP header is enforced and contains only required sources
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `Cross-Origin-Opener-Policy: same-origin`
- [ ] privacy page content matches the active technical stack
- [ ] while `SITE_INDEXABLE=false`, `X-Robots-Tag` is noindex
- [ ] while `SITE_INDEXABLE=false`, robots disallows crawling and sitemap exposes no indexable URLs

Final index flip only after all launch gates pass:

```env
SITE_INDEXABLE=true
```

After the flip:

- [ ] apex remains HTTP 200
- [ ] www remains a single 308 redirect to apex
- [ ] noindex header is absent on canonical production pages
- [ ] robots allows crawling
- [ ] sitemap contains approved canonical pages
- [ ] canonical metadata points to `https://ghoulhouse.fi`

## Final sign-off

```text
Code/CI:             [ ] PASS
Visual/A11y:         [ ] PASS
Verified trust media:[ ] PASS or explicitly accepted concept fallback
Lead delivery:       [ ] PASS
Plausible:           [ ] PASS
Vercel domains:      [ ] PASS
Security/privacy:    [ ] PASS
DNS cutover:         [ ] separate approved action
Indexing:            [ ] enable only after all above
```
