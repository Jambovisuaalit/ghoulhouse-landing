'use client';

import { useEffect, useRef } from 'react';

const DESKTOP_MEDIA_QUERY = '(min-width: 768px)';

export default function ResponsiveMobileNav() {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const closeForDesktop = () => {
      if (media.matches && detailsRef.current?.open) {
        detailsRef.current.open = false;
      }
    };

    closeForDesktop();
    media.addEventListener('change', closeForDesktop);
    return () => media.removeEventListener('change', closeForDesktop);
  }, []);

  const closeMenu = () => {
    if (detailsRef.current) detailsRef.current.open = false;
  };

  return (
    <details className="mobileNav" ref={detailsRef}>
      <summary>MENU</summary>
      <nav aria-label="Mobiilinavigaatio">
        <a href="#toiminta" onClick={closeMenu}>Miten toimii</a>
        <a href="#palvelu" onClick={closeMenu}>Palvelu</a>
        <a href="#hinta" onClick={closeMenu}>Hinta</a>
        <a href="#ukk" onClick={closeMenu}>UKK</a>
        <a href="#yhteys" onClick={closeMenu}>Pyydä 2 esimerkkiä</a>
      </nav>
    </details>
  );
}
