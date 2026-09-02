import Container from '@/components/ui/Container';
import { offerExcludes, offerIncludes } from '@/data/landing';
import { siteConfig } from '@/config/site';

export default function Pricing() {
  return (
    <section id="hinta" className="bg-paper py-20 md:py-28" aria-labelledby="pricing-title">
      <Container>
        <div
          className="pricing-shell"
          data-offer-card
          data-offer-name={siteConfig.offer.name}
          data-offer-price={siteConfig.offer.price}
        >
          <div className="bg-black p-6 text-white md:p-10">
            <p className="type-label text-signal">Yksi paketti / 30 päivää</p>
            <h2 id="pricing-title" className="type-display mt-5 max-w-[8ch] text-white">
              GHOULHOUSE SOME 12
            </h2>
            <div className="mt-10 border-l-4 border-signal pl-5">
              <p className="font-display text-[clamp(3.2rem,7vw,6.7rem)] uppercase leading-[0.82] tracking-[-0.035em]">
                490 €
              </p>
              <p className="mt-3 type-label text-white/60">+ ALV / 30 PÄIVÄÄ</p>
            </div>
            <p className="mt-8 max-w-md text-sm font-semibold leading-6 text-white/70">
              Ensimmäiset 30 päivää 490 € + ALV. Ei sitoumusta jatkosta.
            </p>
            <a href="#laheta-kuvat" className="btn btn-primary mt-8 w-full md:w-auto md:min-w-[320px]">
              {siteConfig.cta.primary}
            </a>
          </div>

          <div className="grid bg-white lg:grid-cols-2">
            <div className="p-6 md:p-9">
              <p className="type-label text-signal">Sisältyy</p>
              <ul className="mt-6 border-t border-ink/20">
                {offerIncludes.map((item) => (
                  <li key={item} className="grid grid-cols-[28px_1fr] border-b border-ink/15 py-3 text-sm font-bold text-ink">
                    <span aria-hidden="true" className="text-signal">+</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-ink/20 p-6 md:p-9 lg:border-l lg:border-t-0">
              <p className="type-label text-signal">Ei sisälly</p>
              <ul className="mt-6 border-t border-ink/20">
                {offerExcludes.map((item) => (
                  <li key={item} className="grid grid-cols-[28px_1fr] border-b border-ink/15 py-3 text-sm font-bold text-ink">
                    <span aria-hidden="true" className="text-signal">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
