export const GA_MEASUREMENT_ID = 'G-43VQ8505YL';
export const CONSENT_KEY = 'ghoulhouse_analytics_consent';
export type ConsentState = 'accepted' | 'rejected' | null;
let sessionConsent: ConsentState | undefined;

type ConsentTarget = {
  dataLayer?: unknown[][];
  gtag?: (...args: unknown[]) => void;
  [key: string]: unknown;
};

export function readAnalyticsConsent(): ConsentState {
  if (typeof window === 'undefined') return null;
  if (sessionConsent !== undefined) return sessionConsent;
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === 'accepted' || value === 'rejected' ? value : null;
  } catch {
    return null;
  }
}

export function applyAnalyticsConsent(target: ConsentTarget, accepted: boolean) {
  // This flag also stops an already loaded Google tag, before any queued update.
  target[`ga-disable-${GA_MEASUREMENT_ID}`] = !accepted;
  if (!target.gtag) {
    const queue = target.dataLayer ||= [];
    target.gtag = (...args) => { queue.push(args); };
    target.gtag('consent', 'default', {
      analytics_storage: 'denied', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied',
    });
  }
  target.gtag('consent', 'update', {
    analytics_storage: accepted ? 'granted' : 'denied',
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
  });
}

export function syncAnalyticsConsent() {
  const accepted = readAnalyticsConsent() === 'accepted';
  if (typeof window !== 'undefined') {
    applyAnalyticsConsent(window as unknown as ConsentTarget, accepted);
  }
  return accepted;
}

export function canTrackAnalytics() {
  return readAnalyticsConsent() === 'accepted' &&
    (window as Window & { ghoulhouseAnalyticsReady?: boolean }).ghoulhouseAnalyticsReady === true;
}

export function saveAnalyticsConsent(value: Exclude<ConsentState, null>) {
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
    sessionConsent = undefined;
  } catch {
    // With unavailable storage, stay opted out rather than starting measurement.
    sessionConsent = 'rejected';
  }
  syncAnalyticsConsent();
  window.dispatchEvent(new CustomEvent('ghoulhouse:analytics-consent'));
  return readAnalyticsConsent();
}
