import type { Metadata } from 'next';
import SeoLandingPage from '@/components/seo/SeoLandingPage';
import { seoClusterPages } from '@/data/seo-cluster';

const page = seoClusterPages['some-12'];

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: '/' + page.slug },
  robots: process.env.VERCEL_ENV === 'production'
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
};

export default function Page() {
  const offerSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': 'https://ghoulhouse.fi/some-12#service',
        name: 'GhoulHouse SOME 12',
        serviceType: 'Kiinteä 30 päivän some-sisältöpaketti',
        description: page.description,
        provider: { '@id': 'https://ghoulhouse.fi/#organization' },
        areaServed: { '@type': 'Country', name: 'Finland' },
        offers: { '@id': 'https://ghoulhouse.fi/some-12#offer' },
      },
      {
        '@type': 'Offer',
        '@id': 'https://ghoulhouse.fi/some-12#offer',
        name: 'SOME 12 — 12 sisältöä / 30 päivää',
        price: '490',
        priceCurrency: 'EUR',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '490',
          priceCurrency: 'EUR',
          valueAddedTaxIncluded: false,
        },
        url: 'https://ghoulhouse.fi/some-12',
        itemOffered: { '@id': 'https://ghoulhouse.fi/some-12#service' },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(offerSchema) }} />
      <SeoLandingPage page={page} />
    </>
  );
}
