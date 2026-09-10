import Script from 'next/script';
import { SITE_HOST } from '@/lib/seo';

export default function PlausibleAnalytics() {
  const scriptSrc = process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_SRC?.trim();
  const enabled = process.env.VERCEL_ENV === 'production' && Boolean(scriptSrc);

  if (!enabled || !scriptSrc) return null;

  return (
    <Script
      id="plausible-analytics"
      src={scriptSrc}
      data-domain={SITE_HOST}
      strategy="afterInteractive"
    />
  );
}
