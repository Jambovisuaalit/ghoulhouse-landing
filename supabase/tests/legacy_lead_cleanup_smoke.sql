-- Run as the database administrator AFTER the cleanup migration.
-- All synthetic leads, rate buckets and outbox entries roll back inside a
-- subtransaction. The notification worker cannot see uncommitted rows.
-- Never invoke the worker here; no test email is dispatched.
do $smoke$
declare
  smoke_lead_id uuid;
  smoke_rate_key text := replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', '');
begin
  if to_regclass('private.lead_rate_limits') is not null
     or exists (select 1 from pg_proc p join pg_namespace n on n.oid=p.pronamespace
                where n.nspname='public' and p.proname in
                  ('submit_ghoulhouse_lead','submit_ghoulhouse_lead_v2','submit_ghoulhouse_lead_v3')) then
    raise exception 'Legacy objects remain';
  end if;

  begin
    for i in 1..5 loop
      smoke_lead_id := public.submit_ghoulhouse_lead_v4(
        smoke_rate_key, 'booking', 'QA rollback #109', 'Internal verification',
        'qa@example.invalid', 'Ei vielä verkkosivua tai Instagramia',
        null, null, null, 'Synthetic verification; rolled back', 'social', true
      );
      if not exists (
        select 1 from private.lead_notification_outbox o
        join public.leads l on l.id=o.lead_id
        where l.id=smoke_lead_id and l.delivery_status='pending'
          and o.state='queued' and o.attempts=0 and o.request_id is null
          and o.idempotency_key='ghoulhouse-lead/' || l.id::text
      ) then
        raise exception 'Lead notification was not queued';
      end if;
    end loop;

    begin
      perform public.submit_ghoulhouse_lead_v4(
        smoke_rate_key, 'booking', 'QA rollback #109', 'Internal verification',
        'qa@example.invalid', 'fixture profile'
      );
      raise exception 'Sixth submission was not rate limited' using errcode='ZX110';
    exception when sqlstate 'P0001' then
      if sqlerrm <> 'rate_limited' then raise; end if;
    end;

    -- A distinct client still works, including phone-only contact.
    perform public.submit_ghoulhouse_lead_v4(
      replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', ''),
      'booking', 'QA rollback #109', 'Internal verification', null,
      'fixture profile', '0000000000'
    );

    -- The handler catches only this deliberate rollback, never an assertion.
    raise exception 'Rollback successful smoke test' using errcode='ZX109';
  exception when sqlstate 'ZX109' then
    null;
  end;

  if exists (select 1 from public.leads where company='QA rollback #109')
     or exists (select 1 from private.lead_rate_buckets b where b.rate_key=smoke_rate_key)
     or exists (select 1 from private.lead_notification_outbox o where o.lead_id=smoke_lead_id) then
    raise exception 'Synthetic smoke-test data survived rollback';
  end if;
end;
$smoke$;

select 'PASS: v4 insert, notification queue, 5/10m limit, separate client, phone-only contact and rollback' as verification;
