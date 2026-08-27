'use client';

import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';

interface FinalCTAProps {
  onCtaClick: () => void;
}

export default function FinalCTA({ onCtaClick }: FinalCTAProps) {
  return (
    <section className="bg-ink py-16 text-ghost md:py-24" aria-labelledby="final-cta-title">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-signal">Seuraava askel</p>
            <h2 id="final-cta-title" className="max-w-4xl text-ghost">
              Näe ensin kaksi esimerkkiä omasta materiaalistanne
            </h2>
            <p className="mt-5 max-w-2xl text-ghost/70">
              Ei pitkää PDF:ää eikä sitoumusta. Demo ensin, keskustelu sen jälkeen.
            </p>
          </div>

          <Button variant="primary" size="lg" onClick={onCtaClick} className="w-full lg:w-auto">
            Pyydä 2 sisältöesimerkkiä
          </Button>
        </div>
      </Container>
    </section>
  );
}
