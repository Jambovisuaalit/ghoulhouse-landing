export type FunnelEvent =
  | 'page_view'
  | 'primary_cta_click'
  | 'booking_cta_click'
  | 'photo_demo_cta_click'
  | 'lead_form_open'
  | 'lead_form_start'
  | 'lead_form_submit'
  | 'lead_form_success'
  | 'lead_form_error'
  | 'pricing_view'
  | 'content_example_view';

type AnalyticsProperties = Record<string, string | number | boolean>;
type GtagArguments = [command: 'event', eventName: string, params?: AnalyticsProperties];
type GtagFn = (...args: GtagArguments) => void;

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: GtagFn;
};

function getGtag(target: AnalyticsWindow): GtagFn {
  if (typeof target.gtag === 'function') return target.gtag;

  target.dataLayer ||= [];
  const gtag: GtagFn = (...args) => {
    target.dataLayer?.push(args);
  };
  target.gtag = gtag;
  return gtag;
}

export function trackEvent(
  event: FunnelEvent,
  properties: AnalyticsProperties = {}
) {
  if (typeof window === 'undefined') return;

  const payload = { event, ...properties };
  const target = window as AnalyticsWindow;

  // GA4 sends the initial page_view through gtag('config', measurementId).
  // Custom funnel events are intentionally limited to non-PII metadata.
  if (event !== 'page_view') {
    getGtag(target)('event', event, properties);
  }

  window.dispatchEvent(
    new CustomEvent('ghoulhouse:analytics', {
      detail: payload,
    })
  );
}
