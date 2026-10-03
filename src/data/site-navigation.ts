/** Canonical primary navigation for homepage (desktop/mobile) and all inner pages. */
export const siteNavigation = [
  { href: '/some-sisallontuotanto', label: 'Social' },
  { href: '/verkkosivut-yritykselle', label: 'Verkkosivut' },
  { href: '/resurssit', label: 'SEO & resurssit' },
  { href: '/referenssit', label: 'Työt' },
] as const;

/** The same six destinations on every viewport and route. */
export const overlayNavigation = [
  { href: '/#palvelut', label: 'Palvelut' },
  { href: '/#toiminta', label: 'Miten toimii' },
  { href: '/referenssit', label: 'Referenssit' },
  { href: '/some-sisallontuotanto/hinta', label: 'Hinnat' },
  { href: '/resurssit', label: 'Oppaat' },
  { href: '/#yhteys', label: 'Yhteys' },
] as const;
