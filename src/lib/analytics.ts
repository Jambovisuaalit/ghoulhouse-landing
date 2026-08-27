export type FunnelEvent =
  | 'page_view'
  | 'primary_cta_click'
  | 'lead_form_open'
  | 'lead_form_start'
  | 'lead_form_submit'
  | 'lead_form_success'
  | 'lead_form_error'
  | 'pricing_view'
  | 'content_example_view';

export function trackEvent(
  event: FunnelEvent,
  properties: Record<string, string | number | boolean> = {}
) {
  if (typeof window === 'undefined') return;

  const payload = { event, ...properties };
  const target = window as Window & {
    dataLayer?: Array<Record<string, unknown>>;
  };

  if (Array.isArray(target.dataLayer)) {
    target.dataLayer.push(payload);
  }

  window.dispatchEvent(
    new CustomEvent('ghoulhouse:analytics', {
      detail: payload,
    })
  );
}
