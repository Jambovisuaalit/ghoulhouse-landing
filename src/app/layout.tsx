import type { Metadata, Viewport } from 'next';
import { Anton, Montserrat } from 'next/font/google';
import { siteConfig } from '@/config/site';
import { SITE_URL, isIndexingApproved, isProductionDeployment, productionUrl } from '@/lib/seo';
import { faqItems } from '@/components/sections/FAQ';
import VercelAnalytics from '@/components/analytics/VercelAnalytics';
import './globals.css';

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const montserrat = Montserrat({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const title = 'GhoulHouse | Työmaakuvista valmis some';
const description =
  'GhoulHouse tekee remontti- ja palveluyritysten työmaakuvista suunnitellun sisältökuukauden Instagramiin ja Facebookiin. SOME 12: 490 € + ALV / 30 päivää.';
const indexable = isProductionDeployment() && isIndexingApproved();

export const metadata: Metadata = {
  title,
  description,
  applicationName: 'GhoulHouse',
  creator: siteConfig.company.legalName,
  publisher: siteConfig.company.legalName,
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: '/' },
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
        alt: 'GhoulHouse — Työmaakuvat sisään. Valmis some ulos.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/opengraph-image'],
  },
  robots: indexable
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#111111',
  colorScheme: 'light',
};

const organizationId = `${SITE_URL}/#organization`;
const serviceId = `${SITE_URL}/#some-12`;

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
      description:
        'GhoulHouse tuottaa asiakkaan työmaa- ja referenssikuvista suunnitelmallista Instagram- ja Facebook-sisältöä.',
    },
    {
      '@type': 'Service',
      '@id': serviceId,
      name: siteConfig.offer.name,
      provider: { '@id': organizationId },
      description:
        '12 sisältöä / 30 päivää Instagramiin ja Facebookiin asiakkaan toimittamasta materiaalista.',
      offers: {
        '@type': 'Offer',
        price: String(siteConfig.offer.price),
        priceCurrency: 'EUR',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: siteConfig.offer.price,
          priceCurrency: 'EUR',
          unitText: '30 päivää',
          valueAddedTaxIncluded: false,
        },
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fi">
      <body className={`${anton.variable} ${montserrat.variable}`}>
        {children}
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
