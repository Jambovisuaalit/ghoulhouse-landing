import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Rakennusyrityksen some: mitä työmaakuvista kannattaa julkaista? | GhoulHouse',
  description: 'Opas rakennusyritykselle: miten työmaa-, valmis kohde- ja prosessikuvista rakennetaan jatkuvaa some-sisältöä.',
  alternates: { canonical: '/oppaat/rakennusyrityksen-some' },
  openGraph: { title: 'Rakennusyrityksen some | GhoulHouse', description: 'Miten työmaakuvista rakennetaan jatkuvaa some-sisältöä.', url: '/oppaat/rakennusyrityksen-some', type: 'article', images: [{ url: '/opengraph-image', width: 1200, height: 630 }] },
  robots: process.env.VERCEL_ENV === 'production' ? { index: true, follow: true } : { index: false, follow: false, nocache: true },
};

export default function Page() {
  const schema = { '@context':'https://schema.org', '@type':'Article', headline:'Rakennusyrityksen some: mitä työmaakuvista kannattaa julkaista?', description:metadata.description, url:'https://ghoulhouse.fi/oppaat/rakennusyrityksen-some' };
  return <main className="websitePage">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}} />
    <section className="websiteHero"><div className="contentShell websiteHeroGrid"><div className="websiteHeroCopy">
      <p className="kicker">OPAS / RAKENNUSALA</p>
      <h1>Rakennusyrityksen some alkaa työstä, ei sisältöideoista.</h1>
      <p className="websiteLead">Kun työmaalta syntyy kuvia jatkuvasti, ongelma ei yleensä ole materiaalin puute. Ongelma on se, ettei materiaali muutu julkaisuiksi.</p>
    </div></div></section>
    <section className="websiteSection"><div className="contentShell websiteTwoCol">
      <div><p className="kicker">01 / MATERIAALI</p><h2>MITÄ TYÖMAALTA KANNATTAA KUVATA?</h2></div>
      <div className="websiteCopy"><p>Kuvaa lähtötilanne, työvaiheet, yksityiskohdat ja valmis kohde. Yksittäinen kuva toimii paremmin, kun sen yhteydessä kerrotaan mitä tehtiin ja miksi.</p><p>Ennen-jälkeen-kuvat ovat hyödyllisiä erityisesti saneeraus- ja remonttikohteissa, mutta myös tavallinen työvaihe voi toimia referenssinä.</p></div>
    </div></section>
    <section className="websiteSection websiteSection--dark"><div className="contentShell"><div className="sectionIntro"><p className="kicker kicker--inverse">04 SISÄLTÖROOLIA</p><div><h2>YHDESTÄ TYÖMAASTA USEAMPI KULMA.</h2></div></div>
      <div className="websiteCards">
        {['Työmaa nyt','Valmis kohde','Työvaihe','Tekijä ja prosessi'].map((x,i)=><article key={x}><span>{String(i+1).padStart(2,'0')}</span><h3>{x}</h3><p>Yksi selkeä näkökulma, oikeat projektifaktat ja yksi toimintakehotus.</p></article>)}
      </div>
    </div></section>
    <section className="websiteSection"><div className="contentShell websiteTwoCol">
      <div><p className="kicker">SEURAAVA ASKEL</p><h2>RAKENNA KUUKAUDEN RYTMI.</h2></div>
      <div className="websiteCopy"><p>Jos materiaalia syntyy mutta julkaiseminen jää tekemättä, tuotanto voidaan rakentaa valmiiksi kuukausieräksi.</p><div className="heroActions"><Link className="button button--signal" href="/rakennusyrityksille">RAKENNUSYRITYKSEN SOME →</Link><Link className="textLink" href="/some-sisallontuotanto/hinta">SOME 12 / HINTA →</Link><Link className="textLink" href="/referenssit">KATSO REFERENSSIHUB →</Link></div></div>
    </div></section>
  </main>;
}
