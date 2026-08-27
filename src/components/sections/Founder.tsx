import Container from '@/components/ui/Container';
import { siteConfig } from '@/config/site';

export default function Founder() {
  return (
    <section
      className="border-y-2 border-ink bg-ghost py-14 md:py-20"
      aria-labelledby="founder-title"
    >
      <Container>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch lg:gap-10">
          <div className="lg:col-span-5">
            <div
              className="relative flex h-full min-h-[360px] flex-col justify-between overflow-hidden border-2 border-ink bg-bone p-5 sm:min-h-[440px] sm:p-6 lg:min-h-[500px]"
              aria-label="Hanna Nyholmin perustajakuvan paikka"
              data-founder-image-slot
            >
              <div className="flex items-start justify-between gap-4">
                <span className="type-label text-signal">
                  Hanna Nyholm
                </span>
                <span className="type-caption uppercase tracking-[0.06em] text-ink/65">
                  Founder / Helsinki
                </span>
              </div>

              <div className="max-w-[18rem]">
                <div
                  className="mb-6 h-16 w-px bg-signal"
                  aria-hidden="true"
                />
                <p className="text-[clamp(2rem,6vw,3.5rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.04em] text-ink">
                  Omistaja.
                  <span className="block">Tekijä.</span>
                  <span className="block">Yhteyshenkilö.</span>
                </p>
              </div>

              <p className="type-caption max-w-[24ch] uppercase tracking-[0.06em] text-ink/65">
                Founder portrait / production image slot
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center lg:col-span-6 lg:col-start-7">
            <p className="type-label text-signal">
              Omistajavetoinen palvelu
            </p>

            <h2
              id="founder-title"
              className="type-section-title mt-4 max-w-[12ch] uppercase text-ink"
            >
              {siteConfig.company.founder}
            </h2>

            <p className="type-label mt-4 text-ink/65">
              Founder · {siteConfig.company.legalName} · Helsinki
            </p>

            <div className="mt-8 max-w-2xl border-t-2 border-ink pt-6">
              <p className="type-editorial font-semibold text-ink">
                Hanna vastaa GhoulHousen palvelun toteutuksesta ja
                asiakasviestinnästä.
              </p>
              <p className="type-editorial mt-4 max-w-xl text-ink/70">
                Keskustelet suoraan palvelusta vastaavan ihmisen kanssa.
                Ei välikäsiä, ei erillistä asiakkuustiimiä.
              </p>
            </div>

            <div className="type-label mt-9 flex flex-wrap gap-x-6 gap-y-3 border-t border-ink/25 pt-5 text-ink/65">
              <span>Vastuu / Hanna</span>
              <span>Yhteys / suora</span>
              <span>Sijainti / Helsinki</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
