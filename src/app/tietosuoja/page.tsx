import Container from '@/components/ui/Container';
import { siteConfig } from '@/config/site';

export const metadata = {
  title: 'Tietosuojaselostus | GhoulHouse',
  description: 'GhoulHousen tietosuojaselostus ja tietojen käsittely.',
  robots: { index: false },
};

export default function PrivacyPage() {
  const company = siteConfig.company;

  return (
    <main className="min-h-screen bg-paper py-16 md:py-24">
      <Container>
        <article className="prose prose-sm max-w-3xl">
          <h1 className="text-3xl font-black uppercase md:text-4xl">Tietosuojaselostus</h1>
          <p className="text-sm text-ghost/60">
            Viimeksi päivitetty: 2026-09-03
          </p>

          <section>
            <h2>1. Rekisterinpitäjä</h2>
            <p>
              <strong>{company.legalName}</strong>
              <br />
              Y-tunnus: {company.businessId}
              <br />
              Kotipaikka: {company.domicile}
              <br />
              {company.registrationStatus}
              <br />
              Postiosoite: {company.postalAddress.careOf}
              <br />
              {company.postalAddress.street}
              <br />
              {company.postalAddress.postalCode} {company.postalAddress.city}
              <br />
              Suomi
              <br />
              <br />
              Yhteyshenkilö tietosuojaa koskevissa asioissa:
              <br />
              {company.founder}
              <br />
              Sähköposti: <a href="mailto:hello@ghoulhouse.fi">hello@ghoulhouse.fi</a>
            </p>
          </section>

          <section>
            <h2>2. Henkilötietojen käsittelyn tarkoitus</h2>
            <p>
              Käsittelemme henkilötietoja seuraaviin tarkoituksiin:
            </p>
            <ul>
              <li>Asiakkaan yhteydenottopyynnön käsittely</li>
              <li>Tarjousten ja sopimuksien hallinta</li>
              <li>Palvelun toimittaminen ja asiakaspalvelu</li>
              <li>Markkinointiviestinnän lähettäminen (vain suostumuksella)</li>
              <li>Oikeudellisten velvoitteiden noudattaminen</li>
            </ul>
          </section>

          <section>
            <h2>3. Käsiteltävät henkilötiedot</h2>
            <p>
              Käsittelemme seuraavia henkilötietoja:
            </p>
            <ul>
              <li>Nimi</li>
              <li>Sähköpostiosoite</li>
              <li>Puhelinnumero</li>
              <li>Yrityksen nimi ja verkkosivut</li>
              <li>Instagram-tunnus</li>
              <li>Yhteydenotto-/tilausviesti</li>
            </ul>
          </section>

          <section>
            <h2>4. Oikeusperusta</h2>
            <p>
              Henkilötietojen käsittely perustuu:
            </p>
            <ul>
              <li>
                <strong>Sopimuksen täytäntöönpano:</strong> Asiakkaan pyynnöstä lähetettyjen tarjousten ja sopimusten hallinta (GDPR 6(1)(b))
              </li>
              <li>
                <strong>Oikeutettu etu:</strong> Asiakaspalvelu ja liiketoiminnan kehittäminen (GDPR 6(1)(f))
              </li>
              <li>
                <strong>Suostumus:</strong> Markkinointiviestinnän lähettäminen vaatii nimenomaisen suostumuksen
              </li>
              <li>
                <strong>Lakisääteiset velvoitteet:</strong> Kirjanpito ja verotus (GDPR 6(1)(c))
              </li>
            </ul>
          </section>

          <section>
            <h2>5. Tietojen säilytysajat</h2>
            <p>
              Säilytämme henkilötietoja seuraavasti:
            </p>
            <ul>
              <li>
                <strong>Yhteydenottolomakkeen tiedot:</strong> Enintään 12 kuukautta yhteydenotosta tai kunnes sopimus solmitaan
              </li>
              <li>
                <strong>Asiakastiedot (sopimukseen liittyvät):</strong> Sopimuksen päättymisen jälkeen 6 vuotta (kirjanpitolain vaatimus)
              </li>
              <li>
                <strong>Markkinointi-opt-in-tiedot:</strong> Kunnes vastaanottaja peruuttaa suostumuksensa
              </li>
              <li>
                <strong>Teknisiä lokitietoja:</strong> Enintään 30 päivää
              </li>
            </ul>
          </section>

          <section>
            <h2>6. Tietojen vastaanottajat</h2>
            <p>
              Saatamme luovuttaa henkilötietoja seuraaviin tahoihin:
            </p>
            <ul>
              <li>
                <strong>Palveluntarjoajat:</strong> Sähköpostijärjestelmät (Resend), analytiikkapalvelut (Vercel Analytics), verkkopiste (Vercel)
              </li>
              <li>
                <strong>Viranomaiset:</strong> Kun laissa määrätään
              </li>
              <li>
                <strong>Oikeudellisen kohtelun edellyttämissä tapauksissa:</strong> Esimerkiksi oikeudelliset kiistat
              </li>
            </ul>
          </section>

          <section>
            <h2>7. Tietojen siirrot EU/ETA-alueen ulkopuolelle</h2>
            <p>
              Saatamme siirtää henkilötietoja EU/ETA-alueen ulkopuolelle seuraaviin palveluntarjoajiin:
            </p>
            <ul>
              <li>
                <strong>Vercel (USA):</strong> Verkkopiste- ja analytiikkapalvelut. Vercel noudattaa Standard Contractual Clauses (SCC) -sopimuksia.
              </li>
            </ul>
            <p>
              Varmistamme, että tietojen siirroissa noudatetaan GDPR:n vaatimia suojaavia tekijöitä.
            </p>
          </section>

          <section>
            <h2>8. Rekisteröidyn oikeudet</h2>
            <p>
              Sinulla on seuraavat oikeudet henkilötietojesi osalta:
            </p>
            <ul>
              <li>
                <strong>Tiedonsaantioikeus:</strong> Voit pyytää tietoa siitä, mitä henkilötietoja käsittelemme sinusta
              </li>
              <li>
                <strong>Oikeus korjaukseen:</strong> Voit pyytää virheellisten tai puutteellisten tietojen korjaamista
              </li>
              <li>
                <strong>Oikeus poistamiseen ("oikeus tulla unohdetuksi"):</strong> Voit pyytää tietojen poistamista tietyissä tapauksissa
              </li>
              <li>
                <strong>Oikeus käsittelyn rajoittamiseen:</strong> Voit pyytää käsittelyn väliaikaista keskeyttämistä
              </li>
              <li>
                <strong>Oikeus vastustavaa:</strong> Voit vastustaa henkilötietojen käsittelyä tietyissä tapauksissa
              </li>
              <li>
                <strong>Oikeus tietojen siirrettävyyteen:</strong> Voit pyytää henkilötietojasi jäsennellyssä, yleisesti käytetyssä muodossa
              </li>
            </ul>
            <p>
              Näiden oikeuksien käyttämiseksi ota yhteyttä: <a href="mailto:hello@ghoulhouse.fi">hello@ghoulhouse.fi</a>
            </p>
          </section>

          <section>
            <h2>9. Evästeet ja seurantatekniikka</h2>
            <p>
              Vercel Analytics käyttää evästeitä käyttäjäkäyttäytymisen seuraamiseen. Nämä evästeet ovat:
            </p>
            <ul>
              <li>
                <strong>Tekniset evästeet:</strong> Istunnon hallintaa varten (välttämätön)
              </li>
              <li>
                <strong>Analytiikkaevästeet:</strong> Käyttäjän käyttäytymisen seurantaan (vaatii suostumuksen)
              </li>
            </ul>
            <p>
              Voit hallita evästeita selaimen asetuksissa.
            </p>
          </section>

          <section>
            <h2>10. Tietoturva</h2>
            <p>
              Suojelemme henkilötietoja asianmukaisilla teknisilla ja organisaatioilla toimenpiteillä, mukaan lukien:
            </p>
            <ul>
              <li>SSL/TLS-salaus siirron aikana</li>
              <li>Pääsynvalvonta ja kirjautuminen</li>
              <li>Henkilöstön koulutus tietosuojasta</li>
              <li>Säännölliset tietoturva-auditoinnit</li>
            </ul>
          </section>

          <section>
            <h2>11. Tietomurron ilmoittaminen</h2>
            <p>
              Mikäli henkilötietojesi turvallisuus vaarantuu, ilmoitamme siitä sinulle ja viranomaisille lainsäädännön edellyttämällä tavalla.
            </p>
          </section>

          <section>
            <h2>12. Valitukseen oikeus</h2>
            <p>
              Sinulla on oikeus tehdä valitus tietosuojaviranomaiselle, mikäli katsot meidän loukaneen oikeuksiasi.
            </p>
            <p>
              <strong>Suomen tietosuojaviranomainen:</strong>
              <br />
              Tietosuojavaltuutettu
              <br />
              www.tietosuojavaltuutettu.fi
            </p>
          </section>

          <section>
            <h2>13. Muutokset tietosuojaselosteeseen</h2>
            <p>
              Saatamme päivittää tietosuojaselosteen aika ajoin. Päivityksistä ilmoitetaan tällä sivulla.
            </p>
          </section>
        </article>
      </Container>
    </main>
  );
}
