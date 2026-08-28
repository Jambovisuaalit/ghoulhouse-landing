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
            <p className="type-label mb-4 text-signal-on-dark">Prosessi</p>
            <h2 className="type-section-title text-ghost">Kolme askelta.</h2>
          </div>

          <ol className="border-t border-ghost/35 lg:col-span-8">
            {steps.map((step) => (
              <li
                key={step.number}
                className="grid gap-4 border-b border-ghost/25 py-6 sm:grid-cols-[60px_110px_1fr]"
              >
                <span className="type-label text-signal-on-dark">{step.number}</span>
                <span className="type-label text-ghost/60">{step.owner}</span>
                <div>
                  <h3 className="text-lg font-extrabold leading-tight tracking-[-0.02em] text-ghost sm:text-xl">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-[58ch] text-[0.95rem] leading-[1.55] text-ghost/70">
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
