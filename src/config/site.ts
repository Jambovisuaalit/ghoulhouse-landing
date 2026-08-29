const canonicalSiteUrl = 'https://ghoulhouse.fi';

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
  cta: { primary: 'PYYDÄ 2 SISÄLTÖESIMERKKIÄ' },
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
  },
  contact: { email: null, phone: null, instagram: null },
  legal: {
    privacyPath: '/tietosuoja',
    cookiesPath: '/evasteet',
    termsPath: '/kayttoehdot',
  },
} as const;

export type SiteConfig = typeof siteConfig;
