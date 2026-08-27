import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://ghoulhouse.fi',
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
