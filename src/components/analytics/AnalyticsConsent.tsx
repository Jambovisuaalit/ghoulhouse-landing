'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { readAnalyticsConsent, saveAnalyticsConsent, type ConsentState } from '@/lib/analytics-consent';

export default function AnalyticsConsent() {
  const pathname = usePathname();
  const [consent, setConsent] = useState<ConsentState>(null);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [homepageSlot, setHomepageSlot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setConsent(readAnalyticsConsent());
    setReady(true);
    // Rebind after client navigation: the old page's slot is removed from the DOM.
    setHomepageSlot(document.getElementById('gh-consent-inflow'));
    const handleOpen = () => setOpen(true);
    window.addEventListener('ghoulhouse:analytics-settings', handleOpen);
    return () => window.removeEventListener('ghoulhouse:analytics-settings', handleOpen);
  }, [pathname]);

  const save = (value: Exclude<ConsentState, null>) => {
    setConsent(saveAnalyticsConsent(value));
    setOpen(false);
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
        <p className="analyticsConsent__eyebrow">YKSITYISYYS / ANALYTIIKKA</p>
        <h2 id="analytics-consent-title">Sallitaanko käytön mittaus?</h2>
        <p>
          Google Analytics 4 käynnistyy vain luvallasi. Sivusto toimii myös ilman analytiikkaa.
          Voit muuttaa valintaasi myöhemmin.
        </p>
        <a href="/tietosuoja">Lue tietosuojaseloste</a>
      </div>
      <div className="analyticsConsent__actions">
        <button className="analyticsConsent__button analyticsConsent__accept" type="button" onClick={() => save('accepted')}>
          Salli analytiikka
        </button>
        <button
          className="analyticsConsent__button analyticsConsent__reject"
          type="button"
          onClick={() => save('rejected')}
        >
          Hylkää analytiikka
        </button>
      </div>
    </aside>
  );
  return homepageSlot ? createPortal(banner, homepageSlot) : banner;
}
