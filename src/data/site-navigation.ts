/** Canonical primary navigation for homepage (desktop/mobile) and all inner pages. */
export const siteNavigation = [
  { href: '/some-sisallontuotanto', label: 'Social' },
  { href: '/verkkosivut-yritykselle', label: 'Verkkosivut' },
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
    return { href: '#yhteys', label: 'Pyydä verkkosivuarvio', note: 'Kerro nykyisestä sivustosta tai uuden toteutuksen tarpeesta.', priceHref: '/verkkosivut/hinta' };
  }
  if (path === '/some-12') {
    return { href: '#yhteys', label: 'Pyydä SOME 12 -aloitusta', note: '12 sisältöä Instagramiin ja Facebookiin / 30 päivää.', priceHref: '/some-sisallontuotanto/hinta' };
  }
  if (
    path === '/some-sisallontuotanto' ||
    path === '/some-sisallontuotanto/hinta' ||
    path === '/instagram-sisallontuotanto' ||
    path === '/rakennusyrityksille' ||
    path === '/lvi-yrityksille' ||
    path === '/saneerausyrityksille'
  ) {
    return { href: '#yhteys', label: 'Pyydä 2 sisältöesimerkkiä', note: 'Maksuttomat esimerkit omista kuvistanne.', priceHref: '/some-sisallontuotanto/hinta' };
  }
  return { href: '/?intent=photos#yhteys', label: 'Pyydä 2 sisältöesimerkkiä', note: 'Maksuttomat esimerkit omista kuvistanne.', priceHref: '/some-sisallontuotanto/hinta' };
}

/** Keep service and resource navigation selected on their child pages. */
export function isNavigationActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (pathname === href) return true;
  if (href === '/resurssit') return pathname.startsWith('/oppaat/');
  if (href === '/referenssit') return pathname.startsWith('/tyot/');
  if (href === '/verkkosivut-yritykselle') return pathname.startsWith('/verkkosivut/');
  if (href === '/some-sisallontuotanto') {
    return pathname.startsWith('/some-sisallontuotanto/') || [
      '/some-12', '/instagram-sisallontuotanto', '/rakennusyrityksille',
      '/lvi-yrityksille', '/saneerausyrityksille',
    ].includes(pathname);
  }
  return false;
}
