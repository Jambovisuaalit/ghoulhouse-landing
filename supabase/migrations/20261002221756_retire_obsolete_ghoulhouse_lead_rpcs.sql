-- Retire obsolete public lead-ingest RPC versions.
-- The canonical production application uses submit_ghoulhouse_lead_v3.
revoke all on function public.submit_ghoulhouse_lead(
  text,text,text,text,text,text,text,text,text
) from public, anon, authenticated;

revoke all on function public.submit_ghoulhouse_lead_v2(
  text,text,text,text,text,text,text,text,text,text,boolean
) from public, anon, authenticated;

comment on function public.submit_ghoulhouse_lead_v3(
  text,text,text,text,text,text,text,text,text,text,boolean
) is 'Intentional anonymous ingest-only endpoint for GhoulHouse lead submissions. Input validation, RLS isolation and rate limiting are enforced inside the function.';
