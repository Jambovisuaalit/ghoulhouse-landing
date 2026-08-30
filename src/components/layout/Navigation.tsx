'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import Container from '@/components/ui/Container';
import ContactTrigger from '@/components/contact/ContactTrigger';
import { siteConfig } from '@/config/site';

const navItems = [
  ['Palvelu', '#palvelu'],
  ['Miten toimii', '#miten-toimii'],
  ['Hinta', '#hinta'],
  ['Esimerkit', '#esimerkit'],
  ['UKK', '#faq'],
] as const;

export default function Navigation() {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 72);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="nav-slot">
      <header className={`nav-shell ${stuck ? 'nav-shell--stuck' : ''}`}>
        <Container>
          <nav
            className="flex min-h-16 items-center justify-between gap-4 sm:min-h-[72px] sm:gap-5"
            aria-label="Päänavigaatio"
          >
            <a href="#top" className="shrink-0" aria-label="GhoulHouse — sivun alku">
              <span className="sr-only">GhoulHouse</span>
              <Image
                src="/logo-horizontal.svg"
                alt="GhoulHouse"
                width={1400}
                height={460}
                priority
                className="h-9 w-auto sm:h-[44px] lg:h-[48px]"
              />
            </a>

            <div className="hidden items-center gap-6 lg:flex">
              {navItems.map(([label, href]) => (
                <a key={href} href={href} className="type-ui uppercase text-ink hover:text-signal">
                  {label}
                </a>
              ))}
            </div>

            <ContactTrigger className="btn btn-primary min-h-12 px-3 text-[0.65rem] sm:px-5 sm:text-[0.72rem]">
              <span className="hidden sm:inline">{siteConfig.cta.primary}</span>
              <span className="sm:hidden">VARAA 20 MIN</span>
            </ContactTrigger>
          </nav>
        </Container>
      </header>
    </div>
  );
}
