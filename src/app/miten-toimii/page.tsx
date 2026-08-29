import type { Metadata } from 'next';
import Container from '@/components/ui/Container';
import PageIntro from '@/components/ui/PageIntro';

export const metadata: Metadata = {
  title: 'Miten GhoulHouse toimii',
  description:
    'Content Engine on aktiivinen. Acquisition Engine on arkkitehtuurissa valmiina myöhempää Performance-pilottia varten.',
  alternates: { canonical: '/miten-toimii' },
};

const contentSteps = ['Materiaalit', 'Suunnittelu', 'Tuotanto', 'Hyväksyntä', 'Julkaisu'] as const;
const acquisitionSteps = ['Mainos', 'Lead', 'AI speed-to-lead', 'Qualification', 'Booking', 'CRM', 'Kauppa'] as const;

export default function HowItWorksPage() {
  return (
    <main id="main-content" className="min-h-screen bg-ghost">
      <PageIntro
        eyebrow="Miten toimii"
        title="KAKSI JÄRJESTELMÄÄ. VAIN TOINEN ON NYT AKTIIVINEN."
        description="Content Engine toimittaa SOME 12 -palvelun. Acquisition Engine pidetään arkkitehtuurissa valmiina, mutta sitä ei myydä ennen proof-gateja."
      />
      <section className="border-b-2 border-ink py-12 md:py-16">
        <Container className="grid gap-8 lg:grid-cols-2">
          <article className="border-2 border-ink bg-white p-6">
            <p className="type-label text-signal">Aktiivinen · Content Engine</p>
            <ol className="mt-6">
              {contentSteps.map((step, index) => (
                <li key={step} className="grid grid-cols-[52px_1fr] border-t border-ink/20 py-4 first:border-t-2 first:border-ink">
                  <span className="type-label text-signal">{String(index + 1).padStart(2, '0')}</span>
                  <span className="type-ui uppercase text-ink">{step}</span>
                </li>
              ))}
            </ol>
          </article>
          <article className="border-2 border-ink bg-bone p-6">
            <p className="type-label text-ink/60">Roadmap · Acquisition Engine</p>
            <ol className="mt-6">
              {acquisitionSteps.map((step, index) => (
                <li key={step} className="grid grid-cols-[52px_1fr] border-t border-ink/20 py-4 first:border-t-2 first:border-ink">
                  <span className="type-label text-signal">{String(index + 1).padStart(2, '0')}</span>
                  <span className="type-ui uppercase text-ink">{step}</span>
                </li>
              ))}
            </ol>
          </article>
        </Container>
      </section>
    </main>
  );
}
