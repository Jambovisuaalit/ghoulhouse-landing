import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const SITE_URL = siteConfig.company.domain;
export const SITE_HOST = new URL(SITE_URL).hostname;

const MANAGED_HOSTS = new Set(['ghoulhouse.fi', 'www.ghoulhouse.fi']);

function normalizeHost(value: string | null | undefined) {
  return (value || '')
    .split(',')[0]
    .trim()
    .toLowerCase()
    .replace(/:\d+$/, '');
}

export function isProductionDeployment() {
  return process.env.VERCEL_ENV === 'production';
}

/**
 * Emergency indexing kill switch. Canonical production remains indexable when
 * SITE_INDEXABLE is unset or true; an explicit false disables indexing.
 */
export function isIndexingEnabled() {
  return process.env.SITE_INDEXABLE?.trim().toLowerCase() !== 'false';
}

/**
 * Use the same indexing decision in page metadata as in root metadata,
 * robots.txt and the X-Robots-Tag middleware.
 */
export function indexableRobots(): Metadata['robots'] {
  return isProductionDeployment() && isIndexingEnabled()
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true };
}

export function isCanonicalHost(value: string | null | undefined) {
  return normalizeHost(value) === SITE_HOST;
}

export function shouldRedirectToCanonical(
  value: string | null | undefined
) {
  const host = normalizeHost(value);
  return MANAGED_HOSTS.has(host) && host !== SITE_HOST;
}

export function shouldIndexRequest(value: string | null | undefined) {
  return isProductionDeployment() && isIndexingEnabled() && isCanonicalHost(value);
}

export function productionUrl(path = '/') {
  return new URL(path, SITE_URL).toString();
}
