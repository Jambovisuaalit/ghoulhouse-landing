-- Issue #109: retire only the superseded v1-v3 ingest and its IP counters.
-- One atomic block: any failed prerequisite or unexpected dependency rolls back
-- every DROP. RESTRICT deliberately refuses to remove dependent objects.
do $cleanup$
declare
  v4 oid := to_regprocedure('public.submit_ghoulhouse_lead_v4(text,text,text,text,text,text,text,text,text,text,text,boolean)');
  legacy_names text[] := array['submit_ghoulhouse_lead', 'submit_ghoulhouse_lead_v2', 'submit_ghoulhouse_lead_v3'];
  legacy_pattern text := '\m(lead_rate_limits|submit_ghoulhouse_lead|submit_ghoulhouse_lead_v2|submit_ghoulhouse_lead_v3)\M';
begin
  perform set_config('lock_timeout', '3s', true);
  perform set_config('statement_timeout', '15s', true);

  if v4 is null or to_regclass('private.lead_rate_buckets') is null then
    raise exception 'Trusted v4 ingest must exist before legacy cleanup';
  end if;
  if has_function_privilege('anon', v4, 'EXECUTE')
     or has_function_privilege('authenticated', v4, 'EXECUTE')
     or not has_function_privilege('service_role', v4, 'EXECUTE') then
    raise exception 'Trusted v4 ingest privileges are not backend-only';
  end if;

  -- PostgreSQL does not track table/function references inside PL/pgSQL bodies.
  -- Inspect application routines as well as catalog dependencies via RESTRICT.
  if exists (
    select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname not in ('pg_catalog', 'information_schema')
      and not (n.nspname = 'public' and p.proname = any(legacy_names))
      and p.prosrc ~ legacy_pattern
  ) then
    raise exception 'A non-legacy routine still references retired lead ingest';
  end if;
  if exists (select 1 from cron.job where active and command ~ legacy_pattern) then
    raise exception 'An active cron job still references retired lead ingest';
  end if;

  if to_regclass('private.lead_rate_limits') is not null then
    -- Prevent a legacy writer from racing the final activity check.
    lock table private.lead_rate_limits in access exclusive mode;
    if exists (select 1 from private.lead_rate_limits
               where created_at >= now() - interval '10 minutes') then
      raise exception 'Legacy ingest has recent activity; postpone cleanup';
    end if;
  end if;

  drop function if exists public.submit_ghoulhouse_lead(
    text,text,text,text,text,text,text,text,text
  ) restrict;
  drop function if exists public.submit_ghoulhouse_lead_v2(
    text,text,text,text,text,text,text,text,text,text,boolean
  ) restrict;
  drop function if exists public.submit_ghoulhouse_lead_v3(
    text,text,text,text,text,text,text,text,text,text,boolean
  ) restrict;

  if exists (
    select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = any(legacy_names)
  ) then
    raise exception 'Unexpected legacy function overload remains; cleanup aborted';
  end if;

  drop table if exists private.lead_rate_limits restrict;
end;
$cleanup$;
