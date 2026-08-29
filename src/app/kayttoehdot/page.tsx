import type { Metadata } from 'next';
import Container from '@/components/ui/Container';
import PageIntro from '@/components/ui/PageIntro';

export const metadata: Metadata = {
  title: 'Käyttöehdot — GhoulHouse',
  description: 'GhoulHouse-verkkosivuston yleiset käyttöehdot.',
  alternates: { canonical: '/kayttoehdot' },
};

export default function TermsPage() {
  return (
    <main id="main-content" className="min-h-screen bg-ghost">
      <PageIntro
        eyebrow="Legal"
        title="KÄYTTÖEHDOT"
        description="Nämä ehdot koskevat GhoulHouse-verkkosivuston käyttöä. Varsinaisen asiakaspalvelun kaupalliset ehdot sovitaan erillisessä asiakassopimuksessa."
      />
      <section className="border-b-2 border-ink py-12 md:py-16">
        <Container className="max-w-4xl">
          <div className="type-editorial space-y-6 text-ink/70">
            <p>Sivuston sisältö on yleistä palvelutietoa. Sivustolla esitetyt konseptiesimerkit eivät ole väitteitä toteutuneesta asiakastyöstä.</p>
            <p>Palvelun lopullinen sisältö, aikataulu, vastuut ja hinta määräytyvät asiakkaan kanssa hyväksytyn tarjouksen tai sopimuksen perusteella.</p>
            <p>Sivuston tekstit, tunnukset, logot ja muu brändimateriaali ovat oikeudenhaltijoidensa omaisuutta.</p>
          </div>
        </Container>
      </section>
    </main>
  );
}
