# 🚀 GhoulHouse Landing: Launch Checklist

**Status:** Ready for production deployment  
**Last Updated:** 2026-09-03  
**Target:** `ghoulhouse.fi` (apex domain)

---

## 📋 Pre-Launch Critical Path (Must Complete Before DNS Cutover)

### ✅ Code Deployment (COMPLETE)

- [x] **Fix 308 Redirect Status** - Changed middleware.ts line 18 from `301` to `308`
- [x] **Create GDPR Privacy Page** - Added `/tietosuoja` with complete compliance disclosures
- [x] **Commit deployed** - Commit: `05b78feace9f56de1d90e5325de3db219a85c41e`

### ⏳ Vercel Configuration (Must Complete)

#### 1. **Connect GitHub Repository to Vercel Project**
- [ ] Link `Jambovisuaalit/ghoulhouse-landing` → `ghoulhouse-oy`
- [ ] Verify Vercel Project ID: `prj_Xf2QTX7hkMQhdhGdcyQyMTv78weK`
- [ ] Confirm Preview deployment is running latest main commit

#### 2. **Configure Production Environment Variables**

Set these in **Vercel Production Environment Variables** (not Preview):

```env
# Lead Delivery - Choose ONE mode:
LEAD_DELIVERY_MODE=resend
RESEND_API_KEY=<your-resend-api-key>
LEAD_TO_EMAIL=hello@ghoulhouse.fi
LEAD_FROM_EMAIL=noreply@ghoulhouse.fi

# OR for webhook mode:
# LEAD_DELIVERY_MODE=webhook
# LEAD_WEBHOOK_URL=https://your-webhook-endpoint.com
# LEAD_WEBHOOK_TOKEN=<optional-bearer-token>

# Privacy & Indexing Gate
NEXT_PUBLIC_PRIVACY_PATH=/tietosuoja
SITE_INDEXABLE=true

# Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED=true

# Security
CSP_ENFORCE=true
```

#### 3. **Enable Vercel Web Analytics**
- [ ] Go to Vercel Project Settings → Analytics
- [ ] Enable Web Analytics
- [ ] Verify `/_vercel/insights/script.js` returns 200 OK

#### 4. **Attach Custom Domains**
- [ ] Add `ghoulhouse.fi` (apex) to `ghoulhouse-oy` project
- [ ] Add `www.ghoulhouse.fi` as alias
- [ ] **DO NOT change DNS yet** — verify Vercel assignment first

#### 5. **Test Lead Delivery E2E**
- [ ] Submit test lead from production Preview
- [ ] Verify lead arrives at `hello@ghoulhouse.fi`
- [ ] Test both form variants (desktop/mobile)
- [ ] Check error handling with rate-limit test

#### 6. **Verify Redirects**
- [ ] Test: `https://www.ghoulhouse.fi` → `https://ghoulhouse.fi` (308 response)
- [ ] Confirm apex responds with 200 OK
- [ ] Check `X-Robots-Tag` header (should be `noindex` until SITE_INDEXABLE=true)

#### 7. **Robots & Sitemap QA**
- [ ] Visit `/robots.txt` → Should show `Disallow: /` (prelaunch state)
- [ ] Visit `/sitemap.xml` → Should be empty `<urlset/>`
- [ ] After SITE_INDEXABLE flip: robots should show `Allow: /`

#### 8. **Visual & Accessibility QA (Production Preview)**
- [ ] Test all viewports: 390px, 768px, 1440px+
- [ ] Verify no horizontal overflow
- [ ] Check CTA buttons ≥ 44×44 px
- [ ] Test keyboard navigation
- [ ] Test with `prefers-reduced-motion: reduce`
- [ ] Verify OG image renders on social shares

---

## 🌐 DNS Cutover (Only After All Above Pass)

### Prerequisites Checklist
- [ ] Custom domains assigned to `ghoulhouse-oy` in Vercel
- [ ] Preview deployment fully green
- [ ] Lead delivery tested end-to-end
- [ ] Apex & www redirect verified
- [ ] All Vercel env vars set

### DNS Update Instructions

**Current DNS Target:** (old Vercel project or staging)  
**New DNS Target:** Vercel Production (`ghoulhouse-oy`)

**Step 1: Update A Record (Apex)**
```
Domain:  ghoulhouse.fi
Type:    A
Value:   76.76.21.21  (Vercel Production IP)
TTL:     3600
```

**Step 2: Update CNAME Record (www)**
```
Domain:  www.ghoulhouse.fi
Type:    CNAME
Value:   cname.vercel-dns.com.
TTL:     3600
```

**OR** verify Vercel-assigned nameservers if using Vercel DNS management.

### Post-DNS Cutover Verification (30 min after DNS propagation)

- [ ] `curl -I https://ghoulhouse.fi` → HTTP 200
- [ ] `curl -I https://www.ghoulhouse.fi` → HTTP 308 to apex
- [ ] `dig ghoulhouse.fi` resolves to `76.76.21.21`
- [ ] SSL certificate valid (no warnings)
- [ ] `X-Robots-Tag` header is absent (indexing approved)
- [ ] robots.txt shows `Allow: /`
- [ ] sitemap.xml contains `/` and `/tietosuoja`

---

## 📱 Launch Day Timeline

### Morning (Before Cutover)
- [ ] **Jami:** Final Preview QA (all devices, all browsers)
- [ ] **Hanna:** Content & visual spot-check
- [ ] **Jami:** Verify all Vercel settings locked
- [ ] **Jami:** Tag release: `git tag -a v1.0.0-release -m "Production launch"`

### Afternoon (DNS Cutover)
- [ ] **Jami:** Update DNS A/CNAME records
- [ ] **Jami:** Wait 5-10 min for propagation
- [ ] **Jami:** Verify production apex (200 OK)
- [ ] **Hanna:** Test booking CTA link works
- [ ] **Hanna:** Submit test lead → confirm inbox receipt
- [ ] **Jami:** Verify SSL certificate valid
- [ ] **Jami:** Check Vercel error logs (should be clean)

### Post-Launch (Next 24 Hours)
- [ ] Monitor Vercel Analytics for traffic spike
- [ ] Check Google Search Console for crawl errors
- [ ] Verify Plausible Analytics events firing
- [ ] Monitor error logs hourly
- [ ] Spot-check booking flow on multiple devices

---

## 🔄 Post-Launch Monitoring (Week 1)

### Daily Checklist
- [ ] Check Vercel error logs
- [ ] Monitor Core Web Vitals (LCP < 2.5s, CLS = 0, INP < 200ms)
- [ ] Monitor bounce rate and session duration
- [ ] Verify CTA click events in Plausible

### Weekly Metrics
- [ ] Total visits
- [ ] Top landing pages
- [ ] Conversion funnel (CTA clicks → leads → bookings)
- [ ] Mobile vs desktop split
- [ ] Geographic breakdown

### SEO Monitoring
- [ ] Google Search Console: Check for indexing errors
- [ ] Bing Webmaster Tools: Submit sitemap
- [ ] Monitor organic search impressions (take 2-4 weeks to appear)

---

## 🚨 Rollback Plan (If Critical Issue Found)

### Immediate Rollback (< 5 min)
1. **Revert DNS A record** to previous IP
2. **Revert Vercel domain assignment** to previous project
3. Verify traffic back on old system

### Investigation
1. Review Vercel build logs
2. Check error logs for runtime issues
3. Test on local production build: `npm run build && npm start`

### Rollback PR
If code issue found, create `feature/hotfix-*` PR and merge after quick review.

---

## 📞 Contacts & Resources

**Jami (Tech Lead)**
- DNS updates
- Vercel configuration
- SSL certificates
- Error logs & monitoring

**Hanna (Product Lead)**
- Visual QA
- Content verification
- Booking flow testing
- User feedback

**Critical Contact for Issues:**
- Email: hello@ghoulhouse.fi
- Vercel Support: https://vercel.com/support

---

## ✅ Final Sign-Off

```
Codebase Ready:    ✅ Yes
Vercel Configured: ⏳ Awaiting completion
DNS Ready:         ⏳ Awaiting completion
QA Complete:       ⏳ Awaiting completion

Approved by:  ________________  Date: __________
Deployed by:  ________________  Date: __________
```

---

## 📚 Reference Links

- **Repository:** https://github.com/Jambovisuaalit/ghoulhouse-landing
- **Vercel Project:** `ghoulhouse-oy`
- **Production URL:** https://ghoulhouse.fi
- **Privacy Page:** https://ghoulhouse.fi/tietosuoja (post-launch)
- **Plausible Dashboard:** [link to setup]
- **Google Search Console:** [link to verify ownership]
