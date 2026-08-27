'use client';

import { useState } from 'react';

type NavigationProps = {
  onCtaClick: () => void;
};

const links = [
  { href: '#examples', label: 'Esimerkit' },
  { href: '#process', label: 'Prosessi' },
  { href: '#pricing', label: 'Hinta' },
  { href: '#faq', label: 'FAQ' },
];

export default function Navigation({ onCtaClick }: NavigationProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-ghost/95 backdrop-blur">
      <div className="container-wide flex min-h-16 items-center justify-between gap-4">
        <a href="#top" className="font-black uppercase tracking-tight text-ink" aria-label="GhoulHouse etusivu">
          GhoulHouse
        </a>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Päänavigaatio">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-sm font-semibold text-ink">
              {link.label}
            </a>
          ))}
          <button type="button" className="btn btn-primary py-2.5" onClick={onCtaClick}>
            Pyydä 2 sisältöesimerkkiä
          </button>
        </nav>

        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center border-2 border-ink bg-transparent font-bold text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Sulje valikko' : 'Avaa valikko'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? '×' : '☰'}
        </button>
      </div>

      {open && (
        <nav id="mobile-menu" className="border-t border-ink/10 bg-ghost px-4 py-4 md:hidden" aria-label="Mobiilinavigaatio">
          <div className="mx-auto flex max-w-screen-sm flex-col gap-2">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="min-h-11 py-2 font-semibold text-ink"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              className="btn btn-primary mt-2 w-full"
              onClick={() => {
                setOpen(false);
                onCtaClick();
              }}
            >
              Pyydä 2 sisältöesimerkkiä
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
