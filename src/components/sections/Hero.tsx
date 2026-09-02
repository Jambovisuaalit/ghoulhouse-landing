import Container from '@/components/ui/Container';
import { siteConfig } from '@/config/site';

const flow = ['TYÖMAAKUVAT', 'SUUNNITTELU', '12 SISÄLTÖÄ', 'JULKAISU'] as const;

export default function Hero() {
  return (
    <section id="top" className="hero-surface overflow-hidden bg-black text-white" aria-labelledby="hero-title">
      <Container className="hero-container relative py-10 sm:py-12 md:py-14 lg:py-16">
        <div className="hero-grid" aria-hidden="true" />

        <div className="hero-layout relative grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="hero-copy lg:col-span-8">
            <p className="type-label text-signal">GhoulHouse / Social content system</p>
            <h1 id="hero-title" className="type-display hero-title mt-4 max-w-[15ch] text-white">
              TYÖMAAKUVA<br className="mobile-title-break" /> SISÄÄN.
              <span className="block text-signal">
                VALMIS JULKAISU<br className="mobile-title-break" /> ULOS.
              </span>
            </h1>
            <p className="hero-description mt-5 max-w-2xl text-[clamp(1rem,1.8vw,1.3rem)] font-semibold leading-[1.4] text-white/75">
              GhoulHouse tekee remontti- ja rakennusyritysten työmaakuvista valmista sisältöä Instagramiin ja Facebookiin — ilman tekstien kirjoittamista tai Canvan säätämistä.
            </p>

            <div className="hero-actions mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="#laheta-kuvat"
                aria-label={siteConfig.cta.primary}
                className="btn btn-primary min-h-14 sm:min-w-[310px]"
              >
                <span className="sm:hidden">PYYDÄ 2 ESIMERKKIÄ</span>
                <span className="hidden sm:inline">{siteConfig.cta.primary}</span>
              </a>
              <a href="#raw-final" className="btn btn-inverse min-h-14 sm:min-w-[220px]">
                KATSO RAW → FINAL
              </a>
            </div>

            <div className="hero-price mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/20 pt-4">
              <strong className="font-display text-3xl uppercase tracking-[-0.025em] text-white">
                490 € + ALV / 30 PÄIVÄÄ
              </strong>
              <span className="type-label text-white/55">Ei sitoumusta jatkosta</span>
            </div>
          </div>

          <div className="hero-proof-column hidden lg:col-span-4 lg:block">
            <div className="hero-proof">
              <p className="type-label text-signal">Työmaa → julkaisu</p>
              <div className="mt-4 grid gap-px bg-white/20">
                {flow.map((item, index) => (
                  <div key={item} className="hero-proof__row grid grid-cols-[44px_1fr_auto] items-center bg-black px-4 py-3">
                    <span className="type-label text-signal">{String(index + 1).padStart(2, '0')}</span>
                    <span className="text-sm font-black uppercase tracking-[0.04em]">{item}</span>
                    {index < flow.length - 1 ? <span aria-hidden="true" className="text-signal">↓</span> : <span aria-hidden="true">■</span>}
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs font-bold uppercase tracking-[0.1em] text-white/45">
                Prosessi havainnollistettu — ei tuloslupaus
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
