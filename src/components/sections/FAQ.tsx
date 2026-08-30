import Container from '@/components/ui/Container';
import { faqItems as verifiedFaqItems } from '@/data/landing';

export const faqItems = verifiedFaqItems;

export default function FAQ() {
  return (
    <section
      id="faq"
      className="border-y border-ink bg-white py-16 md:py-28"
      aria-labelledby="faq-title"
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="type-label text-signal">Vastaväitteet / UKK</p>
            <h2 id="faq-title" className="type-section-title mt-4 max-w-[9ch] text-ink">
              KYSY ENNEN KUIN OSTAT.
            </h2>
          </div>
          <div className="border-t border-ink lg:col-span-8">
            {faqItems.map((item, index) => (
              <details key={item.question} className="group border-b border-ink/20">
                <summary className="grid cursor-pointer list-none grid-cols-[42px_1fr_auto] gap-4 py-5">
                  <span className="type-label text-signal">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="font-extrabold text-ink">{item.question}</span>
                  <span
                    aria-hidden="true"
                    className="text-2xl font-light transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="max-w-[66ch] pb-6 pl-[58px] text-sm leading-6 text-muted">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
