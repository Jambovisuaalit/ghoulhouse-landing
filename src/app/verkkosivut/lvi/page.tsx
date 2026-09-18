  openGraph: { title: 'GhoulHouse', description: 'GhoulHouse', url: '/verkkosivut/lvi', type: 'website', images: [{ url: '/opengraph-image', width: 1200, height: 630 }] },
import type { Metadata } from 'next';
import WebsiteLandingPage from '@/components/website/WebsiteLandingPage';
import { websiteVerticals } from '@/data/website';
const page = websiteVerticals.lvi;
export const metadata: Metadata = { title: page.title, description: page.description, alternates: { canonical: '/verkkosivut/lvi' }, robots: process.env.VERCEL_ENV === 'production' ? { index: true, follow: true } : { index: false, follow: false, nocache: true } };
export default function Page() { return <WebsiteLandingPage vertical={page} />; }
