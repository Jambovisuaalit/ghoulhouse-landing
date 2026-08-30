import Image from 'next/image';
import Container from '@/components/ui/Container';
import { siteConfig } from '@/config/site';

export default function Founder() {
  const portrait = siteConfig.company.founderImage;

  return (
    <section className="bg-paper py-20 md:py-28" aria-labelledby="founder-title">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-stretch">
          <div className="lg:col-span-5">
            {portrait ? (
              <figure className="relative min-h-[460px] overflow-hidden border border-ink bg-white md:min-h-[600px]">
                <Image
                  src={portrait}
                  alt="GhoulHousen perustajan vahvistettu kuva"
                  fill
                  sizes="(max-width: 1023px) 100vw, 42vw"
                  className="object-cover"
                />
              </figure>
            ) : (
              <div className="founder-avatar min-h-[460px] border border-ink bg-white p-7 md:min-h-[600px] md:p-10">
                <div className="flex h-28 w-28 items-center justify-center rounded-full border border-ink bg-paper font-display text-5xl">
                  HN
                </div>
                <div className="mt-auto">
                  <p className="type-label text-signal">Vahvistettu kuva puuttuu</p>
                  <p className="mt-3 font-bold text-ink">NEXT_PUBLIC_FOUNDER_IMAGE</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between lg:col-span-6 lg:col-start-7">
            <div>
              <p className="type-label text-signal">Tekijä sisällön takana</p>
              <h2 id="founder-title" className="type-section-title mt-4 max-w-[10ch] text-ink">
                TEKIJÄ SISÄLLÖN TAKANA
              </h2>
            </div>
            <div className="mt-12 border-t border-ink pt-7">
              <p className="text-2xl font-black uppercase tracking-[-0.03em] text-ink">{siteConfig.company.founder}</p>
              <p className="mt-5 type-editorial text-muted">
                [TARKISTA: founder-esittely, tausta ja tarkka roolikuvaus ennen julkaisua.]
              </p>
              <p className="mt-6 text-sm font-bold text-ink">
                Founder-kuva pysyy vaihdettavana ympäristömuuttujalla <code>NEXT_PUBLIC_FOUNDER_IMAGE</code>.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
