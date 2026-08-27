import Image from 'next/image';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';
import { siteConfig } from '@/config/site';

interface HeroProps {
  onCtaClick: () => void;
}

export default function Hero({ onCtaClick }: HeroProps) {
  const { positioning, offer, cta } = siteConfig;

  return (
    <section
      id="top"
      className="overflow-hidden border-b-2 border-ink bg-ghost"
      aria-labelledby="hero-title"
    >
      <Container className="grid min-h-[calc(100svh-73px)] grid-cols-1 gap-8 py-8 md:py-12 lg:grid-cols-12 lg:gap-8 lg:py-10">
        <div className="flex flex-col justify-between lg:col-span-8">
          <div className="flex items-center gap-4 border-b border-ink/25 pb-4 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-ink">
            <span className="normal-case tracking-normal text-base">
              {siteConfig.company.brand}
            </span>
            <span className="h-px w-10 bg-ink" aria-hidden="true" />
            <span className="hidden sm:inline">Somepalvelu paikallisille palveluyrityksille</span>
          </div>

          <div className="py-10 md:py-14 lg:py-8">
            <h1
              id="hero-title"
              className="max-w-[11ch] lg:max-w-none font-display text-[clamp(2.45rem,7.6vw,8.2rem)] font-black uppercase leading-[0.82] tracking-[-0.045em] text-ink"
            >
              <span className="block">{positioning.headline[0]}</span>
              <span className="block">{positioning.headline[1]}</span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink/80 md:text-xl">
              <strong className="font-bold text-ink">
                {positioning.supporting[0]}
              </strong>{' '}
              {positioning.supporting[1]}
            </p>

            <div className="mt-8 grid max-w-3xl grid-cols-1 border-2 border-ink sm:grid-cols-[auto_1fr]">
              <div className="bg-bone px-5 py-4 text-ink sm:min-w-[250px]">
                <p className="font-display text-3xl font-black leading-none">
                  {offer.start.price} € {offer.start.vatLabel}
                </p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-ink/65">
                  / {offer.start.period} · {offer.start.lifecycle}
                </p>
              </div>
              <Button
                variant="primary"
                size="lg"
                onClick={onCtaClick}
                className="min-h-16 border-0 border-t-2 border-ink text-sm uppercase tracking-[0.08em] sm:border-l-2 sm:border-t-0"
              >
                {cta.primary}
              </Button>
            </div>
          </div>

          <p className="border-t border-ink/25 pt-4 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink/65">
            12 sisältöä / 30 päivää · Instagram + Facebook
          </p>
        </div>

        <figure className="relative min-h-[270px] overflow-hidden border-2 border-ink bg-ink md:min-h-[360px] lg:col-span-4 lg:min-h-0">
          <Image
            src="/hero-renovation-clean.svg"
            alt="Konseptikuva remonttityön materiaalista GhoulHouse-sisältöprosessissa"
            fill
            priority
            sizes="(max-width: 1023px) 100vw, 34vw"
            className="object-cover grayscale contrast-125"
          />
          <div
            className="absolute inset-y-0 left-0 flex w-9 items-center justify-center bg-ink text-[0.55rem] font-bold uppercase tracking-[0.16em] text-ghost [writing-mode:vertical-rl]"
            aria-hidden="true"
          >
            GHOULHOUSE / FIELD NOTE 01
          </div>
          <figcaption className="absolute left-12 top-4 border border-ink bg-ghost px-2 py-1 text-[0.55rem] font-bold uppercase tracking-[0.12em] text-ink">
            KONSEPTIESIMERKKI — EI ASIAKASTYÖ
          </figcaption>
          <div
            className="absolute bottom-0 left-9 right-0 grid grid-cols-[1fr_auto_1fr] border-t border-ghost/30 bg-ink px-4 py-3 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-ghost"
            aria-hidden="true"
          >
            <span>RAW</span>
            <span className="text-signal">→</span>
            <span className="text-right">FINAL</span>
          </div>
        </figure>
      </Container>
    </section>
  );
}
