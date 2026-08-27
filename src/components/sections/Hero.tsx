import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';

interface HeroProps {
  onCtaClick: () => void;
}

export default function Hero({ onCtaClick }: HeroProps) {
  return (
    <section id="top" className="bg-white pb-16 pt-20 md:pb-24 md:pt-32">
      <Container>
        <div className="max-w-3xl">
          <h1 className="mb-6 text-ink">
            Työmaakuvat sisään.
            <br />
            <span className="text-signal">Valmis SOME ulos.</span>
          </h1>

          <p className="mb-8 max-w-2xl text-xl leading-relaxed text-ink/80">
            Teette hyvää työtä. Me pidämme huolen, että asiakkaat myös näkevät sen.
          </p>

          <div className="mb-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Button variant="primary" size="lg" onClick={onCtaClick}>
              Pyydä 2 sisältöesimerkkiä
            </Button>
            <div className="text-lg font-bold text-signal">
              490 €<span className="text-base font-normal text-ink/60"> + ALV / 30 päivää</span>
            </div>
          </div>

          <p className="text-sm text-ink/60">
            12 alkuperäistä sisältöä · Instagram + Facebook · kuukausittain irtisanottava
          </p>
        </div>
      </Container>
    </section>
  );
}
