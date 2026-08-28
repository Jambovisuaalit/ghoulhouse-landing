import Container from '@/components/ui/Container';
import ContactTrigger from '@/components/contact/ContactTrigger';
import { siteConfig } from '@/config/site';

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

export default function Pricing() {
  const { start, managed } = siteConfig.offer;

  return (
    <section id="pricing" className="border-y-2 border-ink bg-ghost py-14 md:py-20" aria-labelledby="pricing-title">
      <Container>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <p className="type-label mb-4 text-signal">Hinnoittelu / asiakkuuden eteneminen</p>
            <h2 id="pricing-title" className="type-section-title max-w-[12ch] text-ink">
              Yksi asiakkuus.<span className="block">Kaksi vaihetta.</span>
            </h2>
            <p className="type-editorial mt-6 max-w-md text-ink/70">
              Asiakkuus alkaa START-vaiheesta ja jatkuu palvelujaksosta 4 MANAGED-vaiheeseen. Näitä ei valita rinnakkaisina paketteina.
            </p>
            <div className="mt-8 hidden border-l-4 border-signal pl-4 lg:block">
              <p className="type-label text-ink/65">Lifecycle</p>
              <p className="mt-2 text-2xl font-extrabold uppercase leading-none tracking-[-0.025em] text-ink">
                01–03 <span className="mx-2 text-signal">→</span> 04+
              </p>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="border-y-2 border-ink">
              <article className="grid grid-cols-1 gap-6 py-7 sm:py-8 md:grid-cols-[190px_1fr] md:gap-8">
                <div>
                  <p className="type-label text-signal">{start.lifecycle}</p>
                  <h3 className="mt-2 text-3xl font-extrabold uppercase leading-none tracking-[-0.03em] text-ink sm:text-4xl">{start.name}</h3>
                  <div className="mt-5 border-l-4 border-signal pl-4">
                    <p className="type-price text-ink">{start.price} €</p>
                    <p className="type-label mt-1 text-ink/60">{start.vatLabel} / {start.period}</p>
                  </div>
                </div>
                <div>
                  <div className="grid grid-cols-1 border-t border-ink/25 sm:grid-cols-2">
                    {startSummary.map(([label, value]) => (
                      <div key={label} className="grid grid-cols-[92px_1fr] gap-3 border-b border-ink/20 py-3 sm:grid-cols-1 sm:gap-1 sm:px-4 sm:first:pl-0 sm:[&:nth-child(odd)]:border-r">
                        <span className="type-label text-signal">{label}</span>
                        <span className="type-ui text-ink">{value}</span>
                      </div>
                    ))}
                  </div>
                  <ContactTrigger className="btn btn-primary mt-6 w-full justify-between text-left sm:w-auto sm:min-w-[300px]">
                    <span>{siteConfig.cta.primary}</span><span aria-hidden="true">→</span>
                  </ContactTrigger>
                </div>
              </article>

              <div className="grid min-h-16 grid-cols-[1fr_auto_1fr] items-center border-y-2 border-ink bg-ink px-4 text-ghost sm:px-6">
                <span className="type-label text-ghost/60">Jakso 03</span>
                <div className="flex items-center gap-3 px-3 sm:gap-5 sm:px-6">
                  <span className="h-px w-5 bg-ghost/35 sm:w-12" aria-hidden="true" />
                  <span className="text-2xl font-extrabold text-signal">→</span>
                  <span className="h-px w-5 bg-ghost/35 sm:w-12" aria-hidden="true" />
                </div>
                <span className="text-right text-[0.58rem] font-black uppercase tracking-[0.14em] text-ghost/65">Jakso 04+</span>
              </div>

              <article className="grid grid-cols-1 gap-6 bg-bone py-7 sm:py-8 md:grid-cols-[190px_1fr] md:gap-8">
                <div>
                  <p className="type-label text-ink/60">{managed.lifecycle}</p>
                  <h3 className="mt-2 text-3xl font-extrabold uppercase leading-none tracking-[-0.03em] text-ink sm:text-4xl">{managed.name}</h3>
                  <div className="mt-5 border-l-4 border-ink pl-4">
                    <p className="type-price text-ink">{managed.price} €</p>
                    <p className="type-label mt-1 text-ink/60">{managed.vatLabel} / {managed.period}</p>
                  </div>
                </div>
                <div>
                  <p className="type-label mb-4 text-signal">START +</p>
                  <ul className="grid grid-cols-1 border-t border-ink/25 sm:grid-cols-2">
                    {managedSummary.map((item) => (
                      <li key={item} className="type-ui flex gap-3 border-b border-ink/20 py-3 text-ink sm:px-4 sm:first:pl-0 sm:[&:nth-child(odd)]:border-r">
                        <span aria-hidden="true" className="mt-[0.15rem] shrink-0 text-signal">+</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </div>
            <div className="type-caption mt-5 flex flex-col gap-3 text-ink/60 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
              <p className="max-w-xl">Tarkemmat rajaukset, sopimuslogiikka ja palvelun sisältö on avattu UKK:ssa.</p>
              <a href="#faq" className="type-label shrink-0 text-ink">Katso UKK →</a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
