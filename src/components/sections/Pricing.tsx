import Reveal from '@/components/ui/Reveal';

export default function Pricing() {
  return (
    <section id="pricing" className="bg-signal py-16 text-white sm:py-24" aria-labelledby="pricing-title">
      <div className="container-wide">
        <Reveal className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em]">Yksi paketti</p>
            <h2 id="pricing-title" className="mt-4 max-w-3xl text-white">12 sisältöä / 30 päivää</h2>
            <p className="mt-5 max-w-2xl text-white/85">
              Kuukausittain irtisanottava. Ei maksettua mainontaa, kuvauspäiviä, päivittäistä community managementia tai tulostakuuta.
            </p>
          </div>
          <div className="border-2 border-white p-6 sm:min-w-80 sm:p-8">
            <p className="text-5xl font-black tracking-tight">490 €</p>
            <p className="mt-1 font-semibold">+ ALV / 30 päivää</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
