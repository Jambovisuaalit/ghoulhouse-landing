import type { Metadata } from 'next';
import Container from '@/components/ui/Container';
import PageIntro from '@/components/ui/PageIntro';

export const metadata: Metadata = {
  title: 'Evästeet — GhoulHouse',
  description: 'Tietoa GhoulHouse-sivuston teknisestä mittauksesta ja mahdollisista evästeistä.',
  alternates: { canonical: '/evasteet' },
};

export default function CookiesPage() {
  return (
    <main id="main-content" className="min-h-screen bg-ghost">
      <PageIntro
        eyebrow="Legal"
        title="EVÄSTEET JA TEKNINEN MITTAUS"
        description="Sivustolla käytetään vain toiminnan ja laadun kannalta tarpeellista teknistä mittausta. Markkinointievästeitä ei oteta käyttöön ilman erillistä arviointia ja tarvittavaa suostumusratkaisua."
      />
      <section className="border-b-2 border-ink py-12 md:py-16">
        <Container className="max-w-4xl">
          <div className="type-editorial space-y-6 text-ink/70">
            <p>Sivuston tekninen toteutus voi kerätä rajattua käyttö- ja suorituskykytietoa sivuston toiminnan, virheiden ja konversiopolun laadun seuraamiseksi.</p>
            <p>Jos sivustolle myöhemmin lisätään suostumusta edellyttäviä analytiikka- tai markkinointiteknologioita, suostumusmekanismi ja tämä seloste päivitetään ennen käyttöönottoa.</p>
          </div>
        </Container>
      </section>
    </main>
  );
}
