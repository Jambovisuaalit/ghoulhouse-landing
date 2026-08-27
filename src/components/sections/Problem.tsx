const sequence = [
  {
    number: '01',
    title: 'Työ valmistuu',
    body: 'Asiakastyö tuottaa jatkuvasti uutta näyttöä osaamisesta.',
  },
  {
    number: '02',
    title: 'Kuvat jäävät',
    body: 'Referenssit hajautuvat puhelimiin, WhatsAppiin ja kansioihin.',
  },
  {
    number: '03',
    title: 'Näyttö puuttuu',
    body: 'Potentiaalinen asiakas ei näe verkossa samaa laatua, jonka nykyiset asiakkaat näkevät työmaalla.',
  },
] as const;

export default function Problem() {
  return (
    <section id="ongelma" className="section bg-ghost">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
          <div>
            <p className="eyebrow text-signal">01 / ONGELMA</p>
            <div className="rule-signal mt-5" />
          </div>

          <div>
            <h2 className="display-title text-ink">
              Hyvä työnjälki ei auta verkossa, jos se jää puhelimeen.
            </h2>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-ink/65">
              Remontti valmistuu, kuvat otetaan ja seuraava työ alkaa. Markkinointiraaka-aine
              on jo olemassa — mutta siitä puuttuu toistettava prosessi.
            </p>

            <div className="problem-stage mt-14">
              {sequence.map((item) => (
                <article key={item.number} className="problem-row">
                  <span className="problem-row-index">{item.number}</span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
