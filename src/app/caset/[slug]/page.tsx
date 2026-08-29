import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Container from '@/components/ui/Container';
import ContactTrigger from '@/components/contact/ContactTrigger';
import CaseViewAnalytics from '@/components/analytics/CaseViewAnalytics';
import { cases } from '@/content/cases';
import { siteConfig } from '@/config/site';

export function generateStaticParams() {
  return cases.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = cases.find((candidate) => candidate.slug === slug);

  if (!item) return {};

  return {
    title: `${item.title} — GhoulHouse`,
    description: item.summary,
    alternates: { canonical: `/caset/${item.slug}` },
  };
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = cases.find((candidate) => candidate.slug === slug);

  if (!item) notFound();

  return (
    <main id="main-content" className="min-h-screen bg-ghost">
      <CaseViewAnalytics slug={item.slug} />
      <section className="border-b-2 border-ink py-12 md:py-20">
        <Container>
          <p className="type-label text-signal">{item.status}</p>
          <h1 className="type-display mt-5 max-w-[13ch] text-ink">{item.title}</h1>
          <p className="type-editorial mt-7 max-w-2xl text-ink/70">{item.summary}</p>
        </Container>
      </section>

      <section className="border-b-2 border-ink py-12 md:py-16">
        <Container>
          <div className="grid overflow-hidden border-2 border-ink md:grid-cols-2">
            <figure className="relative aspect-[4/3] bg-ink">
              <Image
                src={item.beforeImage}
                alt="Konseptiesimerkin lähtökuva"
                fill
                sizes="(max-width: 767px) 100vw, 50vw"
                className="object-cover grayscale"
              />
              <figcaption className="absolute left-3 top-3 bg-ink px-3 py-2 type-label text-ghost">
                RAW
              </figcaption>
            </figure>
            <figure className="relative aspect-[4/3] border-t-4 border-signal bg-bone md:border-l-4 md:border-t-0">
              <Image
                src={item.afterImage}
                alt="Konseptiesimerkin valmis toteutus"
                fill
                sizes="(max-width: 767px) 100vw, 50vw"
                className="object-cover"
              />
              <figcaption className="absolute right-3 top-3 bg-signal px-3 py-2 type-label text-white">
                FINAL
              </figcaption>
            </figure>
          </div>

          <div className="mt-10 grid border-y-2 border-ink lg:grid-cols-3">
            {[
              ['Lähtötilanne', item.situation],
              ['Toteutus', item.implementation],
              ['Output', item.output],
            ].map(([label, value], index) => (
              <div
                key={label}
                className={`p-6 ${
                  index < 2
                    ? 'border-b border-ink/20 lg:border-b-0 lg:border-r'
                    : ''
                }`}
              >
                <p className="type-label text-signal">{label}</p>
                <p className="type-editorial mt-4 text-ink/70">{value}</p>
              </div>
            ))}
          </div>

          <ContactTrigger className="btn btn-primary mt-10">
            {siteConfig.cta.primary}
          </ContactTrigger>
        </Container>
      </section>
    </main>
  );
}
