import type { Metadata } from 'next';
import Container from '@/components/ui/Container';
import PageIntro from '@/components/ui/PageIntro';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Meistä — GhoulHouse',
  description:
    'GhoulHouse on omistajavetoinen, tuotteistettu sisältöpalvelu. Hanna Nyholm vastaa palvelun toteutuksesta ja asiakasviestinnästä.',
  alternates: { canonical: '/meista' },
};

export default function AboutPage() {
  return (
    <main id="main-content" className="min-h-screen bg-ghost">
      <PageIntro
        eyebrow="Founder-led"
        title="HYVÄ TYÖ EI SAA JÄÄDÄ NÄKYMÄTTÖMÄKSI."
        description="GhoulHouse rakennetaan tuotteistettuna palveluna: selkeä input, selkeä output ja mahdollisimman vähän turhaa kitkaa asiakkaalle."
      />
      <section className="border-b-2 border-ink py-12 md:py-16">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="type-label text-signal">Founder</p>
            <h2 className="type-section-title mt-4 uppercase text-ink">{siteConfig.company.founder}</h2>
            <p className="type-caption mt-4 uppercase tracking-[0.08em] text-ink/60">
              {siteConfig.company.legalName} · Helsinki
            </p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <p className="type-editorial font-semibold text-ink">
              Hanna vastaa GhoulHousen palvelun toteutuksesta ja asiakasviestinnästä.
            </p>
            <p className="type-editorial mt-5 text-ink/70">
              Palvelu ei perustu raskaisiin kuvauspäiviin tai geneeriseen agency-prosessiin. Lähtökohta on asiakkaan omassa työssä jo syntyvä materiaali.
            </p>
          </div>
        </Container>
      </section>
    </main>
  );
}
