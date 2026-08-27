export const siteConfig = {
  company: {
    brand: 'GhoulHouse',
    legalName: 'GhoulHouse Oy',
    founder: 'Hanna Nyholm',
    location: 'Helsinki, Finland',
    domain: 'https://ghoulhouse.fi',
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
      name: 'START',
      price: 490,
      vatLabel: '+ ALV',
      period: '30 päivää',
      lifecycle: 'Palvelujaksot 1–3',
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
    privacyPath: null,
    termsPath: null,
  },
} as const;

export type SiteConfig = typeof siteConfig;
