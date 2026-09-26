'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { siteNavigation } from '@/data/site-navigation';
import LiquidGlassFooter from '@/components/LiquidGlassFooter';

/** One common navigation and footer on every inner route.
 * The homepage keeps its existing anchored Swiss-editorial navigation.
 */
export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (!pathname || pathname === '/') return <>{children}</>;
  const active = (href: string) => pathname === href
    || (href === '/resurssit' && pathname.startsWith('/oppaat/'))
    || (href === '/referenssit' && pathname.startsWith('/tyot/'))
    || (href === '/verkkosivut-yritykselle' && pathname.startsWith('/verkkosivut/'));

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
            {siteNavigation.map(({ href, label }) => (
              <Link key={href} href={href} aria-current={active(href) ? 'page' : undefined}>{label}</Link>
            ))}
          </nav>
          <Link className="ghGlobalInquiry" href="/#yhteys">Pyydä ehdotus <span aria-hidden="true">↗</span></Link>
          <details className="mobileNav ghGlobalMobileNav">
            <summary aria-label="Avaa valikko">VALIKKO <span aria-hidden="true">+</span></summary>
            <nav aria-label="Mobiilinavigaatio">
              {siteNavigation.map(({ href, label }) => (
                <Link key={href} href={href} aria-current={active(href) ? 'page' : undefined}>{label}</Link>
              ))}
              <Link href="/#yhteys">Pyydä ehdotus</Link>
            </nav>
          </details>
        </div>
      </header>
      <div id="site-content" className="ghGlobalContent" tabIndex={-1}>{children}</div>
      <LiquidGlassFooter />
    </>
  );
}
