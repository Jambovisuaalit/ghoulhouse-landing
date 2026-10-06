# GhoulHouse public SEO baseline — 2026-10-06

This is a public-web baseline, not Google Search Console data.

## Technical indexability

Verified from production:

- 19 URLs in sitemap.xml.
- Every sitemap URL returned HTTP 200.
- Every sitemap URL returned index, follow.
- Every sitemap URL exposed a self-referencing canonical.
- Every sitemap URL had a distinct title and H1.
- robots.txt allows crawling and points to https://ghoulhouse.fi/sitemap.xml.

Conclusion: there is no obvious crawl/indexability blocker visible from the public production surface.

## Public search visibility sample

Search sampling did not surface ghoulhouse.fi prominently for these commercial intents:

- some sisällöntuotanto rakennusyritykselle
- some sisällöntuotanto LVI-yritykselle
- verkkosivut rakennusyritykselle
- verkkosivut LVI-yritykselle
- some sisällöntuotannon hinta
- työmaakuvat someen

This is not proof of Google ranking position. It is only a public search baseline.

## Competitive SERP evidence

Observed competitors/pages:

- Tauoton — https://www.tauoton.fi/verkkosivut-lvi-yritykselle
- WebFin LVI — https://www.webfin.fi/kotisivut-yritykselle/lvi-yritykselle
- WebFin construction — https://www.webfin.fi/kotisivut-yritykselle/rakennusyritykselle
- Tuuma Digital — https://tuuma.fi/verkkosivut-rakennusyritykselle
- Your Flow Creative — https://www.yourflow.fi/palvelut/some-ja-sisallontuotanto
- Mainostoimisto Taiga — https://www.mainostoimistotaiga.fi/some-sisallontuotanto/

Common competitive proof signals:
- real customer references
- industry-specific service pages
- visible price anchors
- clear CTA
- local/service-area relevance

## Brand/entity risk

The brand query GhoulHouse is ambiguous because a Swedish death metal band uses the same name and has substantial historical web authority.

Observed GhoulHouse Oy signals:
- Hanna Nyholm LinkedIn profile associates her with Ghoulhouse Oy.
- company registration aggregators mention Ghoulhouse Oy, Helsinki.
- ghoulhouse.fi production schema previously had empty sameAs arrays because social profile environment variables were not configured.

Action taken:
- keep organization social profiles separate from founder profiles
- link Hanna Nyholm Person schema to her verified public LinkedIn profile
- add organization PostalAddress, ContactPoint and Uusimaa areaServed schema

## Search Console baseline required

Once GSC access is available, capture:
1. indexed vs submitted URLs
2. top queries by impressions
3. top pages by impressions
4. query/page pairs with positions 5–20
5. CTR by query and page
6. cannibalization: same query across multiple landing pages
7. branded queries: GhoulHouse / GhoulHouse Oy / Hanna Nyholm
8. non-branded commercial queries by cluster
9. URL Inspection for all 19 sitemap URLs

Decision rule:
- do not create new location/service landing pages until GSC data shows demand or a verified local reference creates unique value.

## Next content priority

1. Publish the first real customer case with permission.
2. Link it from /referenssit and the relevant vertical/service page.
3. Add project-specific service, location, scope and images.
4. Re-run query/page baseline after indexing.
