import type { Metadata } from 'next';
import SeoLandingPage from '@/components/seo/SeoLandingPage';
import { seoClusterPages } from '@/data/seo-cluster';

const page = seoClusterPages['referenssit'];

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: '/' + page.slug },
  robots: process.env.VERCEL_ENV === 'production'
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
};

export default function Page() {
  return <SeoLandingPage page={page} />;
}
