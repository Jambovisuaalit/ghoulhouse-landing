'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

const navigation = [
  { href: '/verkkosivut-yritykselle', label: 'Verkkosivut' },
  { href: '/some-sisallontuotanto', label: 'Social' },
  { href: '/resurssit', label: 'SEO & resurssit' },
  { href: '/referenssit', label: 'Työt' },
] as const;

/** One common navigation and footer on every inner route.
 * The homepage keeps its existing anchored Swiss-editorial navigation.
 */
export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (!pathname || pathname === '/') return <>{children}</>;
  const active = (href: string) => pathname === href || (href === '/resurssit' && pathname.startsWith('/oppaat/'));

  return (
    <>
      <a className="skipLink" href="#site-content">Siirry pääsisältöön</a>
      <header className="ghGlobalHeader">
        <div className="ghGlobalShell ghGlobalHeaderInner">
          <Link className="ghGlobalBrand" href="/" aria-label="GhoulHouse — etusivu">
            <Image src="/favicon.svg" alt="" width={36} height={36} />
            <span>GHOULHOUSE</span>
          </Link>
          <nav className="ghGlobalDesktopNav" aria-label="Päänavigaatio">
            {navigation.map(({ href, label }) => (
              <Link key={href} href={href} aria-current={active(href) ? 'page' : undefined}>{label}</Link>
            ))}
          </nav>
          <Link className="ghGlobalInquiry" href="/#yhteys">Pyydä ehdotus <span aria-hidden="true">↗</span></Link>
          <details className="mobileNav ghGlobalMobileNav">
            <summary aria-label="Avaa valikko">VALIKKO <span aria-hidden="true">+</span></summary>
            <nav aria-label="Mobiilinavigaatio">
              {navigation.map(({ href, label }) => (
                <Link key={href} href={href} aria-current={active(href) ? 'page' : undefined}>{label}</Link>
              ))}
              <Link href="/#yhteys">Pyydä ehdotus</Link>
            </nav>
          </details>
        </div>
      </header>
      <div id="site-content" className="ghGlobalContent" tabIndex={-1}>{children}</div>
      <footer className="ghGlobalFooter">
        <div className="ghGlobalShell">
          <div className="ghGlobalFooterMasthead" aria-hidden="true">GHOULHOUSE<span>.</span></div>
          <div className="ghGlobalFooterGrid">
            <div>
              <Link className="ghGlobalBrand" href="/" aria-label="GhoulHouse — etusivu">
                <Image src="/favicon.svg" alt="" width={32} height={32} />
                <span>GHOULHOUSE</span>
              </Link>
              <p>Hyvä työ pitää näkyä.<br />Verkkosivut · Social · SEO.</p>
            </div>
            <div>
              <strong>YHTEYSTIEDOT</strong>
              <p>GhoulHouse Oy · Helsinki<br />Y-tunnus 3651127-5</p>
              <a href="mailto:hello@ghoulhouse.fi">hello@ghoulhouse.fi</a>
            </div>
            <nav aria-label="Alatunnisteen navigaatio">
              {navigation.map(({ href, label }) => <Link key={href} href={href}>{label}</Link>)}
              <Link href="/tietosuoja">Tietosuoja</Link>
              <Link href="/#yhteys">Pyydä ehdotus ↗</Link>
            </nav>
          </div>
          <div className="ghGlobalFooterBottom"><span>© 2026 GhoulHouse Oy</span><Link href="/">Takaisin etusivulle ↑</Link></div>
        </div>
      </footer>
    </>
  );
}
