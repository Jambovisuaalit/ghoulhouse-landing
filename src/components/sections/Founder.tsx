import Logo from '@/components/ui/Logo';

export default function Founder() {
  return (
    <section id="hanna" className="section bg-ghost">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
          <div>
            <p className="eyebrow text-signal">08 / FOUNDER</p>
            <div className="rule-signal mt-5" />
          </div>

          <div>
            <p className="eyebrow text-ink/45">HANNA NYHOLM / HELSINKI</p>
            <h2 className="display-title mt-5 text-ink">
              GhoulHouse rakentaa näkyvyyttä oikeasta työstä, ei tyhjästä imagosta.
            </h2>
          </div>
        </div>

        <div className="founder-spread mt-14">
          <div className="founder-monogram-field">
            <div className="relative z-10 inline-block bg-ghost p-3">
              <Logo compact className="w-14" />
            </div>
            <p className="absolute left-7 top-28 max-w-[18ch] text-sm leading-6 text-ink/55">
              Independent social content studio / founder-led / Helsinki.
            </p>
            <span className="founder-monogram" aria-hidden="true">HN</span>
          </div>

          <div className="founder-copy">
            <p className="founder-quote">
              Hyvä työ on jo tehty. Se pitää vain tehdä näkyväksi.
            </p>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-ink/75">
              GhoulHouse syntyi havainnosta, että pienillä palveluyrityksillä on jo jatkuvasti
              käyttökelpoista näyttöä osaamisesta — työmaakuvia, referenssejä ja projektifaktoja —
              mutta ei selkeää järjestelmää muuttaa niitä jatkuvaksi sisällöksi.
            </p>

            <p className="mt-6 max-w-2xl text-base leading-7 text-ink/55">
              Hannan rooli on pitää palvelu käytännöllisenä: asiakkaan materiaali sisään,
              suunnittelu ja tuotanto GhoulHousella, hyväksyntä asiakkaalla ja valmis sisältö ulos.
            </p>

            <p className="eyebrow mt-10 text-signal">
              HANNA NYHOLM · FOUNDER · GHOULHOUSE OY
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
