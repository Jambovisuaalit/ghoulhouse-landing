import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Verkkosivut itse vai ammattilaiselta? | GhoulHouse',
  description: 'Milloin yrityksen verkkosivut kannattaa tehdä itse ja milloin ulkoistaa? Käytännön tarkistuslista rakenteesta, sisällöstä, SEO:sta ja julkaisemisesta.',
  alternates: { canonical: '/oppaat/verkkosivut-itse-vai-ammattilaiselta' },
  openGraph: {
    title: 'Verkkosivut itse vai ammattilaiselta? | GhoulHouse',
    description: 'Käytännön tarkistuslista yrityksen verkkosivuprojektin päätökseen.',
    url: '/oppaat/verkkosivut-itse-vai-ammattilaiselta',
    type: 'article',
  },
  robots: process.env.VERCEL_ENV === 'production' ? { index: true, follow: true } : { index: false, follow: false, nocache: true },
};

const checks = [
  ['Tee itse', 'Yrityksen palvelut ovat selkeitä, sisältöä syntyy omasta takaa ja joku pystyy käyttämään projektin toteutukseen aikaa.'],
  ['Hanki apua', 'Palvelut ovat vaikeasti hahmotettavia, referenssimateriaalia on paljon tai sivuston pitäisi toimia aktiivisena myyntikanavana.'],
  ['Ulkoista toteutus', 'Kun rakenne, copy, tekninen toteutus, SEO ja julkaisu pitää saada yhdeksi kokonaisuudeksi ilman että työ jää yrittäjän sivuprojektiksi.'],
];

export default function Page() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Verkkosivut itse vai ammattilaiselta?',
    description: 'Käytännön tarkistuslista yrityksen verkkosivuprojektin päätökseen.',
    image: 'https://ghoulhouse.fi/opengraph-image',
    datePublished: '2026-09-18',
    dateModified: '2026-09-19',
    author: { '@id': 'https://ghoulhouse.fi/#organization' },
    publisher: { '@id': 'https://ghoulhouse.fi/#organization' },
    mainEntityOfPage: 'https://ghoulhouse.fi/oppaat/verkkosivut-itse-vai-ammattilaiselta',
  };
  return (
    <main className="websitePage">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="websiteHero">
        <div className="contentShell websiteHeroGrid">
          <div className="websiteHeroCopy">
            <p className="kicker">OPAS / VERKKOSIVUT</p>
            <h1>Verkkosivut itse vai ammattilaiselta?</h1>
            <p className="websiteLead">Päätös kannattaa tehdä työn määrän, osaamisen ja tavoitteen perusteella — ei sen perusteella, näyttääkö ensimmäinen template hyvältä.</p>
            <div className="heroActions">
              <Link className="button button--signal" href="/verkkosivut-yritykselle">VERKKOSIVUT YRITYKSELLE →</Link>
              <Link className="textLink" href="/verkkosivut/hinta">Katso verkkosivujen hinta</Link>
            </div>
          </div>
        </div>
      </section>
      <section className="websiteSection">
        <div className="contentShell websiteTwoCol">
          <div><p className="kicker">ENSIMMÄINEN KYSYMYS</p><h2>MITÄ SIVUSTON PITÄÄ SAADA AIKAAN?</h2></div>
          <div className="websiteCopy">
            <p>Jos sivuston tehtävä on vain kertoa yrityksen olemassaolosta, kevyt itse tehty sivusto voi riittää. Jos sen pitää auttaa asiakasta vertailemaan palveluita, nähdä työn näyttö ja ottaa yhteyttä, rakenne vaatii enemmän suunnittelua.</p>
            <p>Työ kannattaa jakaa kolmeen osaan: sisältö, rakenne ja tekninen toteutus. Jos jokainen osa onnistuu yrityksen omilla resursseilla, ulkoistamiselle ei ole automaattista tarvetta.</p>
          </div>
        </div>
      </section>
      <section className="websiteSection websiteSection--dark">
        <div className="contentShell">
          <div className="sectionIntro"><p className="kicker kicker--inverse">TARKISTUSLISTA</p><div><h2>KOLME TILANNETTA.</h2></div></div>
          <div className="websiteCards">
            {checks.map(([title,copy],i)=><article key={title}><span>{String(i+1).padStart(2,'0')}</span><h3>{title}</h3><p>{copy}</p></article>)}
          </div>
        </div>
      </section>
      <section className="websiteSection">
        <div className="contentShell websiteTwoCol">
          <div><p className="kicker">MINIMITASO</p><h2>ÄLÄ JULKAISE ENNEN KUIN NÄMÄ OVAT KUNNOSSA.</h2></div>
          <div className="websiteProofList">
            {['Yksi selkeä H1, joka kertoo mitä yritys tekee.', 'Jokaiselle tärkeälle palvelulle oma ymmärrettävä paikka.', 'Oikeat referenssit ja projektifaktat.', 'Yksi selkeä CTA ja toimiva yhteydenottopolku.', 'Title, meta description, canonical ja sitemap.', 'Mobiilinäkymä, nopeus ja lomakkeen toimivuus tarkistettu.'].map((x,i)=><div key={x}><span>{String(i+1).padStart(2,'0')}</span><p>{x}</p></div>)}
          </div>
        </div>
      </section>
      <section className="websiteSection websiteSection--soft">
        <div className="contentShell websiteTwoCol">
          <div><p className="kicker">SEURAAVA ASKEL</p><h2>VERTAA RAKENNETTA, EI PELKKÄÄ HINTAA.</h2></div>
          <div className="websiteCopy">
            <p>Jos haluat arvioida projektia ennen toteutusta, katso mitä hintaan sisältyy: rakenne, sisältö, referenssit, tekninen toteutus, SEO ja julkaisu.</p>
            <Link className="button button--signal" href="/verkkosivut/hinta">VERKKOSIVUJEN HINTA →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
