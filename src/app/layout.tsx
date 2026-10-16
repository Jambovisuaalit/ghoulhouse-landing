import FunnelAnalytics from '@/components/analytics/FunnelAnalytics';
import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
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

const montserrat = localFont({
  src: './fonts/Montserrat-Variable.woff2',
  weight: '400 900',
  style: 'normal',
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

const organizationProfiles = [
  'https://www.instagram.com/ghoulhouse.fi/',
  'https://share.google/1LDmIXRgEryPBneud',
].filter((value): value is string => Boolean(value));

const founderProfiles = [
  'https://fi.linkedin.com/in/hanna-nyholm-1b5213434',
];

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
      address: {
        '@type': 'PostalAddress',
        streetAddress: siteConfig.company.postalAddress.street,
        postalCode: siteConfig.company.postalAddress.postalCode,
        addressLocality: siteConfig.company.postalAddress.city,
        addressCountry: 'FI',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: siteConfig.company.contactEmail,
        areaServed: 'FI',
        availableLanguage: ['fi', 'en'],
      },
      areaServed: {
        '@type': 'AdministrativeArea',
        name: 'Uusimaa',
      },
      sameAs: organizationProfiles,
    },
    {
      '@type': 'Person',
      '@id': 'https://ghoulhouse.fi/#hanna-nyholm',
      name: siteConfig.company.founder,
      worksFor: { '@id': 'https://ghoulhouse.fi/#organization' },
      sameAs: founderProfiles,
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
        <a
          className="ghWhatsAppContact"
          href="https://wa.me/message/AUGDWTOOJ3QLK1"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Ota yhteyttä Hannaan WhatsAppissa (avautuu uuteen välilehteen)"
        >
          <svg aria-hidden="true" width="23" height="23" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.52 3.48A11.81 11.81 0 0 0 12.08 0C5.48 0 .1 5.36.09 11.97c0 2.11.55 4.17 1.61 5.99L0 24l6.2-1.63a11.93 11.93 0 0 0 5.87 1.5h.01c6.6 0 11.98-5.37 11.98-11.98a11.9 11.9 0 0 0-3.54-8.41ZM12.08 21.85a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.87 9.87 0 0 1-1.52-5.25c0-5.49 4.46-9.95 9.93-9.95a9.88 9.88 0 0 1 7.04 2.92 9.85 9.85 0 0 1 2.91 7.03c0 5.49-4.46 9.95-9.97 9.95Zm5.45-7.45c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.9-.8-1.5-1.78-1.67-2.08-.18-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.5h-.57c-.2 0-.52.07-.8.38-.27.3-1.05 1.02-1.05 2.49 0 1.47 1.08 2.9 1.23 3.1.15.2 2.12 3.24 5.14 4.54.72.31 1.28.49 1.72.63.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z"/>
          </svg>
          <span>WhatsApp</span>
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
