import FunnelAnalytics from '@/components/analytics/FunnelAnalytics';
import type { Metadata, Viewport } from 'next';
import { Montserrat } from 'next/font/google';
import { siteConfig } from '@/config/site';
import { isIndexingEnabled, isProductionDeployment } from '@/lib/seo';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import AnalyticsConsent from '@/components/analytics/AnalyticsConsent';
import SiteChrome from '@/components/SiteChrome';
import './site.css';
import './global-chrome.css';
import './liquid-glass-footer.css';
import './analytics-consent.css';
import './official-brand.css';
import './social-editorial.css';
import './editorial-system.css';
import './motion-overlay-menu.css';

const montserrat = Montserrat({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin-ext'],
  variable: '--font-body',
  display: 'swap',
});

const title = 'GhoulHouse | Social remontti- ja LVI-yrityksille Uudellamaalla';
const description =
  'Työmaakuvat sisään, valmis some ulos. 12 sisältöä Instagramiin ja Facebookiin 30 päivässä, 490 € + ALV. Verkkosivut ja SEO lisäpalveluina.';
const indexable = isProductionDeployment() && isIndexingEnabled();

export const metadata: Metadata = {
  metadataBase: new URL('https://ghoulhouse.fi'),
  title,
  description,
  applicationName: 'GhoulHouse',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/brand-icons/180', sizes: '180x180', type: 'image/png' }],
  },
  creator: siteConfig.company.legalName,
  publisher: siteConfig.company.legalName,
  alternates: { canonical: '/' },
  robots: indexable
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
  openGraph: {
    title,
    description,
    url: '/',
    siteName: 'GhoulHouse',
    locale: 'fi_FI',
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'GhoulHouse — Hyvä työ pitää näkyä. Verkkosivut, Social & SEO.',
      },
    ],
  },
  twitter: { card: 'summary_large_image', title, description, images: ['/opengraph-image'] },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#F7F4EF',
  colorScheme: 'light',
};

const socialProfiles = [
  process.env.NEXT_PUBLIC_LINKEDIN_URL?.trim(),
  process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim(),
].filter((value): value is string => Boolean(value));

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://ghoulhouse.fi/#website',
      name: 'GhoulHouse',
      url: 'https://ghoulhouse.fi',
      inLanguage: 'fi-FI',
    },
    {
      '@type': 'Organization',
      '@id': 'https://ghoulhouse.fi/#organization',
      name: siteConfig.company.legalName,
      alternateName: siteConfig.company.brand,
      url: 'https://ghoulhouse.fi',
      foundingDate: siteConfig.company.registrationDate,
      identifier: {
        '@type': 'PropertyValue',
        name: 'Y-tunnus',
        value: siteConfig.company.businessId,
      },
      logo: {
        '@type': 'ImageObject',
        '@id': 'https://ghoulhouse.fi/#logo',
        url: 'https://ghoulhouse.fi/ghoulhouse-logo.svg',
      },
      sameAs: socialProfiles,
    },
    {
      '@type': 'Person',
      '@id': 'https://ghoulhouse.fi/#hanna-nyholm',
      name: siteConfig.company.founder,
      worksFor: { '@id': 'https://ghoulhouse.fi/#organization' },
      sameAs: socialProfiles,
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fi">
      <body className={montserrat.variable}>
        <GoogleAnalytics />
        <FunnelAnalytics />
        <SiteChrome>{children}</SiteChrome>
        <AnalyticsConsent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
