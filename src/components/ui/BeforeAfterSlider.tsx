'use client';

import Image from 'next/image';
import { type CSSProperties, useEffect, useState } from 'react';
import styles from './BeforeAfterSlider.module.css';
import { tryGetItem, trySetItem } from '@/lib/storage';

const HINT_STORAGE_KEY = 'ghoulhouse:before-after-slider-used';

export default function BeforeAfterSlider() {
  const [position, setPosition] = useState(50);
  const [showFirstTouchHint, setShowFirstTouchHint] = useState(false);

  useEffect(() => {
    const coarsePointer = typeof window !== 'undefined' && window.matchMedia(
      '(hover: none) and (pointer: coarse)'
    ).matches;
    const reducedMotion = typeof window !== 'undefined' && window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (!coarsePointer || reducedMotion) return;

    const used = tryGetItem(HINT_STORAGE_KEY);
    setShowFirstTouchHint(used !== '1');
  }, []);

  const markAsUsed = () => {
    if (!showFirstTouchHint) return;

    setShowFirstTouchHint(false);
    trySetItem(HINT_STORAGE_KEY, '1');
  };

  const splitStyle = {
    '--before-after-split': `${position}%`,
  } as CSSProperties;

  return (
    <figure className={styles.beforeAfterDemo}>
      <div className={styles.beforeAfterSlider} style={splitStyle}>
        <Image
          src="/hero-renovation-clean.svg"
          alt="Ennen-vaihetta havainnollistava remontin konseptikuva"
          fill
          sizes="(max-width: 767px) 100vw, 1100px"
          className={styles.beforeAfterSlider__image}
          priority={false}
        />

        <div className={styles.beforeAfterSlider__after} aria-hidden="true">
          <Image
            src="/finished-space.svg"
            alt=""
            fill
            sizes="(max-width: 767px) 100vw, 1100px"
            className={styles.beforeAfterSlider__image}
          />
        </div>

        <div className={`${styles.beforeAfterSlider__label} ${styles['beforeAfterSlider__label--before']}`}>
          Ennen
        </div>
        <div className={`${styles.beforeAfterSlider__label} ${styles['beforeAfterSlider__label--after']}`}>
          Jälkeen
        </div>

        <div className={styles.beforeAfterSlider__divider} aria-hidden="true">
          <span
            className={
              showFirstTouchHint
                ? `${styles.beforeAfterSlider__handle} ${styles['beforeAfterSlider__handle--hint']}`
                : styles.beforeAfterSlider__handle
            }
          >
            <span className={styles.beforeAfterSlider__arrows}>↔</span>
          </span>
          {showFirstTouchHint ? (
            <span className={styles.beforeAfterSlider__touchHint}>Vedä ↔</span>
          ) : null}
        </div>

        <input
          className={styles.beforeAfterSlider__range}
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

      <figcaption className={styles.beforeAfterDemo__caption}>
        <span className="type-label text-signal">Before / after</span>
        <p>
          Vedä jakajaa nähdäksesi, miten sama työ voidaan esittää muutoksena.
          Konseptiesimerkki — ei asiakastyö.
        </p>
      </figcaption>
    </figure>
  );
}
