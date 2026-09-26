import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { SITE_URL, shouldIndexRequest } from '@/lib/seo';

const INDEXABLE_CLUSTER_SLUGS = [
  'rakennusyrityksille',
  'lvi-yrityksille',
  'some-sisallontuotanto',
  'instagram-sisallontuotanto',
  'referenssit',
  'tyot/ghoulhouse-verkkosivut',
  'some-12',
  'verkkosivut-yritykselle',
  'verkkosivut/hinta',
  'verkkosivut/rakennus',
  'verkkosivut/lvi',
  'verkkosivut/sahko',
  'resurssit',
  'oppaat/verkkosivut-itse-vai-ammattilaiselta',
  'saneerausyrityksille',
  'some-sisallontuotanto/hinta',
  'oppaat/rakennusyrityksen-some',
  'oppaat/tyomaakuvat-sosiaaliseen-mediaan',
] as const;

// P2 production trigger: sitemap includes the Social cluster.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const requestHeaders = await headers();
  const requestHost = requestHeaders.get('x-forwarded-host') || requestHeaders.get('host');

  if (!shouldIndexRequest(requestHost)) return [];

  return [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    ...INDEXABLE_CLUSTER_SLUGS.map((slug) => ({
      url: SITE_URL + '/' + slug,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
