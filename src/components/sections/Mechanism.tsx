'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import Container from '@/components/ui/Container';

const rawPhoto =
  'https://images.unsplash.com/photo-1768321917661-d4f1a89d2185?auto=format&fit=crop&fm=jpg&q=85&w=1800';
const finishedBathroom =
  'https://images.unsplash.com/photo-1771929662486-f793e08f0f16?auto=format&fit=crop&fm=jpg&q=85&w=1800';
const finishedBathroomAlt =
  'https://images.unsplash.com/photo-1741282306943-2f2e4c4e0aa5?auto=format&fit=crop&fm=jpg&q=85&w=1800';

const frames = [
  {
    image: rawPhoto,
    index: '01',
    label: 'RAAKA',
    caption: 'Työmaalta sellaisenaan',
  },
  {
    image: rawPhoto,
    index: '02',
    label: 'KULMA',
    caption: 'Työvaiheesta asiantuntijasisältö',
  },
  {
    image: finishedBathroom,
    index: '03',
    label: 'KOHDE',
    caption: 'Valmis tila referenssiksi',
  },
  {
    image: finishedBathroomAlt,
    index: '04',
    label: 'JULKAISU',
    caption: 'Kuva, rakenne ja viesti yhdessä',
  },
] as const;

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export default function Mechanism() {
  const rawSectionRef = useRef<HTMLDivElement>(null);
  const rawStickyRef = useRef<HTMLDivElement>(null);
  const filmSectionRef = useRef<HTMLDivElement>(null);
  const filmStickyRef = useRef<HTMLDivElement>(null);
  const filmViewportRef = useRef<HTMLDivElement>(null);
  const filmTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rawSection = rawSectionRef.current;
    const rawSticky = rawStickyRef.current;
    const filmSection = filmSectionRef.current;
    const filmSticky = filmStickyRef.current;
    const filmViewport = filmViewportRef.current;
    const filmTrack = filmTrackRef.current;

    if (
      !rawSection ||
      !rawSticky ||
      !filmSection ||
      !filmSticky ||
      !filmViewport ||
      !filmTrack
    ) {
      return;
    }

    const desktopMotion = window.matchMedia(
      '(min-width: 1100px) and (prefers-reduced-motion: no-preference)'
    );

    let animationFrame = 0;
    let measureFrame = 0;

    const resetStaticState = () => {
      rawSection.style.removeProperty('height');
      filmSection.style.removeProperty('height');
      rawSticky.style.removeProperty('height');
      rawSticky.style.removeProperty('top');
      filmSticky.style.removeProperty('height');
      filmSticky.style.removeProperty('top');
      filmTrack.style.removeProperty('transform');

      rawSection.style.setProperty('--raw-progress', '0.5');
      rawSection.style.setProperty('--raw-cut', '50%');
      rawSection.style.setProperty('--raw-left', '50%');
      rawSection.style.setProperty('--raw-shift', '0px');
      rawSection.style.setProperty('--final-shift', '0px');
      rawSection.style.setProperty('--raw-opacity', '1');
      rawSection.style.setProperty('--final-opacity', '1');
      rawSection.style.setProperty('--raw-scale', '1.02');
      rawSection.style.setProperty('--final-scale', '1.02');
      filmSection.style.setProperty('--film-progress', '0');
    };

    const sectionProgress = (
      section: HTMLElement,
      sticky: HTMLElement
    ) => {
      const sectionRect = section.getBoundingClientRect();
      const stickyTop = Number.parseFloat(sticky.style.top) || 0;
      const travel = Math.max(1, section.offsetHeight - sticky.offsetHeight);

      return clamp((stickyTop - sectionRect.top) / travel);
    };

    const render = () => {
      animationFrame = 0;

      if (!desktopMotion.matches) {
        resetStaticState();
        return;
      }

      const rawProgress = sectionProgress(rawSection, rawSticky);
      const rawCut = 100 - rawProgress * 100;

      rawSection.style.setProperty('--raw-progress', rawProgress.toFixed(4));
      rawSection.style.setProperty('--raw-cut', `${rawCut.toFixed(2)}%`);
      rawSection.style.setProperty(
        '--raw-left',
        `${(rawProgress * 100).toFixed(2)}%`
      );
      rawSection.style.setProperty(
        '--raw-shift',
        `${(-36 * rawProgress).toFixed(2)}px`
      );
      rawSection.style.setProperty(
        '--final-shift',
        `${(36 * (1 - rawProgress)).toFixed(2)}px`
      );
      rawSection.style.setProperty(
        '--raw-opacity',
        Math.max(0.2, 1 - rawProgress * 1.08).toFixed(3)
      );
      rawSection.style.setProperty(
        '--final-opacity',
        Math.max(0.18, rawProgress * 1.15).toFixed(3)
      );
      rawSection.style.setProperty(
        '--raw-scale',
        (1.035 - rawProgress * 0.018).toFixed(4)
      );
      rawSection.style.setProperty(
        '--final-scale',
        (1.012 + rawProgress * 0.012).toFixed(4)
      );

      const filmProgress = sectionProgress(filmSection, filmSticky);
      const horizontalTravel = Math.max(
        0,
        filmTrack.scrollWidth - filmViewport.clientWidth
      );

      filmSection.style.setProperty('--film-progress', filmProgress.toFixed(4));
      filmTrack.style.transform = `translate3d(${(
        -horizontalTravel * filmProgress
      ).toFixed(2)}px, 0, 0)`;
    };

    const scheduleRender = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(render);
    };

    const measure = () => {
      measureFrame = 0;

      if (!desktopMotion.matches) {
        resetStaticState();
        return;
      }

      const header =
        document.querySelector<HTMLElement>('body > header') ??
        document.querySelector<HTMLElement>('header');
      const headerHeight = Math.round(
        header?.getBoundingClientRect().height ?? 68
      );
      const stickyHeight = Math.max(520, window.innerHeight - headerHeight);

      rawSticky.style.top = `${headerHeight}px`;
      rawSticky.style.height = `${stickyHeight}px`;
      filmSticky.style.top = `${headerHeight}px`;
      filmSticky.style.height = `${stickyHeight}px`;

      const rawTravel = Math.min(1500, Math.max(950, stickyHeight * 1.35));
      rawSection.style.height = `${stickyHeight + rawTravel}px`;

      const horizontalTravel = Math.max(
        0,
        filmTrack.scrollWidth - filmViewport.clientWidth
      );
      const filmTravel = Math.min(
        2800,
        Math.max(horizontalTravel, stickyHeight * 1.2)
      );
      filmSection.style.height = `${stickyHeight + filmTravel}px`;

      render();
    };

    const scheduleMeasure = () => {
      if (measureFrame) return;
      measureFrame = window.requestAnimationFrame(measure);
    };

    const resizeObserver = new ResizeObserver(scheduleMeasure);
    resizeObserver.observe(filmViewport);
    resizeObserver.observe(filmTrack);

    measure();

    window.addEventListener('scroll', scheduleRender, { passive: true });
    window.addEventListener('resize', scheduleMeasure);
    desktopMotion.addEventListener('change', scheduleMeasure);

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      if (measureFrame) window.cancelAnimationFrame(measureFrame);
      resizeObserver.disconnect();
      window.removeEventListener('scroll', scheduleRender);
      window.removeEventListener('resize', scheduleMeasure);
      desktopMotion.removeEventListener('change', scheduleMeasure);
    };
  }, []);

  return (
    <section
      id="mechanism"
      className="border-y border-ink bg-ink text-ghost"
      aria-labelledby="mechanism-title"
    >
      <Container className="py-16 md:py-24">
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="type-label mb-4 text-signal">Työmaalta julkaisuun</p>
            <h2
              id="mechanism-title"
              className="type-display max-w-[12ch] text-ghost"
            >
              Sama työ.
              <span className="block text-signal">Parempi näyttö.</span>
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="font-editorial-accent text-[clamp(1.55rem,2.4vw,2.15rem)] leading-[1.05] text-ghost">
              Ei uutta kuvauspäivää.
            </p>
            <p className="type-editorial mt-3 max-w-md text-ghost/65">
              Työmaalla jo syntyvä materiaali saa selkeän rajauksen, sisältökulman
              ja julkaisuvalmiin muodon.
            </p>
          </div>
        </div>
      </Container>

      <div ref={rawSectionRef} className="mechanism-raw" data-scroll-raw>
        <div ref={rawStickyRef} className="mechanism-raw__sticky">
          <div className="mechanism-raw__copy mechanism-raw__copy--raw">
            <span className="type-label text-signal">01 / RAAKA</span>
            <h3>Puhelimesta.</h3>
            <p>Oikea työmaa. Materiaali sellaisena kuin se syntyy.</p>
          </div>

          <div
            className="mechanism-raw__stage"
            aria-label="Raakamateriaalista valmiiksi somejulkaisuksi"
          >
            <div className="mechanism-raw__image mechanism-raw__image--source">
              <Image
                src={rawPhoto}
                alt="Oikea remonttityömaa ennen sisältökäsittelyä"
                fill
                sizes="(max-width: 1099px) 100vw, 58vw"
                className="object-cover"
              />
              <div className="mechanism-raw__technical" aria-hidden="true">
                <span>RAAKA / 01</span>
                <span>TYÖMAAMATERIAALI</span>
                <span>KÄSITTELEMÄTÖN</span>
              </div>
            </div>

            <div className="mechanism-raw__image mechanism-raw__image--final">
              <Image
                src={rawPhoto}
                alt="Sama remonttikuva osana viimeisteltyä GhoulHouse-sisältökonseptia"
                fill
                sizes="(max-width: 1099px) 100vw, 58vw"
                className="object-cover"
              />
              <div className="mechanism-raw__final-frame" aria-hidden="true" />
              <div className="mechanism-raw__final-copy">
                <span className="type-label text-signal">GHOULHOUSE / VALMIS</span>
                <strong>Pohjatyö ratkaisee lopputuloksen.</strong>
                <small>KONSEPTIESIMERKKI — EI ASIAKASTYÖ</small>
              </div>
            </div>

            <div className="mechanism-raw__divider" aria-hidden="true">
              <span />
            </div>
          </div>

          <div className="mechanism-raw__copy mechanism-raw__copy--final">
            <span className="type-label text-signal">02 / JULKAISU</span>
            <h3>Näkyväksi.</h3>
            <p>Rajaus, sisältökulma, teksti ja toimintakehotus valmiina.</p>
          </div>
        </div>
      </div>

      <div ref={filmSectionRef} className="mechanism-film" data-scroll-film>
        <div ref={filmStickyRef} className="mechanism-film__sticky">
          <div className="mechanism-film__header">
            <p className="type-label text-signal">Sisältöesimerkit</p>
            <h3>Yksi materiaali. Useampi käyttö.</h3>
          </div>

          <div
            ref={filmViewportRef}
            className="mechanism-film__viewport"
            tabIndex={0}
            role="region"
            aria-label="GhoulHouse-sisältöesimerkit"
          >
            <div ref={filmTrackRef} className="mechanism-film__track">
              {frames.map((frame) => (
                <figure className="mechanism-film__frame" key={frame.index}>
                  <div className="mechanism-film__perforation" aria-hidden="true" />
                  <div className="mechanism-film__image">
                    <Image
                      src={frame.image}
                      alt=""
                      fill
                      sizes="(max-width: 1099px) 82vw, 38vw"
                      className="object-cover"
                    />
                    <span>{frame.label}</span>
                  </div>
                  <figcaption>
                    <strong>{frame.index}</strong>
                    <p>{frame.caption}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          <div className="mechanism-film__progress" aria-hidden="true">
            <span />
          </div>

          <p className="type-caption mt-4 text-ghost/55">
            Kuvareferenssit: Unsplash · konseptiesimerkkejä, ei GhoulHousen
            asiakastöitä.
          </p>
        </div>
      </div>
    </section>
  );
}
