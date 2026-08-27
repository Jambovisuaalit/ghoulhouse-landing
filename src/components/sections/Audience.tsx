import SectionHeading from '@/components/ui/SectionHeading';

const fit = [
  'Pieni suomalainen paikallinen palveluyritys',
  'Alkuvaiheessa erityisesti remontti-, rakennus- ja korjauspalvelut',
  'Yrityksellä syntyy jatkuvasti kuvattavaa työnjälkeä',
  'Yrittäjä tai toimitusjohtaja on lähellä myyntiä ja arjen tekemistä',
  'Instagram tai Facebook on olemassa, mutta sisältö jää epäsäännölliseksi',
] as const;

const notFit = [
  'Tarvitsette ensisijaisesti maksettua mainontaa tai liiditakuuta',
  'Teillä ei synny käyttökelpoista materiaalia eikä sitä voida toimittaa',
  'Tarvitsette päivittäistä asiakaspalvelua, myyntineuvotteluja tai rajatonta tuotantoa',
] as const;

export default function Audience() {
  return (
    <section id="kenelle" className="section bg-bone">
      <div className="shell">
        <SectionHeading
          eyebrow="07 / KENELLE"
          title="Hyvä firma. Hyvä työnjälki. Liian vähän näkyvää näyttöä."
          intro="Kohderyhmä on rajattu tarkoituksella. Hyvä sivu kvalifioi yhtä paljon kuin se houkuttelee."
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="fit-ledger">
            <div className="flex items-center justify-between gap-4 border-b border-ink/20 py-4">
              <p className="eyebrow text-signal">GOOD FIT / 01</p>
              <span className="font-mono text-xs text-ink/40">QUALIFICATION</span>
            </div>

            {fit.map((item, index) => (
              <div key={item} className="fit-row">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{item}</strong>
              </div>
            ))}
          </div>

          <aside className="not-fit-note">
            <p className="eyebrow text-ink">NOT FIT / 02</p>
            <h3 className="mt-5 font-display text-4xl font-black uppercase leading-[0.9] tracking-[-0.05em]">
              Kaikkea ei tarvitse myydä kaikille.
            </h3>

            <div className="mt-8 space-y-5">
              {notFit.map((item, index) => (
                <div key={item} className="fit-row">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <p className="text-ink/65">{item}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
