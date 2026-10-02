revoke all on function public.submit_ghoulhouse_lead_v3(
  text,text,text,text,text,text,text,text,text,text,boolean
) from public, anon, authenticated;

comment on function public.submit_ghoulhouse_lead_v3(
  text,text,text,text,text,text,text,text,text,text,boolean
) is 'Retired legacy GhoulHouse lead ingest RPC. Anonymous execution is disabled after the verified v4 OIDC cutover.';
