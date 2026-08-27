'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Button from '@/components/ui/Button';
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

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-ghost">
      <Container>
        <nav
          className="flex min-h-[72px] items-center justify-between gap-5"
          aria-label="Päänavigaatio"
        >
          <Link href="#top" aria-label="GhoulHouse — sivun alku">
            <span className="flex items-center gap-2.5">
              <Image
                src="/mark-color.svg"
                alt=""
                width={42}
                height={42}
                priority
                className="h-9 w-9 md:h-10 md:w-10"
              />
              <span className="font-display text-2xl uppercase leading-none tracking-[-0.02em] text-ink md:text-[1.7rem]">
                GhoulHouse
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-bold text-ink hover:text-signal"
              >
                {link.label}
              </a>
            ))}
            <Button
              variant="primary"
              size="sm"
              onClick={onCtaClick}
              className="whitespace-nowrap text-xs uppercase tracking-[0.06em]"
            >
              {siteConfig.cta.primary}
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-11 w-11 items-center justify-center border-2 border-ink bg-ghost text-ink md:hidden"
            aria-label={mobileMenuOpen ? 'Sulje valikko' : 'Avaa valikko'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            <span className="sr-only">
              {mobileMenuOpen ? 'Sulje valikko' : 'Avaa valikko'}
            </span>
            <span aria-hidden="true" className="text-xl font-black">
              {mobileMenuOpen ? '×' : '≡'}
            </span>
          </button>
        </nav>
      </Container>

      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="border-t-2 border-ink bg-ghost md:hidden"
        >
          <Container className="py-4">
            <div className="divide-y divide-ink/20 border-y border-ink/20">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block py-4 text-base font-bold text-ink"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setMobileMenuOpen(false);
                onCtaClick();
              }}
              className="mt-4 w-full text-xs uppercase tracking-[0.07em]"
            >
              {siteConfig.cta.primary}
            </Button>
          </Container>
        </div>
      )}
    </header>
  );
}
