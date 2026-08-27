import Container from '@/components/ui/Container';

const steps = [
  {
    number: '1',
    title: 'Lähetätte materiaalin',
    body: 'Työmaa- ja referenssikuvat sekä tarvittavat kohdetiedot. Käytämme sitä, mitä teillä jo syntyy.',
  },
  {
    number: '2',
    title: 'Me tuotamme',
    body: 'Valitsemme ja viimeistelemme kuvat, kirjoitamme tekstit ja sovitamme sisällöt Instagramiin ja Facebookiin.',
  },
  {
    number: '3',
    title: 'Te hyväksytte',
    body: 'Sisällöt tulevat koottuna hyväksyttäväksi. Pakettiin kuuluu yksi koottu korjauskierros.',
  },
  {
    number: '4',
    title: 'Me julkaisemme',
    body: 'Hyväksytyt sisällöt ajastetaan ja julkaistaan sovittuun rytmiin.',
  },
];

export default function Mechanism() {
  return (
    <section id="mechanism" className="bg-white py-16 md:py-24" aria-labelledby="mechanism-title">
      <Container>
        <h2 id="mechanism-title" className="mb-12 text-ink md:mb-16">
          Miten GhoulHouse toimii
        </h2>

        <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {steps.map((step) => (
            <li key={step.number} className="flex flex-col">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-signal text-lg font-bold text-white">
                {step.number}
              </div>
              <h3 className="mb-2 font-bold text-ink">{step.title}</h3>
              <p className="text-sm leading-relaxed text-ink/70">{step.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
