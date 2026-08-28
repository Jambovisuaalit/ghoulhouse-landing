import Image from 'next/image';
import Container from '@/components/ui/Container';
import ContactTrigger from '@/components/contact/ContactTrigger';
import { siteConfig } from '@/config/site';

export default function Hero() {
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
            <p className="type-label text-signal">12 sisältöä / 30 päivää · Instagram + Facebook</p>
            <h1 id="hero-title" className="type-display mt-5 max-w-[13ch] text-ink">
              <span className="block">{positioning.headline[0]}</span>
              <span className="mt-[0.08em] block text-signal">{positioning.headline[1]}</span>
            </h1>
            <p className="type-editorial mt-6 text-ink/80 sm:mt-8 lg:max-w-xl">
              <strong className="font-black text-ink">{positioning.supporting[0]}</strong>{' '}
              {positioning.supporting[1]}
            </p>
          </div>

          <div className="mt-8 sm:mt-10 lg:mt-12">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:gap-7 lg:gap-9">
              <div className="border-l-4 border-signal pl-4">
                <p className="type-price text-ink">{offer.start.price} € {offer.start.vatLabel}</p>
                <p className="type-label mt-1 text-ink/60">/ {offer.start.period}</p>
              </div>
              <ContactTrigger className="btn btn-primary min-h-14 w-full justify-between px-5 text-left sm:w-auto sm:min-w-[285px] sm:px-6">
                <span>{cta.primary}</span><span aria-hidden="true">→</span>
              </ContactTrigger>
            </div>
            <p className="type-caption mt-4 max-w-xl uppercase tracking-[0.08em] text-ink/60">
              START · palvelujaksot 1–3 · kuukausittain irtisanottava sovittujen ehtojen mukaisesti
            </p>
          </div>
        </div>

        <figure className="lg:col-span-5 xl:col-span-4">
          <div className="grid h-[178px] grid-cols-2 overflow-hidden border-2 border-ink sm:h-[250px] lg:h-full lg:min-h-[520px] lg:grid-cols-1">
            <div className="relative overflow-hidden bg-ink">
              <Image src="/hero-renovation-clean.svg" alt="Työmaalta syntyvää raakamateriaalia havainnollistava konseptikuva" fill priority sizes="(max-width: 1023px) 50vw, 34vw" className="object-cover grayscale contrast-125" />
              <span className="absolute left-3 top-3 bg-ink px-2 py-1 type-label text-ghost">RAW / SISÄÄN</span>
            </div>
            <div className="relative overflow-hidden border-l-4 border-signal bg-bone lg:border-l-0 lg:border-t-4">
              <Image src="/finished-space.svg" alt="Valmista GhoulHouse-sisältöä havainnollistava konseptikuva" fill priority sizes="(max-width: 1023px) 50vw, 34vw" className="object-cover" />
              <span className="absolute right-3 top-3 bg-signal px-2 py-1 type-label text-white">FINAL / ULOS</span>
            </div>
          </div>
          <figcaption className="type-caption mt-3 flex items-center justify-between gap-4 uppercase tracking-[0.06em] text-ink/60">
            <span>Työmaamateriaali → valmis sisältö</span>
            <span className="shrink-0">Konsepti · ei asiakastyö</span>
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}
