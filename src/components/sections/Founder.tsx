import Image from 'next/image';
import Container from '@/components/ui/Container';
import { siteConfig } from '@/config/site';

export default function Founder() {
  const portrait = siteConfig.company.founderImage;

  return (
    <section
      className="bg-bone py-16 md:py-24"
      aria-labelledby="founder-title"
    >
      <Container>
        <div className="grid grid-cols-1 gap-10 min-[960px]:grid-cols-12 min-[960px]:items-stretch">
          <div className="min-[960px]:col-span-5">
            {portrait ? (
              <figure className="relative min-h-[420px] overflow-hidden bg-ghost sm:min-h-[560px]">
                <Image
                  src={portrait}
                  alt="Hanna Nyholm, GhoulHousen perustaja"
                  fill
                  sizes="(max-width: 959px) 100vw, 42vw"
                  className="object-cover"
                />
              </figure>
            ) : (
              <div className="flex min-h-[360px] flex-col justify-between bg-ghost p-7 sm:min-h-[500px] sm:p-9">
                <div
                  className="flex h-28 w-28 items-center justify-center rounded-full border border-ink/20 bg-bone sm:h-36 sm:w-36"
                  role="img"
                  aria-label="Hanna Nyholmin profiiliavatar"
                >
                  <span className="font-display text-[3rem] leading-none tracking-[-0.03em] text-ink sm:text-[4rem]">
                    HN
                  </span>
                </div>
                <div>
                  <p className="font-editorial-accent text-[clamp(2rem,4vw,3.4rem)] leading-[0.98] text-ink">
                    Henkilökohtainen palvelu.
                  </p>
                  <p className="type-editorial mt-5 max-w-sm text-ink/70">
                    Keskustelet suoraan palvelusta vastaavan ihmisen kanssa
                    ensimmäisestä materiaalipyynnöstä kuukausiraporttiin asti.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between min-[960px]:col-span-6 min-[960px]:col-start-7">
            <div>
              <p className="type-label text-signal">Perustaja / GhoulHouse</p>
              <h2
                id="founder-title"
                className="type-section-title mt-4 max-w-[12ch] text-ink"
              >
                {siteConfig.company.founder}
              </h2>
              <p className="font-editorial-accent mt-5 max-w-[18ch] text-[clamp(1.8rem,3vw,2.8rem)] leading-[1.02] text-ink">
                Hyvän työn pitäisi näyttää yhtä hyvältä verkossa kuin se näyttää
                valmiina kohteessa.
              </p>
            </div>

            <div className="mt-10 border-t border-ink/25 pt-7">
              <p className="type-editorial max-w-2xl font-semibold text-ink">
                Hanna vastaa GhoulHousen palvelun toteutuksesta ja
                asiakasviestinnästä.
              </p>
              <p className="type-editorial mt-4 max-w-2xl text-ink/70">
                Keskustelet suoraan palvelusta vastaavan ihmisen kanssa. Ei
                välikäsiä eikä erillistä asiakkuustiimiä.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-y-4 border-t border-ink/20 pt-5 sm:grid-cols-3 sm:gap-x-6">
                <div>
                  <p className="type-label text-signal">Vastuu</p>
                  <p className="type-ui mt-2 text-ink">Palvelun toteutus</p>
                </div>
                <div>
                  <p className="type-label text-signal">Yhteys</p>
                  <p className="type-ui mt-2 text-ink">Suoraan Hannalle</p>
                </div>
                <div>
                  <p className="type-label text-signal">Sijainti</p>
                  <p className="type-ui mt-2 text-ink">Helsinki</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
