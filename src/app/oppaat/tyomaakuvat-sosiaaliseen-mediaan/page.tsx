import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Työmaakuvat sosiaaliseen mediaan — kuvausohje yritykselle | GhoulHouse',
  description: 'Käytännön kuvausohje: miten työmaalta otetaan kuvia, joista voidaan rakentaa some- ja referenssisisältöä.',
  alternates: { canonical: '/oppaat/tyomaakuvat-sosiaaliseen-mediaan' },
  openGraph: { title: 'Työmaakuvat sosiaaliseen mediaan | GhoulHouse', description: 'Käytännön kuvausohje työmaakuvien hyödyntämiseen somessa.', url: '/oppaat/tyomaakuvat-sosiaaliseen-mediaan', type: 'article', images: [{ url: '/opengraph-image', width: 1200, height: 630 }] },
  robots: process.env.VERCEL_ENV === 'production' ? { index: true, follow: true } : { index: false, follow: false, nocache: true },
};

export default function Page() {
  const schema = { '@context':'https://schema.org', '@type':'Article', headline:'Työmaakuvat sosiaaliseen mediaan — kuvausohje yritykselle', description:metadata.description, url:'https://ghoulhouse.fi/oppaat/tyomaakuvat-sosiaaliseen-mediaan' };
  return <main className="websitePage">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}} />
    <section className="websiteHero"><div className="contentShell websiteHeroGrid"><div className="websiteHeroCopy">
      <p className="kicker">OPAS / KUVAUSOHJE</p>
      <h1>Työmaakuvat sosiaaliseen mediaan: kuvaa näin.</h1>
      <p className="websiteLead">Hyvä somekuva ei vaadi studiota. Se vaatii riittävän kontekstin: missä ollaan, mitä tehdään ja miltä lopputulos näyttää.</p>
    </div></div></section>
    <section className="websiteSection"><div className="contentShell websiteTwoCol">
      <div><p className="kicker">KUVAUSLISTA</p><h2>VIISI KUVAA SAMASTA KOHTEESTA.</h2></div>
      <ol className="seoSteps">{['Laaja kuva kohteesta','Lähtötilanne tai ennen-kuva','Työvaiheen yksityiskohta','Tekijä työssä','Valmis lopputulos'].map((x,i)=><li key={x}><span>{String(i+1).padStart(2,'0')}</span><p>{x}</p></li>)}</ol>
    </div></section>
    <section className="websiteSection websiteSection--soft"><div className="contentShell websiteTwoCol">
      <div><p className="kicker">FAKTAT</p><h2>KUVA EI YKSIN RIITÄ.</h2></div>
      <div className="websiteCopy"><p>Kirjaa kuvan yhteyteen vähintään kohde, työvaihe ja olennainen ratkaisu. Jos kyse on remontista, lisää esimerkiksi tilan käyttötarkoitus ja työn rajaus.</p><p>Faktat tarkistetaan ennen julkaisua. Näin sisältö pysyy yrityksen oikean työn mukaisena eikä markkinointiteksti keksi projektista asioita.</p></div>
    </div></section>
    <section className="websiteSection"><div className="contentShell websiteTwoCol">
      <div><p className="kicker">SEURAAVA ASKEL</p><h2>MUUTA KUVAT VALMIIKSI SISÄLLÖIKSI.</h2></div>
      <div className="websiteCopy"><div className="heroActions"><Link className="button button--signal" href="/some-sisallontuotanto/hinta">SOME 12 / HINTA →</Link><Link className="textLink" href="/saneerausyrityksille">SANEERAUSYRITYKSILLE →</Link><Link className="textLink" href="/referenssit">KATSO REFERENSSIHUB →</Link></div></div>
    </div></section>
  </main>;
}
