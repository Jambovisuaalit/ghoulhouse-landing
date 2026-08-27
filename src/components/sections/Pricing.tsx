import Container from '@/components/ui/Container';

export default function Pricing() {
  return (
    <section id="pricing" className="bg-signal py-16 text-white md:py-24" aria-labelledby="pricing-title">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.14em]">GhoulHouse Some 12</p>
            <h2 id="pricing-title" className="text-white">
              12 sisältöä / 30 päivää
            </h2>
            <p className="mt-5 max-w-2xl text-white/85">
              Instagram + Facebook. Kuukausittain irtisanottava. Ei määräaikaista sopimusta.
            </p>
          </div>

          <div className="border-2 border-white p-6">
            <p className="text-5xl font-black leading-none">490 €</p>
            <p className="mt-2 font-semibold">+ ALV / 30 päivää</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
