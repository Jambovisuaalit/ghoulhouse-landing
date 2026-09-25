import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import '../proof.css';

export const metadata: Metadata = {
  title: 'Työnäytteet ja referenssit | GhoulHouse',
  description: 'Tutustu GhoulHousen julkaistuun omaan verkkosivutoteutukseen. Työnäyte on merkitty omaksi projektiksi, eikä sitä esitetä asiakasreferenssinä.',
  alternates: { canonical: '/referenssit' },
  openGraph: {
    title: 'Työnäytteet ja referenssit | GhoulHouse',
    description: 'Julkaistu oma verkkosivutoteutus ja sen todennettavat osat.',
    url: '/referenssit',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  robots: process.env.VERCEL_ENV === 'production'
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
};

export default function Page() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'GhoulHouse – työnäytteet ja referenssit',
    url: 'https://ghoulhouse.fi/referenssit',
    description: 'GhoulHousen julkaistu oma työnäyte.',
  };

  return (
    <main className="websitePage proofPage">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="websiteHero">
        <div className="contentShell proofIntro">
          <p className="kicker">TYÖNÄYTTEET / 01</p>
          <h1>Tehty työ näkyviin.</h1>
          <p>Alla on julkaistu oma toteutuksemme. Se näyttää rakenteen ja ilmeen käytännössä. Asiakkaan tuloksia tai palautetta emme väitä ilman varmennettua lupaa.</p>
        </div>
      </section>

      <section className="websiteSection" aria-labelledby="own-work-title">
        <div className="contentShell proofCase">
          <div className="proofCaseDetails">
            <p className="kicker">GH / OMA TOTEUTUS · JULKAISTU</p>
            <h2 id="own-work-title">GhoulHouse.fi</h2>
            <p className="proofCaseLead">Oma yrityssivusto, jossa verkkosivut, Social ja SEO on järjestetty palveluiksi, oppaiksi ja yhteydenottopoluksi.</p>
            <dl>
              <div><dt>Työn laji</dt><dd>Oma verkkosivutoteutus</dd></div>
              <div><dt>Näyttö</dt><dd>Julkaistu sivusto ja sivun kuvakaappaus</dd></div>
              <div><dt>Tila</dt><dd>Oma työnäyte — ei asiakasreferenssi</dd></div>
            </dl>
            <div className="heroActions">
              <a className="button button--signal" href="https://ghoulhouse.fi/" target="_blank" rel="noopener noreferrer">AVAA JULKAISTU SIVUSTO ↗</a>
              <Link className="textLink" href="/verkkosivut-yritykselle">Miten toteutamme verkkosivut →</Link>
            </div>
          </div>
          <figure className="proofCaseImage">
            <Image src="/ghoulhouse-site-proof.png" alt="Kuvakaappaus GhoulHousen julkaistun etusivun ylänäkymästä." width={1440} height={900} sizes="(max-width: 767px) 100vw, 55vw" />
            <figcaption>Kuvakaappaus omasta sivustosta. Avaa nykyinen versio yllä olevasta linkistä.</figcaption>
          </figure>
        </div>
      </section>

      <section className="websiteSection websiteSection--soft">
        <div className="contentShell proofNext">
          <div>
            <p className="kicker">SEURAAVA ASKEL</p>
            <h2>Haluatko näyttää yrityksesi työn yhtä selkeästi?</h2>
            <p>Kerro palveluistanne ja nykyisestä materiaalista. Rakennamme ehdotuksen niiden pohjalta.</p>
          </div>
          <Link className="button button--signal" href="/verkkosivut-yritykselle#yhteys">PYYDÄ EHDOTUS →</Link>
        </div>
      </section>
    </main>
  );
}
