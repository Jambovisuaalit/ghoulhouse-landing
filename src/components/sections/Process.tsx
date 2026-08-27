import Container from '@/components/ui/Container';

const steps = [
  {
    number: '01',
    owner: 'SINÄ',
    title: 'Lähetät materiaalin ja faktat.',
    body: 'Työmaakuvat, lyhyt kuvaus kohteesta ja olennaiset yksityiskohdat riittävät alkuun.',
  },
  {
    number: '02',
    owner: 'GHOULHOUSE',
    title: 'Rakennamme sisältöbatchin.',
    body: 'Suunnittelemme sisältökulmat, käsittelemme kuvat, kirjoitamme copyt ja rakennamme julkaisuvalmiit versiot.',
  },
  {
    number: '03',
    owner: 'YHDESSÄ',
    title: 'Hyväksyt. Me julkaisemme.',
    body: 'Tarkistat faktat. Yhden kootun korjauskierroksen jälkeen sisällöt ajastetaan ja julkaistaan.',
  },
] as const;

export default function Process() {
  return (
    <section id="process" className="bg-ink py-16 text-ghost md:py-24">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-signal">
              Prosessi
            </p>
            <h2 className="font-display text-[clamp(2.8rem,5vw,5.5rem)] font-black uppercase leading-[0.9] tracking-[-0.04em]">
              Kolme askelta.
            </h2>
          </div>

          <ol className="border-t border-ghost/35 lg:col-span-8">
            {steps.map((step) => (
              <li
                key={step.number}
                className="grid gap-4 border-b border-ghost/25 py-6 sm:grid-cols-[60px_110px_1fr]"
              >
                <span className="text-xs font-black tracking-[0.14em] text-signal">
                  {step.number}
                </span>
                <span className="text-xs font-black uppercase tracking-[0.14em] text-ghost/55">
                  {step.owner}
                </span>
                <div>
                  <h3 className="text-xl font-black text-ghost">{step.title}</h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-ghost/65">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
