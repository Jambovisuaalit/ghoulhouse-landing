import Container from '@/components/ui/Container';
import { processSteps } from '@/data/landing';

export default function Process() {
  return (
    <section id="miten-toimii" className="border-y border-ink bg-white py-20 md:py-28" aria-labelledby="process-title">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="type-label text-signal">Miten palvelu toimii</p>
            <h2 id="process-title" className="type-section-title mt-4 max-w-[12ch] text-ink">
              KOLME VAIHETTA. YKSI SELKEÄ RYTMI.
            </h2>
          </div>
          <p className="type-editorial text-muted lg:col-span-4">
            Faktat ja kuvien julkaisuoikeudet vahvistetaan ennen tuotantoa. Sisältöä ei rakenneta arvailun varaan.
          </p>
        </div>

        <ol className="mt-12 grid gap-px border border-ink bg-ink lg:grid-cols-3">
          {processSteps.map((step) => (
            <li key={step.number} className="process-step bg-paper p-6 md:p-8">
              <span className="font-display text-6xl leading-none text-signal">{step.number}</span>
              <h3 className="mt-10 text-2xl font-black uppercase leading-[0.95] tracking-[-0.03em] text-ink">
                {step.title}
              </h3>
              <p className="mt-5 text-sm leading-6 text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
