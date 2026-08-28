import Script from 'next/script';

export default function VercelAnalytics() {
  const enabled =
    process.env.VERCEL_ENV === 'production' &&
    process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED === 'true';

  if (!enabled) return null;

  return (
    <>
      <Script id="vercel-analytics-init" strategy="afterInteractive">
        {`window.va = window.va || function () {
          (window.vaq = window.vaq || []).push(arguments);
        };`}
      </Script>
      <Script
        src="/_vercel/insights/script.js"
        strategy="afterInteractive"
      />
    </>
  );
}
