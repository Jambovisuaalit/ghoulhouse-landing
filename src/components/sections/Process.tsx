import Reveal from '@/components/ui/Reveal';

const steps = [
  ['01', 'Materiaalit', 'Lähetätte nykyiset kuvat, perustiedot ja mahdolliset tarjoukset.'],
  ['02', 'Kickoff + batch', 'Sovimme suunnan ja GhoulHouse tekee ensimmäisen sisältöbatchin hyväksyttäväksi.'],
  ['03', 'Julkaisu', 'Hyväksytyt sisällöt ajastetaan ja julkaistaan. Prosessi toistuu seuraavalla 30 päivän jaksolla.'],
];

export default function Process() {
  return (
    <section id="process" className="bg-ghost py-16 sm:py-24" aria-labelledby="process-title">
      <div className="container-wide">
        <Reveal>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-signal">Aloitus</p>
          <h2 id="process-title" className="mt-4 text-ink">Kevyt prosessi. Ei uutta sisältöprojektia teille.</h2>
        </Reveal>
        <ol className="mt-10 grid gap-4 lg:grid-cols-3">
          {steps.map(([number, title, body], index) => (
            <Reveal key={number} className="border-2 border-ink p-6 sm:p-8" delay={index * 0.06}>
              <p className="text-sm font-black text-signal">{number}</p>
              <h3 className="mt-8 text-ink">{title}</h3>
              <p className="mt-3 text-ink/70">{body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
