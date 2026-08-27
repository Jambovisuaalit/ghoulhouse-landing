import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import {
  SITE_URL,
  productionUrl,
  shouldIndexRequest,
} from '@/lib/seo';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const requestHeaders = await headers();
  const requestHost =
    requestHeaders.get('x-forwarded-host') || requestHeaders.get('host');
  const indexable = shouldIndexRequest(requestHost);

  if (!indexable) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: productionUrl('/sitemap.xml'),
    host: SITE_URL,
  };
}
