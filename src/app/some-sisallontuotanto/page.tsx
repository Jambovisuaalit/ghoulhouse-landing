import type { Metadata } from 'next';
import SeoLandingPage from '@/components/seo/SeoLandingPage';
import { seoClusterPages } from '@/data/seo-cluster';

const page = seoClusterPages['some-sisallontuotanto'];

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: '/' + page.slug },
  robots: process.env.VERCEL_ENV === 'production'
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
};

export default function Page() {
  const socialSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': 'https://ghoulhouse.fi/some-sisallontuotanto#service',
        name: 'GhoulHouse SOME 12',
        serviceType: 'Some-sisällöntuotanto',
        provider: { '@id': 'https://ghoulhouse.fi/#organization' },
        areaServed: { '@type': 'Country', name: 'Finland' },
        offers: { '@id': 'https://ghoulhouse.fi/some-sisallontuotanto#offer' },
      },
      {
        '@type': 'Offer',
        '@id': 'https://ghoulhouse.fi/some-sisallontuotanto#offer',
        name: 'SOME 12 — 12 sisältöä / 30 päivää',
        price: '490',
        priceCurrency: 'EUR',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '490',
          priceCurrency: 'EUR',
          valueAddedTaxIncluded: false,
        },
        url: 'https://ghoulhouse.fi/some-sisallontuotanto',
        itemOffered: { '@id': 'https://ghoulhouse.fi/some-sisallontuotanto#service' },
      },
    ],
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(socialSchema) }} /><SeoLandingPage page={page} /></>;
}
