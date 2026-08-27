import Container from '@/components/ui/Container';

export default function Audience() {
  return (
    <section className="bg-ghost py-16 md:py-24">
      <Container>
        <h2 className="text-ink mb-8">Kenelle palvelu on tarkoitettu</h2>

        <div className="max-w-3xl space-y-6 text-ink/80">
          <p className="text-lg leading-relaxed">
            GhoulHouse on suunniteltu erityisesti pienille remontti- ja korjausrakentamisen yrityksille, joilla syntyy työmaakuvia mutta joiden some päivittyy epäsäännöllisesti.
          </p>

          <ul className="space-y-3 text-lg">
            {[
              'Remontti- ja korjausrakentamisen yritys',
              'Tyypillisesti 2–10 henkilöä',
              'Työmailta syntyy jatkuvasti kuva- tai videomateriaalia',
              'Instagram ja Facebook eivät päivity johdonmukaisesti',
              'Yrittäjä haluaa käyttää aikansa asiakastyöhön, ei sisällön rakentamiseen',
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-signal font-bold mt-1" aria-hidden="true">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="bg-white p-6 rounded border-l-4 border-signal mt-8">
            <p className="text-ink font-bold mb-2">Mitä GhoulHouse ei takaa</p>
            <p className="text-sm text-ink/70">
              Palvelu ei lupaa tiettyä liidi-, myynti-, seuraaja- tai tavoittavuustulosta. GhoulHouse sitoutuu sovittuun sisältötoimitukseen.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
