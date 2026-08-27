import Container from '@/components/ui/Container';

const steps = [
  ['1', 'Materiaalit', 'Lähetätte nykyiset työmaa- ja referenssikuvat sekä tarvittavat perustiedot.'],
  ['2', 'Kickoff + ensimmäinen batch', 'Sovimme suunnan ja teemme ensimmäiset sisällöt hyväksyttäväksi.'],
  ['3', 'Hyväksyntä + julkaisu', 'Yksi koottu korjauskierros, jonka jälkeen sisällöt ajastetaan ja julkaistaan.'],
];

export default function Process() {
  return (
    <section id="process" className="bg-ghost py-16 md:py-24" aria-labelledby="process-title">
      <Container>
        <h2 id="process-title" className="mb-10 text-ink">
          Aloitus ilman raskasta projektia
        </h2>

        <ol className="grid gap-5 md:grid-cols-3">
          {steps.map(([number, title, description]) => (
            <li key={number} className="border-2 border-ink bg-white p-6">
              <div className="mb-6 flex h-11 w-11 items-center justify-center bg-signal font-bold text-white">
                {number}
              </div>
              <h3 className="mb-2 font-bold text-ink">{title}</h3>
              <p className="text-sm leading-relaxed text-ink/70">{description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
