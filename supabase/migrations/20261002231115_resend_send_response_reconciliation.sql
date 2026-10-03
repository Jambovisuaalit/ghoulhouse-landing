create extension if not exists pg_cron;

create or replace function private.reconcile_ghoulhouse_resend_requests()
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

revoke all on function private.reconcile_ghoulhouse_resend_requests()
from public, anon, authenticated;

do $$
begin
  begin
    perform cron.unschedule('ghoulhouse-resend-reconcile');
  exception when others then
    null;
  end;

  perform cron.schedule(
    'ghoulhouse-resend-reconcile',
    '* * * * *',
    'select private.reconcile_ghoulhouse_resend_requests();'
  );
end $$;
