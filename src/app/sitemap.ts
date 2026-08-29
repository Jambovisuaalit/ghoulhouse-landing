import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { SITE_URL, shouldIndexRequest } from '@/lib/seo';

const publicRoutes = [
  '/',
  '/palvelut',
  '/some-12',
  '/caset',
  '/miten-toimii',
  '/meista',
  '/yhteys',
  '/tietosuoja',
  '/evasteet',
  '/kayttoehdot',
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const requestHeaders = await headers();
  const requestHost =
    requestHeaders.get('x-forwarded-host') || requestHeaders.get('host');

  if (!shouldIndexRequest(requestHost)) return [];

  return publicRoutes.map((path) => ({
    url: new URL(path, SITE_URL).toString(),
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : path === '/some-12' ? 0.9 : 0.7,
  }));
}
