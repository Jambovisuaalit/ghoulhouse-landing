'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { usePathname } from 'next/navigation';
import ArrowUpRight from '@/components/ArrowUpRight';
import { overlayNavigation, siteNavigation } from '@/data/site-navigation';

/** Native modal supplies background inertness; the details menu also works without JS. */
export default function MotionOverlayMenu({ home = false }: { home?: boolean }) {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const unlockRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    setReady(true);
    return () => {
      clearTimeout(timerRef.current);
      unlockRef.current?.();
    };
  }, []);

  function finishClose() {
    clearTimeout(timerRef.current);
    dialogRef.current?.close();
    unlockRef.current?.();
    unlockRef.current = null;
    setOpen(false);
    setClosing(false);
    triggerRef.current?.focus({ preventScroll: true });
  }

  function requestClose() {
    if (closing) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finishClose();
      return;
    }
    setClosing(true);
    timerRef.current = setTimeout(finishClose, 240);
  }

  function showMenu() {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    const body = document.body;
    const y = window.scrollY;
    const previous = { position: body.style.position, top: body.style.top, width: body.style.width, overflow: body.style.overflow };
    body.style.position = 'fixed';
    body.style.top = `-${y}px`;
    body.style.width = '100%';
    body.style.overflow = 'hidden';
    unlockRef.current = () => {
      Object.assign(body.style, previous);
      window.scrollTo({ top: y, behavior: 'instant' });
    };
    setClosing(false);
    setOpen(true);
    dialog.showModal();
    closeRef.current?.focus({ preventScroll: true });
  }

  return (
    <>
      <details hidden={ready} className={`mobileNav ghMenuFallback ${home ? 'ghMobileNav' : 'ghGlobalMobileNav'}`}>
        <summary aria-label="Avaa valikko">Valikko <span aria-hidden="true">+</span></summary>
        <nav aria-label="Mobiilinavigaatio">
          {siteNavigation.map(({ href, label }) => <a key={href} href={href}>{label}</a>)}
          <a href="/?intent=photos#yhteys">Pyydä 2 sisältöesimerkkiä</a>
        </nav>
      </details>
      <button hidden={!ready} ref={triggerRef} type="button" className="ghMenuTrigger" aria-expanded={open} aria-controls="gh-overlay-menu" aria-haspopup="dialog" onClick={showMenu}>
        Valikko <span className="ghMenuIcon" aria-hidden="true"><i /><i /></span>
      </button>
      <dialog ref={dialogRef} id="gh-overlay-menu" className="ghOverlayMenu" aria-label="Sivuston valikko" data-closing={closing || undefined}
        onCancel={(event) => { event.preventDefault(); requestClose(); }}
        onClick={(event) => {
          if (event.target instanceof Element && event.target.closest('a')) finishClose();
        }}
        onKeyDown={(event) => {
          if (event.key !== 'Tab') return;
          const elements = dialogRef.current?.querySelectorAll<HTMLElement>('a[href], button');
          if (!elements?.length) return;
          const first = elements[0];
          const last = elements[elements.length - 1];
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        }}>
        <div className="ghOverlayShell">
          <div className="ghOverlayTop">
            <a className="ghOverlayBrand" href="/" aria-label="GhoulHouse — etusivu">
              <Image src="/ghoulhouse-logo-reverse.svg" alt="" width={175} height={58} />
            </a>
            <button ref={closeRef} type="button" className="ghMenuClose" onClick={requestClose} aria-label="Sulje valikko">Sulje <span className="ghMenuIcon" aria-hidden="true"><i /><i /></span></button>
          </div>
          <div className="ghOverlayBody">
            <nav className="ghOverlayNav" aria-label="Päävalikko">
              {overlayNavigation.map(({ href, label }, index) => (
                <a key={href} href={href} aria-current={!href.includes('#') && pathname === href ? 'page' : undefined} style={{ '--menu-index': index } as CSSProperties}>
                  <span className="ghOverlayNumber" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <span>{label}</span>
                  <span className="ghOverlayArrow" aria-hidden="true"><ArrowUpRight /></span>
                </a>
              ))}
            </nav>
            <div className="ghOverlayAside">
              <p className="ghOverlayEyebrow">Työmaakuvat sisään.<br />Valmis some ulos.</p>
              <a className="ghOverlayCta" href="/?intent=photos#yhteys">Pyydä 2<br />sisältöesimerkkiä <span aria-hidden="true"><ArrowUpRight /></span></a>
              <p className="ghOverlayNote">Maksuttomat esimerkit omista kuvistanne.</p>
              <a className="ghOverlayEmail" href="mailto:hanna@ghoulhouse.fi">hanna@ghoulhouse.fi</a>
              <div className="ghOverlayServices" aria-label="Palvelut">
                {siteNavigation.slice(0, 3).map(({ href, label }) => <a key={href} href={href}>{label}</a>)}
              </div>
            </div>
          </div>
          <div className="ghOverlayBottom"><span>GhoulHouse Oy · Helsinki</span><a href="/tietosuoja">Tietosuoja</a></div>
        </div>
      </dialog>
    </>
  );
}
