import Logo from '@/components/ui/Logo';
import SectionHeading from '@/components/ui/SectionHeading';

export default function Examples() {
  return (
    <section id="esimerkit" className="section bg-bone">
      <div className="shell">
        <SectionHeading
          eyebrow="03 / ESIMERKIT"
          title="Näytä tuote. Älä keksi tuloksia."
          intro="Alla olevat materiaalit havainnollistavat GhoulHousen tuotetta. Ne ovat konseptiesimerkkejä, eivät toteutuneita asiakastuloksia."
        />
        <div className="mt-14 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="concept-card min-h-[30rem] bg-ghost text-ink">
            <div className="example-label">KONSEPTIESIMERKKI — EI ASIAKASTYÖ.</div>
            <div className="mt-12 grid flex-1 gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <div className="border border-ink/20 bg-bone p-5">
                <p className="eyebrow">RAW / 01</p>
                <div className="mt-16 border-t border-ink/20 pt-3 text-sm text-ink/65">
                  Työmaakuva + faktat
                </div>
              </div>
              <div className="font-display text-3xl font-black text-signal" aria-hidden="true">→</div>
              <div className="border border-signal bg-white p-5">
                <Logo compact className="h-10 w-10" />
                <p className="eyebrow mt-12 text-signal">READY / 02</p>
                <p className="mt-3 font-display text-3xl font-black uppercase leading-[0.95] tracking-[-0.045em]">
                  Valmis referenssisisältö
                </p>
              </div>
            </div>
            <p className="mt-6 max-w-xl text-sm leading-6 text-ink/60">
              Yksi selkeä mekanismi: asiakkaan olemassa oleva materiaali muutetaan suunnitelluksi, kirjoitetuksi ja julkaisuvalmiiksi sisällöksi.
            </p>
          </article>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            <article className="concept-card bg-ink text-ghost">
              <div className="example-label">KONSEPTIESIMERKKI — EI ASIAKASTYÖ.</div>
              <p className="eyebrow mt-10 text-signal">RAW → FINAL</p>
              <p className="mt-4 font-display text-4xl font-black uppercase leading-[0.9] tracking-[-0.05em]">
                TYÖMAAKUVA<br />→<br />REFERENSSISISÄLTÖ
              </p>
              <p className="mt-6 max-w-sm text-sm leading-6 text-ghost/60">
                Sama kuva voidaan jalostaa tunnistettavaksi feed-julkaisuksi ilman erillistä kuvauspäivää.
              </p>
            </article>
            <article className="concept-card bg-ghost text-ink">
              <div className="example-label">KONSEPTIESIMERKKI — EI ASIAKASTYÖ.</div>
              <p className="eyebrow mt-10 text-signal">BEFORE / AFTER</p>
              <div className="mt-5 grid grid-cols-2 gap-2" aria-hidden="true">
                <div className="aspect-[4/5] border border-ink/20 bg-bone p-3 text-xs font-bold">RAW</div>
                <div className="aspect-[4/5] border border-signal bg-white p-3 text-xs font-bold text-signal">READY</div>
              </div>
              <p className="mt-5 text-sm leading-6 text-ink/60">
                Ennen–jälkeen toimii erityisen hyvin remontti-, maalaus- ja saneeraustöissä, joissa muutos näkyy suoraan kuvassa.
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
