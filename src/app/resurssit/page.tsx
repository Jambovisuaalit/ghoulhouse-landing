import type { Metadata } from 'next';
import Link from 'next/link';
import { websiteResources } from '@/data/website';

export const metadata: Metadata = {
  title: 'Yrityksen verkkosivut, some ja SEO – oppaat | GhoulHouse',
  description: 'Käytännön oppaat yrityksen verkkosivuihin, some-sisältöihin ja digitaaliseen näkyvyyteen. Katso hinnat, ohjeet ja toimialakohtaiset resurssit.',
  alternates: { canonical: '/resurssit' },
  openGraph: { title: 'Yrityksen verkkosivut, some ja SEO – oppaat | GhoulHouse', description: 'Käytännön oppaat yrityksen verkkosivuihin, some-sisältöihin ja digitaaliseen näkyvyyteen.', url: '/resurssit', type: 'website', images: [{ url: '/opengraph-image', width: 1200, height: 630 }] },
  robots: process.env.VERCEL_ENV === 'production' ? { index: true, follow: true } : { index: false, follow: false, nocache: true },
};

export default function Page() {
  return (
    <main className="websitePage">
      <section className="websiteHero"><div className="contentShell websiteHeroGrid"><div className="websiteHeroCopy"><p className="kicker">RESURSSIT</p><h1>Selkeämpi verkkosivu alkaa selkeämmästä lähtökohdasta.</h1><p className="websiteLead">Koottuja näkökulmia yrityksen verkkosivuihin, referensseihin ja ostamisen kitkan vähentämiseen.</p></div></div></section>
      <section className="websiteSection"><div className="contentShell"><div className="websiteResourceGrid websiteResourceGrid--large"><Link href="/oppaat/verkkosivut-itse-vai-ammattilaiselta"><span>Opas: verkkosivut itse vai ammattilaiselta?</span><p>Milloin oma tekeminen riittää ja milloin kannattaa ulkoistaa?</p><b>LUE →</b></Link><Link href="/oppaat/rakennusyrityksen-some"><span>Opas: rakennusyrityksen some</span><p>Mitä työmaakuvista kannattaa julkaista ja miten kuukausirytmi rakennetaan?</p><b>LUE →</b></Link><Link href="/oppaat/tyomaakuvat-sosiaaliseen-mediaan"><span>Opas: työmaakuvat sosiaaliseen mediaan</span><p>Käytännön kuvauslista yrityksen omalle työmaamateriaalille.</p><b>LUE →</b></Link><Link href="/some-sisallontuotanto/hinta"><span>Some-sisällöntuotannon hinta</span><p>SOME 12: sisältö, prosessi ja 490 € + ALV / 30 päivää.</p><b>KATSO HINTA →</b></Link>{websiteResources.map(([label, copy, href]) => <Link key={href} href={href}><span>{label}</span><p>{copy}</p><b>LUE →</b></Link>)}</div></div></section>
    </main>
  );
}
