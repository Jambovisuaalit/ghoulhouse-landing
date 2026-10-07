import type { Metadata } from 'next';
import { indexableRobots } from '@/lib/seo';
import SeoLandingPage from '@/components/seo/SeoLandingPage';
import { seoClusterPages } from '@/data/seo-cluster';

const page = seoClusterPages['lvi-yrityksille'];

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: '/' + page.slug },
  robots: indexableRobots(),
};

export default function Page() {
  return <SeoLandingPage page={page} />;
}
