'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

export const GA_MEASUREMENT_ID = 'G-43VQ8505YL';
const CONSENT_KEY = 'ghoulhouse_analytics_consent';
const GA_INIT_SCRIPT = "window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} window.gtag = window.gtag || gtag; gtag('js', new Date()); gtag('config', 'G-43VQ8505YL'); window.dispatchEvent(new CustomEvent('ghoulhouse:analytics-ready'));";

function hasAnalyticsConsent() {
  return typeof window !== 'undefined' && window.localStorage.getItem(CONSENT_KEY) === 'accepted';
}

export default function GoogleAnalytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const sync = () => setEnabled(hasAnalyticsConsent());
    sync();
    window.addEventListener('ghoulhouse:analytics-consent', sync);
    return () => window.removeEventListener('ghoulhouse:analytics-consent', sync);
  }, []);

  if (!enabled) return null;

  return (
    <>
      <Script id="google-analytics-src" src={"https://www.googletagmanager.com/gtag/js?id=" + GA_MEASUREMENT_ID} strategy="afterInteractive" />
      <Script id="google-analytics-init" strategy="afterInteractive">{GA_INIT_SCRIPT}</Script>
    </>
  );
}
