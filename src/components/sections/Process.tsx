import SectionHeading from '@/components/ui/SectionHeading';
import { processSteps } from '@/lib/content';

export default function Process() {
  return (
    <section id="prosessi" className="section bg-ink text-ghost">
      <div className="shell">
        <SectionHeading
          inverse
          eyebrow="05 / PROSESSI"
          title="Materiaalista julkaisuun ilman jatkuvaa säätöä."
          intro="Prosessi on batch-pohjainen: yksi materiaalivirta, yksi koottu hyväksyntä, yksi revisio ja suunniteltu julkaisu."
        />
        <ol className="mt-14 border-t border-ghost/15">
          {processSteps.map((step) => (
            <li key={step.number} className="grid gap-5 border-b border-ghost/15 py-7 sm:grid-cols-[90px_1fr] lg:grid-cols-[120px_0.8fr_1.2fr] lg:items-start lg:py-9">
              <span className="font-mono text-sm text-signal">{step.number}</span>
              <h3 className="font-display text-3xl font-black uppercase tracking-[-0.04em]">{step.title}</h3>
              <p className="max-w-2xl text-base leading-7 text-ghost/65">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
