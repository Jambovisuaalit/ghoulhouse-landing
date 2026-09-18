  openGraph: { title: 'Verkkosivut yritykselle | GhoulHouse', description: 'Yrityksen verkkosivut, joissa palvelut, referenssit, luottamus ja yhteydenotto muodostavat yhden selkeän polun.', url: '/verkkosivut-yritykselle', type: 'website', images: [{ url: '/opengraph-image', width: 1200, height: 630 }] },
import type { Metadata } from 'next';
import WebsiteLandingPage from '@/components/website/WebsiteLandingPage';

export const metadata: Metadata = {
  title: 'Verkkosivut yritykselle | GhoulHouse',
  description: 'Yrityksen verkkosivut, joissa palvelut, referenssit, luottamus ja yhteydenotto muodostavat yhden selkeän polun.',
  alternates: { canonical: '/verkkosivut-yritykselle' },
  robots: process.env.VERCEL_ENV === 'production' ? { index: true, follow: true } : { index: false, follow: false, nocache: true },
};

export default function Page() { return <WebsiteLandingPage />; }
