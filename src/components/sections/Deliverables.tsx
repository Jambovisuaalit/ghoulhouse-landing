import Container from '@/components/ui/Container';
import { siteConfig } from '@/config/site';

const productionRows = [
  {
    label: 'KANAVAT',
    value: 'Instagram + Facebook',
  },
  {
    label: 'TUOTANTO',
    value: 'Suunnittelu · kuvankäsittely · grafiikka · copy · CTA:t',
  },
  {
    label: 'JULKAISU',
    value: 'Ajastus ja julkaisu',
  },
  {
    label: 'KORJAUS',
    value: '1 koottu korjauskierros',
  },
  {
    label: 'RAPORTTI',
    value: 'Kuukausittainen tulosyhteenveto',
  },
  {
    label: 'YHTEISTYÖ',
    value: 'Onboarding · materiaaliohjeistus · WhatsApp',
  },
] as const;

export default function Deliverables() {
  return (
    <section id="deliverables" className="bg-ghost py-14 md:py-20">
      <Container>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <p className="type-label mb-4 text-signal">
              START / toimitussisältö
            </p>
            <h2 className="type-section-title max-w-[11ch] text-ink">
              Mitä 30 päivässä syntyy.
            </h2>
            <p className="type-editorial mt-6 max-w-sm text-ink/70">
              Palvelun rajaus näkyy ennen aloitusta. Ei avointa
              palveluvalikkoa, vaan yksi selkeä tuotantorytmi.
            </p>
          </div>

          <div className="border-y-2 border-ink lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-[0.82fr_1.18fr]">
              <div className="flex min-h-[230px] flex-col justify-between border-b-2 border-ink bg-ink p-5 text-ghost sm:p-6 md:min-h-[360px] md:border-b-0 md:border-r-2">
                <p className="type-label text-signal">OUTPUT / 30 PÄIVÄÄ</p>

                <div>
                  <p className="text-[clamp(5rem,12vw,9rem)] font-extrabold leading-[0.78] tracking-[-0.06em]">
                    12
                  </p>
                  <p className="mt-4 max-w-[15ch] text-xl font-extrabold uppercase leading-[0.95] tracking-[-0.025em] sm:text-2xl">
                    alkuperäistä sisältöä
                  </p>
                </div>

                <p className="type-caption max-w-xs text-ghost/65">
                  Yksi ydinsisältö sovitetaan sovituille kanaville. Ei 24
                  erillistä alkuperäispostausta.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2">
                {productionRows.map((item, index) => (
                  <div
                    key={item.label}
                    className={`min-h-[112px] border-b border-ink/25 p-5 ${
                      index % 2 === 0 ? 'sm:border-r' : ''
                    }`}
                  >
                    <p className="type-label text-signal">{item.label}</p>
                    <p className="type-ui mt-3 max-w-[30ch] text-ink">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="type-caption mt-5 flex flex-col gap-2 border-t border-ink/20 pt-4 text-ink/65 sm:flex-row sm:items-center sm:justify-between">
          <p>
            START · {siteConfig.offer.start.price} € {siteConfig.offer.start.vatLabel} /{' '}
            {siteConfig.offer.start.period}
          </p>
          <p>Palvelujaksot 1–3</p>
        </div>
      </Container>
    </section>
  );
}
