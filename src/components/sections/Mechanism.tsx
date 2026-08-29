'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import Container from '@/components/ui/Container';

const frames = [
  { image: '/hero-renovation-clean.svg', index: '01', label: 'RAW', caption: 'Työmaalta sellaisenaan' },
  { image: '/work-detail.svg', index: '02', label: 'DETAIL', caption: 'Osaaminen nostetaan esiin' },
  { image: '/finished-space.svg', index: '03', label: 'CRAFT', caption: 'Työvaiheesta sisältökulma' },
  { image: '/hero-renovation.svg', index: '04', label: 'FINAL', caption: 'Visuaalisesti viimeistelty' },
  { image: '/finished-space.svg', index: '05', label: 'PUBLISH', caption: 'Valmis julkaistavaksi' },
] as const;

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export default function Mechanism() {
  const rawSectionRef = useRef<HTMLDivElement>(null);
  const rawStickyRef = useRef<HTMLDivElement>(null);
  const filmSectionRef = useRef<HTMLDivElement>(null);
  const filmViewportRef = useRef<HTMLDivElement>(null);
  const filmTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rawSection = rawSectionRef.current;
    const rawSticky = rawStickyRef.current;
    const filmSection = filmSectionRef.current;
    const filmViewport = filmViewportRef.current;
    const filmTrack = filmTrackRef.current;

    if (!rawSection || !rawSticky || !filmSection || !filmViewport || !filmTrack) return;

    const desktopMotion = window.matchMedia(
      '(min-width: 1100px) and (prefers-reduced-motion: no-preference)'
    );

    let rawFrame = 0;
    let filmFrame = 0;
    let measureFrame = 0;

    const resetRawState = () => {
      rawSection.style.removeProperty('height');
      rawSticky.style.removeProperty('height');
      rawSticky.style.removeProperty('top');
      rawSection.style.setProperty('--raw-progress', '0.5');
      rawSection.style.setProperty('--raw-cut', '50%');
      rawSection.style.setProperty('--raw-left', '50%');
      rawSection.style.setProperty('--raw-shift', '0px');
      rawSection.style.setProperty('--final-shift', '0px');
      rawSection.style.setProperty('--raw-opacity', '1');
      rawSection.style.setProperty('--final-opacity', '1');
      rawSection.style.setProperty('--raw-scale', '1.02');
      rawSection.style.setProperty('--final-scale', '1.02');
    };

    const renderRaw = () => {
      rawFrame = 0;
      if (!desktopMotion.matches) {
        resetRawState();
        return;
      }

      const sectionRect = rawSection.getBoundingClientRect();
      const stickyTop = Number.parseFloat(rawSticky.style.top) || 0;
      const travel = Math.max(1, rawSection.offsetHeight - rawSticky.offsetHeight);
      const progress = clamp((stickyTop - sectionRect.top) / travel);
      const cut = 100 - progress * 100;

      rawSection.style.setProperty('--raw-progress', progress.toFixed(4));
      rawSection.style.setProperty('--raw-cut', `${cut.toFixed(2)}%`);
      rawSection.style.setProperty('--raw-left', `${(progress * 100).toFixed(2)}%`);
      rawSection.style.setProperty('--raw-shift', `${(-28 * progress).toFixed(2)}px`);
      rawSection.style.setProperty('--final-shift', `${(28 * (1 - progress)).toFixed(2)}px`);
      rawSection.style.setProperty('--raw-opacity', Math.max(0.28, 1 - progress).toFixed(3));
      rawSection.style.setProperty('--final-opacity', Math.max(0.24, progress).toFixed(3));
      rawSection.style.setProperty('--raw-scale', (1.03 - progress * 0.014).toFixed(4));
      rawSection.style.setProperty('--final-scale', (1.014 + progress * 0.01).toFixed(4));
    };

    const renderFilmProgress = () => {
      filmFrame = 0;
      const maxScroll = Math.max(0, filmViewport.scrollWidth - filmViewport.clientWidth);
      const progress = maxScroll > 1 ? filmViewport.scrollLeft / maxScroll : 0;
      filmSection.style.setProperty('--film-progress', clamp(progress).toFixed(4));
    };

    const scheduleRaw = () => {
      if (!rawFrame) rawFrame = window.requestAnimationFrame(renderRaw);
    };

    const scheduleFilm = () => {
      if (!filmFrame) filmFrame = window.requestAnimationFrame(renderFilmProgress);
    };

    const measure = () => {
      measureFrame = 0;

      if (desktopMotion.matches) {
        const header =
          document.querySelector<HTMLElement>('body > header') ??
          document.querySelector<HTMLElement>('header');
        const headerHeight = Math.round(header?.getBoundingClientRect().height ?? 66);
        const stickyHeight = Math.max(520, window.innerHeight - headerHeight);
        const rawTravel = Math.min(800, Math.max(650, stickyHeight * 0.82));

        rawSticky.style.top = `${headerHeight}px`;
        rawSticky.style.height = `${stickyHeight}px`;
        rawSection.style.height = `${stickyHeight + rawTravel}px`;
      } else {
        resetRawState();
      }

      renderRaw();
      renderFilmProgress();
    };

    const scheduleMeasure = () => {
      if (!measureFrame) measureFrame = window.requestAnimationFrame(measure);
    };

    const resizeObserver = new ResizeObserver(scheduleMeasure);
    resizeObserver.observe(filmViewport);
    resizeObserver.observe(filmTrack);

    measure();
    filmViewport.addEventListener('scroll', scheduleFilm, { passive: true });
    window.addEventListener('scroll', scheduleRaw, { passive: true });
    window.addEventListener('resize', scheduleMeasure);
    desktopMotion.addEventListener('change', scheduleMeasure);

    return () => {
      if (rawFrame) window.cancelAnimationFrame(rawFrame);
      if (filmFrame) window.cancelAnimationFrame(filmFrame);
      if (measureFrame) window.cancelAnimationFrame(measureFrame);
      resizeObserver.disconnect();
      filmViewport.removeEventListener('scroll', scheduleFilm);
      window.removeEventListener('scroll', scheduleRaw);
      window.removeEventListener('resize', scheduleMeasure);
      desktopMotion.removeEventListener('change', scheduleMeasure);
    };
  }, []);

  return (
    <section id="mechanism" className="border-y-2 border-ink bg-ink text-ghost" aria-labelledby="mechanism-title">
      <Container className="py-14 md:py-20">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-9">
            <p className="type-label mb-4 text-signal">Signature / RAW → FINAL</p>
            <h2 id="mechanism-title" className="type-display max-w-[13ch] text-ghost">
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

      <div ref={rawSectionRef} className="mechanism-raw" data-scroll-raw>
        <div ref={rawStickyRef} className="mechanism-raw__sticky">
          <div className="mechanism-raw__copy mechanism-raw__copy--raw">
            <span className="type-label text-signal">01 / RAW</span>
            <h3>Puhelimesta.</h3>
            <p>Oikea työmaa. Oikea hetki. Materiaali sellaisena kuin se syntyy.</p>
          </div>

          <div className="mechanism-raw__stage" aria-label="RAW to FINAL -konseptitransformaatio">
            <div className="mechanism-raw__image mechanism-raw__image--source">
              <Image
                src="/hero-renovation-clean.svg"
                alt="Raaka työmaamateriaali ennen GhoulHouse-käsittelyä"
                fill
                sizes="(max-width: 1023px) 100vw, 58vw"
                className="object-cover"
              />
              <div className="mechanism-raw__technical" aria-hidden="true">
                <span>RAW / 01</span><span>WORKSITE MATERIAL</span><span>UNEDITED</span>
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
                <span className="type-label text-signal">GhoulHouse / final</span>
                <strong>Työ näyttää yhtä hyvältä kuin se on.</strong>
                <small>KONSEPTIESIMERKKI — EI ASIAKASTYÖ</small>
              </div>
            </div>

            <div className="mechanism-raw__divider" aria-hidden="true"><span /></div>
          </div>

          <div className="mechanism-raw__copy mechanism-raw__copy--final">
            <span className="type-label text-signal">02 / FINAL</span>
            <h3>Julkaisuun.</h3>
            <p>Rajaus, rakenne, copy ja CTA — sama työ selkeämmässä muodossa.</p>
          </div>
        </div>
      </div>

      <div ref={filmSectionRef} className="mechanism-film" data-scroll-film>
        <div className="mechanism-film__body">
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
                    <Image src={frame.image} alt="" fill sizes="(max-width: 1023px) 82vw, 34vw" className="object-cover" />
                    <span>{frame.label}</span>
                  </div>
                  <figcaption><strong>{frame.index}</strong><p>{frame.caption}</p></figcaption>
                </figure>
              ))}
            </div>
          </div>

          <div className="mechanism-film__progress" aria-hidden="true"><span /></div>
        </div>
      </div>
    </section>
  );
}
