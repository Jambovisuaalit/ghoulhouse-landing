'use client';

import Image from 'next/image';
import { type CSSProperties, useEffect, useState } from 'react';

const HINT_STORAGE_KEY = 'ghoulhouse:before-after-slider-used';

export default function BeforeAfterSlider() {
  const [position, setPosition] = useState(50);
  const [showFirstTouchHint, setShowFirstTouchHint] = useState(false);

  useEffect(() => {
    const coarsePointer = window.matchMedia(
      '(hover: none) and (pointer: coarse)'
    ).matches;
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (!coarsePointer || reducedMotion) return;

    try {
      setShowFirstTouchHint(
        window.localStorage.getItem(HINT_STORAGE_KEY) !== '1'
      );
    } catch {
      setShowFirstTouchHint(true);
    }
  }, []);

  const markAsUsed = () => {
    if (!showFirstTouchHint) return;

    setShowFirstTouchHint(false);
    try {
      window.localStorage.setItem(HINT_STORAGE_KEY, '1');
    } catch {
      // Storage can be unavailable in strict privacy modes; the interaction
      // remains fully functional without persistence.
    }
  };

  const splitStyle = {
    '--before-after-split': `${position}%`,
  } as CSSProperties;

  return (
    <figure className="before-after-demo">
      <div className="before-after-slider" style={splitStyle}>
        <Image
          src="/hero-renovation-clean.svg"
          alt="Ennen-vaihetta havainnollistava remontin konseptikuva"
          fill
          sizes="(max-width: 767px) 100vw, 1100px"
          className="before-after-slider__image"
          priority={false}
        />

        <div className="before-after-slider__after" aria-hidden="true">
          <Image
            src="/finished-space.svg"
            alt=""
            fill
            sizes="(max-width: 767px) 100vw, 1100px"
            className="before-after-slider__image"
          />
        </div>

        <div className="before-after-slider__label before-after-slider__label--before">
          Ennen
        </div>
        <div className="before-after-slider__label before-after-slider__label--after">
          Jälkeen
        </div>

        <div
          className="before-after-slider__divider"
          aria-hidden="true"
        >
          <span
            className={
              showFirstTouchHint
                ? 'before-after-slider__handle before-after-slider__handle--hint'
                : 'before-after-slider__handle'
            }
          >
            <span className="before-after-slider__arrows">↔</span>
          </span>
          {showFirstTouchHint ? (
            <span className="before-after-slider__touch-hint">Vedä ↔</span>
          ) : null}
        </div>

        <input
          className="before-after-slider__range"
          type="range"
          min="0"
          max="100"
          step="1"
          value={position}
          aria-label="Vertaa ennen- ja jälkeen-kuvaa"
          aria-valuetext={`Ennen ${position} prosenttia, jälkeen ${100 - position} prosenttia`}
          onChange={(event) => {
            setPosition(Number(event.currentTarget.value));
            markAsUsed();
          }}
          onPointerDown={markAsUsed}
          onKeyDown={markAsUsed}
        />
      </div>

      <figcaption className="before-after-demo__caption">
        <span className="type-label text-signal">Before / after</span>
        <p>
          Vedä jakajaa nähdäksesi, miten sama työ voidaan esittää muutoksena.
          Konseptiesimerkki — ei asiakastyö.
        </p>
      </figcaption>
    </figure>
  );
}
