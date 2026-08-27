import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';

interface FinalCTAProps {
  onCtaClick: () => void;
}

export default function FinalCTA({ onCtaClick }: FinalCTAProps) {
  return (
    <section className="bg-signal py-16 md:py-24">
      <Container>
        <div className="max-w-2xl">
          <h2 className="text-white mb-6">Haluatko nähdä, miltä sisältö voisi näyttää?</h2>
          <p className="text-white/90 text-lg mb-8 leading-relaxed">
            Lähetä lyhyt pyyntö. Saat kaksi yrityskohtaista konseptiesimerkkiä ilman maksuvelvoitetta.
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={onCtaClick}
            className="bg-white text-signal border-white hover:bg-ghost"
          >
            PYYDÄ 2 SISÄLTÖESIMERKKIÄ
          </Button>
        </div>
      </Container>
    </section>
  );
}
