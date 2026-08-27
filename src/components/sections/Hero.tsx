import Logo from '@/components/ui/Logo';
import { siteConfig } from '@/lib/site';

export default function Hero() {
  return (
    <section id="top" className="hero-section">
      <div className="shell relative z-10 grid min-h-[calc(100svh-72px)] content-between gap-14 py-10 sm:py-14 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)] lg:items-end lg:gap-10 lg:py-16">
        <div className="max-w-5xl self-center">
          <p className="eyebrow mb-7 text-signal">GHOULHOUSE · HELSINKI</p>
          <h1 className="hero-title">
            TYÖMAAKUVAT<br />
            SISÄÄN.<br />
            <span>VALMIS SOME ULOS.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-7 text-ghost/72 sm:text-xl sm:leading-8">
            Teette hyvää työtä. Me pidämme huolen, että asiakkaat myös näkevät sen.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a href={siteConfig.contactAnchor} className="btn-primary">
              {siteConfig.primaryCta}
            </a>
            <p className="price-chip"><strong>490 € + ALV</strong><span>/ 30 päivää · jaksot 1–3</span></p>
          </div>
        </div>

        <aside className="hero-proof" aria-label="Palvelun yhteenveto">
          <div className="flex items-center justify-between border-b border-ink/15 pb-4">
            <p className="eyebrow text-ink">PALVELU / START</p>
            <Logo compact />
          </div>
          <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-6 text-ink">
            <div><dt>OUTPUT</dt><dd>12 sisältöä</dd></div>
            <div><dt>KANAVAT</dt><dd>IG + Facebook</dd></div>
            <div><dt>JAKSO</dt><dd>30 päivää</dd></div>
            <div><dt>REVISIO</dt><dd>1 kierros</dd></div>
          </dl>
          <p className="mt-8 border-t border-ink/15 pt-4 text-sm leading-6 text-ink/65">
            Asiakas toimittaa kuvat, faktat ja hyväksynnät. GhoulHouse suunnittelee, viimeistelee ja julkaisee.
          </p>
        </aside>
      </div>
    </section>
  );
}
