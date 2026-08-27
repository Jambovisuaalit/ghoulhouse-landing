import Container from '@/components/ui/Container';

const steps = [
  ['1', 'Lähetät materiaalin', 'Työmaakuvat, videot ja olennaiset faktat. Käytämme sitä materiaalia, jota yritykselläsi jo on.'],
  ['2', 'Me tuotamme', 'Rakennamme sisällöt, käsittelemme kuvat ja kirjoitamme Instagram- ja Facebook-versiot.'],
  ['3', 'Hyväksyt', 'Tarkistat faktat ja sävyn. Yksi koottu muokkauskierros sisältyy palveluun.'],
  ['4', 'Me julkaisemme', 'Hyväksytyt sisällöt ajastetaan ja julkaistaan sovitun palvelujakson aikana.'],
] as const;

export default function Mechanism() {
  return (
    <section id="mechanism" className="bg-white py-16 md:py-24">
      <Container>
        <h2 className="text-ink mb-12 md:mb-16">Miten GhoulHouse toimii</h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {steps.map(([number, title, description]) => (
            <article key={number} className="flex flex-col">
              <div className="w-12 h-12 bg-signal rounded-full flex items-center justify-center text-white font-bold text-lg mb-4" aria-hidden="true">
                {number}
              </div>
              <h3 className="text-ink font-bold mb-2">{title}</h3>
              <p className="text-ink/70 text-sm leading-relaxed">{description}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
