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
            <div className="relative flex min-h-[360px] h-full flex-col justify-between overflow-hidden border-2 border-ink bg-bone p-5 sm:min-h-[440px] sm:p-6 lg:min-h-[520px]">
              <div className="flex items-start justify-between gap-4">
                <span className="text-[0.6rem] font-black uppercase tracking-[0.16em] text-signal">
                  Founder portrait
                </span>
                <span className="text-[0.55rem] font-black uppercase tracking-[0.14em] text-ink/45">
                  Approved image slot
                </span>
              </div>

              <div className="max-w-[16rem]">
                <div
                  className="mb-5 h-px w-16 bg-signal"
                  aria-hidden="true"
                />
                <p className="font-display text-[clamp(2.8rem,8vw,5rem)] font-black uppercase leading-[0.86] tracking-[-0.04em] text-ink">
                  Hanna
                  <span className="block">Nyholm</span>
                </p>
              </div>

              <p className="max-w-xs text-[0.62rem] font-bold uppercase leading-relaxed tracking-[0.13em] text-ink/50">
                Korvataan hyväksytyllä tuotantokuvalla heti kun kuva on
                saatavilla.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between lg:col-span-6 lg:col-start-7">
            <div>
              <p className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-signal sm:text-xs">
                Omistajavetoinen palvelu
              </p>

              <h2
                id="founder-title"
                className="mt-4 font-display text-[clamp(3rem,7vw,6rem)] font-black uppercase leading-[0.86] tracking-[-0.045em] text-ink"
              >
                {siteConfig.company.founder}
              </h2>

              <p className="mt-4 text-sm font-black uppercase tracking-[0.13em] text-ink/55">
                Founder · {siteConfig.company.legalName} · Helsinki
              </p>

              <div className="mt-8 max-w-2xl border-t-2 border-ink pt-6">
                <p className="text-lg font-bold leading-relaxed text-ink sm:text-xl">
                  Hanna vastaa GhoulHousen palvelun toteutuksesta ja
                  asiakasviestinnästä.
                </p>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/70">
                  Keskustelet suoraan palvelusta vastaavan ihmisen kanssa.
                  Ei välikäsiä, ei erillistä asiakkuustiimiä.
                </p>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 border-y border-ink/25 sm:grid-cols-3 lg:mt-12">
              <div className="border-b border-ink/20 py-4 sm:border-b-0 sm:border-r sm:pr-4">
                <p className="text-[0.55rem] font-black uppercase tracking-[0.15em] text-signal">
                  Vastuu
                </p>
                <p className="mt-2 text-sm font-bold text-ink">
                  Sama henkilö vastaa toteutuksesta.
                </p>
              </div>

              <div className="border-b border-ink/20 py-4 sm:border-b-0 sm:border-r sm:px-4">
                <p className="text-[0.55rem] font-black uppercase tracking-[0.15em] text-signal">
                  Yhteys
                </p>
                <p className="mt-2 text-sm font-bold text-ink">
                  Suora kommunikaatio.
                </p>
              </div>

              <div className="py-4 sm:pl-4">
                <p className="text-[0.55rem] font-black uppercase tracking-[0.15em] text-signal">
                  Sijainti
                </p>
                <p className="mt-2 text-sm font-bold text-ink">
                  Helsinki, Finland
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
