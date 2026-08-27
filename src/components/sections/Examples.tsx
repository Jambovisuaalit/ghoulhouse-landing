import Reveal from '@/components/ui/Reveal';

export default function Examples() {
  return (
    <section id="examples" className="bg-ink py-16 text-ghost sm:py-24" aria-labelledby="examples-title">
      <div className="container-wide">
        <Reveal>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-signal">Proof ennen caseja</p>
          <h2 id="examples-title" className="mt-4 max-w-4xl text-ghost">
            Näytämme ensin, mitä nykyisestä materiaalista voidaan tehdä.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <Reveal className="border border-ghost/20 p-5 sm:p-7">
            <div className="grid min-h-72 grid-cols-2 gap-3">
              <div className="flex items-center justify-center border border-ghost/20 bg-ghost/5 text-center">
                <span className="text-sm font-black uppercase tracking-[0.16em] text-ghost/55">RAW</span>
              </div>
              <div className="flex items-center justify-center bg-signal text-center text-white">
                <span className="text-sm font-black uppercase tracking-[0.16em]">FINAL</span>
              </div>
            </div>
            <h3 className="mt-6 text-ghost">Referenssipostaus</h3>
            <p className="mt-2 text-ghost/70">Oikeasta remonttikohteesta rakennettu selkeä, julkaisuvalmis sisältö.</p>
            <p className="mt-5 text-xs font-black uppercase tracking-[0.14em] text-signal">
              Konseptiesimerkki — ei asiakastyö
            </p>
          </Reveal>

          <Reveal className="border border-ghost/20 p-5 sm:p-7" delay={0.08}>
            <div className="flex min-h-72 flex-col justify-between bg-ghost p-6 text-ink">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-signal">Asiantuntijasisältö</p>
              <div>
                <p className="text-5xl font-black leading-none">01 → 02 → 03</p>
                <p className="mt-4 max-w-sm font-semibold">
                  Kartoitus → toteutus → valmis kohde
                </p>
              </div>
            </div>
            <h3 className="mt-6 text-ghost">Prosessi tai before / after</h3>
            <p className="mt-2 text-ghost/70">Sama materiaali jalostetaan toiseksi sisältötyypiksi, ei vain yhdeksi kuvapostaukseksi.</p>
            <p className="mt-5 text-xs font-black uppercase tracking-[0.14em] text-signal">
              Konseptiesimerkki — ei asiakastyö
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
