# Legacy lead ingest cleanup — issue #109

## Scope

Remove only `public.submit_ghoulhouse_lead`, `_v2`, `_v3` and
`private.lead_rate_limits`. The latter contains obsolete short-lived IP counters,
not customer leads. Keep v4, `private.lead_rate_buckets`, `public.leads`, Resend
event handling, the notification trigger and reconciliation cron unchanged.

The migration refuses to run without backend-only v4, if another routine or
active cron references the legacy names, or if a legacy counter is less than ten
minutes old. Exact signatures and `RESTRICT` prevent cascading deletion. All
drops are atomic, including when an unexpected overload or view blocks cleanup.

## Validation and rollout

1. Run `node --test tests/*.test.mjs`, typecheck and lint. The PGlite integration
   tests execute the actual cleanup and v4 SQL on isolated PostgreSQL fixtures.
   They cover successful/repeated application, retained v4 inserts, anonymous
   rejection, recent usage, routine/cron/view dependencies, missing v4 buckets,
   public v4 execution and unexpected overload rollback.
2. Require CI `validate` and the exact PR-head Vercel preview to pass before merge.
3. Recheck live legacy dependencies/activity and apply the migration through
   Supabase. Record the actual production migration version returned by Supabase;
   its generated timestamp may differ from the local CLI filename.
4. Run `supabase/tests/legacy_lead_cleanup_smoke.sql` as the database administrator.
   The test checks v4 inserts, notification queueing, rate limits and phone-only
   contact, then rolls back every synthetic row and queued HTTP request. Sequence
   values may advance. It does not test fresh external email delivery.
5. Verify `https://ghoulhouse.fi/api/health/lead-storage` returns 200, function
   definitions/permissions are unchanged, the cron succeeds, and Security Advisor
   no longer identifies the removed table. Existing signed delivery events prove
   historical delivery only; do not describe them as a new end-to-end email test.

## Recovery

Do not restore anonymous legacy RPC access or roll the app back to v3. If the
migration aborts, its atomic block preserves the pre-migration objects. Investigate
the named dependency or recent caller and rerun after resolution. The unchanged
v4 application remains the supported path after successful cleanup.

## Branch protection (#104)

The connected GitHub integration cannot write repository administration settings.
The repository owner must create an active rule for `main`: require pull requests,
require the `validate` CI check, require an up-to-date branch, block force pushes
and deletions, and avoid an ordinary bypass for direct pushes. Confirm with a
deliberately failing test PR that merge is blocked. Until that check is enforced,
manual green-CI verification remains necessary for every merge.
