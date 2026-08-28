const canonicalSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://www.ghoulhouse.fi';
const privacyPath =
  process.env.NEXT_PUBLIC_PRIVACY_PATH?.trim() || null;
const termsPath =
  process.env.NEXT_PUBLIC_TERMS_PATH?.trim() || null;

export const siteConfig = {
  company: {
    brand: 'GhoulHouse',
    legalName: 'GhoulHouse Oy',
    founder: 'Hanna Nyholm',
    location: 'Helsinki, Finland',
    domain: canonicalSiteUrl,
  },
  positioning: {
    headline: ['TYÖMAAKUVAT SISÄÄN.', 'VALMIS SOME ULOS.'],
    supporting: [
      'Teette hyvää työtä.',
      'Me pidämme huolen, että asiakkaat myös näkevät sen.',
    ],
  },
  cta: {
    primary: 'PYYDÄ 2 SISÄLTÖESIMERKKIÄ',
  },
  offer: {
    start: {
      name: 'SOME 12',
      price: 490,
      vatLabel: '+ ALV',
      period: '30 päivää',
      lifecycle: '30 päivän palvelujakso',
      includes: [
        '12 alkuperäistä sisältöä / 30 päivää',
        'Instagram + Facebook -sovitus',
        'Sisältösuunnittelu',
        'Kevyt kuvankäsittely',
        'Graafinen suunnittelu',
        'Copywriting',
        'CTA:t',
        'Ajastus ja julkaisu',
        'Yksi koottu korjauskierros',
        'WhatsApp-viestintä',
        'Kuukausittainen tulosyhteenveto',
        'Onboarding ja materiaaliohjeistus',
      ],
    },
    managed: {
      name: 'MANAGED',
      price: 790,
      vatLabel: '+ ALV',
      period: '30 päivää',
      lifecycle: 'Palvelujaksosta 4 alkaen',
      includes: [
        'Kaikki START-palvelun sisältö',
        'Jatkuva optimointi',
        'Parhaiden aiheiden analyysi',
        'Formaattianalyysi',
        'CTA-analyysi',
        'Julkaisurytmin optimointi',
        'Sisältöpankin hallinta',
        'Lyhyt viikkotilanne',
        'Rajattu community management',
        'Yksi konkreettinen kehityssuositus / kk',
      ],
    },
  },
  contact: {
    email: null,
    phone: null,
    instagram: null,
  },
  legal: {
    privacyPath,
    termsPath,
  },
} as const;

export type SiteConfig = typeof siteConfig;
