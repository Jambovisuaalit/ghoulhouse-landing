'use client';

import { useEffect, useRef, useState } from 'react';
import Logo from '@/components/ui/Logo';
import { siteConfig } from '@/lib/site';

const links = [
  { href: '#mekanismi', label: 'Mekanismi' },
  { href: '#sisalto', label: 'Sisältö' },
  { href: '#hinta', label: 'Hinta' },
  { href: '#ukk', label: 'UKK' },
] as const;

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 768px)');
    const closeAtDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };

    desktopQuery.addEventListener('change', closeAtDesktop);
    return () => desktopQuery.removeEventListener('change', closeAtDesktop);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    firstLinkRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key !== 'Tab') return;

      const menu = document.getElementById('mobile-menu');
      const focusable = menu?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <header className="site-header">
      <div className="shell flex min-h-[72px] items-center justify-between gap-6">
        <a href="#top" aria-label="GhoulHouse — etusivun alku" className="shrink-0">
          <Logo />
        </a>

        <nav aria-label="Päänavigaatio" className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="nav-link">
              {link.label}
            </a>
          ))}
          <a href={siteConfig.contactAnchor} className="btn-primary btn-small">
            {siteConfig.primaryCta}
          </a>
        </nav>

        <button
          ref={menuButtonRef}
          type="button"
          className="menu-button md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Sulje valikko' : 'Avaa valikko'}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
      </div>

      {open ? (
        <nav id="mobile-menu" aria-label="Mobiilinavigaatio" className="mobile-menu md:hidden">
          <div className="shell flex flex-col py-6">
            {links.map((link, index) => (
              <a
                key={link.href}
                ref={index === 0 ? firstLinkRef : undefined}
                href={link.href}
                className="mobile-nav-link"
                onClick={closeMenu}
              >
                {link.label}
              </a>
            ))}
            <a href={siteConfig.contactAnchor} className="btn-primary mt-6 w-full" onClick={closeMenu}>
              {siteConfig.primaryCta}
            </a>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
