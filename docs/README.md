# Website documentation — start here

Reviewed 20 October 2026 against main b59341e. This index selects the working
sources for the website; similarly named old master packs do not override them.

| Need | Working source |
| --- | --- |
| Current implementation, content, routes, release gates | [WEBSITE_BASELINE.md](WEBSITE_BASELINE.md) |
| Media selection, rights gaps, external master decisions | [RESOURCE_REGISTER.md](RESOURCE_REGISTER.md) |
| Exact asset hashes, status and rights evidence | [resources.json](resources.json) |
| Current visual tokens and layout principles | [EDITORIAL_ART_DIRECTION.md](EDITORIAL_ART_DIRECTION.md) |
| Search intent ownership (dated baseline) | [SEO_INTENT_MAP.md](SEO_INTENT_MAP.md) |
| Lead migration/recovery history | [LEGACY_LEAD_CLEANUP.md](LEGACY_LEAD_CLEANUP.md) |
| Cleanup decisions and remaining work | [RESOURCE_CLEANUP_2026-10-20.md](RESOURCE_CLEANUP_2026-10-20.md) |
| Font delivery experiment and repeated LCP method | [PERFORMANCE_2026-10-20.md](PERFORMANCE_2026-10-20.md) |

## Evidence, not current operating instructions

- [SEO_PUBLIC_BASELINE_2026-10-06.md](SEO_PUBLIC_BASELINE_2026-10-06.md): dated public search observations.
- [SEO_QA_2026-10-06.md](SEO_QA_2026-10-06.md): dated SEO review.
- [UI_UX_AUDIT_2026-10-16.md](UI_UX_AUDIT_2026-10-16.md): dated UI audit and QA evidence.
- [Launch checklist](../LAUNCH_CHECKLIST.md): historical launch sign-off, not today's acceptance result.
- [archive/HOMEPAGE_V2.md](archive/HOMEPAGE_V2.md) and
  [archive/REDESIGN_DIRECTION.md](archive/REDESIGN_DIRECTION.md): superseded design decisions.

Do not convert an unchecked rights or approval field into an approval without evidence.
Do not carry historical PASS results forward to a new commit. Update the relevant
working source in the same PR as the implementation; keep history clearly dated.
