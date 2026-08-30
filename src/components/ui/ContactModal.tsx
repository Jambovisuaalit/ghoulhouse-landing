'use client';

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { siteConfig } from '@/config/site';
import type { ContactIntent } from '@/components/contact/ContactProvider';
import { trackEvent } from '@/lib/analytics';

interface ContactModalProps {
  onClose: () => void;
  intent: ContactIntent;
}

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactModal({ onClose, intent }: ContactModalProps) {
  const isBooking = intent === 'booking';
  const [status, setStatus] = useState<SubmitState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const hasStarted = useRef(false);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    previousFocus.current = document.activeElement as HTMLElement | null;
    firstInputRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]), summary, a[href], [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => {
        if (element.hasAttribute('hidden')) return false;

        const closedDetails = element.closest('details:not([open])');
        return !closedDetails || element.tagName === 'SUMMARY';
      });

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      previousFocus.current?.focus();
    };
  }, [onClose]);

  const markStarted = () => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    trackEvent('lead_form_start');
  };

  const focusFirstError = (errors: Record<string, string>) => {
    const firstField = Object.keys(errors)[0];
    if (!firstField) return;

    requestAnimationFrame(() => {
      formRef.current
        ?.querySelector<HTMLElement>(`[name="${firstField}"]`)
        ?.focus();
    });
  };

  const getClientErrors = (data: Record<string, FormDataEntryValue>) => {
    const errors: Record<string, string> = {};
    const company = String(data.company || '').trim();
    const name = String(data.name || '').trim();
    const email = String(data.email || '').trim();
    const profile = String(data.profile || '').trim();

    if (!company) errors.company = 'Yritys on pakollinen.';
    if (!name) errors.name = 'Nimi on pakollinen.';

    if (!email) {
      errors.email = 'Sähköposti on pakollinen.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Tarkista sähköpostiosoite.';
    }

    if (!profile) {
      errors.profile = 'Verkkosivu tai Instagram on pakollinen.';
    }

    return errors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const clientErrors = getClientErrors(data);

    if (Object.keys(clientErrors).length > 0) {
      setStatus('error');
      setFieldErrors(clientErrors);
      setErrorMessage('Tarkista merkityt kentät.');
      focusFirstError(clientErrors);
      return;
    }

    setStatus('submitting');
    trackEvent('lead_form_submit');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        code?: string;
        errors?: Record<string, string>;
      };

      if (!response.ok || !payload.ok) {
        if (payload.errors) {
          setFieldErrors(payload.errors);
          focusFirstError(payload.errors);
        }

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

  return (
    <div
      className="contact-modal-backdrop fixed inset-0 z-50 flex items-end justify-center bg-ink/80 p-0 sm:items-center sm:p-4 md:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="max-h-[96svh] w-full overflow-y-auto border-t-2 border-ink bg-ghost sm:max-w-2xl sm:border-2"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        aria-describedby="contact-modal-description"
        aria-busy={status === 'submitting'}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between border-b-2 border-ink bg-ghost px-4 py-4 sm:p-6">
          <div className="pr-4">
            <p className="type-label text-signal">
              {isBooking ? '20 min keskustelu' : 'Yksityinen konseptidemo'}
            </p>
            <h2
              id="contact-modal-title"
              className="mt-2 text-[clamp(1.9rem,6vw,2.8rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.035em] text-ink"
            >
              {isBooking ? siteConfig.cta.primary : siteConfig.cta.secondary}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-ink bg-ghost text-2xl leading-none text-ink hover:bg-ink hover:text-ghost"
            aria-label="Sulje yhteydenottolomake"
          >
            ×
          </button>
        </div>

        {status === 'success' ? (
          <div className="p-5 sm:p-8" aria-live="polite">
            <p className="type-label text-signal">
              {isBooking ? 'Keskustelupyyntö vastaanotettu' : 'Demopyyntö vastaanotettu'}
            </p>
            <h3 className="mt-3 text-3xl font-extrabold uppercase leading-[0.95] tracking-[-0.03em] text-ink sm:text-4xl">
              Seuraavaksi.
            </h3>

            <div className="mt-6 border-y-2 border-ink">
              <div className="grid grid-cols-[42px_1fr] gap-3 border-b border-ink/20 py-4">
                <span className="type-label text-signal">01</span>
                <p className="type-ui text-ink">
                  {isBooking
                  ? 'Käymme läpi antamasi tiedot ja palaamme keskustelun sopimiseksi.'
                  : 'Käymme läpi antamasi verkkosivun tai Instagram-profiilin.'}
                </p>
              </div>
              <div className="grid grid-cols-[42px_1fr] gap-3 border-b border-ink/20 py-4">
                <span className="type-label text-signal">02</span>
                <p className="type-ui text-ink">
                  {isBooking
                    ? 'Ehdotamme keskustelulle sopivaa etenemistapaa ja vahvistamme ajan erikseen.'
                    : 'Työkuvien varsinainen toimituskanava vahvistetaan erikseen: [TARKISTA].'}
                </p>
              </div>
              <div className="grid grid-cols-[42px_1fr] gap-3 py-4">
                <span className="type-label text-signal">03</span>
                <p className="type-ui text-ink">
                  {isBooking
                    ? '20 minuutin keskustelussa käydään läpi tarve, materiaalit ja SOME 12 -palvelun sopivuus.'
                    : 'Kun kuvat ja faktat on vahvistettu, konseptidemo voidaan rakentaa ilman oletuksia käyttöoikeuksista.'}
                </p>
              </div>
            </div>

            <p className="type-caption mt-5 max-w-lg text-ink/65">
              Mahdollinen materiaalipyyntö ja esimerkkien eteneminen
              vahvistetaan erikseen sähköpostitse.
            </p>

            <button
              type="button"
              className="btn btn-secondary mt-7 w-full sm:w-auto"
              onClick={onClose}
            >
              Sulje
            </button>
          </div>
        ) : (
          <form
            ref={formRef}
            className="p-4 sm:p-7"
            onSubmit={handleSubmit}
            onChange={markStarted}
            noValidate
          >
            <div
              id="contact-modal-description"
              className="border-b border-ink/20 pb-5"
            >
              <p className="type-editorial max-w-xl text-ink/70">
                {isBooking
                  ? 'Anna perustiedot, jotta voimme sopia 20 minuutin keskustelun. Varsinainen ajankohta vahvistetaan erikseen.'
                  : 'Anna perustiedot konseptidemoa varten. Työkuvien varsinainen toimituskanava vahvistetaan erikseen: [TARKISTA].'}
              </p>

              <div className="type-caption mt-4 grid grid-cols-1 gap-2 uppercase tracking-[0.05em] text-ink/60 sm:grid-cols-3">
                <span>01 · Lähetä tiedot</span>
                <span>02 · Katsomme yrityksen</span>
                <span>03 · Pyydämme kuvat tarvittaessa</span>
              </div>
            </div>

            <div className="sr-only" aria-hidden="true">
              <label htmlFor="fax">Jätä tämä kenttä tyhjäksi</label>
              <input
                id="fax"
                name="fax"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <input type="hidden" name="intent" value={intent} />
            <fieldset
              disabled={status === 'submitting'}
              className="mt-6"
            >
              <legend className="type-label mb-4 text-signal">
                Tarvitsemme nämä
              </legend>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  id="company"
                  label="Yritys"
                  required
                  error={fieldErrors.company}
                >
                  <input
                    ref={firstInputRef}
                    id="company"
                    name="company"
                    type="text"
                    required
                    maxLength={120}
                    autoComplete="organization"
                    enterKeyHint="next"
                    className="form-control"
                    aria-invalid={Boolean(fieldErrors.company)}
                    aria-describedby={
                      fieldErrors.company ? 'company-error' : undefined
                    }
                  />
                </Field>

                <Field
                  id="name"
                  label="Nimi"
                  required
                  error={fieldErrors.name}
                >
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    maxLength={120}
                    autoComplete="name"
                    enterKeyHint="next"
                    className="form-control"
                    aria-invalid={Boolean(fieldErrors.name)}
                    aria-describedby={
                      fieldErrors.name ? 'name-error' : undefined
                    }
                  />
                </Field>
              </div>

              <div className="mt-4 grid gap-4">
                <Field
                  id="email"
                  label="Email"
                  required
                  error={fieldErrors.email}
                >
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    maxLength={254}
                    autoComplete="email"
                    inputMode="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    enterKeyHint="next"
                    className="form-control"
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={
                      fieldErrors.email ? 'email-error' : undefined
                    }
                  />
                </Field>

                <Field
                  id="profile"
                  label="Verkkosivu tai Instagram"
                  required
                  error={fieldErrors.profile}
                  hint="Esim. yritys.fi tai @yritys"
                >
                  <input
                    id="profile"
                    name="profile"
                    type="text"
                    required
                    maxLength={300}
                    autoComplete="url"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    enterKeyHint="done"
                    placeholder="yritys.fi tai @yritys"
                    className="form-control"
                    aria-invalid={Boolean(fieldErrors.profile)}
                    aria-describedby={
                      fieldErrors.profile
                        ? 'profile-hint profile-error'
                        : 'profile-hint'
                    }
                  />
                </Field>
              </div>

              <details className="group mt-5 border-y border-ink/20">
                <summary className="type-ui flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-3 text-ink [&::-webkit-details-marker]:hidden">
                  <span>Puhelin tai viesti</span>
                  <span className="type-label text-ink/65">
                    valinnainen
                  </span>
                </summary>

                <div className="grid gap-4 border-t border-ink/20 pb-4 pt-4">
                  <Field
                    id="phone"
                    label="Puhelin"
                    error={fieldErrors.phone}
                  >
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      maxLength={40}
                      autoComplete="tel"
                      inputMode="tel"
                      enterKeyHint="next"
                      className="form-control"
                      aria-invalid={Boolean(fieldErrors.phone)}
                      aria-describedby={
                        fieldErrors.phone ? 'phone-error' : undefined
                      }
                    />
                  </Field>

                  <Field
                    id="message"
                    label="Viesti"
                    error={fieldErrors.message}
                    hint="Halutessasi voit kertoa palvelusta tai materiaalista."
                  >
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      maxLength={1200}
                      className="form-control resize-y"
                      placeholder="Valinnainen lisätieto"
                      aria-invalid={Boolean(fieldErrors.message)}
                      aria-describedby={
                        fieldErrors.message
                          ? 'message-hint message-error'
                          : 'message-hint'
                      }
                    />
                  </Field>
                </div>
              </details>
            </fieldset>

            {status === 'error' && errorMessage && (
              <div
                className="type-ui mt-5 border-2 border-signal bg-white p-4 text-ink"
                role="alert"
                aria-live="assertive"
              >
                {errorMessage}
              </div>
            )}

            <div className="mt-6 border-t-2 border-ink pt-5">
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="btn btn-primary min-h-14 w-full justify-between uppercase tracking-[0.07em] disabled:cursor-wait disabled:opacity-60"
              >
                <span>
                  {status === 'submitting'
                    ? 'PYYNTÖÄ LÄHETETÄÄN…'
                    : isBooking
                      ? siteConfig.cta.primary
                      : siteConfig.cta.secondary}
                </span>
                <span
                  aria-hidden="true"
                  className={status === 'submitting' ? 'animate-spin' : ''}
                >
                  {status === 'submitting' ? '↻' : '→'}
                </span>
              </button>

              <div className="type-caption mt-4 grid gap-2 text-ink/60 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-6">
                <p>
                  Antamiasi tietoja käytetään tämän yhteydenottopyynnön
                  käsittelyyn ja siihen liittyvään viestintään.
                  {siteConfig.legal.privacyPath && (
                    <>
                      {' '}
                      <a
                        href={siteConfig.legal.privacyPath}
                        className="font-bold text-ink underline underline-offset-2"
                      >
                        Tietosuojaseloste
                      </a>
                      .
                    </>
                  )}
                </p>
                <p className="font-bold text-ink/70">
                  {isBooking
                    ? 'Keskusteluaika vahvistetaan erikseen.'
                    : 'Kuvien toimituskanava: [TARKISTA].'}
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
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
      <label htmlFor={id} className="type-ui mb-1.5 block text-ink">
        {label}
        {required ? ' *' : ''}
      </label>

      {children}

      {hint && (
        <p
          id={`${id}-hint`}
          className="type-caption mt-1.5 text-ink/60"
        >
          {hint}
        </p>
      )}

      {error && (
        <p
          id={`${id}-error`}
          className="type-caption mt-1.5 font-bold text-signal"
        >
          {error}
        </p>
      )}
    </div>
  );
}
