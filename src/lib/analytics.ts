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

type VercelAnalyticsFn = (
  command: 'event',
  payload: {
    name: string;
    data?: AnalyticsProperties;
  }
) => void;

export function trackEvent(
  event: FunnelEvent,
  properties: AnalyticsProperties = {}
) {
  if (typeof window === 'undefined') return;

  const payload = { event, ...properties };
  const target = window as Window & {
    dataLayer?: Array<Record<string, unknown>>;
    va?: VercelAnalyticsFn;
  };

  if (Array.isArray(target.dataLayer)) {
    target.dataLayer.push(payload);
  }

  if (typeof target.va === 'function') {
    target.va('event', {
      name: event,
      ...(Object.keys(properties).length > 0 ? { data: properties } : {}),
    });
  }

  window.dispatchEvent(
    new CustomEvent('ghoulhouse:analytics', {
      detail: payload,
    })
  );
}
