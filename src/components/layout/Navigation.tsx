'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Container from '@/components/ui/Container';
import ContactTrigger from '@/components/contact/ContactTrigger';
import { siteConfig } from '@/config/site';

const links = [
  { href: '/some-12', label: 'Some 12' },
  { href: '/miten-toimii', label: 'Miten toimii' },
  { href: '/caset', label: 'Caset' },
  { href: '/meista', label: 'Meistä' },
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
          className="flex min-h-[60px] items-center justify-between gap-5 min-[1100px]:min-h-[66px]"
          aria-label="Päänavigaatio"
        >
          <Link href="/" className="inline-flex shrink-0 items-center" aria-label="GhoulHouse — etusivu">
            <Image
              src="/logo-horizontal.svg"
              alt="GhoulHouse"
              width={1400}
              height={460}
              priority
              className="hidden h-auto w-[150px] sm:block min-[1100px]:w-[178px]"
            />
            <Image
              src="/mark-color.svg"
              alt="GhoulHouse"
              width={96}
              height={96}
              priority
              className="h-10 w-10 shrink-0 sm:hidden"
            />
          </Link>

          <div className="hidden items-center gap-7 min-[1100px]:flex min-[1100px]:gap-9">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="type-label text-ink transition-colors hover:text-signal">
                {link.label}
              </Link>
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
            className="type-label inline-flex min-h-11 items-center gap-2 text-ink min-[1100px]:hidden"
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
          className="absolute inset-x-0 top-full max-h-[calc(100svh-60px)] overflow-y-auto border-y-2 border-ink bg-ghost min-[1100px]:hidden"
        >
          <Container className="py-5">
            <div className="grid">
              {links.map((link, index) => (
                <Link
                  ref={index === 0 ? firstMobileLinkRef : undefined}
                  key={link.href}
                  href={link.href}
                  className={`type-ui flex min-h-12 items-center justify-between border-ink/20 py-3 uppercase tracking-[0.08em] text-ink ${
                    index === 0 ? 'border-t' : ''
                  } border-b`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{link.label}</span>
                  <span aria-hidden="true" className="text-signal">→</span>
                </Link>
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
