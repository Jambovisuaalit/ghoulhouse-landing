'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Container from '@/components/ui/Container';
import { siteConfig } from '@/config/site';

interface NavigationProps {
  onCtaClick: () => void;
}

const links = [
  { href: '#deliverables', label: 'Palvelu' },
  { href: '#mechanism', label: 'Näin toimii' },
  { href: '#pricing', label: 'Hinta' },
  { href: '#faq', label: 'UKK' },
] as const;

export default function Navigation({ onCtaClick }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
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
            className="inline-flex shrink-0 items-center"
            aria-label="GhoulHouse — sivun alku"
          >
            <Image
              src="/logo-horizontal.svg"
              alt="GhoulHouse"
              width={420}
              height={138}
              priority
              className="h-auto w-[150px] md:w-[176px]"
            />
          </Link>

          <div className="hidden items-center gap-7 md:flex lg:gap-9">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[0.72rem] font-black uppercase tracking-[0.12em] text-ink transition-colors hover:text-signal"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={onCtaClick}
              className="inline-flex min-h-11 items-center gap-2 text-[0.72rem] font-black uppercase tracking-[0.12em] text-signal transition-colors hover:text-ink"
            >
              <span>2 sisältöesimerkkiä</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="inline-flex min-h-11 items-center gap-2 text-[0.7rem] font-black uppercase tracking-[0.14em] text-ink md:hidden"
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
          className="absolute inset-x-0 top-full border-y-2 border-ink bg-ghost md:hidden"
        >
          <Container className="py-5">
            <div className="grid">
              {links.map((link, index) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`flex min-h-12 items-center justify-between border-ink/20 py-3 text-sm font-black uppercase tracking-[0.1em] text-ink ${
                    index === 0 ? 'border-t' : ''
                  } border-b`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{link.label}</span>
                  <span aria-hidden="true" className="text-signal">→</span>
                </a>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onCtaClick();
              }}
              className="mt-5 flex min-h-14 w-full items-center justify-between bg-signal px-5 text-left text-sm font-black uppercase tracking-[0.08em] text-white"
            >
              <span>{siteConfig.cta.primary}</span>
              <span aria-hidden="true">→</span>
            </button>
          </Container>
        </div>
      )}
    </header>
  );
}
