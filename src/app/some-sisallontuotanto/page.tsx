import type { Metadata } from 'next';
import { indexableRobots } from '@/lib/seo';
import SeoLandingPage from '@/components/seo/SeoLandingPage';
import { seoClusterPages } from '@/data/seo-cluster';

const page = seoClusterPages['some-sisallontuotanto'];

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: '/' + page.slug },
  robots: indexableRobots(),
};

export default function Page() {
  const socialSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': 'https://ghoulhouse.fi/some-sisallontuotanto#service',
    name: 'Ulkoistettu some-sisällöntuotanto yrityksille',
    serviceType: 'Some-sisällöntuotannon suunnittelu ja toteutus',
    provider: { '@id': 'https://ghoulhouse.fi/#organization' },
    areaServed: { '@type': 'Country', name: 'Finland' },
    url: 'https://ghoulhouse.fi/some-sisallontuotanto',
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(socialSchema) }} /><SeoLandingPage page={page} /></>;
}
