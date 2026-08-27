import Image from 'next/image';
import Container from '@/components/ui/Container';
import { siteConfig } from '@/config/site';

export default function Founder() {
  return (
    <section className="border-y-2 border-ink bg-ghost py-16 md:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="relative min-h-[300px] overflow-hidden border-2 border-ink bg-bone lg:col-span-5">
            <Image
              src="/mark-color.svg"
              alt=""
              width={420}
              height={420}
              className="absolute -bottom-12 -right-10 h-auto w-[85%] max-w-[420px]"
            />
            <div className="absolute left-5 top-5 text-xs font-bold uppercase tracking-[0.16em] text-ink">
              Founder / Helsinki
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-signal">
              Omistajavetoinen palvelu
            </p>
            <h2 className="mt-4 font-display text-[clamp(3rem,5vw,5.5rem)] font-black uppercase leading-[0.88] tracking-[-0.04em] text-ink">
              {siteConfig.company.founder}
            </h2>
            <p className="mt-3 text-sm font-bold uppercase tracking-[0.12em] text-ink/60">
              Founder · {siteConfig.company.legalName} · Helsinki
            </p>

            <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink/80">
              <p>
                GhoulHouse on omistajavetoinen palvelu. Keskustelet suoraan
                palvelun toteutuksesta vastaavan ihmisen kanssa.
              </p>
              <p>
                Tavoite on käytännöllinen: asiakkaan olemassa oleva
                työmaamateriaali muutetaan johdonmukaiseksi sisällöksi ilman
                raskasta markkinointiprojektia.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-3 border-y border-ink/25 py-4 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-ink/60">
              <span>Suora yhteys</span>
              <span>Henkilökohtainen vastuu</span>
              <span>Kädet savessa</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
