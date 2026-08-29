import type { Metadata } from 'next';
import Container from '@/components/ui/Container';
import PageIntro from '@/components/ui/PageIntro';

export const metadata: Metadata = {
  title: 'Kylpyhuoneremontit — Performance Pilot — GhoulHouse',
  description:
    'GhoulHouse Performance Pilot -arkkitehtuurin niche landing page. Pilotti ei ole vielä kaupallisesti avoin.',
  alternates: { canonical: '/kylpyhuoneremontit' },
  robots: { index: false, follow: false },
};

const funnel = ['Mainos', 'Lead', 'AI speed-to-lead', 'Qualification', 'Booking', 'Arviokäynti', 'Tarjous', 'Kauppa'] as const;

export default function BathroomPerformancePage() {
  return (
    <main id="main-content" className="min-h-screen bg-ghost">
      <PageIntro
        eyebrow="Performance MVP · ei vielä kaupallisesti avoin"
        title="KYLPYHUONEREMONTIT — ACQUISITION FUNNEL."
        description="Reitti on rakennettu valmiiksi Performance-pilottia varten, mutta sitä ei aktivoida myyntiin ennen offer-, tracking-, lead-delivery- ja qualification-gatejen läpäisyä."
      />
      <section className="border-b-2 border-ink py-12 md:py-16">
        <Container>
          <ol className="grid border-2 border-ink sm:grid-cols-2 lg:grid-cols-4">
            {funnel.map((step, index) => (
              <li key={step} className="border-b border-r border-ink/20 p-5">
                <p className="type-label text-signal">{String(index + 1).padStart(2, '0')}</p>
                <p className="type-ui mt-3 uppercase text-ink">{step}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 border-2 border-signal bg-white p-6">
            <p className="type-label text-signal">Gate</p>
            <p className="type-editorial mt-3 font-semibold text-ink">
              Pilotti ei ole avoin. CTA “HAE PILOTTIIN” aktivoidaan vasta, kun koko lead-polku on todistettu päästä päähän.
            </p>
          </div>
        </Container>
      </section>
    </main>
  );
}
