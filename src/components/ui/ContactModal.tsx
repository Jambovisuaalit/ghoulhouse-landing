'use client';

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { siteConfig } from '@/config/site';
import { trackEvent } from '@/lib/analytics';

interface ContactModalProps {
  onClose: () => void;
}

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactModal({ onClose }: ContactModalProps) {
  const [status, setStatus] = useState<SubmitState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const hasStarted = useRef(false);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

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
          'button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => !element.hasAttribute('hidden'));

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitting');
    setErrorMessage('');
    setFieldErrors({});
    trackEvent('lead_form_submit');

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

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
        if (payload.errors) setFieldErrors(payload.errors);

        throw new Error(
          payload.code === 'delivery_unavailable'
            ? 'Lomakkeen toimituskanavaa ei ole vielä kytketty.'
            : 'Pyyntöä ei voitu lähettää.'
        );
      }

      setStatus('success');
      trackEvent('lead_form_success');
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Pyyntöä ei voitu lähettää. Yritä uudelleen.'
      );
      trackEvent('lead_form_error');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-3 md:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      aria-hidden="false"
    >
      <div
        ref={dialogRef}
        className="max-h-[94svh] w-full max-w-2xl overflow-y-auto border-2 border-ink bg-ghost shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        aria-describedby="contact-modal-description"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between border-b-2 border-ink bg-ghost p-5 md:p-7">
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-signal">
              Seuraava askel
            </p>
            <h2
              id="contact-modal-title"
              className="mt-2 font-display text-3xl font-black uppercase leading-none text-ink md:text-4xl"
            >
              {siteConfig.cta.primary}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-4 flex h-11 w-11 shrink-0 items-center justify-center border-2 border-ink bg-ghost text-2xl leading-none text-ink hover:bg-ink hover:text-ghost"
            aria-label="Sulje yhteydenottolomake"
          >
            ×
          </button>
        </div>

        {status === 'success' ? (
          <div className="p-6 md:p-10" aria-live="polite">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-signal">
              Pyyntö vastaanotettu
            </p>
            <h3 className="mt-3 font-display text-4xl font-black uppercase leading-none text-ink">
              Kiitos.
            </h3>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-ink/75">
              Yhteydenottopyyntö on lähetetty. GhoulHouse voi käyttää antamiasi
              tietoja tämän sisältöesimerkkipyynnön käsittelyyn.
            </p>
            <button
              type="button"
              className="btn btn-secondary mt-8"
              onClick={onClose}
            >
              Sulje
            </button>
          </div>
        ) : (
          <form
            className="p-5 md:p-8"
            onSubmit={handleSubmit}
            onChange={markStarted}
            noValidate
          >
            <p
              id="contact-modal-description"
              className="mb-7 max-w-xl text-sm leading-relaxed text-ink/65"
            >
              Kerro yritys ja yhteystiedot. Verkkosivu tai Instagram auttaa
              tekemään esimerkeistä yrityskohtaisia.
            </p>

            <div className="sr-only" aria-hidden="true">
              <label htmlFor="fax">Jätä tämä kenttä tyhjäksi</label>
              <input id="fax" name="fax" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
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
                  className="form-control"
                />
              </Field>

              <Field id="name" label="Nimi" required error={fieldErrors.name}>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  maxLength={120}
                  autoComplete="name"
                  className="form-control"
                />
              </Field>

              <Field
                id="email"
                label="Sähköposti"
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
                  className="form-control"
                />
              </Field>

              <Field id="phone" label="Puhelin" error={fieldErrors.phone}>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  maxLength={40}
                  autoComplete="tel"
                  className="form-control"
                />
              </Field>

              <Field
                id="website"
                label="Verkkosivu"
                error={fieldErrors.website}
              >
                <input
                  id="website"
                  name="website"
                  type="url"
                  maxLength={300}
                  inputMode="url"
                  placeholder="https://yritys.fi"
                  className="form-control"
                />
              </Field>

              <Field
                id="instagram"
                label="Instagram"
                error={fieldErrors.instagram}
              >
                <input
                  id="instagram"
                  name="instagram"
                  type="text"
                  maxLength={120}
                  placeholder="@yritys"
                  className="form-control"
                />
              </Field>
            </div>

            <Field
              id="message"
              label="Viesti (vapaaehtoinen)"
              error={fieldErrors.message}
              className="mt-5"
            >
              <textarea
                id="message"
                name="message"
                rows={4}
                maxLength={1200}
                className="form-control resize-y"
                placeholder="Mitä teette ja millaista työmaamateriaalia teiltä syntyy?"
              />
            </Field>

            {status === 'error' && (
              <div
                className="mt-5 border-2 border-signal bg-white p-4 text-sm text-ink"
                role="alert"
              >
                {errorMessage}
              </div>
            )}

            <div className="mt-7 border-t border-ink/20 pt-6">
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="btn btn-primary w-full uppercase tracking-[0.07em] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {status === 'submitting'
                  ? 'LÄHETETÄÄN…'
                  : siteConfig.cta.primary}
              </button>
              <p className="mt-3 text-xs leading-relaxed text-ink/55">
                Tietoja käytetään yhteydenottopyynnön käsittelyyn.
                Tietosuojatekstin julkaisu vaatii vielä yrityksen vahvistuksen
                ennen production-julkaisua.
              </p>
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
  className = '',
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-bold text-ink">
        {label}
        {required ? ' *' : ''}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs font-bold text-signal">
          {error}
        </p>
      )}
    </div>
  );
}
