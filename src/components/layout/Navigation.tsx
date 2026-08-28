'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Container from '@/components/ui/Container';
import ContactTrigger from '@/components/contact/ContactTrigger';
import { siteConfig } from '@/config/site';

const links = [
  { href: '#deliverables', label: 'Palvelu' },
  { href: '#mechanism', label: 'Näin toimii' },
  { href: '#pricing', label: 'Hinta' },
  { href: '#faq', label: 'UKK' },
] as const;

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const backgroundElements = Array.from(
      document.querySelectorAll<HTMLElement>('main, footer, a.skip-link')
    );
    const backgroundState = backgroundElements.map((element) => ({
      element,
      inert: element.hasAttribute('inert'),
      ariaHidden: element.getAttribute('aria-hidden'),
    }));

    document.body.style.overflow = 'hidden';

    for (const element of backgroundElements) {
      element.setAttribute('inert', '');
      element.setAttribute('aria-hidden', 'true');
    }

    requestAnimationFrame(() => firstMobileLinkRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        requestAnimationFrame(() => menuButtonRef.current?.focus());
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = Array.from(
        document.querySelectorAll<HTMLElement>(
          'button[aria-controls="mobile-navigation"], #mobile-navigation a[href], #mobile-navigation button:not([disabled])'
        )
      ).filter((element) => element.offsetParent !== null);

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;

      for (const { element, inert, ariaHidden } of backgroundState) {
        if (inert) element.setAttribute('inert', '');
        else element.removeAttribute('inert');

        if (ariaHidden === null) element.removeAttribute('aria-hidden');
        else element.setAttribute('aria-hidden', ariaHidden);
      }
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/20 bg-ghost">
      <Container>
        <nav
          className="flex min-h-[60px] items-center justify-between gap-5 md:min-h-[66px]"
          aria-label="Päänavigaatio"
        >
          <Link
            href="#top"
            className="inline-flex shrink-0 items-center gap-2"
            aria-label="GhoulHouse — sivun alku"
          >
            <Image
              src="/mark-color.svg"
              alt=""
              width={96}
              height={96}
              priority
              className="h-10 w-10 shrink-0 md:h-11 md:w-11"
            />
            <span className="font-display text-[1.55rem] uppercase leading-none tracking-[-0.025em] text-ink md:text-[1.75rem]">
              GhoulHouse
            </span>
          </Link>

          <div className="hidden items-center gap-9 lg:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="type-label text-ink transition-colors hover:text-signal"
              >
                {link.label}
              </a>
            ))}
            <ContactTrigger className="type-cta inline-flex min-h-11 items-center gap-2 text-signal transition-colors hover:text-ink">
              <span>2 sisältöesimerkkiä</span>
              <span aria-hidden="true">→</span>
            </ContactTrigger>
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="type-label inline-flex min-h-11 items-center gap-2 text-ink lg:hidden"
            aria-label={mobileMenuOpen ? 'Sulje valikko' : 'Avaa valikko'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            <span>{mobileMenuOpen ? 'Sulje' : 'Valikko'}</span>
            <span aria-hidden="true" className="text-base leading-none text-signal">
              {mobileMenuOpen ? '×' : '+'}
            </span>
          </button>
        </nav>
      </Container>

      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="absolute inset-x-0 top-full max-h-[calc(100svh-66px)] overflow-y-auto border-y-2 border-ink bg-ghost lg:hidden"
        >
          <Container className="py-5">
            <div className="grid">
              {links.map((link, index) => (
                <a
                  ref={index === 0 ? firstMobileLinkRef : undefined}
                  key={link.href}
                  href={link.href}
                  className={`type-ui flex min-h-12 items-center justify-between border-ink/20 py-3 uppercase tracking-[0.08em] text-ink ${
                    index === 0 ? 'border-t' : ''
                  } border-b`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{link.label}</span>
                  <span aria-hidden="true" className="text-signal">
                    →
                  </span>
                </a>
              ))}
            </div>
            <ContactTrigger
              onBeforeOpen={() => setMobileMenuOpen(false)}
              className="type-cta mt-5 flex min-h-14 w-full items-center justify-between bg-signal px-5 text-left text-white"
            >
              <span>{siteConfig.cta.primary}</span>
              <span aria-hidden="true">→</span>
            </ContactTrigger>
          </Container>
        </div>
      )}
    </header>
  );
}
