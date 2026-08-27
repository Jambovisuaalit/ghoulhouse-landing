import LeadForm from '@/components/ui/LeadForm';

export default function FinalCTA() {
  return (
    <section id="demo" className="section bg-signal text-white">
      <div className="shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <header>
          <p className="eyebrow text-white">10 / DEMO</p>
          <h2 className="display-title mt-6 text-white">Pyydä 2 sisältöesimerkkiä omasta materiaalistanne.</h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white">
            Ensimmäinen askel ei ole pitkä myyntipalaveri. Lähetä yrityksen tiedot, niin voimme arvioida, millainen demo olisi teille relevantti.
          </p>
        </header>
        <div className="bg-ghost p-5 text-ink sm:p-8 lg:p-10">
          <LeadForm />
        </div>
      </div>
    </section>
  );
}
