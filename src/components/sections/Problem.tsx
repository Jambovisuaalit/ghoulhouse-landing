import Container from '@/components/ui/Container';

const observations = [
  {
    number: '01',
    title: 'Materiaalia syntyy jo.',
    body: 'Työmaakuvat, ennen–jälkeen-materiaali ja valmiit kohteet todistavat osaamisesta.',
  },
  {
    number: '02',
    title: 'Todiste jää piiloon.',
    body: 'Kuvat jäävät puhelimeen, WhatsAppiin tai kansioihin eivätkä rakenna jatkuvaa näkyvyyttä.',
  },
  {
    number: '03',
    title: 'Julkaiseminen jää muun työn alle.',
    body: 'Omistajan aika kuuluu asiakkaisiin ja työmaihin, ei jatkuvaan editointiin, copyyn ja ajastamiseen.',
  },
] as const;

export default function Problem() {
  return (
    <section id="problem" className="bg-ghost py-16 md:py-24">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="type-label mb-4 text-signal">
              Ongelma / tunnistaminen
            </p>
            <h2 className="type-section-title max-w-[14ch] text-ink">
              Hyvä työ ei auta,
              <span className="block">jos kukaan ei näe sitä.</span>
            </h2>
          </div>

          <div className="border-t-2 border-ink lg:col-span-6">
            {observations.map((item) => (
              <article
                key={item.number}
                className="grid grid-cols-[52px_1fr] gap-4 border-b border-ink/30 py-6"
              >
                <span className="type-label text-signal">
                  {item.number}
                </span>
                <div>
                  <h3 className="text-lg font-extrabold leading-tight tracking-[-0.02em] text-ink sm:text-xl">{item.title}</h3>
                  <p className="mt-2 max-w-[58ch] text-[0.95rem] leading-[1.55] text-ink/70">
                    {item.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
