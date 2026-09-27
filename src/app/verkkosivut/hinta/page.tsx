import type { Metadata } from 'next';
import Link from 'next/link';
import WebsiteLandingPage from '@/components/website/WebsiteLandingPage';

export const metadata: Metadata = {
  title: 'Verkkosivujen hinta | GhoulHouse',
  description: 'Mistä yrityksen verkkosivujen hinta muodostuu? Käy läpi rakenteen, sisältöjen ja toteutuksen vaikutus ja pyydä rajattu arvio.',
  alternates: { canonical: '/verkkosivut/hinta' },
  openGraph: { title: 'Verkkosivujen hinta | GhoulHouse', description: 'Mistä verkkosivujen hinta muodostuu? Tutustu hintaan vaikuttaviin tekijöihin ja pyydä rajattu arvio.', url: '/verkkosivut/hinta', type: 'website', images: [{ url: '/opengraph-image', width: 1200, height: 630 }] },
  robots: process.env.VERCEL_ENV === 'production' ? { index: true, follow: true } : { index: false, follow: false, nocache: true },
};

export default function Page() {
  return (
    <>
      <WebsiteLandingPage
        eyebrow="VERKKOSIVUJEN HINTA"
        heading="Mistä verkkosivujen hinta muodostuu?"
        introduction="Tällä sivulla ei ole kiinteää hintaa: työ rajataan yrityksen rakenteen, sisältöjen ja valmiin materiaalin perusteella. Käy läpi hintaan vaikuttavat osat ja pyydä omaan tilanteeseesi rajattu arvio."
        contactHeading="PYYDÄ ARVIO OMASTA PROJEKTISTA."
        contactIntroduction="Kerro yrityksen nimi, tarvittavat palvelut ja mahdollinen nykyinen sivusto. Voit pyytää arviota myös, jos verkkosivua ei vielä ole."
        secondaryHref="/verkkosivut-yritykselle"
        secondaryLabel="Katso toteutuksen sisältö"
      >
      <section className="websitePrice" aria-labelledby="website-price-title">
        <div className="contentShell websitePriceGrid">
          <div><p className="kicker">HINTA</p><h2 id="website-price-title">HINTA RAKENTUU TYÖSTÄ, EI SIVUMÄÄRÄSTÄ.</h2></div>
          <div className="websitePriceCopy">
            <p>Verkkosivuprojektin hinta riippuu ennen kaikkea rakenteen laajuudesta, sisällön määrästä, integraatioista ja siitä, kuinka paljon olemassa olevaa materiaalia voidaan hyödyntää.</p>
            <ul><li>Perusrakenne ja suunnittelu</li><li>Palvelu- ja referenssisisällöt</li><li>Tekninen toteutus ja responsiivisuus</li><li>SEO-perusta ja julkaisu</li></ul>
            <Link className="button button--signal" href="#yhteys">PYYDÄ ARVIO →</Link>
          </div>
        </div>
      </section>
      </WebsiteLandingPage>
    </>
  );
}
