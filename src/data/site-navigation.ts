/** Canonical primary navigation for homepage (desktop/mobile) and all inner pages. */
export const siteNavigation = [
  { href: '/verkkosivut-yritykselle', label: 'Verkkosivut' },
  { href: '/some-sisallontuotanto', label: 'Social' },
  { href: '/resurssit', label: 'Oppaat' },
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

/** Consistent, service-aware inquiry destination; never lose service context. */
export function getInquiryCta(pathname: string | null | undefined) {
  const path = pathname || '/';
  if (path === '/verkkosivut-yritykselle' || path.startsWith('/verkkosivut/')) {
    return { href: '#yhteys', label: 'Pyydä verkkosivuarvio', note: 'Käymme verkkosivunne lähtötilanteen läpi. Ei sitoumusta.', eyebrow: 'Verkkosivut yritykselle. Selkeä reitti yhteydenottoon.', pricingHref: '/verkkosivut/hinta' };
  }
  if (path === '/some-12') {
    return { href: '#yhteys', label: 'Pyydä SOME 12 -aloitusta', note: 'Sovimme materiaalit ja hyväksynnät ennen aloitusta.', eyebrow: 'Työmaakuvat sisään. Valmis some ulos.', pricingHref: '/some-sisallontuotanto/hinta' };
  }
  if (
    path === '/some-sisallontuotanto' ||
    path === '/some-sisallontuotanto/hinta' ||
    path === '/instagram-sisallontuotanto' ||
    path === '/rakennusyrityksille' ||
    path === '/lvi-yrityksille' ||
    path === '/saneerausyrityksille'
  ) {
    return { href: '#yhteys', label: 'Pyydä 2 sisältöesimerkkiä', note: 'Maksuttomat esimerkit omista kuvistanne.', eyebrow: 'Työmaakuvat sisään. Valmis some ulos.', pricingHref: '/some-sisallontuotanto/hinta' };
  }
  return { href: '/?service=websites#yhteys', label: 'Pyydä verkkosivuarvio', note: 'Kerro yrityksestänne ja verkkosivutarpeesta. Ei sitoumusta.', eyebrow: 'Verkkosivut yritykselle. Selkeä reitti yhteydenottoon.', pricingHref: '/verkkosivut/hinta' };
}
