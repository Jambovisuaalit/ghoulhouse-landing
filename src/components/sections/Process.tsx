import Container from '@/components/ui/Container';

const steps = [
  ['1', 'Materiaalit lähetetään', 'Lähetät kuvat, videot ja olennaiset kohdetiedot sovittua kanavaa pitkin.'],
  ['2', 'GhoulHouse tuottaa', 'Käsittelemme materiaalin ja rakennamme valmiit Instagram- ja Facebook-sisällöt.'],
  ['3', 'Hyväksyntä', 'Tarkistat faktat ja sävyn. Yksi koottu muokkauskierros sisältyy palveluun.'],
  ['4', 'Julkaisu', 'Hyväksytyt sisällöt ajastetaan ja julkaistaan palvelujakson aikana.'],
] as const;

export default function Process() {
  return (
    <section id="process" className="bg-ghost py-16 md:py-24">
      <Container>
        <h2 className="text-ink mb-12">Prosessi</h2>

        <div className="max-w-3xl space-y-8">
          {steps.map(([number, title, description]) => (
            <article key={number} className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-signal text-white font-bold" aria-hidden="true">
                  {number}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-ink mb-2">{title}</h3>
                <p className="text-ink/70">{description}</p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
