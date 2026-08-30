'use client';

import { useEffect, useRef } from 'react';
import Container from '@/components/ui/Container';
import ContactTrigger from '@/components/contact/ContactTrigger';
import { siteConfig } from '@/config/site';

const flow = ['TYÖMAAKUVAT', 'SUUNNITTELU', '12 SISÄLTÖÄ', 'JULKAISU'] as const;

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = heroRef.current;
    if (!root) return;

    const desktopMotion = window.matchMedia(
      '(min-width: 1100px) and (prefers-reduced-motion: no-preference)'
    );
    let animations: Animation[] = [];

    const cancelAnimations = () => {
      animations.forEach((animation) => animation.cancel());
      animations = [];
    };

    const playAnimations = () => {
      cancelAnimations();
      if (!desktopMotion.matches) return;

      const nodes = Array.from(root.querySelectorAll<HTMLElement>('[data-hero-motion]'));
      animations = nodes.map((node, index) =>
        node.animate(
          [
            { opacity: 0, transform: 'translateY(24px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ],
          {
            duration: 620,
            delay: index * 95,
            easing: 'cubic-bezier(.2,.8,.2,1)',
            fill: 'both',
          }
        )
      );
    };

    playAnimations();
    desktopMotion.addEventListener('change', playAnimations);

    return () => {
      desktopMotion.removeEventListener('change', playAnimations);
      cancelAnimations();
    };
  }, []);

  return (
    <section
      ref={heroRef}
      id="top"
      className="hero-surface overflow-hidden bg-black text-white"
      aria-labelledby="hero-title"
    >
      <Container className="hero-container relative py-14 md:py-16 lg:py-20 xl:py-24">
        <div className="hero-grid" aria-hidden="true" />

        <div className="hero-layout relative grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="hero-copy lg:col-span-8">
            <p data-hero-motion className="hero-kicker type-label text-signal">
              GhoulHouse / Social content system
            </p>
            <h1
              id="hero-title"
              data-hero-motion
              className="hero-title type-display mt-5 max-w-[15ch] text-white"
            >
              TYÖMAAKUVAT SISÄÄN.
              <span className="block text-signal">VALMIS SOME ULOS.</span>
            </h1>
            <p
              data-hero-motion
              className="hero-summary mt-7 max-w-2xl text-[clamp(1.05rem,2vw,1.4rem)] font-semibold leading-[1.45] text-white/75"
            >
              12 Instagram- ja Facebook-sisältöä / 30 päivää remontti- ja palveluyritysten omista
              työmaakuvista.
            </p>

            <div data-hero-motion className="hero-actions mt-8 flex flex-col gap-3 sm:flex-row">
              <ContactTrigger className="btn btn-primary min-h-14 sm:min-w-[255px]">
                {siteConfig.cta.primary}
              </ContactTrigger>
              <a
                href="#miten-toimii"
                className="hero-secondary btn btn-inverse min-h-14 sm:min-w-[255px]"
              >
                KATSO, MITEN PALVELU TOIMII
              </a>
            </div>

            <div
              data-hero-motion
              className="hero-price mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/20 pt-5"
            >
              <strong className="font-display text-3xl uppercase tracking-[-0.025em] text-white">
                490 € + ALV / 30 PÄIVÄÄ
              </strong>
              <span className="type-label text-white/55">Kuukausittain irtisanottava</span>
            </div>
          </div>

          <div data-hero-motion className="hero-proof-wrap lg:col-span-4">
            <div className="hero-proof">
              <p className="type-label text-signal">Työmaa → julkaisu</p>
              <div className="mt-5 grid gap-px bg-white/20">
                {flow.map((item, index) => (
                  <div
                    key={item}
                    className="grid grid-cols-[44px_1fr_auto] items-center bg-black px-4 py-4"
                  >
                    <span className="type-label text-signal">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-sm font-black uppercase tracking-[0.04em]">{item}</span>
                    {index < flow.length - 1 ? (
                      <span aria-hidden="true" className="text-signal">
                        ↓
                      </span>
                    ) : (
                      <span aria-hidden="true">■</span>
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.1em] text-white/45">
                Prosessi havainnollistettu — ei tuloslupaus
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
