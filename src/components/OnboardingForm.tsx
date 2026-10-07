'use client';

import { FormEvent, useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { NO_PROFILE_YET } from '@/lib/lead';

type State = 'idle' | 'submitting' | 'error';

function value(formData: FormData, key: string) {
  return String(formData.get(key) || '').trim();
}

function buildMessage(formData: FormData) {
  const rows = [
    ['Tavoite', value(formData, 'goal')],
    ['Palvelut / työt joita halutaan myydä', value(formData, 'services')],
    ['Palvelualue', value(formData, 'serviceArea')],
    ['Kohdeasiakas', value(formData, 'targetCustomer')],
    ['Instagram', value(formData, 'instagram')],
    ['Materiaalit', value(formData, 'materials')],
    ['Materiaalilinkki', value(formData, 'materialsLink')],
    ['Meta-oikeudet', value(formData, 'metaAccess')],
    ['Hyväksyjä', value(formData, 'approvalContact')],
    ['Tyyli / toiveet', value(formData, 'tone')],
    ['Lisätiedot', value(formData, 'notes')],
  ]
    .filter(([, content]) => content)
    .map(([label, content]) => `${label}: ${content}`);

  return ['SOCIAL 12 ONBOARDING', ...rows].join('\n').slice(0, 1200);
}

export default function OnboardingForm() {
  const [state, setState] = useState<State>('idle');
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const website = value(formData, 'website');
    const instagram = value(formData, 'instagram');

    setState('submitting');
    setError('');
    trackEvent('lead_form_submit', { source: 'onboarding' });

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          intent: 'booking',
          service: 'social',
          company: value(formData, 'company'),
          name: value(formData, 'name'),
          email: value(formData, 'email'),
          phone: value(formData, 'phone'),
          profile: website || instagram || NO_PROFILE_YET,
          message: buildMessage(formData),
        }),
      });

      if (response.ok) {
        trackEvent('lead_form_success', { source: 'onboarding' });
        window.location.assign('/aloitus/kiitos');
        return;
      }

      const payload = await response.json().catch(() => ({}));
      const firstError = payload?.errors ? Object.values(payload.errors)[0] : null;
      setError(
        typeof firstError === 'string'
          ? firstError
          : 'Lähetys ei onnistunut. Lähetä tiedot Hannalle tai yritä uudelleen.'
      );
      setState('error');
      trackEvent('lead_form_error', { source: 'onboarding' });
    } catch {
      setError('Yhteys katkesi. Yritä uudelleen.');
      setState('error');
      trackEvent('lead_form_error', { source: 'onboarding' });
    }
  }

  return (
    <form className="onboardingForm" onSubmit={submit}>
      <fieldset>
        <legend>01 / Yritys ja yhteyshenkilö</legend>
        <div className="onboardingGrid onboardingGrid--two">
          <label>
            Yritys *
            <input name="company" required maxLength={120} autoComplete="organization" />
          </label>
          <label>
            Yhteyshenkilö *
            <input name="name" required maxLength={120} autoComplete="name" />
          </label>
          <label>
            Sähköposti *
            <input name="email" required type="email" maxLength={254} autoComplete="email" />
          </label>
          <label>
            Puhelin
            <input name="phone" type="tel" maxLength={40} autoComplete="tel" />
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend>02 / Nykyinen näkyvyys</legend>
        <div className="onboardingGrid onboardingGrid--two">
          <label>
            Verkkosivu
            <input name="website" maxLength={300} placeholder="yritys.fi" />
          </label>
          <label>
            Instagram
            <input name="instagram" maxLength={120} placeholder="@yritys" />
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend>03 / Mitä haluatte somen tekevän?</legend>
        <div className="onboardingGrid">
          <label>
            Päätavoite *
            <select name="goal" required defaultValue="">
              <option value="" disabled>Valitse</option>
              <option>Lisää tarjouspyyntöjä / uusia asiakkaita</option>
              <option>Tehdyn työn ja referenssien näkyväksi tekeminen</option>
              <option>Brändin tunnettuus ja uskottavuus</option>
              <option>Rekrytointi</option>
              <option>Muu tavoite</option>
            </select>
          </label>
          <label>
            Mitä palveluja tai töitä haluatte erityisesti myydä? *
            <textarea name="services" required rows={3} maxLength={350} placeholder="Esim. kylpyhuoneremontit, LVI-huollot, saneeraukset..." />
          </label>
          <div className="onboardingGrid onboardingGrid--two">
            <label>
              Palvelualue *
              <input name="serviceArea" required maxLength={180} placeholder="Esim. Helsinki, Espoo, Vantaa" />
            </label>
            <label>
              Tärkein kohdeasiakas
              <input name="targetCustomer" maxLength={220} placeholder="Esim. omakotitalon omistaja, taloyhtiö..." />
            </label>
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend>04 / Materiaalit ja käyttöoikeudet</legend>
        <div className="onboardingGrid">
          <label>
            Mitä materiaalia teillä on? *
            <select name="materials" required defaultValue="">
              <option value="" disabled>Valitse</option>
              <option>Työmaakuvia ja/tai videoita valmiina</option>
              <option>Materiaali toimitetaan WhatsAppissa</option>
              <option>Materiaali on Drive/Dropbox/OneDrive-linkissä</option>
              <option>Materiaalia on vähän - tarvitsemme ohjeet kuvaamiseen</option>
            </select>
          </label>
          <label>
            Materiaalilinkki
            <input name="materialsLink" type="url" maxLength={500} placeholder="https://..." />
          </label>
          <label>
            Instagram/Facebook Meta-oikeudet *
            <select name="metaAccess" required defaultValue="">
              <option value="" disabled>Valitse</option>
              <option>Oikeudet voidaan antaa heti</option>
              <option>Tarvitsemme ohjeet oikeuksien antamiseen</option>
              <option>Ei vielä - sovitaan erikseen</option>
            </select>
          </label>
          <label>
            Kuka hyväksyy julkaisut?
            <input name="approvalContact" maxLength={220} placeholder="Nimi + sähköposti / WhatsApp" />
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend>05 / Tyyli ja muut toiveet</legend>
        <div className="onboardingGrid">
          <label>
            Toivottu tyyli / asiat joita pitää välttää
            <textarea name="tone" rows={3} maxLength={350} placeholder="Esim. asiallinen, suoraviivainen, ei liian myyvä..." />
          </label>
          <label>
            Lisätiedot
            <textarea name="notes" rows={3} maxLength={350} />
          </label>
        </div>
      </fieldset>

      {error ? <p className="onboardingError" role="alert">{error}</p> : null}

      <button className="onboardingSubmit" type="submit" disabled={state === 'submitting'}>
        {state === 'submitting' ? 'LÄHETETÄÄN…' : 'LÄHETÄ ALOITUSTIEDOT →'}
      </button>
      <p className="onboardingPrivacy">
        Tietoja käytetään palvelun käynnistämiseen ja asiakastyön toteuttamiseen.{' '}
        <a href="/tietosuoja">Tietosuojaseloste</a>.
      </p>
    </form>
  );
}
