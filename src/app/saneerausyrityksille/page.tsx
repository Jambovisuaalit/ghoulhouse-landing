import type { Metadata } from 'next';
import { indexableRobots } from '@/lib/seo';
import SeoLandingPage from '@/components/seo/SeoLandingPage';
import { seoClusterPages } from '@/data/seo-cluster';

const page = seoClusterPages['saneerausyrityksille'];

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: '/' + page.slug },
  openGraph: { title: page.title, description: page.description, url: '/' + page.slug, type: 'website', images: [{ url: '/opengraph-image', width: 1200, height: 630 }] },
  robots: indexableRobots(),
};

export default function Page() {
  return <SeoLandingPage page={page} />;
}
