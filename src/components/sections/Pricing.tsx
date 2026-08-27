import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';
import { siteConfig } from '@/config/site';

interface PricingProps {
  onCtaClick: () => void;
}

export default function Pricing({ onCtaClick }: PricingProps) {
  const { start, managed } = siteConfig.offer;

  return (
    <section id="pricing" className="border-y-2 border-ink bg-ghost py-16 md:py-24">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-signal">
              Hinnoittelu / palvelun eteneminen
            </p>
            <h2 className="font-display text-[clamp(2.8rem,5vw,5.5rem)] font-black uppercase leading-[0.9] tracking-[-0.04em] text-ink">
              Yksi palvelu.
              <span className="block">Kaksi vaihetta.</span>
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-ink/70">
              Uusi asiakkuus alkaa START-jaksosta. Neljännestä palvelujaksosta
              eteenpäin palvelu jatkuu MANAGED-mallilla. Kyse ei ole kahdesta
              rinnakkaisesta tilauspaketista.
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="border-2 border-ink bg-ghost">
              <article className="grid gap-6 border-b-2 border-ink p-6 md:grid-cols-[180px_1fr] md:p-8">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-signal">
                    {start.lifecycle}
                  </p>
                  <h3 className="mt-2 font-display text-4xl font-black uppercase text-ink">
                    {start.name}
                  </h3>
                  <p className="mt-4 font-display text-4xl font-black leading-none text-signal">
                    {start.price} €
                  </p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-ink/60">
                    {start.vatLabel} / {start.period}
                  </p>
                </div>

                <div>
                  <ul className="grid gap-x-6 gap-y-2 text-sm text-ink/80 sm:grid-cols-2">
                    {start.includes.map((item) => (
                      <li key={item} className="border-t border-ink/15 pt-2">
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={onCtaClick}
                    className="mt-7 w-full uppercase tracking-[0.07em] sm:w-auto"
                  >
                    {siteConfig.cta.primary}
                  </Button>
                </div>
              </article>

              <div
                className="flex items-center justify-center bg-ink py-3 text-sm font-black uppercase tracking-[0.18em] text-ghost"
                aria-hidden="true"
              >
                03 <span className="mx-4 text-signal">→</span> 04
              </div>

              <article className="grid gap-6 bg-bone p-6 md:grid-cols-[180px_1fr] md:p-8">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink/60">
                    {managed.lifecycle}
                  </p>
                  <h3 className="mt-2 font-display text-4xl font-black uppercase text-ink">
                    {managed.name}
                  </h3>
                  <p className="mt-4 font-display text-4xl font-black leading-none text-ink">
                    {managed.price} €
                  </p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-ink/60">
                    {managed.vatLabel} / {managed.period}
                  </p>
                </div>

                <ul className="grid gap-x-6 gap-y-2 text-sm text-ink/80 sm:grid-cols-2">
                  {managed.includes.map((item) => (
                    <li key={item} className="border-t border-ink/20 pt-2">
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-ink/60">
              Palvelu ei sisällä tuloslupausta liideistä, myynnistä,
              seuraajamäärästä tai tavoittavuudesta.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
