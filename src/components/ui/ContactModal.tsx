'use client';

import { useEffect, useRef } from 'react';
import type { FormEvent, KeyboardEvent as ReactKeyboardEvent } from 'react';

interface ContactModalProps {
  onClose: () => void;
}

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'hanna.n-96@hotmail.com';

export default function ContactModal({ onClose }: ContactModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    firstFieldRef.current?.focus();

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleEscape);
      previousFocusRef.current?.focus();
    };
  }, [onClose]);

  const handleFocusTrap = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab' || !dialogRef.current) return;

    const focusable = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(
        'button, a[href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((element) => !element.hasAttribute('disabled'));

    if (focusable.length === 0) return;

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const company = String(form.get('company') ?? '');
    const name = String(form.get('name') ?? '');
    const email = String(form.get('email') ?? '');
    const phone = String(form.get('phone') ?? '');
    const website = String(form.get('website') ?? '');
    const instagram = String(form.get('instagram') ?? '');
    const message = String(form.get('message') ?? '');

    const subject = encodeURIComponent(`2 sisältöesimerkkiä — ${company}`);
    const body = encodeURIComponent(
      [
        `Yritys: ${company}`,
        `Nimi: ${name}`,
        `Sähköposti: ${email}`,
        `Puhelin: ${phone}`,
        `Verkkosivu: ${website}`,
        `Instagram: ${instagram}`,
        '',
        'Lisätieto:',
        message,
      ].join('\n')
    );

    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/80 sm:items-center sm:p-6">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        aria-describedby="contact-modal-description"
        className="max-h-[92dvh] w-full overflow-y-auto bg-ghost p-6 shadow-2xl sm:max-w-xl sm:p-8"
        onKeyDown={handleFocusTrap}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-signal">
              Maksuton demo
            </p>
            <h2 id="contact-modal-title" className="text-2xl font-bold text-ink">
              Pyydä 2 sisältöesimerkkiä
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-11 min-w-11 items-center justify-center border-2 border-ink bg-transparent text-2xl text-ink"
            aria-label="Sulje yhteydenottolomake"
          >
            ×
          </button>
        </div>

        <p id="contact-modal-description" className="mb-6 text-sm text-ink/70">
          Lähetä perustiedot. Teemme kaksi yrityskohtaista konseptiesimerkkiä nykyisen materiaalinne pohjalta ennen varsinaista tarjousta.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="company" className="mb-1 block text-sm font-medium text-ink">
              Yritys *
            </label>
            <input
              ref={firstFieldRef}
              id="company"
              name="company"
              type="text"
              autoComplete="organization"
              required
              className="min-h-12 w-full border-2 border-ink bg-white px-3"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-ink">
                Nimi *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="min-h-12 w-full border-2 border-ink bg-white px-3"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink">
                Sähköposti *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="min-h-12 w-full border-2 border-ink bg-white px-3"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="mb-1 block text-sm font-medium text-ink">
              Puhelinnumero
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              className="min-h-12 w-full border-2 border-ink bg-white px-3"
            />
          </div>

          <div>
            <label htmlFor="website" className="mb-1 block text-sm font-medium text-ink">
              Yrityksen verkkosivut
            </label>
            <input
              id="website"
              name="website"
              type="url"
              inputMode="url"
              className="min-h-12 w-full border-2 border-ink bg-white px-3"
            />
          </div>

          <div>
            <label htmlFor="instagram" className="mb-1 block text-sm font-medium text-ink">
              Instagram-profiili
            </label>
            <input
              id="instagram"
              name="instagram"
              type="text"
              className="min-h-12 w-full border-2 border-ink bg-white px-3"
            />
          </div>

          <div>
            <label htmlFor="message" className="mb-1 block text-sm font-medium text-ink">
              Lisätieto
            </label>
            <textarea
              id="message"
              name="message"
              rows={3}
              className="w-full resize-y border-2 border-ink bg-white px-3 py-3"
            />
          </div>

          <ButtonLikeSubmit />
        </form>
      </div>
    </div>
  );
}

function ButtonLikeSubmit() {
  return (
    <button type="submit" className="btn btn-primary w-full">
      Lähetä demopyyntö
    </button>
  );
}
