'use client';

import { FormEvent, useRef, useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { confirmationPath, type LeadService } from '@/lib/lead-confirmation';
import { NO_PROFILE_YET } from '@/lib/lead';

type Toast = { message: string } | null;
type FieldErrors = Record<string, string>;

function FieldError({ name, errors }: { name: string; errors: FieldErrors }) {
  const message = errors[name];
  if (!message) return null;
  return (
    <span className="fieldError" id={`field-error-${name}`}>
      {message}
    </span>
  );
}

function a11yErrorProps(name: string, errors: FieldErrors) {
  return errors[name]
    ? {
        'aria-invalid': true as const,
        'aria-describedby': `field-error-${name}`,
        'aria-errormessage': `field-error-${name}`,
      }
    : { 'aria-invalid': false as const };
}

export default function LeadForm({ compact = false, mode = 'social', defaultService }: { compact?: boolean; mode?: 'social' | 'proposal'; defaultService?: LeadService }) {
  const proposal = mode === 'proposal';
  const [toast, setToast] = useState<Toast>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [profileValue, setProfileValue] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const hasStarted = useRef(false);

  function markStarted() {
    if (hasStarted.current) return;
    hasStarted.current = true;
    trackEvent('lead_form_start');
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setToast(null);
    setFieldErrors({});
    setSubmitting(true);
    trackEvent('lead_form_submit');
    const formData = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        trackEvent('lead_form_success');
        window.location.assign(confirmationPath(proposal ? 'booking' : 'photos', String(formData.service || '')));
        return;
      }

      const payload = await response.json().catch(() => ({}));
      const errors = payload?.errors as FieldErrors | undefined;
      if (errors && Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        const first = Object.entries(errors)[0];
        const field = form.elements.namedItem(first[0]);
        if (field instanceof HTMLElement) field.focus();
        setToast({ message: `Tarkista lomake: ${first[1]}` });
        trackEvent('lead_form_error');
        return;
      }

      setToast({
        message:
          'Lähetys ei onnistunut. Yritä uudelleen tai lähetä sähköpostia osoitteeseen hello@ghoulhouse.fi.',
      });
      trackEvent('lead_form_error');
    } catch {
      setToast({ message: 'Yhteys katkesi. Yritä uudelleen.' });
      trackEvent('lead_form_error');
    } finally {
      setSubmitting(false);
    }
  }

  function dismissToast() {
    setToast(null);
    requestAnimationFrame(() => {
      const activeErrorName = Object.keys(fieldErrors)[0];
      const errorField = activeErrorName
        ? formRef.current?.elements.namedItem(activeErrorName)
        : null;
      if (errorField instanceof HTMLElement) {
        errorField.focus();
        return;
      }
      formRef.current
        ?.querySelector<HTMLElement>('input:not([type="hidden"]), textarea, button')
        ?.focus();
    });
  }

  return (
    <>
      {toast ? (
        <div className="toast toast--error" role="alert" aria-live="assertive" aria-atomic="true">
          <p>{toast.message}</p>
          <button type="button" onClick={dismissToast} aria-label="Sulje ilmoitus">
            ×
          </button>
        </div>
      ) : null}

      <form
        ref={formRef}
        action="/api/leads"
        method="POST"
        className="leadForm"
        onSubmit={submit}
        onChange={markStarted}
        noValidate
      >
        <input type="hidden" name="intent" value={proposal ? "booking" : "photos"} />

        <div className="fieldRow">
          <div className="fieldGroup">
            <label htmlFor="lead-name">
              Nimi <span aria-hidden="true">*</span>
            </label>
            <input
              id="lead-name"
              name="name"
              required
              maxLength={120}
              autoComplete="name"
              {...a11yErrorProps('name', fieldErrors)}
            />
            <FieldError name="name" errors={fieldErrors} />
          </div>
          <div className="fieldGroup">
            <label htmlFor="lead-company">
              Yritys <span aria-hidden="true">*</span>
            </label>
            <input
              id="lead-company"
              name="company"
              required
              maxLength={120}
              autoComplete="organization"
              {...a11yErrorProps('company', fieldErrors)}
            />
            <FieldError name="company" errors={fieldErrors} />
          </div>
        </div>

        <div className={compact ? 'fieldRow fieldRow--full' : 'fieldRow'}>
          <div className="fieldGroup">
            <label htmlFor="lead-email">
              Sähköposti <span aria-hidden="true">*</span>
            </label>
            <input
              id="lead-email"
              name="email"
              type="email"
              required
              maxLength={254}
              autoComplete="email"
              {...a11yErrorProps('email', fieldErrors)}
            />
            <FieldError name="email" errors={fieldErrors} />
          </div>
          {!compact && (
            <>
              <div className="fieldGroup">
                <label htmlFor="lead-phone">Puhelinnumero</label>
                <input
                  id="lead-phone"
                  name="phone"
                  type="tel"
                  maxLength={40}
                  autoComplete="tel"
                  {...a11yErrorProps('phone', fieldErrors)}
                />
                <FieldError name="phone" errors={fieldErrors} />
              </div>
            </>
          )}
        </div>

        <div className="fieldGroup">
          <label htmlFor="lead-profile">
            Verkkosivu tai Instagram <span aria-hidden="true">*</span>
          </label>
          <input
            id="lead-profile"
            name="profile"
            required
            maxLength={300}
            list="lead-profile-options"
            value={profileValue}
            readOnly={profileValue === NO_PROFILE_YET}
            onChange={(event) => setProfileValue(event.target.value)}
            placeholder="yritys.fi tai @yritys"
            {...a11yErrorProps('profile', fieldErrors)}
          />
          <datalist id="lead-profile-options">
            <option value={NO_PROFILE_YET} />
          </datalist>
          <button
            className="leadProfileNoWebsite"
            type="button"
            aria-pressed={profileValue === NO_PROFILE_YET}
            onClick={() => {
              markStarted();
              setProfileValue((current) => current === NO_PROFILE_YET ? '' : NO_PROFILE_YET);
            }}
          >
            <span aria-hidden="true">{profileValue === NO_PROFILE_YET ? '☑' : '□'}</span>
            Ei vielä verkkosivua tai Instagramia
          </button>
          <FieldError name="profile" errors={fieldErrors} />
        </div>

        {proposal && (
          <div className="fieldGroup">
            <label htmlFor="lead-service">Mistä palvelusta olet kiinnostunut?</label>
            <select id="lead-service" name="service" defaultValue={defaultService || ""}>
              <option value="">En vielä tiedä</option>
              <option value="websites">Verkkosivut</option>
              <option value="social">Social</option>
              <option value="seo">SEO / hakukonenäkyvyys</option>
            </select>
          </div>
        )}

        {compact ? (
          <details className="optionalFields">
            <summary>Lisätiedot (vapaaehtoinen)</summary>
            <div>
              <div className="fieldGroup">
                <label htmlFor="lead-phone">Puhelinnumero</label>
                <input
                  id="lead-phone"
                  name="phone"
                  type="tel"
                  maxLength={40}
                  autoComplete="tel"
                  {...a11yErrorProps('phone', fieldErrors)}
                />
                <FieldError name="phone" errors={fieldErrors} />
              </div>
              <div className="fieldGroup">
                <label htmlFor="lead-message">{proposal ? "Mitä haluat parantaa?" : "Mitä materiaalia sinulla on?"}</label>
                <textarea
                  id="lead-message"
                  name="message"
                  rows={4}
                  maxLength={1200}
                  placeholder={proposal ? "Esim. verkkosivut, some tai hakukonenäkyvyys..." : "Esim. työmaakuvia, valmiita kohteita, videoita..."}
                  {...a11yErrorProps('message', fieldErrors)}
                />
                <FieldError name="message" errors={fieldErrors} />
              </div>
            </div>
          </details>
        ) : (
          <>
            <div className="fieldGroup">
              <label htmlFor="lead-message">Mitä materiaalia sinulla on?</label>
              <textarea
                id="lead-message"
                name="message"
                rows={4}
                maxLength={1200}
                placeholder={proposal ? "Esim. verkkosivut, some tai hakukonenäkyvyys..." : "Esim. työmaakuvia, valmiita kohteita, videoita..."}
                {...a11yErrorProps('message', fieldErrors)}
              />
              <FieldError name="message" errors={fieldErrors} />
            </div>
          </>
        )}

        <input className="trap" name="fax" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <button className="button button--signal formSubmit" type="submit" disabled={submitting}>
          {submitting ? 'LÄHETETÄÄN…' : proposal ? 'PYYDÄ EHDOTUS' : 'PYYDÄ 2 SISÄLTÖESIMERKKIÄ'}{' '}
          <span aria-hidden="true">→</span>
        </button>
        <p className="formMicrocopy">
          {proposal ? 'Kerro tilanteestanne. Ehdotamme sopivaa seuraavaa askelta ilman sitoumusta.' : 'Ei myyntipalaveripakkoa. Katsomme ensin, mitä nykyisestä materiaalistanne voidaan tehdä.'}
        </p>
        <p className="formNote">
          Tietoja käytetään vain yhteydenoton käsittelyyn.{' '}
          <a href="/tietosuoja">Tietosuojaseloste</a>.
        </p>
      </form>
    </>
  );
}
