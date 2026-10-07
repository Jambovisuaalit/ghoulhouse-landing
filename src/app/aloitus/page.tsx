import type { Metadata } from 'next';
import Image from 'next/image';
import OnboardingForm from '@/components/OnboardingForm';
import './onboarding.css';

export const metadata: Metadata = {
  title: 'Aloitus | GhoulHouse Social',
  description: 'GhoulHouse Social -asiakkaan aloitustiedot.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/aloitus' },
};

export default function OnboardingPage() {
  return (
    <main className="onboardingPage">
      <section className="onboardingHero">
        <div className="onboardingShell">
          <a className="onboardingBrand" href="/" aria-label="GhoulHouse - etusivu">
            <Image src="/ghoulhouse-logo.svg" alt="GhoulHouse" width={190} height={63} priority />
          </a>
          <p className="onboardingKicker">SOCIAL 12 / ALOITUS</p>
          <div className="onboardingHeroGrid">
            <div>
              <h1>ALOITETAAN<br />OIKEISTA<br />TIEDOISTA.</h1>
            </div>
            <div className="onboardingIntro">
              <p>
                Täytä yrityksen tavoitteet, materiaalit ja käyttöoikeuksien tilanne yhdellä kertaa.
                Käytämme vastauksia sisällön suunnitteluun ja sovitun aloituksen valmisteluun.
              </p>
              <ul>
                <li>12 sisältöä / kuukausi</li>
                <li>Instagram + Facebook</li>
                <li>Yksi koottu korjauskierros</li>
                <li>Julkaisu ja jatkuva hallinta</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="onboardingBody">
        <div className="onboardingShell onboardingBodyGrid">
          <aside className="onboardingAside">
            <p className="onboardingKicker">MITÄ TARVITSEMME</p>
            <h2>5-10 MINUUTTIA.</h2>
            <p>
              Lomake ei korvaa tarvittaessa lyhyttä kickoffia. Sen tarkoitus on poistaa turha edestakainen
              viestittely ennen tuotannon käynnistämistä.
            </p>
            <div className="onboardingAsideRule">
              <strong>Seuraava vaihe</strong>
              <span>Hanna tarkistaa tiedot ja pyytää vain puuttuvat materiaalit tai oikeudet.</span>
            </div>
          </aside>
          <div className="onboardingSurface">
            <OnboardingForm />
          </div>
        </div>
      </section>
    </main>
  );
}
