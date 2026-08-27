import Reveal from '@/components/ui/Reveal';

export default function Mechanism() {
  return (
    <section className="border-y border-ink/10 bg-white py-16 sm:py-24" aria-labelledby="mechanism-title">
      <div className="container-wide">
        <Reveal>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-signal">Ratkaisu</p>
          <h2 id="mechanism-title" className="mt-4 max-w-4xl text-ink">
            Sama materiaali. Ammattimaisempi käyttö.
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-px bg-ink/15 md:grid-cols-3">
          {[
            ['01', 'Materiaali', 'Lähetätte työmaa- ja referenssikuvat, joita teillä jo syntyy.'],
            ['02', 'GhoulHouse', 'Valitsemme, viimeistelemme, kirjoitamme ja sovitamme sisällön kanaviin.'],
            ['03', 'Julkaisu', 'Hyväksytty sisältö ajastetaan ja julkaistaan Instagramiin ja Facebookiin.'],
          ].map(([number, title, body]) => (
            <Reveal key={number} className="bg-ghost p-6 sm:p-8">
              <p className="text-sm font-black text-signal">{number}</p>
              <h3 className="mt-6 text-ink">{title}</h3>
              <p className="mt-3 text-ink/70">{body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
