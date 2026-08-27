import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';
import { siteConfig } from '@/config/site';

interface PricingProps {
  onCtaClick: () => void;
}

const startSummary = [
  ['CORE', '12 alkuperäistä sisältöä / 30 päivää'],
  ['KANAVAT', 'Instagram + Facebook'],
  ['TUOTANTO', 'Suunnittelu · kuvankäsittely · grafiikka · copy'],
  ['JULKAISU', 'Ajastus ja julkaisu'],
  ['KORJAUS', '1 koottu korjauskierros'],
  ['RAPORTTI', 'Kuukausittainen tulosyhteenveto'],
] as const;

const managedSummary = [
  'Kaikki START-palvelun sisältö',
  'Jatkuva optimointi',
  'Lyhyt viikkotilanne',
  'Sisältöpankin hallinta',
  'Rajattu community management',
  '1 konkreettinen kehityssuositus / kk',
] as const;

export default function Pricing({ onCtaClick }: PricingProps) {
  const { start, managed } = siteConfig.offer;

  return (
    <section
      id="pricing"
      className="border-y-2 border-ink bg-ghost py-14 md:py-20"
      aria-labelledby="pricing-title"
    >
      <Container>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <p className="mb-4 text-[0.65rem] font-black uppercase tracking-[0.18em] text-signal sm:text-xs">
              Hinnoittelu / asiakkuuden eteneminen
            </p>
            <h2
              id="pricing-title"
              className="font-display text-[clamp(2.8rem,6vw,5.5rem)] font-black uppercase leading-[0.88] tracking-[-0.04em] text-ink"
            >
              Yksi asiakkuus.
              <span className="block">Kaksi vaihetta.</span>
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-ink/70 sm:text-base">
              Asiakkuus alkaa START-vaiheesta ja jatkuu palvelujaksosta 4
              MANAGED-vaiheeseen. Näitä ei valita rinnakkaisina paketteina.
            </p>

            <div className="mt-8 hidden border-l-4 border-signal pl-4 lg:block">
              <p className="text-[0.62rem] font-black uppercase tracking-[0.14em] text-ink/50">
                Lifecycle
              </p>
              <p className="mt-2 font-display text-3xl font-black uppercase leading-none text-ink">
                01–03
                <span className="mx-2 text-signal">→</span>
                04+
              </p>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="border-y-2 border-ink">
              <article className="grid grid-cols-1 gap-6 py-7 sm:py-8 md:grid-cols-[190px_1fr] md:gap-8">
                <div>
                  <p className="text-[0.62rem] font-black uppercase tracking-[0.16em] text-signal">
                    {start.lifecycle}
                  </p>
                  <h3 className="mt-2 font-display text-5xl font-black uppercase leading-none text-ink">
                    {start.name}
                  </h3>
                  <div className="mt-5 border-l-4 border-signal pl-4">
                    <p className="font-display text-4xl font-black leading-none text-ink">
                      {start.price} €
                    </p>
                    <p className="mt-1 text-[0.62rem] font-black uppercase tracking-[0.13em] text-ink/55">
                      {start.vatLabel} / {start.period}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="grid grid-cols-1 border-t border-ink/25 sm:grid-cols-2">
                    {startSummary.map(([label, value]) => (
                      <div
                        key={label}
                        className="grid grid-cols-[92px_1fr] gap-3 border-b border-ink/20 py-3 sm:grid-cols-1 sm:gap-1 sm:px-4 sm:first:pl-0 sm:[&:nth-child(odd)]:border-r"
                      >
                        <span className="text-[0.56rem] font-black uppercase tracking-[0.14em] text-signal">
                          {label}
                        </span>
                        <span className="text-sm font-bold leading-relaxed text-ink">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    onClick={onCtaClick}
                    className="mt-6 w-full justify-between text-left text-sm uppercase tracking-[0.08em] sm:w-auto sm:min-w-[300px]"
                  >
                    <span>{siteConfig.cta.primary}</span>
                    <span aria-hidden="true">→</span>
                  </Button>
                </div>
              </article>

              <div className="grid min-h-16 grid-cols-[1fr_auto_1fr] items-center border-y-2 border-ink bg-ink px-4 text-ghost sm:px-6">
                <span className="text-[0.58rem] font-black uppercase tracking-[0.14em] text-ghost/55">
                  Jakso 03
                </span>
                <div className="flex items-center gap-3 px-3 sm:gap-5 sm:px-6">
                  <span className="h-px w-5 bg-ghost/35 sm:w-12" aria-hidden="true" />
                  <span className="font-display text-2xl font-black uppercase text-signal">
                    →
                  </span>
                  <span className="h-px w-5 bg-ghost/35 sm:w-12" aria-hidden="true" />
                </div>
                <span className="text-right text-[0.58rem] font-black uppercase tracking-[0.14em] text-ghost/55">
                  Jakso 04+
                </span>
              </div>

              <article className="grid grid-cols-1 gap-6 bg-bone py-7 sm:py-8 md:grid-cols-[190px_1fr] md:gap-8">
                <div>
                  <p className="text-[0.62rem] font-black uppercase tracking-[0.16em] text-ink/55">
                    {managed.lifecycle}
                  </p>
                  <h3 className="mt-2 font-display text-5xl font-black uppercase leading-none text-ink">
                    {managed.name}
                  </h3>
                  <div className="mt-5 border-l-4 border-ink pl-4">
                    <p className="font-display text-4xl font-black leading-none text-ink">
                      {managed.price} €
                    </p>
                    <p className="mt-1 text-[0.62rem] font-black uppercase tracking-[0.13em] text-ink/55">
                      {managed.vatLabel} / {managed.period}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="mb-4 text-[0.62rem] font-black uppercase tracking-[0.14em] text-signal">
                    START +
                  </p>
                  <ul className="grid grid-cols-1 border-t border-ink/25 sm:grid-cols-2">
                    {managedSummary.map((item, index) => (
                      <li
                        key={item}
                        className="flex gap-3 border-b border-ink/20 py-3 text-sm font-bold leading-relaxed text-ink sm:px-4 sm:first:pl-0 sm:[&:nth-child(odd)]:border-r"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[0.15rem] shrink-0 text-signal"
                        >
                          +
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </div>

            <div className="mt-5 flex flex-col gap-3 text-xs leading-relaxed text-ink/55 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
              <p className="max-w-xl">
                Tarkemmat rajaukset, sopimuslogiikka ja palvelun sisältö on
                avattu UKK:ssa.
              </p>
              <a
                href="#faq"
                className="shrink-0 font-black uppercase tracking-[0.12em] text-ink"
              >
                Katso UKK →
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
