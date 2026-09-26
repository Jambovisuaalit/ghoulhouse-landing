import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import '../../proof.css';

export const metadata: Metadata = {
  title: 'GhoulHouse.fi – oman verkkosivuston toteutusesittely | GhoulHouse',
  description: 'GhoulHousen oman verkkosivuston rakenteen, sisältöjen ja yhteydenottopolun toteutusesittely. Oma projekti, ei asiakasreferenssi tai tulosväite.',
  alternates: { canonical: '/tyot/ghoulhouse-verkkosivut' },
  openGraph: {
    title: 'Oma verkkosivutoteutus – GhoulHouse.fi',
    description: 'Mitä GhoulHousen omalle sivustolle rakennettiin ja miksi.',
    url: '/tyot/ghoulhouse-verkkosivut',
    type: 'article',
  },
  robots: process.env.VERCEL_ENV === 'production'
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
};

const delivered = [
  ['01', 'Palvelurakenne', 'Verkkosivujen, sosiaalisen median sisällöntuotannon ja SEO:n erilliset palvelupolut.'],
  ['02', 'Työnäyte ja sisältö', 'Selkeästi omaksi työksi merkitty toteutus sekä käytännön oppaat ja toimialakohtaiset sivut.'],
  ['03', 'Yhteydenotto', 'Palvelun valinnan sisältävä tarjouspyyntölomake ja palvelukohtaiset vahvistussivut.'],
  ['04', 'Tekninen perusta', 'Responsiivinen käyttöliittymä, sivukohtaiset metatiedot, sisäinen linkitys ja sivustokartta.'],
] as const;

export default function GhoulHouseCasePage() {
  return (
    <main className="websitePage proofPage proofDetail">
      <section className="websiteHero proofDetailHero">
        <div className="contentShell">
          <Link className="proofBackLink" href="/referenssit">← Kaikki työnäytteet</Link>
          <p className="kicker">GH / 001 · OMA TOTEUTUS</p>
          <h1>GhoulHouse.fi: työn näyttämisen rakenne.</h1>
          <p className="proofDetailLead">Oman yrityksemme julkaistu verkkosivusto. Tällä sivulla avaamme, mitä sivustolle rakennettiin ja mitä esimerkki todellisuudessa osoittaa.</p>
          <p className="proofTruthTag">Oma verkkosivutoteutus — ei asiakasreferenssi, asiakaspalaute eikä tulosväite.</p>
        </div>
      </section>

      <section className="websiteSection" aria-labelledby="case-challenge">
        <div className="contentShell proofDetailIntro">
          <div><p className="kicker">01 / TAVOITE</p><h2 id="case-challenge">Palveluista ymmärrettävä kokonaisuus.</h2></div>
          <div>
            <p>Sivuston tehtävänä on kertoa, mitä GhoulHouse tekee, näyttää omaa toteutustapaa ja ohjata kävijä oikean palvelun yhteydenottopolkuun. Se ei ole näyttö asiakkaalle tuotetusta liiketoimintatuloksesta.</p>
            <p>Rakenteessa erotimme verkkosivut, sisällöntuotannon ja hakukonenäkyvyyden sekä liitimme niihin työnäytteet, oppaat ja tarjouspyynnön.</p>
          </div>
        </div>
      </section>

      <section className="websiteSection proofDetailVisual" aria-labelledby="case-visual">
        <div className="contentShell">
          <div className="proofDetailVisualHeading"><p className="kicker">02 / JULKAISTU OMA TYÖ</p><h2 id="case-visual">Rakenteesta sivuksi.</h2></div>
          <figure className="proofDetailScreenshot">
            <Image src="/ghoulhouse-site-proof.png" alt="Kuvakaappaus GhoulHousen aiemmin julkaistun etusivun taitosta." width={1440} height={900} sizes="(max-width: 767px) 100vw, 1200px" />
            <figcaption>Dokumentoitu oman etusivumme aiempi julkaisuversio. Nykyinen sivusto on tämän jälkeen uudistunut; kuva ei esitä nykyistä etusivua.</figcaption>
          </figure>
          <div className="proofDetailFlow" aria-label="Julkaistun sivuston käyttäjäpolku">
            <span>PALVELU</span><span aria-hidden="true">→</span><span>TYÖNÄYTE JA TIETO</span><span aria-hidden="true">→</span><span>YHTEYDENOTTO</span>
          </div>
        </div>
      </section>

      <section className="websiteSection" aria-labelledby="case-delivered">
        <div className="contentShell">
          <div className="proofDetailVisualHeading"><p className="kicker">03 / TOIMITUSSISÄLTÖ</p><h2 id="case-delivered">Mitä rakensimme.</h2></div>
          <ol className="proofDeliverables">
            {delivered.map(([number, title, description]) => (
              <li key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="websiteSection proofDetailNext" aria-labelledby="case-next">
        <div className="contentShell proofNext">
          <div>
            <p className="kicker">04 / SEURAAVA ASKEL</p>
            <h2 id="case-next">Millainen rakenne teidän yrityksellenne?</h2>
            <p>Kerrotte palveluistanne ja olemassa olevasta materiaalista. Ehdotamme tilanteeseenne rajattua toteutusta ilman keksittyjä referenssejä tai tuloslupauksia.</p>
          </div>
          <div className="proofDetailActions">
            <Link className="button button--signal" href="/verkkosivut-yritykselle#yhteys">Pyydä oma ehdotus ↗</Link>
            <Link className="textLink" href="/">Katso nykyinen etusivu →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
