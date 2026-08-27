'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';

interface NavigationProps {
  onCtaClick: () => void;
}

export default function Navigation({ onCtaClick }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-40 border-b border-bone bg-white" aria-label="Päänavigaatio">
      <Container className="flex min-h-16 items-center justify-between">
        <Link href="/" className="flex min-h-11 items-center gap-2" aria-label="GhoulHouse etusivu">
          <span className="text-xl font-bold text-signal">GhoulHouse</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <a href="#problem" className="text-ink transition-colors hover:text-signal">
            Ongelma
          </a>
          <a href="#mechanism" className="text-ink transition-colors hover:text-signal">
            Miten se toimii
          </a>
          <a href="#pricing" className="text-ink transition-colors hover:text-signal">
            Hinta
          </a>
          <a href="#faq" className="text-ink transition-colors hover:text-signal">
            UKK
          </a>
          <Button variant="primary" size="sm" onClick={onCtaClick} className="whitespace-nowrap">
            Pyydä 2 sisältöesimerkkiä
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="flex min-h-11 min-w-11 items-center justify-center border-2 border-ink bg-white md:hidden"
          aria-label={mobileMenuOpen ? 'Sulje päävalikko' : 'Avaa päävalikko'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-main-menu"
        >
          <span aria-hidden="true" className="text-xl font-bold text-ink">
            {mobileMenuOpen ? '×' : '☰'}
          </span>
        </button>
      </Container>

      {mobileMenuOpen && (
        <div id="mobile-main-menu" className="border-t border-bone bg-ghost md:hidden">
          <Container className="space-y-2 py-4">
            {[
              ['#problem', 'Ongelma'],
              ['#mechanism', 'Miten se toimii'],
              ['#pricing', 'Hinta'],
              ['#faq', 'UKK'],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="flex min-h-11 items-center py-2 text-ink transition-colors hover:text-signal"
                onClick={closeMobileMenu}
              >
                {label}
              </a>
            ))}

            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                closeMobileMenu();
                onCtaClick();
              }}
              className="mt-2 w-full"
            >
              Pyydä 2 sisältöesimerkkiä
            </Button>
          </Container>
        </div>
      )}
    </nav>
  );
}
