import Container from '@/components/ui/Container';

const examples = [
  {
    title: 'RAW → FINAL',
    body: 'Raaka työmaakuva jalostetaan viimeistellyksi referenssipostaukseksi, jossa työnjälki ja kohteen konteksti näkyvät selkeästi.',
  },
  {
    title: 'BEFORE / AFTER',
    body: 'Saman remonttikohteen ennen- ja jälkeen-materiaali paketoidaan nopeasti ymmärrettäväksi sisältöpariksi.',
  },
  {
    title: 'ASIANTUNTIJA / PROSESSI',
    body: 'Olemassa olevasta materiaalista rakennetaan toinen sisältökulma, esimerkiksi remontin eteneminen, työvaihe tai asiakkaalle hyödyllinen tieto.',
  },
];

export default function Examples() {
  return (
    <section id="examples" className="bg-bone py-16 md:py-24" aria-labelledby="examples-title">
      <Container>
        <h2 id="examples-title" className="mb-12 text-ink">
          Ennen oikeita asiakascaseja
        </h2>

        <div className="space-y-6">
          {examples.map((example) => (
            <article key={example.title} className="border-l-4 border-signal bg-white p-6">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-signal">
                KONSEPTIESIMERKKI — EI ASIAKASTYÖ
              </p>
              <h3 className="mb-2 text-ink">{example.title}</h3>
              <p className="text-sm leading-relaxed text-ink/70">{example.body}</p>
            </article>
          ))}
        </div>

        <p className="mt-8 border-t border-ink/20 pt-8 text-xs text-ink/60">
          Konseptit korvataan asteittain oikealla asiakastyöllä, palautteella, caseilla ja
          tulosdatalla sitä mukaa kun niitä syntyy.
        </p>
      </Container>
    </section>
  );
}
