'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { GA_MEASUREMENT_ID, syncAnalyticsConsent } from '@/lib/analytics-consent';

export { GA_MEASUREMENT_ID } from '@/lib/analytics-consent';
let initialized = false;

function initializeAnalytics() {
  // Consent can be withdrawn while the external script is still downloading.
  if (!syncAnalyticsConsent()) return;
  const target = window as Window & { gtag?: (...args: unknown[]) => void; ghoulhouseAnalyticsReady?: boolean };
  if (!initialized && target.gtag) {
    target.gtag('js', new Date());
    target.gtag('config', 'G-43VQ8505YL');
    initialized = true;
  }
  target.ghoulhouseAnalyticsReady = true;
  window.dispatchEvent(new CustomEvent('ghoulhouse:analytics-ready'));
}

export default function GoogleAnalytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const sync = () => setEnabled(syncAnalyticsConsent());
    sync();
    window.addEventListener('ghoulhouse:analytics-consent', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('ghoulhouse:analytics-consent', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  if (!enabled) return null;

  return (
    <Script id="google-analytics-src" src={"https://www.googletagmanager.com/gtag/js?id=" + GA_MEASUREMENT_ID} strategy="afterInteractive" onReady={initializeAnalytics} />
  );
}
