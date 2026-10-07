import type { Metadata } from 'next';
import { indexableRobots } from '@/lib/seo';
import WebsiteLandingPage from '@/components/website/WebsiteLandingPage';

export const metadata: Metadata = {
  title: 'Verkkosivut yritykselle | GhoulHouse',
  description: 'Yrityksen verkkosivut, joissa palvelut, referenssit, luottamus ja yhteydenotto muodostavat yhden selkeän polun.',
  alternates: { canonical: '/verkkosivut-yritykselle' },
  openGraph: { title: 'Verkkosivut yritykselle | GhoulHouse', description: 'Yrityksen verkkosivut, joissa palvelut, referenssit, luottamus ja yhteydenotto muodostavat yhden selkeän polun.', url: '/verkkosivut-yritykselle', type: 'website', images: [{ url: '/opengraph-image', width: 1200, height: 630 }] },
  robots: indexableRobots(),
};

export default function Page() { return <WebsiteLandingPage />; }
