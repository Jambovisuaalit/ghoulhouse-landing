'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import Container from '@/components/ui/Container';

const frames = [
  {
    image: '/hero-renovation-clean.svg',
    index: '01',
    label: 'RAW',
    caption: 'Työmaalta sellaisenaan',
  },
  {
    image: '/work-detail.svg',
    index: '02',
    label: 'DETAIL',
    caption: 'Osaaminen nostetaan esiin',
  },
  {
    image: '/finished-space.svg',
    index: '03',
    label: 'CRAFT',
    caption: 'Työvaiheesta sisältökulma',
  },
  {
    image: '/hero-renovation.svg',
    index: '04',
    label: 'FINAL',
    caption: 'Visuaalisesti viimeistelty',
  },
  {
    image: '/finished-space.svg',
    index: '05',
    label: 'PUBLISH',
    caption: 'Valmis julkaistavaksi',
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
      const travel = Math.max(
        1,
        section.offsetHeight - sticky.offsetHeight
      );

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

      rawSection.style.setProperty(
        '--raw-progress',
        rawProgress.toFixed(4)
      );
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

      filmSection.style.setProperty(
        '--film-progress',
        filmProgress.toFixed(4)
      );
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
        header?.getBoundingClientRect().height ?? 66
      );
      const stickyHeight = Math.max(
        520,
        window.innerHeight - headerHeight
      );

      rawSticky.style.top = `${headerHeight}px`;
      rawSticky.style.height = `${stickyHeight}px`;
      filmSticky.style.top = `${headerHeight}px`;
      filmSticky.style.height = `${stickyHeight}px`;

      const rawTravel = Math.min(
        1500,
        Math.max(950, stickyHeight * 1.35)
      );
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
      className="border-y-2 border-ink bg-ink text-ghost"
      aria-labelledby="mechanism-title"
    >
      <Container className="py-14 md:py-20">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-9">
            <p className="type-label mb-4 text-signal">
              Signature / RAW → FINAL
            </p>
            <h2
              id="mechanism-title"
              className="type-display max-w-[13ch] text-ghost"
            >
              Worksite material
              <span className="block text-signal">→ GhoulHouse →</span>
              ready social content.
            </h2>
          </div>

          <p className="type-editorial max-w-sm text-ghost/65 lg:col-span-3 lg:pb-1">
            Sama materiaali. Selkeämpi rajaus, rakenne ja viesti.
          </p>
        </div>
      </Container>

      <div
        ref={rawSectionRef}
        className="mechanism-raw"
        data-scroll-raw
      >
        <div ref={rawStickyRef} className="mechanism-raw__sticky">
          <div className="mechanism-raw__copy mechanism-raw__copy--raw">
            <span className="type-label text-signal">01 / RAW</span>
            <h3>Puhelimesta.</h3>
            <p>
              Oikea työmaa. Oikea hetki. Materiaali sellaisena kuin se syntyy.
            </p>
          </div>

          <div
            className="mechanism-raw__stage"
            aria-label="RAW to FINAL -konseptitransformaatio"
          >
            <div className="mechanism-raw__image mechanism-raw__image--source">
              <Image
                src="/hero-renovation-clean.svg"
                alt="Raaka työmaamateriaali ennen GhoulHouse-käsittelyä"
                fill
                sizes="(max-width: 1023px) 100vw, 58vw"
                className="object-cover"
              />
              <div className="mechanism-raw__technical" aria-hidden="true">
                <span>RAW / 01</span>
                <span>WORKSITE MATERIAL</span>
                <span>UNEDITED</span>
              </div>
            </div>

            <div className="mechanism-raw__image mechanism-raw__image--final">
              <Image
                src="/finished-space.svg"
                alt="GhoulHouse-käsittelyn jälkeen syntyvää valmista somejulkaisua havainnollistava konseptikuva"
                fill
                sizes="(max-width: 1023px) 100vw, 58vw"
                className="object-cover"
              />
              <div className="mechanism-raw__final-frame" aria-hidden="true" />
              <div className="mechanism-raw__final-copy">
                <span className="type-label text-signal">
                  GhoulHouse / final
                </span>
                <strong>Työ näyttää yhtä hyvältä kuin se on.</strong>
                <small>KONSEPTIESIMERKKI — EI ASIAKASTYÖ</small>
              </div>
            </div>

            <div className="mechanism-raw__divider" aria-hidden="true">
              <span />
            </div>
          </div>

          <div className="mechanism-raw__copy mechanism-raw__copy--final">
            <span className="type-label text-signal">02 / FINAL</span>
            <h3>Julkaisuun.</h3>
            <p>
              Rajaus, rakenne, copy ja CTA — sama työ selkeämmässä muodossa.
            </p>
          </div>
        </div>
      </div>

      <div
        ref={filmSectionRef}
        className="mechanism-film"
        data-scroll-film
      >
        <div ref={filmStickyRef} className="mechanism-film__sticky">
          <div className="mechanism-film__header">
            <p className="type-label text-signal">Filmstrip / prosessi</p>
            <h3>Yksi työmaa. Monta kulmaa.</h3>
          </div>

          <div
            ref={filmViewportRef}
            className="mechanism-film__viewport"
            tabIndex={0}
            role="region"
            aria-label="Sisältöprosessin filmstrip"
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
                      sizes="(max-width: 1023px) 82vw, 38vw"
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
        </div>
      </div>
    </section>
  );
}
