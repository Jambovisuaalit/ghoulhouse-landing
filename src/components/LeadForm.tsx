'use client';

import { FormEvent, useRef, useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { confirmationPath, type LeadService } from '@/lib/lead-confirmation';

type FieldErrors = Record<string, string>;

export default function LeadForm({ mode = 'social', defaultService }: { mode?: 'social' | 'proposal'; defaultService?: LeadService }) {
  const proposal = mode === 'proposal';
  const service = defaultService ?? (proposal ? undefined : 'social');
  const serviceValue = service ?? '';
  const profileRequired = service === 'seo';
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const hasStarted = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

  const profileLabel = service === 'websites'
    ? 'Nykyinen verkkosivu (valinnainen)'
    : service === 'seo'
      ? 'Verkkosivu'
      : service === 'social'
        ? 'Instagram tai verkkosivu (valinnainen)'
        : 'Verkkosivu tai Instagram (valinnainen)';

  const profilePlaceholder = service === 'websites' || service === 'seo'
    ? 'yritys.fi'
    : '@yritys tai yritys.fi';

  const submitLabel = !proposal
    ? 'PYYDÄ 2 SISÄLTÖESIMERKKIÄ'
    : service === 'websites'
      ? 'PYYDÄ VERKKOSIVUARVIO'
      : service === 'seo'
        ? 'PYYDÄ SEO-ARVIO'
        : service === 'social'
          ? 'PYYDÄ SOME 12 -ALOITUSTA'
          : 'PYYDÄ EHDOTUS';

  const microcopy = !proposal
    ? 'Sovimme kuvien toimitustavan vastausviestissä. Ei sitoumusta.'
    : service === 'websites'
      ? 'Palaamme rajatulla ehdotuksella nykyisen sivuston tai uuden toteutuksen seuraavasta askeleesta.'
      : service === 'seo'
        ? 'Käymme verkkosivun lähtötilanteen läpi ja palaamme ehdotuksella. Ei sitoumusta.'
        : service === 'social'
          ? 'Palaamme SOME 12 -aloituksen seuraavalla askeleella. Ei sitoumusta.'
          : 'Palaamme ehdotuksella ilman sitoumusta.';

  function markStarted() {
    if (hasStarted.current) return;
    hasStarted.current = true;
    trackEvent('lead_form_start');
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setError('');
    setFieldErrors({});
    setSubmitting(true);
    trackEvent('lead_form_submit');

    try {
      const data = Object.fromEntries(new FormData(form).entries());
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        trackEvent('lead_form_success');
        window.location.assign(confirmationPath(proposal ? 'booking' : 'photos', String(data.service || '')));
        return;
      }
      const payload = await response.json().catch(() => ({}));
      const errors = (payload.errors || {}) as FieldErrors;
      setFieldErrors(errors);
      const first = Object.keys(errors)[0];
      if (first) (form.elements.namedItem(first) as HTMLElement | null)?.focus();
      setError(first ? errors[first] : 'Lähetys ei onnistunut. Yritä uudelleen tai kirjoita osoitteeseen hanna@ghoulhouse.fi.');
      trackEvent('lead_form_error');
    } catch {
      setError('Yhteys katkesi. Yritä uudelleen.');
      trackEvent('lead_form_error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form ref={formRef} action="/api/leads" method="POST" className="leadForm" onSubmit={submit} onChange={markStarted} noValidate>
      <input type="hidden" name="intent" value={proposal ? 'booking' : 'photos'} />
      <input type="hidden" name="service" value={serviceValue} />
      <div className="fieldGroup">
        <label htmlFor="lead-name">Nimi <span aria-hidden="true">*</span></label>
        <input id="lead-name" name="name" required maxLength={120} autoComplete="name" aria-invalid={Boolean(fieldErrors.name)} aria-describedby={fieldErrors.name ? 'lead-name-error' : undefined} />
        {fieldErrors.name && <span className="fieldError" id="lead-name-error">{fieldErrors.name}</span>}
      </div>
      <div className="fieldGroup">
        <label htmlFor="lead-company">Yritys <span aria-hidden="true">*</span></label>
        <input id="lead-company" name="company" required maxLength={120} autoComplete="organization" aria-invalid={Boolean(fieldErrors.company)} aria-describedby={fieldErrors.company ? 'lead-company-error' : undefined} />
        {fieldErrors.company && <span className="fieldError" id="lead-company-error">{fieldErrors.company}</span>}
      </div>
      <div className="fieldGroup">
        <label htmlFor="lead-contact">Sähköposti tai puhelin <span aria-hidden="true">*</span></label>
        <input id="lead-contact" name="contact" type="text" required maxLength={254} autoComplete="email" placeholder="nimi@yritys.fi tai 040 123 4567" aria-invalid={Boolean(fieldErrors.contact)} aria-describedby={fieldErrors.contact ? 'lead-contact-error' : undefined} />
        {fieldErrors.contact && <span className="fieldError" id="lead-contact-error">{fieldErrors.contact}</span>}
      </div>
      <div className="fieldGroup">
        <label htmlFor="lead-profile">{profileLabel} {profileRequired && <span aria-hidden="true">*</span>}</label>
        <input
          id="lead-profile"
          name="profile"
          required={profileRequired}
          maxLength={300}
          placeholder={profilePlaceholder}
          aria-invalid={Boolean(fieldErrors.profile)}
          aria-describedby={fieldErrors.profile ? 'lead-profile-error' : undefined}
        />
        {fieldErrors.profile && <span className="fieldError" id="lead-profile-error">{fieldErrors.profile}</span>}
      </div>
      <input className="trap" name="fax" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {error && <p className="fieldError" role="alert">{error}</p>}
      <button className="button button--signal formSubmit" type="submit" disabled={submitting}>
        {submitting ? 'LÄHETETÄÄN…' : submitLabel} <span aria-hidden="true">→</span>
      </button>
      <p className="formMicrocopy">{microcopy}</p>
      <p className="formNote">Tietoja käytetään vain yhteydenoton käsittelyyn. <a href="/tietosuoja">Tietosuojaseloste</a>.</p>
    </form>
  );
}
