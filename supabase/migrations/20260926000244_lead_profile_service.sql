-- Additive migration: the existing RPC remains available to the current deployment.
alter table public.leads add column service text check (service in ('websites', 'social', 'seo'));
alter table public.leads add column no_profile boolean not null default false;
CREATE OR REPLACE FUNCTION public.submit_ghoulhouse_lead_v2(p_intent text, p_company text, p_name text, p_email text, p_profile text, p_phone text DEFAULT NULL::text, p_website text DEFAULT NULL::text, p_instagram text DEFAULT NULL::text, p_message text DEFAULT NULL::text, p_service text DEFAULT NULL::text, p_no_profile boolean DEFAULT false)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  req_headers jsonb := coalesce(nullif(current_setting('request.headers', true), ''), '{}')::jsonb;
  req_ip text;
  recent_count integer;
  new_id uuid;
begin
  if p_service is not null and p_service not in ('websites', 'social', 'seo') then
    raise exception 'invalid_service' using errcode = '22023';
  end if;
  if coalesce(p_no_profile, false) then
    p_profile := 'Ei vielä verkkosivua tai Instagramia';
    p_website := null;
    p_instagram := null;
  end if;
  req_ip := coalesce(
    nullif(trim(split_part(coalesce(req_headers ->> 'x-forwarded-for', ''), ',', 1)), ''),
    nullif(trim(coalesce(req_headers ->> 'cf-connecting-ip', '')), ''),
    'unknown'
  );

  -- Serialize requests from the same source so concurrent submissions cannot
  -- race past the database-level rate limiter.
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(req_ip, 0));

  delete from private.lead_rate_limits
  where created_at < now() - interval '1 day';

  select count(*) into recent_count
  from private.lead_rate_limits
  where ip = req_ip
    and created_at >= now() - interval '10 minutes';

  if recent_count >= 5 then
    raise exception 'rate_limited' using errcode = 'P0001';
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

  if nullif(trim(p_email), '') is null
     or char_length(trim(p_email)) > 254
     or position('@' in p_email) <= 1
     or position(' ' in p_email) > 0
     or position(pg_catalog.chr(10) in p_email) > 0
     or position(pg_catalog.chr(13) in p_email) > 0 then
    raise exception 'invalid_email' using errcode = '22023';
  end if;

  if nullif(trim(p_profile), '') is null or char_length(trim(p_profile)) > 300 then
    raise exception 'invalid_profile' using errcode = '22023';
  end if;

  if p_phone is not null and char_length(trim(p_phone)) > 40 then
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

  insert into private.lead_rate_limits (ip) values (req_ip);

  insert into public.leads (
    source, intent, company, name, email, profile, phone, website, instagram, message, service, no_profile
  ) values (
    'ghoulhouse.fi',
    p_intent,
    trim(p_company),
    trim(p_name),
    lower(trim(p_email)),
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
revoke all on function public.submit_ghoulhouse_lead_v2(text,text,text,text,text,text,text,text,text,text,boolean) from public, authenticated;
grant execute on function public.submit_ghoulhouse_lead_v2(text,text,text,text,text,text,text,text,text,text,boolean) to anon, service_role;
CREATE OR REPLACE FUNCTION private.notify_ghoulhouse_lead()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  resend_key text;
  request_id bigint;
  subject_line text;
  body_text text;
begin
  select decrypted_secret
    into resend_key
  from vault.decrypted_secrets
  where name = 'ghoulhouse_resend_api_key'
  limit 1;

  if resend_key is null or resend_key = '' then
    raise warning 'GhoulHouse Resend key missing from Vault';
    return new;
  end if;

  subject_line := case
    when new.intent = 'booking' then 'GhoulHouse — ehdotuspyyntö — ' || new.company
    else 'GhoulHouse — sisältöesimerkit — ' || new.company
  end;

  body_text := concat_ws(E'\n',
    case when new.intent = 'booking'
      then 'Uusi GhoulHouse ehdotuspyyntö'
      else 'Uusi GhoulHouse pyyntö kahdesta sisältöesimerkistä'
    end,
    '',
    'Intent: ' || new.intent,
    'Palvelu: ' || coalesce(new.service, 'Ei vielä tiedossa'),
    'Yritys: ' || new.company,
    'Nimi: ' || new.name,
    'Sähköposti: ' || new.email,
    'Verkkosivu / Instagram: ' || new.profile,
    'Puhelin: ' || coalesce(new.phone, '-'),
    'Verkkosivu: ' || coalesce(new.website, '-'),
    'Instagram: ' || coalesce(new.instagram, '-'),
    '',
    'Viesti:',
    coalesce(new.message, '-')
  );

  select net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || resend_key,
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'from', 'GhoulHouse <leads@ghoulhouse.fi>',
      'to', jsonb_build_array('hello@ghoulhouse.fi'),
      'reply_to', new.email,
      'subject', subject_line,
      'text', body_text
    ),
    timeout_milliseconds := 5000
  ) into request_id;

  update public.leads
  set resend_request_id = request_id
  where id = new.id;

  return new;
end;
$function$;
