import type { Metadata, Viewport } from 'next';
import { Anton, Montserrat } from 'next/font/google';
import { siteConfig } from '@/config/site';
import {
  SITE_URL,
  isIndexingApproved,
  isProductionDeployment,
  productionUrl,
} from '@/lib/seo';
import { faqItems } from '@/components/sections/FAQ';
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

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const title = 'Somepalvelu remonttiyrityksille | GhoulHouse';
const description =
  'GhoulHouse muuttaa työmaa- ja referenssikuvat valmiiksi Instagram- ja Facebook-sisällöiksi. 12 sisältöä / 30 päivää, 490 € + ALV.';
const socialDescription =
  'Työmaakuvat sisään. Valmis some ulos. 12 sisältöä / 30 päivää Instagramiin ja Facebookiin.';
const keywords = [
  'somepalvelu remonttiyrityksille',
  'sosiaalisen median sisällöntuotanto',
  'somepalvelu yrityksille',
  'Instagram sisällöntuotanto yritykselle',
  'Facebook sisällöntuotanto yritykselle',
  'sosiaalisen median ylläpito',
  'somepalvelu Helsinki',
  'somepalvelu Uusimaa',
  'remonttiyrityksen some',
];

const indexable = isProductionDeployment() && isIndexingApproved();

export const metadata: Metadata = {
  title,
  description,
  keywords,
  applicationName: 'GhoulHouse',
  creator: siteConfig.company.legalName,
  publisher: siteConfig.company.legalName,
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: '/' },
  openGraph: {
    title,
    description: socialDescription,
    url: '/',
    siteName: 'GhoulHouse',
    locale: 'fi_FI',
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'GhoulHouse — Somepalvelu remonttiyrityksille',
      },
    ],
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
const serviceId = `${SITE_URL}/#some-12`;
const faqId = `${SITE_URL}/#faq`;

const areaServed = [
  { '@type': 'AdministrativeArea', name: 'Uusimaa' },
  { '@type': 'Country', name: 'Finland' },
];

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
      areaServed,
      description:
        'GhoulHouse on tuotteistettu somepalvelu remontti- ja korjausrakentamisen yrityksille. Palvelu muuttaa asiakkaan työmaa- ja referenssikuvat valmiiksi Instagram- ja Facebook-sisällöiksi.',
      knowsAbout: [
        'Sosiaalisen median sisällöntuotanto',
        'Instagram-sisällöntuotanto',
        'Facebook-sisällöntuotanto',
        'Sosiaalisen median ylläpito',
        'Remonttiyritysten referenssisisällöt',
      ],
    },
    {
      '@type': 'Service',
      '@id': serviceId,
      name: 'GhoulHouse SOME 12',
      serviceType:
        'Sosiaalisen median sisällöntuotanto ja ylläpito remonttiyrityksille',
      provider: { '@id': organizationId },
      areaServed,
      audience: {
        '@type': 'BusinessAudience',
        audienceType:
          'Uudenmaan pienet B2C-remontti- ja korjausrakentamisen yritykset',
      },
      description:
        'Asiakas toimittaa työmaa- ja referenssikuvat. GhoulHouse suunnittelee, käsittelee, kirjoittaa, ajastaa ja julkaisee 12 alkuperäistä sisältöä 30 päivän aikana Instagramiin ja Facebookiin.',
      offers: {
        '@type': 'Offer',
        url: productionUrl('/some-12'),
        price: '490',
        priceCurrency: 'EUR',
        category: 'Sosiaalisen median sisällöntuotanto',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: 490,
          priceCurrency: 'EUR',
          unitText: '30 päivää',
          valueAddedTaxIncluded: false,
        },
      },
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
    {
      '@type': 'FAQPage',
      '@id': faqId,
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fi">
      <body className={`${anton.variable} ${montserrat.variable}`}>
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
