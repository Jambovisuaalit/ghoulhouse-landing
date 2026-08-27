import Container from '@/components/ui/Container';

export default function Problem() {
  return (
    <section id="problem" className="bg-ghost py-16 md:py-24" aria-labelledby="problem-title">
      <Container>
        <div className="max-w-3xl">
          <h2 id="problem-title" className="mb-8 text-ink">
            Hyvää työtä, mutta liian vähän näkyvyyttä
          </h2>

          <div className="space-y-6 text-ink/80">
            <p className="text-lg leading-relaxed">
              Työmaalta syntyy jo kuvia ja videoita, jotka näyttävät työn laadun, referenssit ja
              valmiit kohteet.
            </p>

            <p className="text-lg leading-relaxed">
              Ne jäävät helposti puhelimeen, WhatsApp-ketjuihin tai kansioihin, koska sisältöjen
              suunnittelulle, kirjoittamiselle ja julkaisemiselle ei ole aikaa.
            </p>

            <p className="text-lg leading-relaxed">
              GhoulHouse muuttaa olemassa olevan materiaalin valmiiksi, johdonmukaiseksi
              Instagram- ja Facebook-sisällöksi.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
