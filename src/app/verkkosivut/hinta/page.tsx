import type { Metadata } from 'next';
import Link from 'next/link';
import WebsiteLandingPage from '@/components/website/WebsiteLandingPage';

export const metadata: Metadata = {
  title: 'Verkkosivujen hinta | GhoulHouse',
  description: 'Mistä yrityksen verkkosivuprojektin työ muodostuu: rakenne, sisältö, referenssit, toteutus ja julkaisu.',
  alternates: { canonical: '/verkkosivut/hinta' },
  robots: process.env.VERCEL_ENV === 'production' ? { index: true, follow: true } : { index: false, follow: false, nocache: true },
};

export default function Page() {
  return (
    <>
      <WebsiteLandingPage />
      <section className="websitePrice" aria-labelledby="website-price-title">
        <div className="contentShell websitePriceGrid">
          <div><p className="kicker">HINTA</p><h2 id="website-price-title">HINTA RAKENTUU TYÖSTÄ, EI SIVUMÄÄRÄSTÄ.</h2></div>
          <div className="websitePriceCopy">
            <p>Verkkosivuprojektin hinta riippuu ennen kaikkea rakenteen laajuudesta, sisällön määrästä, integraatioista ja siitä, kuinka paljon olemassa olevaa materiaalia voidaan hyödyntää.</p>
            <ul><li>Perusrakenne ja suunnittelu</li><li>Palvelu- ja referenssisisällöt</li><li>Tekninen toteutus ja responsiivisuus</li><li>SEO-perusta ja julkaisu</li></ul>
            <Link className="button button--signal" href="/verkkosivut-yritykselle#yhteys">PYYDÄ ARVIO →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
