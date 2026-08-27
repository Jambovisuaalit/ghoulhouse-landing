import Reveal from '@/components/ui/Reveal';

export default function Problem() {
  return (
    <section className="bg-ghost py-16 sm:py-24" aria-labelledby="problem-title">
      <div className="container-wide">
        <Reveal className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-signal">Ongelma</p>
          <div>
            <h2 id="problem-title" className="max-w-3xl text-ink">
              Hyvää materiaalia syntyy. Julkaiseminen jää.
            </h2>
            <p className="mt-5 max-w-2xl text-ink/70">
              Referenssikuvat jäävät puhelimeen, WhatsAppiin tai verkkosivun galleriaan. Kun sisältöä ei ehditä suunnitella, kirjoittaa ja julkaista, hyvä työnjälki ei rakenna näkyvyyttä systemaattisesti.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
