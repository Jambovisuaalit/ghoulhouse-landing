const canonicalSiteUrl = 'https://ghoulhouse.fi';
const privacyPath = process.env.NEXT_PUBLIC_PRIVACY_PATH?.trim() || null;
const termsPath = process.env.NEXT_PUBLIC_TERMS_PATH?.trim() || null;
const founderImage = process.env.NEXT_PUBLIC_FOUNDER_IMAGE?.trim() || null;

export const siteConfig = {
  company: {
    brand: 'GhoulHouse',
    legalName: 'GhoulHouse Oy',
    founder: 'Hanna Nyholm',
    founderImage,
    domain: canonicalSiteUrl,
  },
  cta: {
    primary: 'VARAA 20 MIN KESKUSTELU',
    secondary: 'LÄHETÄ KAKSI TYÖKUVAA',
  },
  offer: {
    name: 'GHOULHOUSE SOME 12',
    price: 490,
    vatLabel: '+ ALV',
    period: '30 päivää',
    start: {
      name: 'SOME 12',
      price: 490,
      vatLabel: '+ ALV',
      period: '30 päivää',
      lifecycle: '30 päivän palvelujakso',
    },
  },
  legal: {
    privacyPath,
    termsPath,
  },
} as const;

export type SiteConfig = typeof siteConfig;
