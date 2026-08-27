import Logo from '@/components/ui/Logo';
import { siteConfig } from '@/lib/site';

export default function Hero() {
  return (
    <section id="top" className="hero-section">
      <div className="hero-side-index" aria-hidden="true">
        <span>RAW MATERIAL / SOCIAL OUTPUT / HELSINKI</span>
        <b>001</b>
      </div>

      <div className="shell hero-grid">
        <div className="max-w-6xl self-center">
          <div className="hero-meta eyebrow">
            <span>GHOULHOUSE</span>
            <span>/ SOCIAL CONTENT SYSTEM</span>
            <span>/ HELSINKI</span>
          </div>

          <h1 className="hero-title mt-7">
            TYÖMAAKUVAT<br />
            SISÄÄN.<br />
            <span className="signal-line">VALMIS SOME ULOS.</span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-7 text-ghost/70 sm:text-xl sm:leading-8">
            Teette hyvää työtä. Me pidämme huolen, että asiakkaat myös näkevät sen.
          </p>

          <div className="hero-actions mt-8">
            <a href={siteConfig.contactAnchor} className="btn-primary">
              {siteConfig.primaryCta}
            </a>
            <p className="price-chip">
              <strong>490 € + ALV</strong>
              <span>/ 30 päivää · palvelujaksot 1–3</span>
            </p>
          </div>
        </div>

        <aside className="hero-proof" aria-label="Palvelun yhteenveto">
          <div className="hero-proof-head">
            <p className="eyebrow text-signal">START / SERVICE DOCKET</p>
            <div className="bg-ghost p-1.5">
              <Logo compact />
            </div>
          </div>

          <dl>
            <div><dt>OUTPUT</dt><dd>12 sisältöä</dd></div>
            <div><dt>KANAVAT</dt><dd>IG + Facebook</dd></div>
            <div><dt>JAKSO</dt><dd>30 päivää</dd></div>
            <div><dt>REVISIO</dt><dd>1 kierros</dd></div>
          </dl>

          <p className="py-5 text-sm leading-6 text-ghost/55">
            Asiakas toimittaa kuvat, faktat ja hyväksynnät. GhoulHouse suunnittelee,
            viimeistelee ja julkaisee.
          </p>
        </aside>

        <div className="hero-bottom-register" aria-hidden="true">
          <span>RAW / IN</span>
          <span>EDIT / SYSTEM</span>
          <span>READY / OUT</span>
          <span>GH / 2026</span>
        </div>
      </div>
    </section>
  );
}
