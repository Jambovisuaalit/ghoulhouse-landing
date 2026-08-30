import Container from '@/components/ui/Container';
import { contentExamples } from '@/data/landing';

export default function ContentExamples() {
  return (
    <section id="esimerkit" className="bg-black py-20 text-white md:py-28" aria-labelledby="examples-title">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="type-label text-signal">Sisältösuunnat</p>
            <h2 id="examples-title" className="type-section-title mt-4 max-w-[13ch] text-white">
              KUUSI TAPAA TEHDÄ TYÖSTÄ SISÄLTÖÄ.
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="concept-label">KONSEPTIESIMERKKI — EI ASIAKASTYÖ</p>
            <p className="type-editorial mt-4 text-white/65">
              Nämä ovat sisältökategorioita, eivät asiakkaan hyväksymiä julkaisuja tai toteutuneita tuloksia.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-px border border-white/25 bg-white/25 md:grid-cols-2 lg:grid-cols-3">
          {contentExamples.map((item) => (
            <article key={item.title} className="content-example">
              <p className="type-label text-signal">{item.eyebrow}</p>
              <h3 className="mt-8 font-display text-4xl uppercase leading-[0.9] tracking-[-0.03em]">
                {item.title}
              </h3>
              <p className="mt-5 max-w-[34ch] text-sm leading-6 text-white/65">{item.copy}</p>
              <div className="mt-10 border-t border-white/20 pt-4 text-xs font-extrabold uppercase tracking-[0.12em] text-white/45">
                Konseptisuunta / ei asiakastyö
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
