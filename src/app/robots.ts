import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://ghoulhouse.fi/sitemap.xml',
    host: 'https://ghoulhouse.fi',
  };
}
