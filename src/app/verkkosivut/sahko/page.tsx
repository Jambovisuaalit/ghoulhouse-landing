import type { Metadata } from 'next';
import { indexableRobots } from '@/lib/seo';
import WebsiteLandingPage from '@/components/website/WebsiteLandingPage';
import { websiteVerticals } from '@/data/website';
const page = websiteVerticals.sahko;
export const metadata: Metadata = { title: page.title, description: page.description, alternates: { canonical: '/verkkosivut/sahko' }, robots: indexableRobots(), };
export default function Page() { return <WebsiteLandingPage vertical={page} />; }
