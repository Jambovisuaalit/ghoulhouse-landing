'use client';

import { FormEvent, useRef, useState } from 'react';

type Toast = { tone: 'error' | 'status'; message: string } | null;

export default function LeadForm() {
  const [toast, setToast] = useState<Toast>(null);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setToast(null);
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
      const errors = payload?.errors as Record<string, string> | undefined;
      if (errors) {
        const first = Object.entries(errors)[0];
        if (first) {
          const field = form.elements.namedItem(first[0]);
          if (field instanceof HTMLElement) field.focus();
          setToast({ tone: 'error', message: first[1] });
          return;
        }
      }

      setToast({ tone: 'error', message: 'Lähetys ei onnistunut. Yritä uudelleen tai lähetä sähköpostia osoitteeseen hello@ghoulhouse.fi.' });
    } catch {
      setToast({ tone: 'error', message: 'Yhteys katkesi. Yritä uudelleen.' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {toast ? (
        <div className={`toast toast--${toast.tone}`} role={toast.tone === 'error' ? 'alert' : 'status'} aria-live={toast.tone === 'error' ? 'assertive' : 'polite'}>
          <p>{toast.message}</p>
          <button type="button" onClick={() => { setToast(null); requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('input, textarea, button')?.focus()); }} aria-label="Sulje ilmoitus">×</button>
        </div>
      ) : null}

      <form ref={formRef} action="/api/leads" method="POST" className="leadForm" onSubmit={submit} noValidate>
        <input type="hidden" name="intent" value="photos" />
        <div className="fieldRow">
          <label>Nimi <span aria-hidden="true">*</span><input name="name" required maxLength={120} autoComplete="name" /></label>
          <label>Yritys <span aria-hidden="true">*</span><input name="company" required maxLength={120} autoComplete="organization" /></label>
        </div>
        <div className="fieldRow">
          <label>Sähköposti <span aria-hidden="true">*</span><input name="email" type="email" required maxLength={254} autoComplete="email" /></label>
          <label>Puhelinnumero<input name="phone" type="tel" maxLength={40} autoComplete="tel" /></label>
        </div>
        <label>Verkkosivu tai Instagram <span aria-hidden="true">*</span><input name="profile" required maxLength={300} placeholder="yritys.fi tai @yritys" /></label>
        <label>Mitä materiaalia sinulla on?<textarea name="message" rows={4} maxLength={1200} placeholder="Esim. työmaakuvia, valmiita kohteita, videoita..." /></label>
        <input className="trap" name="fax" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <button className="button button--signal formSubmit" type="submit" disabled={submitting}>{submitting ? 'LÄHETETÄÄN…' : 'PYYDÄ 2 SISÄLTÖESIMERKKIÄ'} <span aria-hidden="true">→</span></button>
        <p className="formNote">Tietoja käytetään vain yhteydenoton käsittelyyn. <a href="/tietosuoja">Tietosuojaseloste</a>.</p>
      </form>
    </>
  );
}
