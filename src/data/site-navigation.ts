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
    return { href: '#yhteys', label: 'Pyydä verkkosivuarvio' };
  }
  if (path === '/some-12') {
    return { href: '#yhteys', label: 'Pyydä SOME 12 -aloitusta' };
  }
  if (
    path === '/some-sisallontuotanto' ||
    path === '/some-sisallontuotanto/hinta' ||
    path === '/instagram-sisallontuotanto' ||
    path === '/rakennusyrityksille' ||
    path === '/lvi-yrityksille' ||
    path === '/saneerausyrityksille'
  ) {
    return { href: '#yhteys', label: 'Pyydä 2 sisältöesimerkkiä' };
  }
  return { href: '/?intent=photos#yhteys', label: 'Pyydä 2 sisältöesimerkkiä' };
}
