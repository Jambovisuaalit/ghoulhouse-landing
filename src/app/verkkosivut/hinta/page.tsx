import type { Metadata } from 'next';
import { indexableRobots } from '@/lib/seo';
import Link from 'next/link';
import WebsiteLandingPage from '@/components/website/WebsiteLandingPage';

export const metadata: Metadata = {
  title: 'Verkkosivujen hinta | GhoulHouse',
  description: 'Mistä yrityksen verkkosivujen hinta muodostuu? Tutustu rakenteen, sisältöjen ja integraatioiden vaikutukseen ja pyydä rajattu arvio.',
  alternates: { canonical: '/verkkosivut/hinta' },
  openGraph: { title: 'Verkkosivujen hinta | GhoulHouse', description: 'Mistä verkkosivujen hinta muodostuu? Tutustu hintaan vaikuttaviin tekijöihin ja pyydä rajattu arvio.', url: '/verkkosivut/hinta', type: 'website', images: [{ url: '/opengraph-image', width: 1200, height: 630 }] },
  robots: indexableRobots(),
};

export default function Page() {
  return (
    <>
      <WebsiteLandingPage
        eyebrow="VERKKOSIVUJEN HINTA"
        heading="Mistä verkkosivujen hinta muodostuu?"
        introduction="Verkkosivut hinnoitellaan projektikohtaisesti. Hinta riippuu rakenteesta, sisällöistä, integraatioista ja valmiista materiaalista. Käy läpi hintaan vaikuttavat osat ja pyydä omaan tilanteeseesi rajattu arvio."
        contactHeading="PYYDÄ ARVIO OMASTA PROJEKTISTA."
        contactIntroduction="Kerro yrityksen nimi, tarvittavat palvelut ja mahdollinen nykyinen sivusto. Voit pyytää arviota myös, jos verkkosivua ei vielä ole."
        secondaryHref="/verkkosivut-yritykselle"
        secondaryLabel="Katso toteutuksen sisältö"
      >
      <section className="websitePrice" aria-labelledby="website-price-title">
        <div className="contentShell websitePriceGrid">
          <div><p className="kicker">HINTA</p><h2 id="website-price-title" data-analytics-section="pricing">HINTA RAKENTUU TYÖSTÄ, EI SIVUMÄÄRÄSTÄ.</h2></div>
          <div className="websitePriceCopy">
            <p>Verkkosivuprojektin hinta riippuu rakenteen laajuudesta, tarvittavasta tekstityöstä, integraatioista ja siitä, kuinka paljon nykyisiä kuvia ja sisältöä voidaan hyödyntää. Siksi emme esitä yhtä kaikille sopivaa alkaen-hintaa ilman määriteltyä toimitussisältöä.</p>
            <ul><li>Sivut ja sisältö: montako palvelua, kohdetta ja tekstisisältöä toteutetaan?</li><li>Materiaalit: mitä kuvia, tekstejä ja hyväksyntöjä asiakas toimittaa?</li><li>Toiminnot: lomakkeet, analytiikka ja mahdolliset integraatiot.</li><li>Julkaisu ja jatko: mitä sisältyy käyttöönottoon ja mitä ylläpito maksaa erikseen?</li></ul><p>Tarjouksessa erittelemme sovitun toimitussisällön ja mahdolliset jatkuvat kulut ennen toteutuspäätöstä.</p>
            <Link className="button button--signal" href="#yhteys">PYYDÄ ARVIO →</Link>
          </div>
        </div>
      </section>
      </WebsiteLandingPage>
    </>
  );
}
