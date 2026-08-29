import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import PageIntro from '@/components/ui/PageIntro';
import { cases } from '@/content/cases';

export const metadata: Metadata = {
  title: 'Caset — GhoulHouse',
  description:
    'GhoulHouse proof library. Konseptimateriaali merkitään aina selvästi eikä sitä esitetä asiakastyönä.',
  alternates: { canonical: '/caset' },
};

export default function CasesPage() {
  return (
    <main id="main-content" className="min-h-screen bg-ghost">
      <PageIntro
        eyebrow="Proof library"
        title="NÄYTÄ TYÖ. ÄLÄ SELITÄ SITÄ LIIKAA."
        description="Oikea asiakastyö on aina proof-järjestyksen kärjessä. Kun käytössä on vain konseptimateriaalia, se merkitään näkyvästi."
      />

      <section className="border-b-2 border-ink py-12 md:py-16">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            {cases.map((item) => (
              <article key={item.slug} className="border-2 border-ink bg-white">
                <div className="relative aspect-[4/3] overflow-hidden border-b-2 border-ink bg-bone">
                  <Image
                    src={item.afterImage}
                    alt="GhoulHouse-konseptiesimerkkiä havainnollistava kuva"
                    fill
                    sizes="(max-width: 1023px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <p className="type-label text-signal">{item.status}</p>
                  <h2 className="mt-4 text-3xl font-extrabold uppercase leading-[0.95] tracking-[-0.03em] text-ink">
                    {item.title}
                  </h2>
                  <p className="type-editorial mt-4 text-ink/70">{item.summary}</p>
                  <Link href={`/caset/${item.slug}`} className="btn btn-secondary mt-7">
                    Avaa case
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
