import Container from '@/components/ui/Container';
import { problemItems, solutionItems } from '@/data/landing';

function VisualSystem() {
  return (
    <div className="content-system" aria-label="Hajanaiset työkuvat järjestetään kahdentoista sisällön järjestelmäksi">
      <div className="content-system__pile" aria-hidden="true">
        {[0, 1, 2, 3].map((item) => (
          <span key={item} className={`content-system__photo content-system__photo--${item + 1}`}>
            TYÖKUVA
          </span>
        ))}
      </div>
      <div className="content-system__arrow" aria-hidden="true">→</div>
      <div className="content-system__grid" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, index) => (
          <span key={index}>{String(index + 1).padStart(2, '0')}</span>
        ))}
      </div>
    </div>
  );
}

export default function ProblemSolution() {
  return (
    <section id="palvelu" className="bg-paper py-20 md:py-28" aria-labelledby="problem-solution-title">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="type-label text-signal">Ongelma / ratkaisu</p>
            <h2 id="problem-solution-title" className="type-section-title mt-4 max-w-[15ch] text-ink">
              HYVÄ TYÖ EI MYY, JOS SITÄ EI NÄYTETÄ.
            </h2>
          </div>
          <p className="type-editorial max-w-md text-muted lg:col-span-4">
            Työmailta syntyy jo materiaalia. Puuttuva osa on järjestelmä, joka muuttaa sen jatkuvaksi ja julkaisuvalmiiksi sisällöksi.
          </p>
        </div>

        <div className="mt-12 grid gap-px border border-ink bg-ink lg:grid-cols-2">
          <article className="bg-black p-6 text-white md:p-9">
            <p className="type-label text-signal">Ilman järjestelmää</p>
            <ol className="mt-8 space-y-0">
              {problemItems.map((item, index) => (
                <li key={item} className="grid grid-cols-[44px_1fr] border-t border-white/20 py-4">
                  <span className="type-label text-signal">{String(index + 1).padStart(2, '0')}</span>
                  <span className="font-bold">{item}</span>
                </li>
              ))}
            </ol>
          </article>

          <article className="bg-white p-6 md:p-9">
            <p className="type-label text-signal">GhoulHouse-järjestelmä</p>
            <ol className="mt-8">
              {solutionItems.map((item, index) => (
                <li key={item} className="grid grid-cols-[44px_1fr] border-t border-ink/20 py-4">
                  <span className="type-label text-signal">{String(index + 1).padStart(2, '0')}</span>
                  <span className="font-bold text-ink">{item}</span>
                </li>
              ))}
            </ol>
          </article>
        </div>

        <div className="mt-12">
          <VisualSystem />
        </div>
      </Container>
    </section>
  );
}
