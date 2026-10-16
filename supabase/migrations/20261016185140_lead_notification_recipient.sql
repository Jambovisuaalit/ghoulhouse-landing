-- User-confirmed notification recipient. Existing immutable outbox payloads are retained.
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
      'to', jsonb_build_array('hanna@ghoulhouse.fi'),
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

