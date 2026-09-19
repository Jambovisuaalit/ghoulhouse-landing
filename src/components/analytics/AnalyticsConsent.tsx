'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const CONSENT_KEY = 'ghoulhouse_analytics_consent';

type ConsentState = 'accepted' | 'rejected' | null;

function readConsent(): ConsentState {
  if (typeof window === 'undefined') return null;
  const value = window.localStorage.getItem(CONSENT_KEY);
  return value === 'accepted' || value === 'rejected' ? value : null;
}

export default function AnalyticsConsent() {
  const [consent, setConsent] = useState<ConsentState>(null);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [homepageSlot, setHomepageSlot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setConsent(readConsent());
    setReady(true);
    // On the homepage, keep consent in the document flow so it cannot cover CTA links.
    setHomepageSlot(document.getElementById('gh-consent-inflow'));
    const handleOpen = () => setOpen(true);
    window.addEventListener('ghoulhouse:analytics-settings', handleOpen);
    return () => window.removeEventListener('ghoulhouse:analytics-settings', handleOpen);
  }, []);

  const save = (value: Exclude<ConsentState, null>) => {
    window.localStorage.setItem(CONSENT_KEY, value);
    setConsent(value);
    setOpen(false);
    window.dispatchEvent(new CustomEvent('ghoulhouse:analytics-consent'));
  };

  // Consent controls require JavaScript; never obstruct the native no-JS page.
  if (!ready) return null;

  if (consent && !open) {
    const settings = (
      <button className="analyticsSettings" type="button" onClick={() => setOpen(true)}>
        Analytiikka-asetukset
      </button>
    );
    return homepageSlot ? createPortal(settings, homepageSlot) : settings;
  }

  const banner = (
    <aside className="analyticsConsent" aria-labelledby="analytics-consent-title">
      <div className="analyticsConsent__copy">
        <p className="kicker">ANALYTIIKKA</p>
        <h2 id="analytics-consent-title">SALLITAANKO KÄYTÖN MITTAUS?</h2>
        <p>
          Google Analytics 4 mittaa sivuston käyttöä vain suostumuksellasi. Sivusto toimii myös ilman
          analytiikkaa.
        </p>
        <a href="/tietosuoja">Lue tietosuojaseloste</a>
      </div>
      <div className="analyticsConsent__actions">
        <button className="button button--signal" type="button" onClick={() => save('accepted')}>
          SALLI ANALYTIIKKA
        </button>
        <button
          className="button button--paper analyticsConsent__reject"
          type="button"
          onClick={() => save('rejected')}
        >
          EI NYT
        </button>
      </div>
    </aside>
  );
  return homepageSlot ? createPortal(banner, homepageSlot) : banner;
}
