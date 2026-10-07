-- New notifications have a durable, immutable payload and a bounded retry window.
-- Existing leads are deliberately not re-enqueued: their original sends had no idempotency key.
create table private.lead_notification_outbox (
  lead_id uuid primary key references public.leads(id) on delete cascade,
  payload jsonb not null,
  idempotency_key text not null unique,
  created_at timestamptz not null default now(),
  attempts integer not null default 0 check (attempts between 0 and 4),
  next_attempt_at timestamptz not null default now(),
  last_attempt_at timestamptz,
  request_id bigint,
  state text not null default 'queued' check (state in ('queued', 'sending', 'retry', 'accepted', 'failed'))
);
create index lead_notification_outbox_due_idx on private.lead_notification_outbox(next_attempt_at)
where state in ('queued','sending','retry');
alter table private.lead_notification_outbox enable row level security;
revoke all on private.lead_notification_outbox from public, anon, authenticated;

create table private.lead_notification_alerts (
  lead_id uuid primary key references public.leads(id) on delete cascade,
  reason text not null,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);
alter table private.lead_notification_alerts enable row level security;
revoke all on private.lead_notification_alerts from public, anon, authenticated;

create or replace function private.ghoulhouse_notification_payload(p_lead public.leads)
returns jsonb language plpgsql set search_path to '' as $function$
declare subject_line text; body_text text;
begin
  subject_line := case
    when p_lead.intent = 'booking' then 'GhoulHouse — ehdotuspyyntö — ' || p_lead.company
    else 'GhoulHouse — sisältöesimerkit — ' || p_lead.company
  end;

  body_text := concat_ws(E'\n',
    case when p_lead.intent = 'booking'
      then 'Uusi GhoulHouse ehdotuspyyntö'
      else 'Uusi GhoulHouse pyyntö kahdesta sisältöesimerkistä'
    end,
    '',
    'Intent: ' || p_lead.intent,
    'Palvelu: ' || coalesce(p_lead.service, 'Ei vielä tiedossa'),
    'Yritys: ' || p_lead.company,
    'Nimi: ' || p_lead.name,
    'Sähköposti: ' || coalesce(p_lead.email, '-'),
    'Verkkosivu / Instagram: ' || p_lead.profile,
    'Puhelin: ' || coalesce(p_lead.phone, '-'),
    'Verkkosivu: ' || coalesce(p_lead.website, '-'),
    'Instagram: ' || coalesce(p_lead.instagram, '-'),
    '',
    'Viesti:',
    coalesce(p_lead.message, '-')
  );

  return jsonb_build_object(
      'from', 'GhoulHouse <leads@ghoulhouse.fi>',
      'to', jsonb_build_array('hello@ghoulhouse.fi'),
      'subject', subject_line,
      'text', body_text,
      'tags', jsonb_build_array(
        jsonb_build_object('name', 'source', 'value', 'ghoulhouse_lead'),
        jsonb_build_object('name', 'lead_id', 'value', p_lead.id::text)
      )
    ) || case when p_lead.email is not null
      then jsonb_build_object('reply_to', p_lead.email)
      else '{}'::jsonb
    end;
end;
$function$;
revoke all on function private.ghoulhouse_notification_payload(public.leads) from public, anon, authenticated;

create or replace function private.notify_ghoulhouse_lead()
returns trigger language plpgsql security definer set search_path to '' as $function$
begin
  insert into private.lead_notification_outbox(lead_id, payload, idempotency_key)
  values (new.id, private.ghoulhouse_notification_payload(new), 'ghoulhouse-lead/' || new.id::text);
  update public.leads set delivery_status='pending', delivery_last_event='notification.queued',
    delivery_updated_at=now() where id=new.id;
  return new;
end;
$function$;
revoke all on function private.notify_ghoulhouse_lead() from public, anon, authenticated;

create or replace function private.process_ghoulhouse_notifications()
returns integer language plpgsql security definer set search_path to '' as $function$
declare
  item record;
  response_row record;
  email_id text;
  resend_key text;
  queued_request_id bigint;
  retryable boolean;
  reason text;
  delay_seconds integer;
  processed integer := 0;
begin
  for item in
    select o.* from private.lead_notification_outbox o
    where o.state in ('queued','retry','sending') and o.next_attempt_at <= now()
    order by o.next_attempt_at limit 100 for update skip locked
  loop
    reason := null;
    -- A verified webhook is authoritative even if the initial HTTP response was lost.
    if exists (select 1 from public.leads l where l.id=item.lead_id and l.resend_email_id is not null) then
      update private.lead_notification_outbox set state='accepted' where lead_id=item.lead_id;
      continue;
    end if;
    if item.state='sending' then
      select * into response_row from net._http_response where id=item.request_id limit 1;
      if not found then
        if item.last_attempt_at > now() - interval '2 minutes' then continue; end if;
        retryable := true;
        reason := 'notification.response_timeout';
        delay_seconds := 60;
      else
        retryable := response_row.error_msg is not null or response_row.timed_out
          or response_row.status_code is null or response_row.status_code in (408,429)
          or response_row.status_code >= 500;
        reason := 'notification.send_failed';
        delay_seconds := 60;
        if response_row.headers->>'retry-after' ~ '^[0-9]{1,5}$' then
          delay_seconds := least(3600, (response_row.headers->>'retry-after')::integer);
        end if;
        if response_row.error_msg is null and not coalesce(response_row.timed_out,false)
          and response_row.status_code between 200 and 299 then
          begin
            email_id := nullif(trim((response_row.content::jsonb)->>'id'), '');
          exception when others then email_id := null;
          end;
          if email_id is not null then
            update private.lead_notification_outbox set state='accepted' where lead_id=item.lead_id;
            update public.leads set resend_email_id=email_id,
              delivery_last_event='notification.accepted', delivery_updated_at=now(), delivery_detail=null
            where id=item.lead_id and resend_email_id is null;
            processed := processed + 1;
            continue;
          end if;
          retryable := false;
          reason := 'notification.invalid_response';
        end if;
      end if;
      if retryable and item.attempts < 4 and item.created_at > now() - interval '23 hours' then
        update private.lead_notification_outbox set state='retry',
          next_attempt_at=now() + make_interval(secs => greatest(delay_seconds, 60 * power(2,item.attempts-1)::integer))
        where lead_id=item.lead_id;
        update public.leads set delivery_last_event='notification.retry_scheduled', delivery_updated_at=now()
        where id=item.lead_id;
        processed := processed + 1;
        continue;
      end if;
    elsif item.attempts >= 4 or item.created_at <= now() - interval '23 hours' then
      reason := 'notification.retry_exhausted';
    else
      select decrypted_secret into resend_key from vault.decrypted_secrets
      where name='ghoulhouse_resend_api_key' limit 1;
      if nullif(resend_key,'') is null then
        reason := 'notification.config_missing';
      else
        begin
          select net.http_post(url := 'https://api.resend.com/emails',
            headers := jsonb_build_object('Authorization','Bearer ' || resend_key,
              'Content-Type','application/json','Idempotency-Key',item.idempotency_key),
            body := item.payload, timeout_milliseconds := 10000) into queued_request_id;
          update private.lead_notification_outbox set state='sending', request_id=queued_request_id,
            attempts=attempts+1, last_attempt_at=now(), next_attempt_at=now()+interval '1 minute'
          where lead_id=item.lead_id;
          update public.leads set resend_request_id=queued_request_id, delivery_last_event='notification.queued',
            delivery_updated_at=now() where id=item.lead_id;
          processed := processed + 1;
          continue;
        exception when others then
          -- No request was committed. Keep the durable item for a bounded retry.
          if item.attempts < 3 then
            update private.lead_notification_outbox set state='retry', attempts=attempts+1,
              next_attempt_at=now()+make_interval(secs => 60 * power(2,item.attempts)::integer)
            where lead_id=item.lead_id;
            continue;
          end if;
          reason := 'notification.queue_failed';
        end;
      end if;
    end if;
    update private.lead_notification_outbox set state='failed' where lead_id=item.lead_id;
    update public.leads set delivery_status='failed', delivery_last_event=reason,
      delivery_updated_at=now(), delivery_detail=reason where id=item.lead_id;
    processed := processed + 1;
  end loop;

  insert into private.lead_notification_alerts(lead_id,reason)
  select o.lead_id, coalesce(l.delivery_last_event,'notification.delivery_stale')
  from private.lead_notification_outbox o join public.leads l on l.id=o.lead_id
  where o.state='failed' or l.delivery_status in ('failed','bounced','suppressed')
    or (o.state='accepted' and l.delivery_status='pending' and l.delivery_updated_at < now()-interval '30 minutes')
  on conflict (lead_id) do nothing;
  if found then raise warning 'GhoulHouse notification failures: inspect private.lead_notification_alerts'; end if;

  update private.lead_notification_alerts a set resolved_at=now()
  from public.leads l where a.lead_id=l.id and a.resolved_at is null and l.delivery_status in ('sent','delivered');
  return processed;
end;
$function$;
revoke all on function private.process_ghoulhouse_notifications() from public, anon, authenticated;

create or replace function private.reconcile_ghoulhouse_legacy_requests()
returns integer
language plpgsql
security definer
set search_path to ''
as $function$
declare
  row_record record;
  email_id text;
  processed integer := 0;
begin
  for row_record in
    select
      l.id as lead_id,
      l.resend_request_id,
      r.status_code,
      r.error_msg,
      r.content,
      r.created
    from public.leads l
    join net._http_response r
      on r.id = l.resend_request_id
    where l.resend_request_id is not null
      and l.resend_email_id is null
      and l.delivery_status = 'pending'
      and not exists (select 1 from private.lead_notification_outbox o where o.lead_id = l.id)
      and l.created_at >= now() - interval '6 hours'
    order by l.created_at
    limit 100
    for update of l skip locked
  loop
    if row_record.error_msg is not null
       or row_record.status_code is null
       or row_record.status_code < 200
       or row_record.status_code >= 300 then
      update public.leads
      set
        delivery_status = 'failed',
        delivery_last_event = 'notification.send_failed',
        delivery_updated_at = greatest(
          coalesce(delivery_updated_at, '-infinity'::timestamptz),
          row_record.created
        ),
        delivery_detail = left(
          coalesce(
            nullif(trim(coalesce(row_record.error_msg, '')), ''),
            'Resend API HTTP ' || coalesce(row_record.status_code::text, 'unknown')
          ),
          1000
        )
      where id = row_record.lead_id;

      processed := processed + 1;
      continue;
    end if;

    begin
      email_id := nullif(trim((row_record.content::jsonb)->>'id'), '');
    exception when others then
      email_id := null;
    end;

    if email_id is null then
      update public.leads
      set
        delivery_status = 'failed',
        delivery_last_event = 'notification.invalid_response',
        delivery_updated_at = greatest(
          coalesce(delivery_updated_at, '-infinity'::timestamptz),
          row_record.created
        ),
        delivery_detail = 'Resend API returned no email id'
      where id = row_record.lead_id;

      processed := processed + 1;
      continue;
    end if;

    update public.leads
    set
      resend_email_id = email_id,
      delivery_last_event = 'notification.accepted',
      delivery_updated_at = greatest(
        coalesce(delivery_updated_at, '-infinity'::timestamptz),
        row_record.created
      ),
      delivery_detail = null
    where id = row_record.lead_id;

    processed := processed + 1;
  end loop;

  return processed;
end;
$function$;

revoke all on function private.reconcile_ghoulhouse_legacy_requests()
from public, anon, authenticated;


-- Keep the existing cron job and its legacy send-response reconciliation.
create or replace function private.reconcile_ghoulhouse_resend_requests()
returns integer language plpgsql security definer set search_path to '' as $function$
begin
  return private.process_ghoulhouse_notifications() + private.reconcile_ghoulhouse_legacy_requests();
end;
$function$;
revoke all on function private.reconcile_ghoulhouse_resend_requests() from public, anon, authenticated;

-- Backend-only, read-only readiness probe. Never insert a synthetic lead here.
create or replace function public.check_ghoulhouse_lead_readiness()
returns jsonb language plpgsql stable security definer set search_path to '' as $function$
declare storage_ready boolean; notification_ready boolean; failures integer; stale integer;
begin
  perform id, company, email from public.leads limit 1;
  perform rate_key from private.lead_rate_buckets limit 1;
  storage_ready := coalesce(has_function_privilege('service_role',
    to_regprocedure('public.submit_ghoulhouse_lead_v4(text,text,text,text,text,text,text,text,text,text,text,boolean)'), 'execute'),false)
    and exists(select 1 from pg_catalog.pg_trigger where tgrelid='public.leads'::regclass
      and tgname='trg_notify_ghoulhouse_lead' and tgenabled in ('O','A'));
  select count(*)::integer into failures from private.lead_notification_alerts where resolved_at is null;
  select count(*)::integer into stale from private.lead_notification_outbox
    where state in ('queued','retry','sending') and next_attempt_at < now()-interval '5 minutes';
  notification_ready := exists(select 1 from vault.decrypted_secrets
    where name='ghoulhouse_resend_api_key' and nullif(decrypted_secret,'') is not null)
    and exists(select 1 from cron.job where jobname='ghoulhouse-resend-reconcile' and active)
    and failures=0 and stale=0;
  return jsonb_build_object('ok', storage_ready and notification_ready,
    'storage',jsonb_build_object('ready',storage_ready),
    'notifications',jsonb_build_object('ready',notification_ready,'failures',failures,'stale',stale));
end;
$function$;
revoke all on function public.check_ghoulhouse_lead_readiness() from public, anon, authenticated;
grant execute on function public.check_ghoulhouse_lead_readiness() to service_role;
