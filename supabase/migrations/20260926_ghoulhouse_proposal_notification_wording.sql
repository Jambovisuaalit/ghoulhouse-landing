-- Keep the verified production trigger logic intact; update only its public-facing wording.
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
    else 'GhoulHouse — konseptidemo — ' || new.company
  end;

  body_text := concat_ws(E'\n',
    case when new.intent = 'booking'
      then 'Uusi GhoulHouse ehdotuspyyntö'
      else 'Uusi GhoulHouse konseptidemopyyntö'
    end,
    '',
    'Intent: ' || new.intent,
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
$function$
;
