import Container from '@/components/ui/Container';
import { siteConfig } from '@/config/site';

export default function Founder() {
  return (
    <section
      className="border-y-2 border-ink bg-ghost py-14 md:py-20"
      aria-labelledby="founder-title"
    >
      <Container>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <p className="type-label text-signal">Omistajavetoinen palvelu</p>
            <h2
              id="founder-title"
              className="type-section-title mt-4 max-w-[12ch] uppercase text-ink"
            >
              {siteConfig.company.founder}
            </h2>
            <p className="type-label mt-4 text-ink/65">
              Founder · {siteConfig.company.legalName} · Helsinki
            </p>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <div className="border-y-2 border-ink">
              <div className="grid grid-cols-1 border-b border-ink/25 sm:grid-cols-3">
                <div className="p-5 sm:border-r sm:border-ink/25">
                  <p className="type-label text-signal">Vastuu</p>
                  <p className="type-ui mt-3 uppercase text-ink">
                    Palvelun toteutus
                  </p>
                </div>
                <div className="border-t border-ink/25 p-5 sm:border-r sm:border-t-0 sm:border-ink/25">
                  <p className="type-label text-signal">Yhteys</p>
                  <p className="type-ui mt-3 uppercase text-ink">
                    Suoraan Hannalle
                  </p>
                </div>
                <div className="border-t border-ink/25 p-5 sm:border-t-0">
                  <p className="type-label text-signal">Sijainti</p>
                  <p className="type-ui mt-3 uppercase text-ink">Helsinki</p>
                </div>
              </div>

              <div className="py-7 sm:py-8">
                <p className="type-editorial font-semibold text-ink">
                  Hanna vastaa GhoulHousen palvelun toteutuksesta ja
                  asiakasviestinnästä.
                </p>
                <p className="type-editorial mt-4 max-w-2xl text-ink/70">
                  Keskustelet suoraan palvelusta vastaavan ihmisen kanssa.
                  Ei välikäsiä eikä erillistä asiakkuustiimiä.
                </p>
              </div>
            </div>

            <p className="type-caption mt-5 max-w-2xl uppercase tracking-[0.06em] text-ink/60">
              Founder-kuvaa ei käytetä ennen kuin käytössä on oikea,
              julkaistavaksi hyväksytty portrait.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
