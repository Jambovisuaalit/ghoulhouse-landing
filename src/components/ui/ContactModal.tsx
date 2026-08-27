'use client';

import type { FormEvent } from 'react';
import { useEffect } from 'react';

interface ContactModalProps {
  onClose: () => void;
}

const contactEmail = 'hanna.n-96@hotmail.com';

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim();
}

export default function ContactModal({ onClose }: ContactModalProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const company = value(formData, 'company');
    const name = value(formData, 'name');
    const email = value(formData, 'email');
    const phone = value(formData, 'phone');
    const website = value(formData, 'website');
    const instagram = value(formData, 'instagram');
    const message = value(formData, 'message');

    const subject = `GhoulHouse — 2 sisältöesimerkkiä — ${company}`;
    const body = [
      `Yritys: ${company}`,
      `Nimi: ${name}`,
      `Sähköposti: ${email}`,
      phone && `Puhelin: ${phone}`,
      website && `Verkkosivut: ${website}`,
      instagram && `Instagram: ${instagram}`,
      message && `Viesti: ${message}`,
    ]
      .filter(Boolean)
      .join('\n');

    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      <div className="bg-white rounded-lg max-w-lg w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 id="contact-modal-title" className="text-2xl font-bold text-ink">
            PYYDÄ 2 SISÄLTÖESIMERKKIÄ
          </h2>
          <button type="button" onClick={onClose} className="text-ink hover:text-signal transition-colors p-2" aria-label="Sulje yhteydenottolomake">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-ink mb-1">Yritys *</label>
            <input id="company" name="company" type="text" required autoComplete="organization" className="w-full px-4 py-2 border border-bone rounded focus:outline-none focus:ring-2 focus:ring-signal" placeholder="Esim. Remontti Oy" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-ink mb-1">Nimi *</label>
              <input id="name" name="name" type="text" required autoComplete="name" className="w-full px-4 py-2 border border-bone rounded focus:outline-none focus:ring-2 focus:ring-signal" placeholder="Etunimi Sukunimi" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink mb-1">Sähköposti *</label>
              <input id="email" name="email" type="email" required autoComplete="email" className="w-full px-4 py-2 border border-bone rounded focus:outline-none focus:ring-2 focus:ring-signal" placeholder="nimi@yritys.fi" />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-ink mb-1">Puhelinnumero</label>
            <input id="phone" name="phone" type="tel" autoComplete="tel" className="w-full px-4 py-2 border border-bone rounded focus:outline-none focus:ring-2 focus:ring-signal" placeholder="+358 40 123 4567" />
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium text-ink mb-1">Yrityksen verkkosivut</label>
            <input id="website" name="website" type="url" autoComplete="url" className="w-full px-4 py-2 border border-bone rounded focus:outline-none focus:ring-2 focus:ring-signal" placeholder="https://yritys.fi" />
          </div>

          <div>
            <label htmlFor="instagram" className="block text-sm font-medium text-ink mb-1">Instagram-profiili</label>
            <input id="instagram" name="instagram" type="text" className="w-full px-4 py-2 border border-bone rounded focus:outline-none focus:ring-2 focus:ring-signal" placeholder="@yritys" />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-ink mb-1">Viesti (vapaaehtoinen)</label>
            <textarea id="message" name="message" rows={3} className="w-full px-4 py-2 border border-bone rounded focus:outline-none focus:ring-2 focus:ring-signal resize-none" placeholder="Kerro lyhyesti yrityksestäsi ja mitä etsit..." />
          </div>

          <button type="submit" className="w-full btn btn-primary">LÄHETÄ PYYNTÖ</button>

          <p className="text-xs text-ink/60 text-center">
            Lomake avaa sähköpostiohjelmasi valmiiksi täytetyllä viestillä. Sivusto ei lähetä tietoja taustalla.
          </p>
        </form>
      </div>
    </div>
  );
}
