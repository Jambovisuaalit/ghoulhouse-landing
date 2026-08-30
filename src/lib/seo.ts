import { siteConfig } from '@/config/site';

export const SITE_URL = siteConfig.company.domain;
export const SITE_HOST = new URL(SITE_URL).hostname;

const MANAGED_HOSTS = new Set(['ghoulhouse.fi', 'www.ghoulhouse.fi']);
const LEGACY_VERCEL_PROJECT = 'ghoulhouse-landing-1ig9';

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

export function isLegacyDomainBridge() {
  const productionHost = normalizeHost(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
  );
  const deploymentHost = normalizeHost(process.env.VERCEL_URL);

  return (
    productionHost === `${LEGACY_VERCEL_PROJECT}.vercel.app` ||
    deploymentHost.startsWith(`${LEGACY_VERCEL_PROJECT}-`)
  );
}

export function shouldRedirectToCanonical(
  value: string | null | undefined
) {
  const host = normalizeHost(value);

  if (host === 'www.ghoulhouse.fi' && isLegacyDomainBridge()) {
    return false;
  }

  return MANAGED_HOSTS.has(host) && host !== SITE_HOST;
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
