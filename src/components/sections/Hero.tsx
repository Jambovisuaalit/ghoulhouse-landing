import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';

interface HeroProps {
  onCtaClick: () => void;
}

export default function Hero({ onCtaClick }: HeroProps) {
  return (
    <section className="bg-white pt-20 pb-16 md:pt-32 md:pb-24">
      <Container>
        <div className="max-w-3xl">
          <h1 className="text-ink mb-6">
            Työmaakuvat sisään.
            <br />
            <span className="text-signal">Valmis SOME ulos.</span>
          </h1>

          <p className="text-xl text-ink/80 mb-8 leading-relaxed max-w-2xl">
            Teette hyvää työtä. Me pidämme huolen, että asiakkaat myös näkevät sen.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-start mb-12">
            <Button variant="primary" size="lg" onClick={onCtaClick}>
              Pyydä 2 sisältöesimerkkiä
            </Button>
            <div className="text-lg font-bold text-signal">
              490 €<span className="text-ink/60 font-normal text-base"> + alv / kk</span>
            </div>
          </div>

          <p className="text-sm text-ink/60">
            Ensimmäisen 3 kuukauden alennushinnoilla. Sisältöä tuotettavaksi riittävä määrä työmaakuvia.
          </p>
        </div>
      </Container>
    </section>
  );
}
