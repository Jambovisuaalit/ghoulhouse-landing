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

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    firstFieldRef.current?.focus();

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleEscape);
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
    const name = String(form.get('name') ?? '');
    const company = String(form.get('company') ?? '');
    const contact = String(form.get('contact') ?? '');
    const note = String(form.get('note') ?? '');

    const subject = encodeURIComponent(`2 sisältöesimerkkiä — ${company || name}`);
    const body = encodeURIComponent(
      `Nimi: ${name}\nYritys: ${company}\nPuhelin / sähköposti: ${contact}\n\nLisätieto:\n${note}`
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
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.15em] text-signal">
              Maksuton demo
            </p>
            <h2 id="contact-modal-title" className="mt-2 text-3xl text-ink">
              Pyydä 2 sisältöesimerkkiä
            </h2>
          </div>
          <button
            type="button"
            className="min-h-11 min-w-11 border-2 border-ink bg-transparent text-2xl leading-none text-ink"
            onClick={onClose}
            aria-label="Sulje yhteydenottolomake"
          >
            ×
          </button>
        </div>

        <p id="contact-modal-description" className="mt-4 text-ink/75">
          Lähetä perustiedot. Teemme kaksi konseptiesimerkkiä yrityksesi nykyisestä
          materiaalista ennen varsinaista tarjousta.
        </p>

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-2 font-semibold text-ink">
            Nimi
            <input
              ref={firstFieldRef}
              name="name"
              required
              autoComplete="name"
              className="min-h-12 border-2 border-ink bg-white px-3 text-base font-normal"
            />
          </label>

          <label className="grid gap-2 font-semibold text-ink">
            Yritys
            <input
              name="company"
              required
              autoComplete="organization"
              className="min-h-12 border-2 border-ink bg-white px-3 text-base font-normal"
            />
          </label>

          <label className="grid gap-2 font-semibold text-ink">
            Puhelin tai sähköposti
            <input
              name="contact"
              required
              autoComplete="email"
              className="min-h-12 border-2 border-ink bg-white px-3 text-base font-normal"
            />
          </label>

          <label className="grid gap-2 font-semibold text-ink">
            Mitä palvelua haluatte näyttää?
            <textarea
              name="note"
              rows={3}
              className="border-2 border-ink bg-white px-3 py-3 text-base font-normal"
            />
          </label>

          <button type="submit" className="btn btn-primary mt-2 w-full">
            Lähetä demopyyntö
          </button>
        </form>
      </div>
    </div>
  );
}
