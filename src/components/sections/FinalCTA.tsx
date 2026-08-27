import LeadForm from '@/components/ui/LeadForm';

export default function FinalCTA() {
  return (
    <section id="demo" className="section cta-stage">
      <div className="shell grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <header className="lg:sticky lg:top-28">
          <p className="eyebrow text-signal">10 / DEMO REQUEST</p>
          <div className="rule-signal mt-5" />
          <h2 className="display-title mt-7 text-ghost">
            Pyydä 2 sisältöesimerkkiä omasta materiaalistanne.
          </h2>
          <p className="mt-7 max-w-xl text-lg leading-8 text-ghost/65">
            Ensimmäinen askel ei ole pitkä myyntipalaveri. Lähetä yrityksen tiedot,
            niin arvioimme millainen demo olisi teille relevantti.
          </p>

          <div className="mt-10 border-y border-ghost/15 py-5 font-mono text-xs uppercase tracking-[0.08em] text-ghost/40">
            RAW MATERIAL → GHOULHOUSE → READY CONTENT
          </div>
        </header>

        <div className="cta-panel">
          <LeadForm />
        </div>
      </div>
    </section>
  );
}
