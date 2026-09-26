/** Only the request category travels to the confirmation page; never put lead PII in the URL. */
export type LeadIntent = 'booking' | 'photos';
export type LeadService = 'websites' | 'social' | 'seo';

export function confirmationPath(intent: LeadIntent, service?: string): string {
  if (intent === 'photos') return '/kiitos?intent=photos';

  const params = new URLSearchParams({ intent: 'booking' });
  if (service === 'websites' || service === 'social' || service === 'seo') {
    params.set('service', service);
  }

  return `/kiitos?${params.toString()}`;
}
