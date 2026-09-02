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
    primary: 'PYYDÄ 2 MAKSUTONTA SISÄLTÖESIMERKKIÄ',
    secondary: 'LÄHETÄ 2 TYÖKUVAA',
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
      lifecycle: 'Ensimmäiset 30 päivää',
    },
  },
  legal: {
    privacyPath: privacyPath || '/tietosuoja',
    termsPath,
  },
} as const;

export type SiteConfig = typeof siteConfig;
