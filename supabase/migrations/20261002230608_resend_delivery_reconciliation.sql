alter table public.leads
  add column if not exists resend_email_id text,
  add column if not exists resend_message_id text,
  add column if not exists delivery_status text,
  add column if not exists delivery_last_event text,
  add column if not exists delivery_updated_at timestamptz,
  add column if not exists delivery_detail text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'leads_delivery_status_check'
      and conrelid = 'public.leads'::regclass
  ) then
    alter table public.leads
      add constraint leads_delivery_status_check
      check (
        delivery_status is null
        or delivery_status in ('pending','sent','delayed','delivered','bounced','failed','suppressed')
      );
  end if;
end $$;

create index if not exists leads_resend_email_id_idx
  on public.leads (resend_email_id)
  where resend_email_id is not null;

create table if not exists private.resend_delivery_events (
  svix_id text primary key,
  event_type text not null,
  resend_email_id text,
  resend_message_id text,
  lead_id uuid,
  event_created_at timestamptz not null,
  detail text,
  received_at timestamptz not null default now()
);

alter table private.resend_delivery_events enable row level security;
revoke all on table private.resend_delivery_events from public, anon, authenticated;

create or replace function public.get_ghoulhouse_resend_webhook_secret()
returns text
language sql
security definer
set search_path to ''
as $function$
  select decrypted_secret
  from vault.decrypted_secrets
  where name = 'ghoulhouse_resend_webhook_secret'
  limit 1;
$function$;

revoke all on function public.get_ghoulhouse_resend_webhook_secret()
from public, anon, authenticated;
grant execute on function public.get_ghoulhouse_resend_webhook_secret()
to service_role;

create or replace function public.apply_ghoulhouse_resend_event(
  p_svix_id text,
  p_event_type text,
  p_email_id text,
  p_message_id text,
  p_lead_id uuid,
  p_event_created_at timestamptz,
  p_detail text default null::text
)
returns text
language plpgsql
security definer
set search_path to ''
as $function$
declare
  inserted_event boolean;
  mapped_status text;
  updated_count integer;
begin
  if nullif(trim(p_svix_id), '') is null then
    raise exception 'invalid_svix_id' using errcode = '22023';
  end if;

  if p_event_type not in (
    'email.sent',
    'email.delivered',
    'email.delivery_delayed',
    'email.bounced',
    'email.failed',
    'email.suppressed'
  ) then
    return 'ignored_type';
  end if;

  insert into private.resend_delivery_events (
    svix_id,
    event_type,
    resend_email_id,
    resend_message_id,
    lead_id,
    event_created_at,
    detail
  ) values (
    p_svix_id,
    p_event_type,
    nullif(trim(coalesce(p_email_id, '')), ''),
    nullif(trim(coalesce(p_message_id, '')), ''),
    p_lead_id,
    p_event_created_at,
    nullif(left(trim(coalesce(p_detail, '')), 1000), '')
  )
  on conflict (svix_id) do nothing;

  get diagnostics updated_count = row_count;
  inserted_event := updated_count = 1;

  if not inserted_event then
    return 'duplicate';
  end if;

  mapped_status := case p_event_type
    when 'email.sent' then 'sent'
    when 'email.delivery_delayed' then 'delayed'
    when 'email.delivered' then 'delivered'
    when 'email.bounced' then 'bounced'
    when 'email.failed' then 'failed'
    when 'email.suppressed' then 'suppressed'
  end;

  if p_lead_id is null then
    return 'unmatched';
  end if;

  update public.leads
  set
    resend_email_id = coalesce(nullif(trim(coalesce(p_email_id, '')), ''), resend_email_id),
    resend_message_id = coalesce(nullif(trim(coalesce(p_message_id, '')), ''), resend_message_id),
    delivery_status = mapped_status,
    delivery_last_event = p_event_type,
    delivery_updated_at = p_event_created_at,
    delivery_detail = nullif(left(trim(coalesce(p_detail, '')), 1000), '')
  where id = p_lead_id
    and (
      delivery_updated_at is null
      or p_event_created_at >= delivery_updated_at
    );

  get diagnostics updated_count = row_count;

  if updated_count = 0 then
    if exists (select 1 from public.leads where id = p_lead_id) then
      return 'stale';
    end if;
    return 'unmatched';
  end if;

  return 'updated';
end;
$function$;

revoke all on function public.apply_ghoulhouse_resend_event(
  text,text,text,text,uuid,timestamptz,text
) from public, anon, authenticated;
grant execute on function public.apply_ghoulhouse_resend_event(
  text,text,text,text,uuid,timestamptz,text
) to service_role;

create or replace function private.notify_ghoulhouse_lead()
returns trigger
language plpgsql
security definer
set search_path to ''
as $function$
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
    update public.leads
    set
      delivery_status = 'failed',
      delivery_last_event = 'notification.config_missing',
      delivery_updated_at = now(),
      delivery_detail = 'Resend API key missing from Vault'
    where id = new.id;

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
    'Sähköposti: ' || coalesce(new.email, '-'),
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
      'subject', subject_line,
      'text', body_text,
      'tags', jsonb_build_array(
        jsonb_build_object('name', 'source', 'value', 'ghoulhouse_lead'),
        jsonb_build_object('name', 'lead_id', 'value', new.id::text)
      )
    ) || case when new.email is not null
      then jsonb_build_object('reply_to', new.email)
      else '{}'::jsonb
    end,
    timeout_milliseconds := 5000
  ) into request_id;

  update public.leads
  set
    resend_request_id = request_id,
    delivery_status = 'pending',
    delivery_last_event = 'notification.queued',
    delivery_updated_at = now(),
    delivery_detail = null
  where id = new.id;

  return new;
end;
$function$;
