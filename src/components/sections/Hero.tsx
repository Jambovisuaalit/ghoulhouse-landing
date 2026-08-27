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
      <Container className="grid grid-cols-1 gap-7 py-6 sm:gap-9 sm:py-9 lg:min-h-[calc(100svh-67px)] lg:grid-cols-12 lg:gap-10 lg:py-10">
        <div className="flex flex-col justify-between lg:col-span-7 xl:col-span-8">
          <div>
            <p className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-signal sm:text-xs">
              12 sisältöä / 30 päivää · Instagram + Facebook
            </p>

            <h1
              id="hero-title"
              className="mt-5 font-display text-[clamp(2rem,9.4vw,4.1rem)] font-black uppercase leading-[0.9] tracking-[-0.045em] text-ink sm:text-[clamp(3.4rem,7.7vw,5rem)] lg:text-[clamp(4.4rem,5.7vw,6.4rem)]"
            >
              <span className="block">{positioning.headline[0]}</span>
              <span className="mt-[0.08em] block text-signal">
                {positioning.headline[1]}
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-[1.03rem] leading-[1.5] text-ink/80 sm:mt-8 sm:text-xl lg:max-w-xl lg:text-[1.35rem]">
              <strong className="font-black text-ink">
                {positioning.supporting[0]}
              </strong>{' '}
              {positioning.supporting[1]}
            </p>
          </div>

          <div className="mt-8 sm:mt-10 lg:mt-12">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:gap-7 lg:gap-9">
              <div className="border-l-4 border-signal pl-4">
                <p className="font-display text-[2.4rem] font-black uppercase leading-[0.92] tracking-[-0.03em] text-ink sm:text-5xl">
                  {offer.start.price} € {offer.start.vatLabel}
                </p>
                <p className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-ink/60">
                  / {offer.start.period}
                </p>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={onCtaClick}
                className="min-h-14 w-full justify-between px-5 text-left text-sm uppercase tracking-[0.08em] sm:w-auto sm:min-w-[285px] sm:px-6"
              >
                <span>{cta.primary}</span>
                <span aria-hidden="true">→</span>
              </Button>
            </div>

            <p className="mt-4 max-w-xl text-[0.68rem] font-bold uppercase leading-relaxed tracking-[0.12em] text-ink/55">
              START · palvelujaksot 1–3 · kuukausittain irtisanottava sovittujen ehtojen mukaisesti
            </p>
          </div>
        </div>

        <figure className="lg:col-span-5 xl:col-span-4">
          <div className="grid h-[178px] grid-cols-2 overflow-hidden border-2 border-ink sm:h-[250px] lg:h-full lg:min-h-[520px] lg:grid-cols-1">
            <div className="relative overflow-hidden bg-ink">
              <Image
                src="/hero-renovation-clean.svg"
                alt="Työmaalta syntyvää raakamateriaalia havainnollistava konseptikuva"
                fill
                priority
                sizes="(max-width: 1023px) 50vw, 34vw"
                className="object-cover grayscale contrast-125"
              />
              <span className="absolute left-3 top-3 bg-ink px-2 py-1 text-[0.58rem] font-black uppercase tracking-[0.14em] text-ghost">
                RAW / SISÄÄN
              </span>
            </div>

            <div className="relative overflow-hidden border-l-4 border-signal bg-bone lg:border-l-0 lg:border-t-4">
              <Image
                src="/finished-space.svg"
                alt="Valmista GhoulHouse-sisältöä havainnollistava konseptikuva"
                fill
                priority
                sizes="(max-width: 1023px) 50vw, 34vw"
                className="object-cover"
              />
              <span className="absolute right-3 top-3 bg-signal px-2 py-1 text-[0.58rem] font-black uppercase tracking-[0.14em] text-white">
                FINAL / ULOS
              </span>
            </div>
          </div>

          <figcaption className="mt-3 flex items-center justify-between gap-4 text-[0.58rem] font-bold uppercase tracking-[0.12em] text-ink/50">
            <span>Työmaamateriaali → valmis sisältö</span>
            <span className="shrink-0">Konsepti · ei asiakastyö</span>
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}
