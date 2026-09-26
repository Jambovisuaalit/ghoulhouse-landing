export type FunnelEvent =
  | 'proposal_cta_click' | 'page_view' | 'primary_cta_click' | 'booking_cta_click' | 'photo_demo_cta_click'
  | 'lead_form_open' | 'lead_form_start' | 'lead_form_submit' | 'lead_form_success'
  | 'lead_form_error' | 'pricing_view' | 'content_example_view';

type AnalyticsProperties = Record<string, string | number | boolean>;
type GtagArguments = [command: 'event', eventName: string, params?: AnalyticsProperties];
type GtagFn = (...args: GtagArguments) => void;
type AnalyticsWindow = Window & { dataLayer?: unknown[]; gtag?: GtagFn };

export function trackEvent(event: FunnelEvent, properties: AnalyticsProperties = {}) {
  if (typeof window === 'undefined') return;

  const form = document.querySelector<HTMLFormElement>('form[action="/api/leads"]');
  const data = form ? new FormData(form) : null;
  const intent = data?.get('intent') === 'photos' ? 'photos' : 'booking';
  const service = String(data?.get('service') || (intent === 'photos' ? 'social' : 'unspecified'));
  properties = { service, intent, ...properties };
  const target = window as AnalyticsWindow;
  const consent = window.localStorage.getItem('ghoulhouse_analytics_consent') === 'accepted';

  if (consent && typeof target.gtag === 'function' && event !== 'page_view') {
    target.gtag('event', event, properties);
  }

  window.dispatchEvent(new CustomEvent('ghoulhouse:analytics', { detail: { event, ...properties } }));
}
