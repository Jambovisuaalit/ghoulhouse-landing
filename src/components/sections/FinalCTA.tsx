'use client';

type FinalCTAProps = {
  onCtaClick: () => void;
};

export default function FinalCTA({ onCtaClick }: FinalCTAProps) {
  return (
    <section className="bg-ink py-16 text-ghost sm:py-24" aria-labelledby="final-cta-title">
      <div className="container-wide grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-signal">Seuraava askel</p>
          <h2 id="final-cta-title" className="mt-4 max-w-4xl text-ghost">
            Näe ensin kaksi esimerkkiä omasta materiaalistanne.
          </h2>
          <p className="mt-5 max-w-2xl text-ghost/70">
            Ei pitkää PDF:ää eikä sitoumusta. Demo ensin, keskustelu sen jälkeen.
          </p>
        </div>
        <button type="button" className="btn btn-primary w-full lg:w-auto" onClick={onCtaClick}>
          Pyydä 2 sisältöesimerkkiä
        </button>
      </div>
    </section>
  );
}
