import type { Metadata } from 'next';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import PageIntro from '@/components/ui/PageIntro';

export const metadata: Metadata = {
  title: 'Palvelut — GhoulHouse',
  description:
    'GhoulHouse Some 12 on aktiivinen tuotteistettu sisältöpalvelu. Performance rakennetaan vasta proof-gatejen jälkeen.',
  alternates: { canonical: '/palvelut' },
};

export default function ServicesPage() {
  return (
    <main id="main-content" className="min-h-screen bg-ghost">
      <PageIntro
        eyebrow="Palvelut"
        title="YKSI AKTIIVINEN TUOTE. SEURAAVA VASTA PROOFIN JÄLKEEN."
        description="GhoulHouse pitää palveluvalikoiman tarkoituksella kapeana. SOME 12 on aktiivinen. Performance / Lead Generation ei ole vielä kaupallisesti avoin."
      />
      <section className="border-b-2 border-ink py-12 md:py-16">
        <Container className="grid gap-6 lg:grid-cols-2">
          <article className="border-2 border-ink bg-white p-6 md:p-8">
            <p className="type-label text-signal">Aktiivinen</p>
            <h2 className="type-section-title mt-4 uppercase text-ink">Some 12</h2>
            <p className="type-editorial mt-5 text-ink/70">
              12 alkuperäistä sisältöä / 30 päivää. Instagram + Facebook. 490 € + ALV.
            </p>
            <Link href="/some-12" className="btn btn-primary mt-8">
              Tutustu Some 12 -palveluun
            </Link>
          </article>
          <article className="border-2 border-ink bg-bone p-6 md:p-8">
            <p className="type-label text-ink/60">Roadmap · ei vielä myynnissä</p>
            <h2 className="type-section-title mt-4 uppercase text-ink">Performance</h2>
            <p className="type-editorial mt-5 text-ink/70">
              Mainos → lead → AI speed-to-lead → qualification → booking → CRM.
              Palvelu aktivoidaan vasta, kun offer, tracking, lead delivery ja qualification flow ovat toimivia.
            </p>
          </article>
        </Container>
      </section>
    </main>
  );
}
