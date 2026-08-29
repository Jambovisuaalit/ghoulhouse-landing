import type { Metadata, Viewport } from 'next';
import { Anton } from 'next/font/google';
import { siteConfig } from '@/config/site';
import {
  SITE_URL,
  isIndexingApproved,
  isProductionDeployment,
  productionUrl,
} from '@/lib/seo';
import VercelAnalytics from '@/components/analytics/VercelAnalytics';
import FunnelAnalytics from '@/components/analytics/FunnelAnalytics';
import { ContactProvider } from '@/components/contact/ContactProvider';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import './globals.css';

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const title = 'GhoulHouse — Työmaakuvat sisään. Valmis some ulos.';
const description =
  'GhoulHouse tekee työmaamateriaalista 12 valmista Instagram- ja Facebook-sisältöä 30 päiväksi. SOME 12 490 € + ALV.';
const socialDescription =
  'Teette hyvää työtä. Me pidämme huolen, että asiakkaat myös näkevät sen.';

const indexable = isProductionDeployment() && isIndexingApproved();

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: '/' },
  openGraph: {
    title,
    description: socialDescription,
    url: '/',
    siteName: 'GhoulHouse',
    locale: 'fi_FI',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description: socialDescription,
    images: ['/opengraph-image'],
  },
  robots: indexable
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-image-preview': 'large',
          'max-snippet': -1,
          'max-video-preview': -1,
        },
      }
    : {
        index: false,
        follow: false,
        nocache: true,
        googleBot: { index: false, follow: false, noimageindex: true },
      },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#111111',
  colorScheme: 'light',
};

const organizationId = `${SITE_URL}/#organization`;
const founderId = `${SITE_URL}/#founder`;
const websiteId = `${SITE_URL}/#website`;

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': organizationId,
      name: siteConfig.company.legalName,
      alternateName: siteConfig.company.brand,
      url: SITE_URL,
      logo: productionUrl('/icon'),
      image: productionUrl('/opengraph-image'),
      founder: { '@id': founderId },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Helsinki',
        addressCountry: 'FI',
      },
      areaServed: { '@type': 'Country', name: 'Finland' },
      description:
        'Tuotteistettu sosiaalisen median sisältö- ja hallintapalvelu suomalaisille paikallisille palveluyrityksille.',
    },
    {
      '@type': 'Person',
      '@id': founderId,
      name: siteConfig.company.founder,
      jobTitle: 'Founder',
      worksFor: { '@id': organizationId },
    },
    {
      '@type': 'WebSite',
      '@id': websiteId,
      url: SITE_URL,
      name: siteConfig.company.brand,
      publisher: { '@id': organizationId },
      inLanguage: 'fi-FI',
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fi">
      <body className={anton.variable}>
        <ContactProvider>
          <a className="skip-link" href="#main-content">
            Siirry pääsisältöön
          </a>
          <FunnelAnalytics />
          <Navigation />
          {children}
          <Footer />
        </ContactProvider>
        <VercelAnalytics />
        <script
          id="ghoulhouse-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
