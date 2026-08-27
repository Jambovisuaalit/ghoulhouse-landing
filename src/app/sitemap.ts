import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import {
  SITE_URL,
  shouldIndexRequest,
} from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const requestHeaders = await headers();
  const requestHost =
    requestHeaders.get('x-forwarded-host') || requestHeaders.get('host');

  if (!shouldIndexRequest(requestHost)) {
    return [];
  }

  return [
    {
      url: SITE_URL,
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
