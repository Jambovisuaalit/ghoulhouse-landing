import Image from 'next/image';
import Container from '@/components/ui/Container';
import ContactTrigger from '@/components/contact/ContactTrigger';
import { siteConfig } from '@/config/site';

const worksitePhoto =
  'https://images.unsplash.com/photo-1768321917661-d4f1a89d2185?auto=format&fit=crop&fm=jpg&q=85&w=1800';

export default function Hero() {
  const { positioning, offer, cta } = siteConfig;

  return (
    <section
      id="top"
      className="overflow-hidden border-b border-ink bg-ghost"
      aria-labelledby="hero-title"
    >
      <Container className="grid grid-cols-1 gap-8 py-7 sm:gap-10 sm:py-10 min-[1100px]:min-h-[calc(100svh-69px)] min-[1100px]:grid-cols-12 min-[1100px]:gap-12 min-[1100px]:py-12">
        <div className="flex flex-col justify-between min-[1100px]:col-span-7 xl:col-span-8">
          <div>
            <p className="type-label text-signal">
              12 sisältöä / 30 päivää · Instagram + Facebook
            </p>
            <h1 id="hero-title" className="type-display mt-5 max-w-[13ch] text-ink">
              <span className="block">{positioning.headline[0]}</span>
              <span className="mt-[0.08em] block text-signal">
                {positioning.headline[1]}
              </span>
            </h1>

            <div className="mt-7 max-w-2xl sm:mt-9">
              <p className="font-editorial-accent text-[clamp(1.75rem,3vw,2.55rem)] leading-[1.02] text-ink">
                {positioning.supporting[0]}
              </p>
              <p className="type-editorial mt-2 max-w-xl text-ink/70">
                {positioning.supporting[1]}
              </p>
            </div>
          </div>

          <div className="mt-9 sm:mt-11 min-[1100px]:mt-14">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:gap-8">
              <div className="border-l-[3px] border-signal pl-4">
                <p className="type-price text-ink">
                  {offer.start.price} € {offer.start.vatLabel}
                </p>
                <p className="type-label mt-1 text-ink/60">/ {offer.start.period}</p>
              </div>
              <ContactTrigger className="btn btn-primary min-h-14 w-full justify-between px-5 text-left sm:w-auto sm:min-w-[285px] sm:px-6">
                <span>{cta.primary}</span>
                <span aria-hidden="true">→</span>
              </ContactTrigger>
            </div>
            <p className="type-caption mt-4 max-w-xl uppercase tracking-[0.08em] text-ink/60">
              SOME 12 · 30 päivän palvelujakso · kuukausittain irtisanottava
              sovittujen ehtojen mukaisesti
            </p>
          </div>
        </div>

        <figure className="min-[1100px]:col-span-5 xl:col-span-4">
          <div className="grid h-[230px] grid-cols-2 overflow-hidden border border-ink/35 bg-bone sm:h-[320px] min-[1100px]:h-full min-[1100px]:min-h-[540px] min-[1100px]:grid-cols-1">
            <div className="relative overflow-hidden bg-ink">
              <Image
                src={worksitePhoto}
                alt="Remonttikohteen aitoa työmaamateriaalia havainnollistava valokuva"
                fill
                priority
                sizes="(max-width: 1099px) 50vw, 34vw"
                className="object-cover grayscale contrast-125"
              />
              <span className="absolute left-3 top-3 bg-ink px-2 py-1 type-label text-ghost">
                RAAKA MATERIAALI
              </span>
            </div>

            <div className="relative overflow-hidden border-l border-signal/70 bg-bone min-[1100px]:border-l-0 min-[1100px]:border-t">
              <Image
                src={worksitePhoto}
                alt="Sama remonttikuva viimeisteltynä GhoulHouse-konseptijulkaisun osaksi"
                fill
                sizes="(max-width: 1099px) 50vw, 34vw"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-ghost/95 p-3 sm:p-4">
                <span className="type-label text-signal">VALMIS JULKAISU</span>
                <p className="mt-2 text-sm font-black uppercase leading-tight tracking-[-0.02em] text-ink sm:text-lg">
                  Pohjatyö ratkaisee lopputuloksen.
                </p>
              </div>
            </div>
          </div>
          <figcaption className="type-caption mt-3 flex flex-col gap-1 text-ink/60 sm:flex-row sm:items-center sm:justify-between">
            <span>Oikea remonttivalokuva → sisältökonsepti</span>
            <span>Stock-referenssi · ei asiakastyö</span>
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}
