const canonicalSiteUrl = 'https://ghoulhouse.fi';
const privacyPath = process.env.NEXT_PUBLIC_PRIVACY_PATH?.trim() || null;
const termsPath = process.env.NEXT_PUBLIC_TERMS_PATH?.trim() || null;
const founderImage = process.env.NEXT_PUBLIC_FOUNDER_IMAGE?.trim() || null;

export const siteConfig = {
  company: {
    brand: 'GhoulHouse',
    legalName: 'Ghoulhouse Oy',
    businessId: '3651127-5',
    domicile: 'Helsinki',
    registrationDate: '2026-08-30',
    registrationStatus: 'Y-tunnus annettu 30.8.2026',
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
    privacyPath: privacyPath || '/tietosuoja',
    termsPath,
  },
} as const;

export type SiteConfig = typeof siteConfig;
