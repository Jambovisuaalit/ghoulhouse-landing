'use client';

import { useEffect, FormEvent, useState } from 'react';

interface ContactModalProps {
  onClose: () => void;
}

export default function ContactModal({ onClose }: ContactModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      // TODO: Replace with actual backend endpoint
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      // if (!response.ok) throw new Error('Failed to submit');

      // Temporary: log to console for verification
      console.log('Contact form submitted:', data);
      alert('Kiitos yhteydenotosta! Vastaamme pian.');
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Virhe lähetyksen aikana. Yritä uudelleen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      <div className="bg-white rounded-lg max-w-lg w-full p-8 animate-in">
        <div className="flex justify-between items-center mb-6">
          <h2 id="contact-modal-title" className="text-2xl font-bold text-ink">
            Pyydä 2 sisältöesimerkkiä
          </h2>
          <button
            onClick={onClose}
            className="text-ink hover:text-signal transition-colors"
            aria-label="Sulje modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-ink mb-1">
              Yritys *
            </label>
            <input
              id="company"
              name="company"
              type="text"
              required
              className="w-full px-4 py-2 border border-bone rounded focus:outline-none focus:ring-2 focus:ring-signal"
              placeholder="Esim. Renovaatiot Oy"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-ink mb-1">
                Nimi *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full px-4 py-2 border border-bone rounded focus:outline-none focus:ring-2 focus:ring-signal"
                placeholder="Etunimi Sukunimi"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink mb-1">
                Sähköposti *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-2 border border-bone rounded focus:outline-none focus:ring-2 focus:ring-signal"
                placeholder="nimi@yritys.fi"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-ink mb-1">
              Puhelinnumero
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className="w-full px-4 py-2 border border-bone rounded focus:outline-none focus:ring-2 focus:ring-signal"
              placeholder="+358 50 123 4567"
            />
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium text-ink mb-1">
              Yrityksen verkkosivut
            </label>
            <input
              id="website"
              name="website"
              type="url"
              className="w-full px-4 py-2 border border-bone rounded focus:outline-none focus:ring-2 focus:ring-signal"
              placeholder="https://yritys.fi"
            />
          </div>

          <div>
            <label htmlFor="instagram" className="block text-sm font-medium text-ink mb-1">
              Instagram-profiili
            </label>
            <input
              id="instagram"
              name="instagram"
              type="text"
              className="w-full px-4 py-2 border border-bone rounded focus:outline-none focus:ring-2 focus:ring-signal"
              placeholder="@yritys"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-ink mb-1">
              Viesti (vapaaehtoinen)
            </label>
            <textarea
              id="message"
              name="message"
              rows={3}
              className="w-full px-4 py-2 border border-bone rounded focus:outline-none focus:ring-2 focus:ring-signal resize-none"
              placeholder="Kerro lyhyesti yrityksestäsi ja mitä etsit..."
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Lähetetään...' : 'Lähetä pyyntö'}
            </button>
          </div>

          <p className="text-xs text-ink/60 text-center mt-4">
            Vastaamme pyyntöihin yleensä 24 tunnin sisällä.
          </p>
        </form>
      </div>
    </div>
  );
}
