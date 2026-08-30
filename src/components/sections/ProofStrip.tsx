import Container from '@/components/ui/Container';
import { proofItems } from '@/data/landing';

export default function ProofStrip() {
  return (
    <section className="border-y border-ink bg-paper" aria-label="Palvelun faktat">
      <Container className="py-0">
        <div className="proof-strip">
          {proofItems.map((item, index) => (
            <div className="proof-strip__item" key={item.label}>
              <span className="proof-strip__number">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <p className="type-label text-signal">{item.label}</p>
                <p className="mt-1 text-sm font-extrabold uppercase leading-tight text-ink md:text-base">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
