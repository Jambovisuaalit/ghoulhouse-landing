import Container from '@/components/ui/Container';
import ContactTrigger from '@/components/contact/ContactTrigger';
import { siteConfig } from '@/config/site';

const serviceSummary = [
  ['SISÄLTÖ', '12 alkuperäistä sisältöä / 30 päivää'],
  ['KANAVAT', 'Instagram + Facebook'],
  ['TUOTANTO', 'Suunnittelu · kuvankäsittely · grafiikka · tekstit'],
  ['JULKAISU', 'Ajastus ja julkaisu'],
  ['KORJAUS', '1 koottu korjauskierros'],
  ['RAPORTTI', 'Kuukausittainen tulosyhteenveto'],
] as const;

const excluded = [
  'Maksettu mainonta',
  'Päivittäinen kommentti- ja viestihallinta',
  'Kuvauspäivät',
  'Jatkuva video- tai Reels-videotuotanto',
  'Muut kanavat kuin Instagram + Facebook',
] as const;

export default function Pricing() {
  const { start } = siteConfig.offer;

  return (
    <section
      id="pricing"
      className="border-y border-ink bg-ghost py-14 md:py-20"
      aria-labelledby="pricing-title"
    >
      <Container>
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] xl:gap-10">
          <div className="min-w-0">
            <p className="type-label mb-4 text-signal">
              Hinnoittelu / yksi selkeä paketti
            </p>
            <h2
              id="pricing-title"
              className="type-section-title max-w-[14ch] text-ink xl:max-w-[12ch] xl:text-[clamp(2.5rem,3.75vw,4.15rem)]"
            >
              Yksi paketti.<span className="block">Ei hinnanvaihdosta.</span>
            </h2>
            <p className="type-editorial mt-6 max-w-md text-ink/70">
              Sama 490 € + ALV / 30 päivää -palvelu jatkuu niin kauan kuin
              yhteistyö jatkuu. Ei automaattista siirtymää kalliimpaan
              palvelumalliin.
            </p>

            <div className="mt-8 hidden border-l-4 border-signal pl-4 xl:block">
              <p className="type-label text-ink/65">Sopimus</p>
              <p className="mt-2 text-2xl font-extrabold uppercase leading-none tracking-[-0.025em] text-ink">
                30 päivää <span className="mx-2 text-signal">·</span>{' '}
                kuukausittain irtisanottava
              </p>
            </div>
          </div>

          <div className="min-w-0">
            <article
              className="border-y-2 border-ink"
              data-offer-card
              data-offer-name={start.name}
              data-offer-price={start.price}
            >
              <div className="grid grid-cols-1 gap-6 py-7 sm:py-8 md:grid-cols-[190px_1fr] md:gap-8">
                <div>
                  <p className="type-label text-signal">{start.lifecycle}</p>
                  <h3 className="mt-2 text-3xl font-extrabold uppercase leading-none tracking-[-0.03em] text-ink sm:text-4xl">
                    {start.name}
                  </h3>

                  <div className="mt-5 border-l-4 border-signal pl-4">
                    <p className="type-price text-ink">{start.price} €</p>
                    <p className="type-label mt-1 text-ink/60">
                      {start.vatLabel} / {start.period}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="grid grid-cols-1 border-t border-ink/25 sm:grid-cols-2">
                    {serviceSummary.map(([label, value]) => (
                      <div
                        key={label}
                        className="grid grid-cols-[92px_1fr] gap-3 border-b border-ink/20 py-3 sm:grid-cols-1 sm:gap-1 sm:px-4 sm:first:pl-0 sm:[&:nth-child(odd)]:border-r"
                      >
                        <span className="type-label text-signal">{label}</span>
                        <span className="type-ui text-ink">{value}</span>
                      </div>
                    ))}
                  </div>

                  <ContactTrigger className="btn btn-primary mt-6 w-full justify-between text-left sm:w-auto sm:min-w-[300px]">
                    <span>{siteConfig.cta.primary}</span>
                    <span aria-hidden="true">→</span>
                  </ContactTrigger>
                </div>
              </div>

              <div className="border-t-2 border-ink bg-bone p-5 sm:p-6">
                <p className="type-label text-signal">Ei sisälly</p>
                <ul className="mt-4 grid grid-cols-1 border-t border-ink/25 sm:grid-cols-2">
                  {excluded.map((item) => (
                    <li
                      key={item}
                      className="type-ui flex gap-3 border-b border-ink/20 py-3 text-ink sm:px-4 sm:first:pl-0 sm:[&:nth-child(odd)]:border-r"
                    >
                      <span aria-hidden="true" className="shrink-0 text-signal">
                        —
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            <div className="type-caption mt-5 flex flex-col gap-3 text-ink/60 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
              <p className="max-w-xl">
                Tarkemmat rajaukset ja sopimuslogiikka on avattu UKK:ssa.
              </p>
              <a href="#faq" className="type-label shrink-0 text-ink">
                Katso UKK →
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
