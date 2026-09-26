'use client';

import { useEffect } from 'react';

const DESKTOP_MEDIA_QUERY = '(min-width: 768px)';

export default function ResponsiveNavState() {
  useEffect(() => {
    const media = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const closeMobileMenu = () => {
      if (!media.matches) return;
      const menu = document.querySelector<HTMLDetailsElement>('.mobileNav');
      if (menu?.open) menu.open = false;
    };

    const closeAfterNavigation = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest('.mobileNav nav a');
      const menu = link?.closest<HTMLDetailsElement>('details');
      if (menu) menu.open = false;
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      const menu = document.querySelector<HTMLDetailsElement>('.mobileNav[open]');
      if (event.key !== 'Escape' || !menu) return;
      menu.open = false;
      menu.querySelector('summary')?.focus();
    };

    document.addEventListener('click', closeAfterNavigation);
    document.addEventListener('keydown', closeOnEscape);
    closeMobileMenu();
    media.addEventListener('change', closeMobileMenu);
    return () => {
      media.removeEventListener('change', closeMobileMenu);
      document.removeEventListener('click', closeAfterNavigation);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  return null;
}
