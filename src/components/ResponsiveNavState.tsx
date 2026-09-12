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

    closeMobileMenu();
    media.addEventListener('change', closeMobileMenu);
    return () => media.removeEventListener('change', closeMobileMenu);
  }, []);

  return null;
}
