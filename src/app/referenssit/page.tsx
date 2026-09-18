import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Referenssit | GhoulHouse — Websites, Social & toimialanäyttö',
  description: 'GhoulHousen proof-hub: verkkosivut, some-sisällöt ja toimialakohtaiset työnäytteet. Näyttö perustuu oikeisiin projekteihin ja varmennettaviin faktoihin.',
  alternates: { canonical: '/referenssit' },
  openGraph: { title: 'Referenssit | GhoulHouse', description: 'Websites, Social ja toimialakohtainen proof.', url: '/referenssit', type: 'website' },
  robots: process.env.VERCEL_ENV === 'production' ? { index: true, follow: true } : { index: false, follow: false, nocache: true },
};

const groups = [
  { title:'WEBSITES', intro:'Verkkosivut, rakenne ja toteutus.', links:[['Verkkosivut yritykselle','/verkkosivut-yritykselle'],['Rakennusyrityksen verkkosivut','/verkkosivut/rakennus'],['LVI-yrityksen verkkosivut','/verkkosivut/lvi'],['Sähköyrityksen verkkosivut','/verkkosivut/sahko']] },
  { title:'SOCIAL', intro:'Työmaa-, referenssi- ja sisältötuotanto.', links:[['SOME 12','/some-12'],['Rakennusyrityksille','/rakennusyrityksille'],['LVI-yrityksille','/lvi-yrityksille'],['Instagram-sisällöntuotanto','/instagram-sisallontuotanto']] },
  { title:'TOIMIALAT', intro:'Näyttö järjestetään ostotilanteen ja työn mukaan.', links:[['Verkkosivut rakennusalalle','/verkkosivut/rakennus'],['Verkkosivut LVI-alalle','/verkkosivut/lvi'],['Verkkosivut sähköalalle','/verkkosivut/sahko']] },
];

export default function Page(){
 const schema={'@context':'https://schema.org','@type':'CollectionPage','name':'GhoulHouse Referenssit','url':'https://ghoulhouse.fi/referenssit','description':'GhoulHousen proof-hub.'};
 return <main className="websitePage">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}} />
  <section className="websiteHero"><div className="contentShell websiteHeroGrid"><div className="websiteHeroCopy"><p className="kicker">PROOF HUB</p><h1>Referenssit, järjestettynä sen mukaan mitä ostaja tarvitsee nähdä.</h1><p className="websiteLead">Ei geneeristä portfolioa. Websites, Social ja toimialakohtainen näyttö erotellaan, jotta tehty työ ja sen käyttötarkoitus ovat luettavissa.</p></div></div></section>
  <section className="websiteSection"><div className="contentShell"><div className="websiteResourceGrid">{groups.map(g=><article key={g.title} className="websiteResourceGrid"><div style={{padding:'24px'}}><p className="kicker">{g.title}</p><h2>{g.intro}</h2>{g.links.map(([label,href])=><Link key={href} href={href} className="textLink" style={{display:'flex',justifyContent:'space-between',padding:'14px 0',borderBottom:'1px solid var(--line)'}}>{label}<span>→</span></Link>)}</div></article>)}</div></div></section>
  <section className="websiteSection websiteSection--dark"><div className="contentShell websiteTwoCol"><div><p className="kicker kicker--inverse">PROOF STANDARD</p><h2>FAKTA ENNEN VÄITETTÄ.</h2></div><div className="websiteCopy"><p>Referenssi sisältää vain sen, mikä voidaan yhdistää oikeaan projektiin, palveluun tai julkaistuun toteutukseen.</p><p>Emme lisää keksittyjä asiakastuloksia, testimonial-lupauksia tai prosentteja täyttämään tyhjää kohtaa.</p></div></div></section>
 </main>;
}
