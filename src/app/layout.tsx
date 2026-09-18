import type { Metadata, Viewport } from 'next';
import { Anton, Montserrat } from 'next/font/google';
import { siteConfig } from '@/config/site';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import AnalyticsConsent from '@/components/analytics/AnalyticsConsent';
import ResponsiveNavState from '@/components/ResponsiveNavState';
import './site.css';

const anton = Anton({ weight: '400', subsets: ['latin-ext'], variable: '--font-display', display: 'swap' });
const montserrat = Montserrat({ weight: ['400', '500', '600', '700', '800', '900'], subsets: ['latin-ext'], variable: '--font-body', display: 'swap' });

const title = 'Some-sisällöntuotanto remontti- ja LVI-yrityksille | GhoulHouse';
const description = 'GhoulHouse tekee työmaa- ja referenssikuvista 12 valmista Instagram- ja Facebook-sisältöä 30 päivässä. Remontti- ja LVI-yrityksille. 490 € + ALV.';
const indexable = process.env.VERCEL_ENV === 'production';

export const metadata: Metadata = {
  metadataBase: new URL('https://ghoulhouse.fi'),
  title,
  description,
  applicationName: 'GhoulHouse',
  creator: siteConfig.company.legalName,
  publisher: siteConfig.company.legalName,
  alternates: { canonical: '/' },
  robots: indexable ? { index: true, follow: true } : { index: false, follow: false, nocache: true },
  openGraph: {
    title,
    description,
    url: '/',
    siteName: 'GhoulHouse',
    locale: 'fi_FI',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'GhoulHouse — Työmaakuvat sisään. Valmis some ulos.' }],
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
      identifier: { '@type': 'PropertyValue', name: 'Y-tunnus', value: siteConfig.company.businessId },
      sameAs: socialProfiles,
    },
    {
      '@type': 'Person',
      '@id': 'https://ghoulhouse.fi/#hanna-nyholm',
      name: siteConfig.company.founder,
      worksFor: { '@id': 'https://ghoulhouse.fi/#organization' },
      sameAs: socialProfiles,
    },
    {
      '@type': 'Service',
      '@id': 'https://ghoulhouse.fi/#some-12-service',
      name: 'GhoulHouse SOME 12',
      provider: { '@id': 'https://ghoulhouse.fi/#organization' },
      serviceType: 'Some-sisällöntuotanto',
      areaServed: { '@type': 'Country', name: 'Finland' },
      offers: { '@id': 'https://ghoulhouse.fi/#some-12-offer' },
    },
    {
      '@type': 'Offer',
      '@id': 'https://ghoulhouse.fi/#some-12-offer',
      name: 'GhoulHouse SOME 12',
      price: '490',
      priceCurrency: 'EUR',
      description: '12 some-sisältöä 30 päivässä. Hinta 490 € + ALV.',
      url: 'https://ghoulhouse.fi/some-12',
      itemOffered: { '@id': 'https://ghoulhouse.fi/#some-12-service' },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fi">
      <body className={anton.variable + ' ' + montserrat.variable}>
        <GoogleAnalytics />
        <ResponsiveNavState />
        {children}
        <AnalyticsConsent />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </body>
    </html>
  );
}
