import SectionHeading from '@/components/ui/SectionHeading';

export default function Problem() {
  return (
    <section id="ongelma" className="section bg-ghost">
      <div className="shell">
        <SectionHeading
          eyebrow="01 / ONGELMA"
          title="Hyvä työnjälki ei auta verkossa, jos se jää puhelimeen."
          intro="Remontti valmistuu, kuvat otetaan ja seuraava työ alkaa. Markkinointiraaka-aine on jo olemassa — mutta siitä puuttuu toistettava prosessi."
        />
        <div className="mt-14 grid border-y border-ink/15 md:grid-cols-3">
          {[
            ['01', 'TYÖ VALMISTUU', 'Asiakastyö tuottaa jatkuvasti uutta näyttöä osaamisesta.'],
            ['02', 'KUVAT JÄÄVÄT', 'Referenssit hajautuvat puhelimiin, WhatsAppiin ja kansioihin.'],
            ['03', 'NÄYTTÖ PUUTTUU', 'Potentiaalinen asiakas ei näe verkossa samaa laatua, jonka nykyiset asiakkaat näkevät työmaalla.'],
          ].map(([n, title, body]) => (
            <article key={n} className="border-b border-ink/15 p-6 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 lg:p-8">
              <p className="eyebrow text-signal">{n}</p>
              <h3 className="mt-10 font-display text-3xl font-black uppercase tracking-[-0.04em] text-ink">{title}</h3>
              <p className="mt-4 text-base leading-7 text-ink/65">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
