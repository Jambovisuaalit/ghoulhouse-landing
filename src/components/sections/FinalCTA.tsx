import Container from '@/components/ui/Container';
import LeadForm from '@/components/contact/LeadForm';

export default function FinalCTA() {
  return (
    <section
      id="laheta-kuvat"
      className="hero-surface scroll-mt-6 bg-black py-16 text-white md:py-24"
      aria-labelledby="final-cta-title"
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-6">
            <p className="type-label text-signal">Kaksi maksutonta sisältöesimerkkiä</p>
            <h2 id="final-cta-title" className="type-display final-title mt-5 text-white">
              NÄE OMA TYÖSI
              <span className="block text-signal">VALMIINA JULKAISUNA.</span>
            </h2>
            <p className="type-editorial mt-6 max-w-xl text-white/70">
              Lähetä yrityksesi perustiedot. Sovimme vastausviestissä kahden työkuvan toimitustavan ja teemme niistä kaksi GhoulHouse-konseptiesimerkkiä.
            </p>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.09em] text-white/50">
              Konseptiesimerkit eivät sido jatkoon.
            </p>
          </div>

          <div className="lg:col-span-6">
            <LeadForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
