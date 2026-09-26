/** Classify the clicked destination, rather than attributing every CTA to the current form. */
export function ctaContext(href: string, currentUrl: string, formIntent?: unknown, formService?: unknown) {
  const current = new URL(currentUrl);
  const target = new URL(href, current);
  if (target.origin !== current.origin || target.hash !== '#yhteys') return null;
  const samePage = target.pathname === current.pathname;
  const intent = target.searchParams.get('intent') === 'photos' ||
    (!target.searchParams.has('service') && samePage && formIntent === 'photos') ? 'photos' : 'booking';
  const selected = target.searchParams.get('service') || (samePage ? formService : undefined);
  const service = intent === 'photos' ? 'social' :
    selected === 'websites' || selected === 'social' || selected === 'seo' ? selected : 'unspecified';
  return { intent, service };
}
