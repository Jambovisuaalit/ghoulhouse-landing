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

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-bone">
      <Container className="flex justify-between items-center py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="text-xl font-bold text-signal">GhoulHouse</div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#problem" className="text-ink hover:text-signal transition-colors">
            Ongelma
          </a>
          <a href="#mechanism" className="text-ink hover:text-signal transition-colors">
            Miten se toimii
          </a>
          <a href="#pricing" className="text-ink hover:text-signal transition-colors">
            Hinta
          </a>
          <a href="#faq" className="text-ink hover:text-signal transition-colors">
            UKK
          </a>
          <Button
            variant="primary"
            size="sm"
            onClick={onCtaClick}
            className="whitespace-nowrap"
          >
            Pyydä esimerkit
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 hover:bg-bone rounded transition-colors"
          aria-label="Avaa päävalikko"
          aria-expanded={mobileMenuOpen}
        >
          <svg
            className="w-6 h-6 text-ink"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </Container>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-bone bg-ghost">
          <Container className="py-4 space-y-4">
            <a
              href="#problem"
              className="block text-ink hover:text-signal transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Ongelma
            </a>
            <a
              href="#mechanism"
              className="block text-ink hover:text-signal transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Miten se toimii
            </a>
            <a
              href="#pricing"
              className="block text-ink hover:text-signal transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Hinta
            </a>
            <a
              href="#faq"
              className="block text-ink hover:text-signal transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              UKK
            </a>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                onCtaClick();
                setMobileMenuOpen(false);
              }}
              className="w-full"
            >
              Pyydä esimerkit
            </Button>
          </Container>
        </div>
      )}
    </nav>
  );
}
