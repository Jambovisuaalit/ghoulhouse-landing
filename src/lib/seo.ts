import { siteConfig } from '@/config/site';
export const SITE_URL = 'https://ghoulhouse.fi';
export const SITE_HOST = 'ghoulhouse.fi';

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

export function isIndexingApproved() {
  return (
    process.env.SITE_INDEXABLE === 'true' &&
    Boolean(siteConfig.legal.privacyPath)
  );
}

export function isCanonicalHost(value: string | null | undefined) {
  return normalizeHost(value) === SITE_HOST;
}

export function isWwwHost(value: string | null | undefined) {
  return normalizeHost(value) === `www.${SITE_HOST}`;
}

export function shouldIndexRequest(value: string | null | undefined) {
  return (
    isProductionDeployment() &&
    isIndexingApproved() &&
    isCanonicalHost(value)
  );
}

export function productionUrl(path = '/') {
  return new URL(path, SITE_URL).toString();
}
