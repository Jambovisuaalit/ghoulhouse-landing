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
type PlausibleArguments = [event: string, options?: { props?: AnalyticsProperties }];
type PlausibleAnalyticsFn = (...args: PlausibleArguments) => void;
type QueuedPlausibleAnalyticsFn = PlausibleAnalyticsFn & {
  q?: PlausibleArguments[];
};

function getPlausible(target: Window & { plausible?: QueuedPlausibleAnalyticsFn }) {
  if (typeof target.plausible === 'function') return target.plausible;

  const queue: QueuedPlausibleAnalyticsFn = (...args) => {
    (queue.q ||= []).push(args);
  };

  target.plausible = queue;
  return queue;
}

export function trackEvent(
  event: FunnelEvent,
  properties: AnalyticsProperties = {}
) {
  if (typeof window === 'undefined') return;

  const payload = { event, ...properties };
  const target = window as Window & {
    plausible?: QueuedPlausibleAnalyticsFn;
  };

  if (event !== 'page_view') {
    getPlausible(target)(event, {
      ...(Object.keys(properties).length > 0 ? { props: properties } : {}),
    });
  }

  window.dispatchEvent(
    new CustomEvent('ghoulhouse:analytics', {
      detail: payload,
    })
  );
}
