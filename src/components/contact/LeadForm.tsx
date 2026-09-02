'use client';

import { FormEvent, useRef, useState } from 'react';
import { siteConfig } from '@/config/site';
import { trackEvent } from '@/lib/analytics';
import { validateLead } from '@/lib/lead';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

export default function LeadForm() {
  const [status, setStatus] = useState<SubmitState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const hasStarted = useRef(false);

  const markStarted = () => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    trackEvent('lead_form_start');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setFieldErrors({});

    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const validation = validateLead(data);

    if (!validation.ok) {
      setStatus('error');
      setFieldErrors(validation.errors || {});
      setErrorMessage('Tarkista merkityt kentät.');
      return;
    }

    setStatus('submitting');
    trackEvent('lead_form_submit');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify(data),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        code?: string;
        errors?: Record<string, string>;
      };

      if (!response.ok || !payload.ok) {
        if (payload.errors) setFieldErrors(payload.errors);

        const message =
          payload.code === 'rate_limited'
            ? 'Lähetyksiä on tehty useita lyhyessä ajassa. Yritä hetken kuluttua uudelleen.'
            : payload.code === 'validation_error'
              ? 'Tarkista merkityt kentät.'
              : 'Pyyntöä ei voitu lähettää juuri nyt. Yritä uudelleen.';

        throw new Error(message);
      }

      setStatus('success');
      trackEvent('lead_form_success');
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Pyyntöä ei voitu lähettää juuri nyt. Yritä uudelleen.'
      );
      trackEvent('lead_form_error');
    }
  };

  if (status === 'success') {
    return (
      <div className="border-2 border-white/30 bg-white/5 p-6" role="status" aria-live="polite">
        <p className="type-label text-signal">Pyyntö vastaanotettu</p>
        <h3 className="mt-3 text-3xl font-extrabold uppercase leading-[0.95] tracking-[-0.03em] text-white">
          Kiitos.
        </h3>
        <p className="mt-4 max-w-lg text-sm leading-6 text-white/70">
          Käymme yrityksesi materiaalin läpi ja sovimme työkuvien toimitustavan vastausviestissä.
        </p>
      </div>
    );
  }

  return (
    <form
      method="POST"
      action="/api/leads"
      onSubmit={handleSubmit}
      onChange={markStarted}
      className="grid gap-4"
      aria-busy={status === 'submitting'}
    >
      <input type="hidden" name="intent" value="photos" />

      <div className="sr-only" aria-hidden="true">
        <label htmlFor="lead-fax">Jätä tämä kenttä tyhjäksi</label>
        <input id="lead-fax" name="fax" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="lead-company" label="Yritys" required error={fieldErrors.company}>
          <input id="lead-company" name="company" required maxLength={120} autoComplete="organization" className="form-control" />
        </Field>
        <Field id="lead-name" label="Nimi" required error={fieldErrors.name}>
          <input id="lead-name" name="name" required maxLength={120} autoComplete="name" className="form-control" />
        </Field>
      </div>

      <Field id="lead-email" label="Sähköposti" required error={fieldErrors.email}>
        <input id="lead-email" name="email" type="email" required maxLength={254} autoComplete="email" className="form-control" />
      </Field>

      <Field
        id="lead-profile"
        label="Verkkosivu tai Instagram"
        required
        error={fieldErrors.profile}
        hint="Esim. yritys.fi tai @yritys"
      >
        <input id="lead-profile" name="profile" required maxLength={300} autoComplete="url" placeholder="yritys.fi tai @yritys" className="form-control" />
      </Field>

      <details className="border-y border-white/20">
        <summary className="type-ui flex min-h-12 cursor-pointer list-none items-center justify-between py-3 text-white [&::-webkit-details-marker]:hidden">
          <span>Puhelin tai viesti</span>
          <span className="type-label text-white/55">valinnainen</span>
        </summary>
        <div className="grid gap-4 border-t border-white/20 py-4">
          <Field id="lead-phone" label="Puhelin" error={fieldErrors.phone}>
            <input id="lead-phone" name="phone" type="tel" maxLength={40} autoComplete="tel" className="form-control" />
          </Field>
          <Field id="lead-message" label="Viesti" error={fieldErrors.message}>
            <textarea id="lead-message" name="message" rows={3} maxLength={1200} className="form-control resize-y" />
          </Field>
        </div>
      </details>

      {status === 'error' && errorMessage && (
        <div className="border-2 border-signal bg-white p-4 text-sm font-bold text-ink" role="alert" aria-live="assertive">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="btn btn-primary min-h-14 w-full disabled:cursor-wait disabled:opacity-60"
      >
        {status === 'submitting' ? 'LÄHETETÄÄN…' : siteConfig.cta.primary}
      </button>

      <p className="type-caption text-white/55">
        Kuvien toimitustapa sovitaan heti vastausviestissä. Antamiasi tietoja käytetään vain yhteydenoton käsittelyyn.{' '}
        <a href={siteConfig.legal.privacyPath} className="font-bold text-white underline underline-offset-2">
          Tietosuojaseloste
        </a>
        .
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  required = false,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="type-ui mb-1.5 block text-white">
        {label}{required ? ' *' : ''}
      </label>
      {children}
      {hint && <p className="type-caption mt-1.5 text-white/50">{hint}</p>}
      {error && <p className="type-caption mt-1.5 font-bold text-signal">{error}</p>}
    </div>
  );
}
