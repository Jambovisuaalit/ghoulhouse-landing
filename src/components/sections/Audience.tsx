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
          intro="Ensimmäinen kohderyhmä on rajattu tarkoituksella. Sivun tehtävä on myös kertoa nopeasti, milloin GhoulHouse ei ole oikea ratkaisu."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <div className="border border-ink/15 bg-ghost p-6 sm:p-8">
            <p className="eyebrow text-signal">HYVÄ FIT</p>
            <ul className="mt-6 space-y-4">{fit.map((item) => <li key={item} className="border-t border-ink/10 pt-4 font-bold leading-6">{item}</li>)}</ul>
          </div>
          <div className="border border-ink/15 bg-white p-6 sm:p-8">
            <p className="eyebrow text-ink/65">EI VÄLTTÄMÄTTÄ OIKEA</p>
            <ul className="mt-6 space-y-4">{notFit.map((item) => <li key={item} className="border-t border-ink/10 pt-4 leading-6 text-ink/70">{item}</li>)}</ul>
          </div>
        </div>
      </div>
    </section>
  );
}
