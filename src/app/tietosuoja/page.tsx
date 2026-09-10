import type { ReactNode } from 'react';
import Container from '@/components/ui/Container';
import { siteConfig } from '@/config/site';

export const metadata = {
  title: 'Tietosuojaseloste | GhoulHouse',
  description: 'GhoulHousen tietosuojaseloste ja henkilötietojen käsittelyn periaatteet.',
  robots: { index: false },
};

const linkClass = 'font-bold underline decoration-signal underline-offset-4';

function PrivacySection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-4 border-t border-ink/20 py-8 md:grid-cols-[88px_1fr] md:gap-8 md:py-10">
      <p className="type-label text-signal">{number}</p>
      <div className="max-w-3xl">
        <h2 className="font-display text-3xl uppercase leading-none tracking-[-0.02em] text-ink md:text-4xl">
          {title}
        </h2>
        <div className="mt-5 space-y-4 text-sm leading-7 text-muted md:text-base">
          {children}
        </div>
      </div>
    </section>
  );
}

export default function PrivacyPage() {
  const company = siteConfig.company;

  return (
    <main className="min-h-screen bg-paper py-14 text-ink md:py-20">
      <Container>
        <article className="mx-auto max-w-5xl">
          <header className="pb-10 md:pb-14">
            <p className="type-label text-signal">GHOULHOUSE / TIETOSUOJA</p>
            <h1 className="mt-4 max-w-[12ch] font-display text-5xl uppercase leading-[0.9] tracking-[-0.03em] text-ink md:text-7xl">
              TIETOSUOJA-SELOSTE
            </h1>
            <div className="mt-7 grid gap-4 border-l-4 border-signal pl-5 text-sm leading-6 text-muted md:max-w-2xl">
              <p>
                Tässä selosteessa kuvataan, miten {company.legalName} käsittelee verkkosivun, yhteydenottojen ja asiakassuhteiden yhteydessä syntyviä henkilötietoja.
              </p>
              <p className="type-caption text-ink">Viimeksi päivitetty 10.9.2026</p>
            </div>
          </header>

          <PrivacySection number="01" title="Rekisterinpitäjä">
            <p>
              <strong className="text-ink">{company.legalName}</strong><br />
              Y-tunnus {company.businessId}<br />
              Kotipaikka {company.domicile}<br />
              {company.registrationStatus}
            </p>
            <p>
              {company.postalAddress.careOf}<br />
              {company.postalAddress.street}<br />
              {company.postalAddress.postalCode} {company.postalAddress.city}<br />
              Suomi
            </p>
            <p>
              Tietosuoja-asioiden yhteyshenkilö: {company.founder}.<br />
              <a className={linkClass} href="mailto:hello@ghoulhouse.fi">hello@ghoulhouse.fi</a>
            </p>
          </PrivacySection>

          <PrivacySection number="02" title="Miksi tietoja käsitellään">
            <ul className="list-disc space-y-2 pl-5 marker:text-signal">
              <li>yhteydenottoihin ja tarjouspyyntöihin vastaaminen</li>
              <li>palvelun tilaamisen, toimittamisen ja asiakaspalvelun hoitaminen</li>
              <li>sopimus-, laskutus- ja kirjanpitovelvoitteiden hoitaminen</li>
              <li>palvelun ja verkkosivun toiminnan kehittäminen</li>
              <li>markkinointiviestintä silloin, kun siihen on asianmukainen peruste tai suostumus</li>
            </ul>
          </PrivacySection>

          <PrivacySection number="03" title="Käsiteltävät tiedot">
            <p>Käsiteltäviä tietoja voivat olla esimerkiksi:</p>
            <ul className="list-disc space-y-2 pl-5 marker:text-signal">
              <li>nimi, yritys ja yhteystiedot</li>
              <li>verkkosivu- tai sosiaalisen median profiili</li>
              <li>yhteydenoton tai tilauksen sisältö</li>
              <li>asiakassuhteen hoitamiseen tarvittavat projekti- ja laskutustiedot</li>
              <li>verkkosivun tekniset ja anonyymit käyttötilastot silloin, kun analytiikka on käytössä</li>
            </ul>
          </PrivacySection>

          <PrivacySection number="04" title="Käsittelyn oikeusperusteet">
            <ul className="list-disc space-y-2 pl-5 marker:text-signal">
              <li><strong className="text-ink">Sopimus ja sopimusta edeltävät toimet:</strong> tarjouspyynnöt, tilaukset ja palvelun toimittaminen.</li>
              <li><strong className="text-ink">Oikeutettu etu:</strong> asiakaspalvelu, tietoturva ja liiketoiminnan asianmukainen kehittäminen.</li>
              <li><strong className="text-ink">Lakisääteinen velvoite:</strong> esimerkiksi kirjanpitoon ja verotukseen liittyvät velvoitteet.</li>
              <li><strong className="text-ink">Suostumus:</strong> tilanteissa, joissa käsittely perustuu nimenomaisesti annettuun suostumukseen.</li>
            </ul>
          </PrivacySection>

          <PrivacySection number="05" title="Säilytysajat">
            <p>
              Yhteydenottotietoja säilytetään vain niin kauan kuin yhteydenoton käsittely ja mahdollinen jatkokeskustelu sitä edellyttävät. Asiakassuhteeseen, sopimuksiin, laskutukseen ja kirjanpitoon liittyviä tietoja säilytetään sovellettavan lainsäädännön edellyttämän ajan. Tarpeettomat tiedot poistetaan tai anonymisoidaan.
            </p>
          </PrivacySection>

          <PrivacySection number="06" title="Palveluntarjoajat">
            <p>GhoulHouse käyttää palvelun toteuttamiseen rajattua joukkoa teknisiä palveluntarjoajia:</p>
            <ul className="list-disc space-y-2 pl-5 marker:text-signal">
              <li><strong className="text-ink">Vercel:</strong> verkkosivun hosting ja tekninen infrastruktuuri.</li>
              <li><strong className="text-ink">Supabase:</strong> verkkosivun yhteydenottojen tietokantatallennus ja tekninen käsittely.</li>
              <li><strong className="text-ink">Resend:</strong> yhteydenotoista syntyvien sähköposti-ilmoitusten toimitus.</li>
              <li><strong className="text-ink">Plausible Analytics:</strong> anonyymi käyttötilastointi silloin, kun analytiikka on tuotantoympäristössä aktivoitu.</li>
            </ul>
            <p>Palveluntarjoajat käsittelevät tietoja vain palvelun tuottamisen kannalta tarpeellisessa laajuudessa.</p>
          </PrivacySection>

          <PrivacySection number="07" title="Kansainväliset siirrot">
            <p>
              Hosting-, tietokanta- ja sähköpostipalveluihin voi niiden palvelurakenteesta riippuen liittyä henkilötietojen käsittelyä EU/ETA-alueen ulkopuolella. Tällöin käsittely perustuu sovellettavan tietosuojalainsäädännön mukaisiin siirtoperusteisiin ja suojatoimiin.
            </p>
            <p>
              Plausible Analyticsin pilvipalvelun analytiikkadata käsitellään ja säilytetään EU:ssa silloin, kun palvelu on käytössä. Plausible ei käytä analytiikkaan evästeitä tai pysyviä käyttäjätunnisteita.
            </p>
          </PrivacySection>

          <PrivacySection number="08" title="Rekisteröidyn oikeudet">
            <p>Tilanteesta ja käsittelyn oikeusperusteesta riippuen sinulla voi olla oikeus:</p>
            <ul className="list-disc space-y-2 pl-5 marker:text-signal">
              <li>saada pääsy sinua koskeviin henkilötietoihin</li>
              <li>pyytää virheellisten tietojen korjaamista</li>
              <li>pyytää tietojen poistamista tai käsittelyn rajoittamista</li>
              <li>vastustaa oikeutettuun etuun perustuvaa käsittelyä</li>
              <li>peruuttaa antamasi suostumus</li>
              <li>pyytää soveltuvissa tilanteissa tietojen siirtämistä järjestelmästä toiseen</li>
            </ul>
            <p>
              Oikeuksien käyttämiseksi ota yhteyttä osoitteeseen <a className={linkClass} href="mailto:hello@ghoulhouse.fi">hello@ghoulhouse.fi</a>.
            </p>
          </PrivacySection>

          <PrivacySection number="09" title="Evästeet ja analytiikka">
            <p>
              GhoulHouse ei käytä analytiikkaevästeitä. Jos Plausible Analytics aktivoidaan tuotantoympäristössä, sitä käytetään verkkosivun yleisen käytön mittaamiseen ilman analytiikkaevästeitä ja pysyviä käyttäjätunnisteita. Analytiikkaa ei käytetä yksittäisten kävijöiden profilointiin tai mainonnan kohdentamiseen.
            </p>
            <p>
              Verkkosivun hosting- tai tietoturvatoiminnot voivat käyttää teknisesti välttämättömiä mekanismeja palvelun suojaamiseen ja toimittamiseen.
            </p>
          </PrivacySection>

          <PrivacySection number="10" title="Tietoturva ja muutokset">
            <p>
              Tietoja suojataan asianmukaisin teknisin ja organisatorisin toimin, kuten salatulla HTTPS-yhteydellä, käyttöoikeuksien rajaamisella, Supabasen tietokantatason käyttörajoituksilla ja palveluntarjoajien hallinnalla.
            </p>
            <p>
              Selostetta päivitetään, jos käsittelytavat tai käytetyt palvelut muuttuvat olennaisesti. Ajantasainen versio julkaistaan tällä sivulla.
            </p>
            <p>
              Jos katsot henkilötietojesi käsittelyn olevan tietosuojasääntelyn vastaista, sinulla on oikeus saattaa asia toimivaltaisen tietosuojaviranomaisen käsiteltäväksi.
            </p>
          </PrivacySection>

          <div className="mt-10 border-2 border-ink bg-white p-6 md:flex md:items-end md:justify-between md:gap-10 md:p-8">
            <div>
              <p className="type-label text-signal">TIETOSUOJA-ASIA</p>
              <p className="mt-3 font-display text-3xl uppercase leading-none text-ink">OTA YHTEYTTÄ</p>
            </div>
            <a className="btn btn-secondary mt-6 md:mt-0" href="mailto:hello@ghoulhouse.fi">
              hello@ghoulhouse.fi
            </a>
          </div>
        </article>
      </Container>
    </main>
  );
}
