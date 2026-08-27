'use client';

import { FormEvent, useState } from 'react';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function LeadForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [startedAt] = useState(() => String(Date.now()));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setMessage('');

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/demo-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        setStatus('error');
        setMessage(data.message ?? 'Pyyntöä ei voitu lähettää. Yritä myöhemmin uudelleen.');
        return;
      }

      setStatus('success');
      setMessage('Kiitos. Pyyntö on lähetetty.');
      form.reset();
    } catch {
      setStatus('error');
      setMessage('Pyyntöä ei voitu lähettää juuri nyt. Yritä myöhemmin uudelleen.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="lead-form" aria-describedby="form-status">
      <div className="form-grid">
        <label>
          <span>Yritys *</span>
          <input name="company" autoComplete="organization" required maxLength={120} />
        </label>
        <label>
          <span>Nimi *</span>
          <input name="name" autoComplete="name" required maxLength={120} />
        </label>
        <label>
          <span>Sähköposti *</span>
          <input name="email" type="email" autoComplete="email" required maxLength={160} />
        </label>
        <label>
          <span>Puhelin</span>
          <input name="phone" type="tel" autoComplete="tel" maxLength={40} />
        </label>
        <label>
          <span>Verkkosivu</span>
          <input name="website" type="url" inputMode="url" placeholder="https://" maxLength={240} />
        </label>
        <label>
          <span>Instagram</span>
          <input name="instagram" maxLength={120} placeholder="@yritys" />
        </label>
      </div>
      <label className="mt-4 block">
        <span>Viesti</span>
        <textarea name="message" rows={4} maxLength={1200} placeholder="Mitä haluat meidän katsovan?" />
      </label>
      <label className="sr-only" aria-hidden="true">
        <span>Jätä tyhjäksi</span>
        <input name="companyWebsite" tabIndex={-1} autoComplete="off" />
      </label>
      <input type="hidden" name="startedAt" value={startedAt} />

      <button className="btn-primary mt-6 w-full sm:w-auto" type="submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'LÄHETETÄÄN…' : 'PYYDÄ 2 SISÄLTÖESIMERKKIÄ'}
      </button>
      <p id="form-status" className="mt-4 min-h-6 text-sm" role="status" aria-live="polite">
        {message}
      </p>
      <p className="mt-2 max-w-xl text-xs leading-5 text-ink/70">
        Lähettämällä pyynnön annat GhoulHouselle luvan käyttää toimittamiasi yritystietoja yhteydenottoon ja kahden konseptiesimerkin valmisteluun.
      </p>
    </form>
  );
}
