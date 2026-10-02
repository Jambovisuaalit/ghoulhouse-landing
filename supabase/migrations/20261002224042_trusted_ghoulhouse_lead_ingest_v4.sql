create table if not exists private.lead_rate_buckets (
  rate_key text primary key,
  window_started_at timestamptz not null default now(),
  request_count integer not null default 0 check (request_count >= 0),
  updated_at timestamptz not null default now()
);

alter table private.lead_rate_buckets enable row level security;
revoke all on table private.lead_rate_buckets from public, anon, authenticated;

create or replace function public.submit_ghoulhouse_lead_v4(
  p_rate_key text,
  p_intent text,
  p_company text,
  p_name text,
  p_email text,
  p_profile text,
  p_phone text default null::text,
  p_website text default null::text,
  p_instagram text default null::text,
  p_message text default null::text,
  p_service text default null::text,
  p_no_profile boolean default false
)
returns uuid
language plpgsql
security definer
set search_path to ''
as $function$
declare
  bucket_window timestamptz;
  bucket_count integer;
  new_id uuid;
begin
  if p_rate_key is null or p_rate_key !~ '^[0-9a-f]{64}$' then
    raise exception 'invalid_rate_key' using errcode = '22023';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_rate_key, 1));

  delete from private.lead_rate_buckets
  where updated_at < now() - interval '1 day';

  insert into private.lead_rate_buckets(rate_key, window_started_at, request_count, updated_at)
  values (p_rate_key, now(), 0, now())
  on conflict (rate_key) do nothing;

  select window_started_at, request_count
    into bucket_window, bucket_count
  from private.lead_rate_buckets
  where rate_key = p_rate_key
  for update;

  if bucket_window <= now() - interval '10 minutes' then
    update private.lead_rate_buckets
    set window_started_at = now(), request_count = 1, updated_at = now()
    where rate_key = p_rate_key;
  elsif bucket_count >= 5 then
    raise exception 'rate_limited' using errcode = 'P0001';
  else
    update private.lead_rate_buckets
    set request_count = request_count + 1, updated_at = now()
    where rate_key = p_rate_key;
  end if;

  if p_service is not null and p_service not in ('websites', 'social', 'seo') then
    raise exception 'invalid_service' using errcode = '22023';
  end if;

  if coalesce(p_no_profile, false) then
    p_profile := 'Ei vielä verkkosivua tai Instagramia';
    p_website := null;
    p_instagram := null;
  end if;

  if p_intent not in ('photos', 'booking') then
    raise exception 'invalid_intent' using errcode = '22023';
  end if;

  if nullif(trim(p_company), '') is null
     or char_length(trim(p_company)) > 120
     or position(pg_catalog.chr(10) in p_company) > 0
     or position(pg_catalog.chr(13) in p_company) > 0 then
    raise exception 'invalid_company' using errcode = '22023';
  end if;

  if nullif(trim(p_name), '') is null
     or char_length(trim(p_name)) > 120
     or position(pg_catalog.chr(10) in p_name) > 0
     or position(pg_catalog.chr(13) in p_name) > 0 then
    raise exception 'invalid_name' using errcode = '22023';
  end if;

  if (nullif(trim(coalesce(p_email, '')), '') is null and nullif(trim(coalesce(p_phone, '')), '') is null)
     or (p_email is not null and char_length(trim(p_email)) > 254)
     or (nullif(trim(coalesce(p_email, '')), '') is not null and position('@' in p_email) <= 1)
     or (p_email is not null and position(' ' in p_email) > 0)
     or (p_email is not null and position(pg_catalog.chr(10) in p_email) > 0)
     or (p_email is not null and position(pg_catalog.chr(13) in p_email) > 0) then
    raise exception 'invalid_email' using errcode = '22023';
  end if;

  if nullif(trim(p_profile), '') is null or char_length(trim(p_profile)) > 300 then
    raise exception 'invalid_profile' using errcode = '22023';
  end if;

  if p_phone is not null and (
    char_length(trim(p_phone)) > 40
    or (
      nullif(trim(coalesce(p_email, '')), '') is null
      and length(regexp_replace(p_phone, '[^0-9]', '', 'g')) < 6
    )
  ) then
    raise exception 'invalid_phone' using errcode = '22023';
  end if;

  if p_website is not null and char_length(trim(p_website)) > 300 then
    raise exception 'invalid_website' using errcode = '22023';
  end if;

  if p_instagram is not null and char_length(trim(p_instagram)) > 120 then
    raise exception 'invalid_instagram' using errcode = '22023';
  end if;

  if p_message is not null and char_length(trim(p_message)) > 1200 then
    raise exception 'invalid_message' using errcode = '22023';
  end if;

  insert into public.leads (
    source, intent, company, name, email, profile, phone, website, instagram, message, service, no_profile
  ) values (
    'ghoulhouse.fi',
    p_intent,
    trim(p_company),
    trim(p_name),
    nullif(lower(trim(coalesce(p_email, ''))), ''),
    trim(p_profile),
    nullif(trim(coalesce(p_phone, '')), ''),
    nullif(trim(coalesce(p_website, '')), ''),
    nullif(trim(coalesce(p_instagram, '')), ''),
    nullif(trim(coalesce(p_message, '')), ''),
    coalesce(p_service, case when p_intent = 'photos' then 'social' end),
    coalesce(p_no_profile, false)
  )
  returning id into new_id;

  return new_id;
end;
$function$;

revoke all on function public.submit_ghoulhouse_lead_v4(
  text,text,text,text,text,text,text,text,text,text,text,boolean
) from public, anon, authenticated;

grant execute on function public.submit_ghoulhouse_lead_v4(
  text,text,text,text,text,text,text,text,text,text,text,boolean
) to service_role;

comment on function public.submit_ghoulhouse_lead_v4(
  text,text,text,text,text,text,text,text,text,text,text,boolean
) is 'Trusted backend-only GhoulHouse lead ingest. The caller supplies a server-derived client hash after workload identity verification.';
