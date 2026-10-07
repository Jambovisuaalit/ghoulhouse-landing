import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import '../onboarding.css';

export const metadata: Metadata = {
  title: 'Aloitustiedot vastaanotettu | GhoulHouse',
  robots: { index: false, follow: false },
};

export default function OnboardingThanksPage() {
  return (
    <main className="onboardingThanks">
      <section className="onboardingThanksCard">
        <Image src="/ghoulhouse-logo.svg" alt="GhoulHouse" width={190} height={63} priority />
        <p className="onboardingKicker">SOCIAL 12 / ALOITUS</p>
        <h1>TIEDOT<br />VASTAANOTETTU.</h1>
        <p>
          Hanna käy vastaukset läpi ja ottaa yhteyttä vain, jos tuotannon käynnistämisestä puuttuu
          materiaalia, käyttöoikeuksia tai muu olennainen tieto.
        </p>
        <ul>
          <li>1. Aloitustiedot tarkistetaan.</li>
          <li>2. Puuttuvat materiaalit ja Meta-oikeudet pyydetään tarvittaessa.</li>
          <li>3. Sisältöjen suunnittelu käynnistyy, kun tuotantoedellytykset ovat kunnossa.</li>
        </ul>
        <Link href="/">Takaisin GhoulHouseen →</Link>
      </section>
    </main>
  );
}
