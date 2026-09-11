'use client';

import { FormEvent, useRef, useState } from 'react';

type Toast = { tone: 'error' | 'status'; message: string } | null;
type FieldErrors = Record<string, string>;

function FieldError({ name, errors }: { name: string; errors: FieldErrors }) {
  const message = errors[name];
  if (!message) return null;
  return <span className="fieldError" id={`field-error-${name}`}>{message}</span>;
}

function a11yErrorProps(name: string, errors: FieldErrors) {
  return errors[name]
    ? { 'aria-invalid': true as const, 'aria-describedby': `field-error-${name}`, 'aria-errormessage': `field-error-${name}` }
    : { 'aria-invalid': false as const };
}

export default function LeadForm() {
  const [toast, setToast] = useState<Toast>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setToast(null);
    setFieldErrors({});
    setSubmitting(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form).entries())),
      });

      if (response.ok) {
        setToast({ tone: 'status', message: 'Kiitos. Pyyntö on vastaanotettu.' });
        window.location.assign('/kiitos');
        return;
      }

      const payload = await response.json().catch(() => ({}));
      const errors = payload?.errors as FieldErrors | undefined;
      if (errors && Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        const first = Object.entries(errors)[0];
        const field = form.elements.namedItem(first[0]);
        if (field instanceof HTMLElement) field.focus();
        setToast({ tone: 'error', message: `Tarkista lomake: ${first[1]}` });
        return;
      }

      setToast({ tone: 'error', message: 'Lähetys ei onnistunut. Yritä uudelleen tai lähetä sähköpostia osoitteeseen hello@ghoulhouse.fi.' });
    } catch {
      setToast({ tone: 'error', message: 'Yhteys katkesi. Yritä uudelleen.' });
    } finally {
      setSubmitting(false);
    }
  }

  function dismissToast() {
    setToast(null);
    requestAnimationFrame(() => {
      const activeErrorName = Object.keys(fieldErrors)[0];
      const errorField = activeErrorName ? formRef.current?.elements.namedItem(activeErrorName) : null;
      if (errorField instanceof HTMLElement) {
        errorField.focus();
        return;
      }
      formRef.current?.querySelector<HTMLElement>('input:not([type="hidden"]), textarea, button')?.focus();
    });
  }

  return (
    <>
      {toast ? (
        <div
          className={`toast toast--${toast.tone}`}
          role={toast.tone === 'error' ? 'alert' : 'status'}
          aria-live={toast.tone === 'error' ? 'assertive' : 'polite'}
          aria-atomic="true"
        >
          <p>{toast.message}</p>
          <button type="button" onClick={dismissToast} aria-label="Sulje ilmoitus">×</button>
        </div>
      ) : null}

      <form ref={formRef} action="/api/leads" method="POST" className="leadForm" onSubmit={submit} noValidate>
        <input type="hidden" name="intent" value="photos" />

        <div className="fieldRow">
          <div className="fieldGroup">
            <label htmlFor="lead-name">Nimi <span aria-hidden="true">*</span></label>
            <input id="lead-name" name="name" required maxLength={120} autoComplete="name" {...a11yErrorProps('name', fieldErrors)} />
            <FieldError name="name" errors={fieldErrors} />
          </div>
          <div className="fieldGroup">
            <label htmlFor="lead-company">Yritys <span aria-hidden="true">*</span></label>
            <input id="lead-company" name="company" required maxLength={120} autoComplete="organization" {...a11yErrorProps('company', fieldErrors)} />
            <FieldError name="company" errors={fieldErrors} />
          </div>
        </div>

        <div className="fieldRow">
          <div className="fieldGroup">
            <label htmlFor="lead-email">Sähköposti <span aria-hidden="true">*</span></label>
            <input id="lead-email" name="email" type="email" required maxLength={254} autoComplete="email" {...a11yErrorProps('email', fieldErrors)} />
            <FieldError name="email" errors={fieldErrors} />
          </div>
          <div className="fieldGroup">
            <label htmlFor="lead-phone">Puhelinnumero</label>
            <input id="lead-phone" name="phone" type="tel" maxLength={40} autoComplete="tel" {...a11yErrorProps('phone', fieldErrors)} />
            <FieldError name="phone" errors={fieldErrors} />
          </div>
        </div>

        <div className="fieldGroup">
          <label htmlFor="lead-profile">Verkkosivu tai Instagram <span aria-hidden="true">*</span></label>
          <input id="lead-profile" name="profile" required maxLength={300} placeholder="yritys.fi tai @yritys" {...a11yErrorProps('profile', fieldErrors)} />
          <FieldError name="profile" errors={fieldErrors} />
        </div>

        <div className="fieldGroup">
          <label htmlFor="lead-message">Mitä materiaalia sinulla on?</label>
          <textarea id="lead-message" name="message" rows={4} maxLength={1200} placeholder="Esim. työmaakuvia, valmiita kohteita, videoita..." {...a11yErrorProps('message', fieldErrors)} />
          <FieldError name="message" errors={fieldErrors} />
        </div>

        <input className="trap" name="fax" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <button className="button button--signal formSubmit" type="submit" disabled={submitting}>
          {submitting ? 'LÄHETETÄÄN…' : 'PYYDÄ 2 SISÄLTÖESIMERKKIÄ'} <span aria-hidden="true">→</span>
        </button>
        <p className="formNote">Tietoja käytetään vain yhteydenoton käsittelyyn. <a href="/tietosuoja">Tietosuojaseloste</a>.</p>
      </form>
    </>
  );
}
