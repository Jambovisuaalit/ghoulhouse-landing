'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';

/**
 * An original, dependency-free Next.js interpretation of a 3D infinite carousel.
 * Every item is server-rendered as a readable card when JavaScript is unavailable.
 * All cards are service overviews, not unverified customer references.
 */
type CarouselItem = readonly [label: string, title: string, description: string, href: string];

export default function Service3DCarousel({ items }: { items: readonly CarouselItem[] }) {
  const [active, setActive] = useState(0);
  const [enhanced, setEnhanced] = useState(false);
  const [skipTransition, setSkipTransition] = useState<number | null>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const suppressClick = useRef(false);

  useEffect(() => setEnhanced(true), []);

  const move = (direction: -1 | 1) => {
    // The old outer card crosses behind the carousel, so its repositioning
    // must not animate from one visible edge to the other.
    setSkipTransition((active + (direction === 1 ? items.length - 1 : 1)) % items.length);
    setActive((current) => (current + direction + items.length) % items.length);
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!enhanced || (event.pointerType === 'mouse' && event.button !== 0)) return;
    dragStart.current = { x: event.clientX, y: event.clientY };
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragStart.current) return;
    const dx = event.clientX - dragStart.current.x;
    const dy = event.clientY - dragStart.current.y;
    dragStart.current = null;
    if (Math.abs(dx) < 48 || Math.abs(dx) <= Math.abs(dy) * 1.2) return;
    suppressClick.current = true;
    move(dx < 0 ? 1 : -1);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      move(event.key === 'ArrowRight' ? 1 : -1);
    }
  };

  if (!items.length) return null;

  return (
    <div className={`gh3dCarousel${enhanced ? ' is-ready' : ''}`} role="region"
      aria-roledescription="karuselli" aria-label="GhoulHousen palveluesittelyt"
      onKeyDown={onKeyDown}>
      <div className="gh3dStage" onPointerDown={onPointerDown} onPointerUp={onPointerUp}
        onPointerCancel={() => { dragStart.current = null; }}
        onClickCapture={(event) => {
          if (!suppressClick.current) return;
          event.preventDefault();
          event.stopPropagation();
          suppressClick.current = false;
        }}>
        {items.map(([label, title, description, href], index) => {
          const distance = (index - active + items.length) % items.length;
          const slot = distance === 0 ? 'center' : distance <= items.length / 2 ? 'right' : 'left';
          const isWebsite = label === 'WEBSITES';
          const isSocial = label === 'SOCIAL';
          return (
            <article key={href} className="gh3dCard" data-slot={slot}
              data-skip={skipTransition === index ? 'true' : 'false'}
              aria-hidden={enhanced && slot !== 'center'}
              aria-label={`${label}: ${title}, ${index + 1} / ${items.length}`}>
              <div className={`gh3dCardMedia${isWebsite ? ' gh3dCardMedia--web' : ''}${isSocial ? ' gh3dCardMedia--social' : ''}`}
                aria-hidden="true">
                {isWebsite ? (
                  <Image src="/ghoulhouse-site-proof.png" alt="" fill sizes="(max-width: 767px) 82vw, 480px"
                    className="gh3dScreenshot" />
                ) : isSocial ? (
                  <div className="gh3dSocialConcept">
                    <span>GH / SOME 12</span>
                    <strong>TYÖMAAKUVAT<br />→ VALMIS SOME</strong>
                    <span>12 SISÄLTÖÄ · 30 PÄIVÄÄ</span>
                  </div>
                ) : (
                  <div className="gh3dIndustryConcept">
                    <span>GH / TOIMIALARATKAISUT</span>
                    <strong>HYVÄ TYÖ.<br />NÄKYVÄKSI.</strong>
                    <span>RAKENNUS · LVI · SÄHKÖ</span>
                  </div>
                )}
              </div>
              <span className="gh3dCardType">{label} / {String(index + 1).padStart(2, '0')}</span>
              <h3>{title}</h3>
              <p>{description}</p>
              <a href={href} className="gh3dCardLink" aria-label={`Tutustu: ${title}`}
                tabIndex={enhanced && slot !== 'center' ? -1 : 0}>
                Tutustu <span aria-hidden="true">↗</span>
              </a>
              <small className="gh3dDisclosure">{isWebsite
                ? 'Oma julkaistu sivusto — ei asiakasreferenssi.'
                : 'Palvelun havainne-esittely — ei asiakastyö.'}</small>
            </article>
          );
        })}
      </div>
      <div className="gh3dControls">
        <span className="gh3dCounter" aria-live="polite" aria-atomic="true">
          {String(active + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
        </span>
        <span className="gh3dHint">Vedä tai selaa</span>
        <div className="gh3dButtons">
          <button type="button" onClick={() => move(-1)} aria-label="Edellinen palveluesittely">←</button>
          <button type="button" onClick={() => move(1)} aria-label="Seuraava palveluesittely">→</button>
        </div>
      </div>
    </div>
  );
}
