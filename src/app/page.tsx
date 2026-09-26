import Image from 'next/image';
import LeadForm from '@/components/LeadForm';
import FunnelAnalytics from '@/components/analytics/FunnelAnalytics';
import HeroDotGrid from '@/components/HeroDotGrid';
import Service3DCarousel from '@/components/Service3DCarousel';
import { siteNavigation } from '@/data/site-navigation';
import './homepage.css';
import './homepage-swiss.css';

const services = [
  {
    index: '01',
    title: 'VERKKOSIVUT',
    body: 'Asiakas ymmärtää palvelunne ja löytää yhteydenoton ilman etsimistä. Toteutuksen laajuus sovitaan yrityksen materiaalin ja tarpeen perusteella.',
    outputs: ['Palvelu- ja toimialarakenne', 'Mobiilitoteutus ja yhteydenotto', 'Tekninen SEO ja julkaisu'],
    meta: 'Tarjous toteutuksen laajuuden perusteella',
    href: '/verkkosivut-yritykselle',
    link: 'Katso verkkosivutoteutus',
  },
  {
    index: '02',
    title: 'SOCIAL',
    body: 'Työmaakuvat muuttuvat suunnitelluiksi julkaisuiksi. Asiakkaan materiaalista tuotetaan 12 sisältöä Instagramiin ja Facebookiin 30 päivässä.',
    outputs: ['12 alkuperäistä sisältöä / 30 päivää', 'Instagram ja Facebook', 'Yksi korjauskierros ja kuukausiraportti'],
    meta: 'SOME 12 · 490 € + ALV / 30 päivää',
    href: '/some-sisallontuotanto',
    link: 'Katso Social-paketti',
  },
  {
    index: '03',
    title: 'SEO',
    body: 'Hakukone ja asiakas ymmärtävät, mitä palveluita tarjoatte ja millä alueella. Toteutuksen tarkka rajaus määritellään nykytilan perusteella.',
    outputs: ['Palvelu- ja toimialasivujen rakenne', 'Otsikot, kuvaukset ja sisältö', 'Sisäinen linkitys'],
    meta: 'Sisältö ja hinta sovitaan tarjouksessa',
    href: '/?service=seo#yhteys',
    link: 'Pyydä SEO-ehdotus',
  },
] as const;

const steps = [
  ['Tilanne', 'Käymme läpi nykyisen sivuston, sisällöt ja sen, mitä asiakkaiden pitäisi löytää.'],
  ['Ehdotus', 'Rajaamme tarvittavat palvelut, toimitukset ja etenemisjärjestyksen selkeäksi ehdotukseksi.'],
  ['Toteutus', 'Rakennamme sovitun verkkosivu-, sisältö- tai näkyvyyskokonaisuuden käytettävissä olevasta materiaalista.'],
  ['Julkaisu & kehitys', 'Tarkistamme toteutuksen, julkaisemme hyväksytyn työn ja sovimme mahdollisista jatkotoimista.'],
] as const;

const proofLinks = [
  ['WEBSITES', 'Valmis verkkosivupolku', 'Oman sivustomme toteutettu polku: palvelut, työnäyte ja tarjouspyyntö. Avaa tarkempi toteutusesittely.', '/tyot/ghoulhouse-verkkosivut'],
  ['SOCIAL', 'Työmaakuvasta julkaisuksi', 'Havainne-esimerkki siitä, miten työmaakuvasta muodostuu otsikoitu ja brändätty somejulkaisu.', '/some-sisallontuotanto'],
  ['SEO', 'Palvelusta toimialasivuksi', 'Esimerkkirakenne: rakennusalan palvelusivu, siihen liittyvä sisältö ja selkeä yhteydenotto. Ei hakusijalupaus.', '/verkkosivut/rakennus'],
] as const;

const guides = [
  ['01 / HINTA', 'Mistä verkkosivujen hinta muodostuu?', 'Rakenne, sisällöt ja toteutuksen laajuus.', '/verkkosivut/hinta'],
  ['02 / OPAS', 'Verkkosivut itse vai ammattilaiselta?', 'Tarkistuslista oikean toteutustavan valintaan.', '/oppaat/verkkosivut-itse-vai-ammattilaiselta'],
  ['03 / OPAS', 'Työmaakuvat sosiaaliseen mediaan', 'Mitä kuvata, jotta omasta työstä syntyy julkaistavaa sisältöä.', '/oppaat/tyomaakuvat-sosiaaliseen-mediaan'],
] as const;

function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <a className="ghBrand" href={footer ? '#top' : '/'} aria-label="GhoulHouse — etusivu">
      <Image src="/favicon.svg" alt="" width={40} height={40} priority={!footer} />
      <span>GhoulHouse</span>
    </a>
  );
}

const leadErrors: Record<string, string> = {
  validation: 'Tarkista pakolliset tiedot ja sähköpostiosoite. Lähetä lomake uudelleen.',
  invalid: 'Lomakkeen tietoja ei voitu käsitellä. Tarkista tiedot ja yritä uudelleen.',
  rate_limited: 'Lähetyksiä on tehty liian monta. Yritä hetken kuluttua uudelleen tai lähetä sähköpostia.',
  delivery: 'Lähetys ei onnistunut. Yritä uudelleen tai ota yhteyttä sähköpostitse.',
};

export default async function Home({ searchParams }: { searchParams: Promise<{ lead?: string; service?: string }> }) {
  const params = await searchParams;
  const leadError = params.lead && Object.prototype.hasOwnProperty.call(leadErrors, params.lead)
    ? leadErrors[params.lead]
    : null;
  const selectedService = params.service === 'seo' ? 'seo' : undefined;
  return (
    <div className="homePage">
      <a className="skipLink" href="#main">Siirry pääsisältöön</a>
      <FunnelAnalytics />
      <header className="ghHeader">
        <div className="ghShell ghHeaderInner">
          <Brand />
          <nav className="ghDesktopNav" aria-label="Päänavigaatio">
            {siteNavigation.map(({ href, label }) => <a key={href} href={href}>{label}</a>)}
          </nav>
          <a className="ghButton ghHeaderCta" href="#yhteys">Pyydä ehdotus <span aria-hidden="true">↗</span></a>
          <details className="mobileNav ghMobileNav">
            <summary aria-label="Avaa valikko">Valikko <span aria-hidden="true">+</span></summary>
            <nav aria-label="Mobiilinavigaatio">
              {siteNavigation.map(({ href, label }) => <a key={href} href={href}>{label}</a>)}
              <a href="#yhteys">Pyydä ehdotus</a>
            </nav>
          </details>
        </div>
      </header>

      <main id="main">
        <section className="ghHero ghHeroEditorial ghSwissHero" id="top" aria-labelledby="hero-title">
          <HeroDotGrid />
          <div className="ghShell ghSwissHeroMeta" aria-hidden="true">
            <span>01 / GHOULHOUSE — HELSINKI</span>
            <span>WEBSITES · SOCIAL · SEO</span>
          </div>
          <div className="ghShell ghHeroGrid">
            <div className="ghHeroCopy">
              <p className="ghEyebrow">Digitaalinen näkyvyys suomalaisille palveluyrityksille</p>
              <h1 id="hero-title">HYVÄ TYÖ<br /><span>PITÄÄ NÄKYÄ.</span></h1>
              <div className="ghSwissHeroBelow">
                <p className="ghLead">Verkkosivut, sisältö ja hakukonenäkyvyys. Vähemmän kohinaa. Enemmän näkyvyyttä oikealle työlle.</p>
                <div className="ghSwissHeroAction">
                  <div className="ghHeroActions"><a className="ghButton" href="#yhteys">Pyydä ehdotus <span aria-hidden="true">↗</span></a></div>
                  <p className="ghHeroFootnote">Selkeä ehdotus yrityksenne tilanteen perusteella.</p>
                </div>
              </div>
            </div>
            <aside className="ghHeroEditorialPanel ghSwissHeroGallery" aria-label="GhoulHousen visuaaliset esimerkit">
              <figure className="ghSwissTile ghSwissTile--work">
                <div className="ghSwissTileImage">
                  <Image src="/bathroom-concept-v2.webp" alt="Havainnekuva kylpyhuoneremontista. Ei asiakkaan työmaa." fill sizes="(max-width: 767px) 45vw, 34vw" priority />
                </div>
                <figcaption>01 / KONSEPTIESIMERKKI — EI ASIAKASTYÖ</figcaption>
              </figure>
              <figure className="ghSwissTile ghSwissTile--brand">
                <div className="ghSwissTileBrand">
                  <span className="ghSwissTileSerial">GH / 002</span>
                  <Image src="/ghoulhouse-mark.svg" alt="" width={112} height={112} priority />
                  <strong>GHOUL<br />HOUSE<span>.</span></strong>
                </div>
                <figcaption>02 / GHOULHOUSE — VISUAALINEN IDENTITEETTI</figcaption>
              </figure>
              <figure className="ghSwissTile ghSwissTile--system">
                <div className="ghSwissTileSystem" aria-label="GhoulHousen palvelumallin visuaalinen esitys">
                  <span className="ghSwissTileSerial">GH / 003 — SERVICE SYSTEM</span>
                  <strong>WEB.<br />SOCIAL.<br />SEO<span>.</span></strong>
                  <span className="ghSwissTileSystemRule">YKSI SELKEÄ KOKONAISUUS <span aria-hidden="true">↗</span></span>
                </div>
                <figcaption>03 / PALVELUMALLI — HAVAINNE</figcaption>
              </figure>
            </aside>
          </div>
          <div className="ghShell ghSwissHeroRule" aria-hidden="true">
            <span>INDEPENDENT DIGITAL STUDIO</span>
            <span>SELAA ALAS ↓</span>
          </div>
        </section>

        {/* Analytics consent is placed after the hero, in normal flow on the homepage. */}
        <div id="gh-consent-inflow" className="ghConsentSlot" />

        <section className="ghServices ghSection" id="palvelut" aria-labelledby="services-title">
          <div className="ghShell">
            <div className="ghSectionIntro ghServicesIntro">
              <p className="ghEyebrow">01 / Palvelut</p>
              <h2 id="services-title">IDEASTA<br />NÄKYVÄKSI.</h2>
              <p>Aloitamme olennaisesta. Verkkosivut, jatkuva sisältö ja löydettävyys voidaan toteuttaa erikseen tai yhdessä.</p>
            </div>
            <div className="ghServiceList">
              {services.map((service) => (
                <article key={service.index} className="ghServiceCard">
                  <span className="ghServiceIndex">{service.index} / 03</span>
                  <div className="ghServiceDetail"><h3>{service.title}</h3><p>{service.body}</p><ul className="ghServiceOutputs" aria-label={`${service.title} – toimituksen osat`}>{service.outputs.map((output) => <li key={output}>{output}</li>)}</ul><p className="ghServiceMeta">{service.meta}</p></div>
                  <a className="ghTextLink" href={service.href}>{service.link} <span aria-hidden="true">↗</span></a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="ghSelected ghSection" id="esimerkit" aria-labelledby="selected-title">
          <div className="ghShell ghSelectedGrid">
            <div className="ghSectionIntro">
              <p className="ghEyebrow">02 / Valitut työt</p>
              <h2 id="selected-title">TYÖ PUHUU.<br />NÄYTÄ SE.</h2>
              <p>Oma julkaistu verkkosivutoteutuksemme on ensimmäinen dokumentoitu työnäyte. Lisäämme asiakastöitä vasta julkaisuluvan ja todennettavan aineiston perusteella.</p>
              <a className="ghTextLink" href="/referenssit">Katso toteutukset ja työnäytteet <span aria-hidden="true">↗</span></a>
              <a className="ghSelectedInquiry" href="/verkkosivut-yritykselle#yhteys">Pyydä oma verkkosivuarvio <span aria-hidden="true">↗</span></a>
            </div>
            <a className="ghSelectedCase" href="/tyot/ghoulhouse-verkkosivut" aria-label="Tutustu GhoulHousen oman verkkosivuston toteutusesittelyyn">
              <div className="ghSelectedCaseTop"><span>GH / OMA TOTEUTUS</span><span>AVAA TOTEUTUSESITTELY ↗</span></div>
              <div className="ghSelectedCaseDisplay">
                <Image src="/ghoulhouse-site-proof.png" alt="Kuvakaappaus GhoulHousen aiemmin julkaistusta ghoulhouse.fi-etusivusta." width={1440} height={900} sizes="(max-width: 767px) 100vw, 50vw" className="ghSelectedScreenshot" />
              </div>
              <div className="ghSelectedCaseFoot"><strong>GhoulHousen julkaistu verkkosivusto</strong><span>Oma sivusto — ei asiakasreferenssi. Kuvakaappaus aiemmasta versiosta.</span></div>
            </a>
          </div>
        </section>

        <section className="ghProcess ghSection" id="toiminta" aria-labelledby="process-title">
          <div className="ghShell">
            <div className="ghSectionIntro"><p className="ghEyebrow">Yhteistyömalli</p><h2 id="process-title">SELKEÄ PROSESSI.<br />ALUSTA LOPPUUN.</h2></div>
            <ol className="ghSteps">
              {steps.map(([title, copy], i) => <li key={title}><div className="ghStepTop"><span>{String(i + 1).padStart(2, '0')}</span>{i < 3 && <span aria-hidden="true">→</span>}</div><h3>{title}</h3><p>{copy}</p></li>)}
            </ol>
            <div className="ghProcessInquiry"><span>Kun tiedät, mitä haluat kehittää, seuraava askel on rajattu ehdotus.</span><a href="#yhteys">Pyydä ehdotus <span aria-hidden="true">↗</span></a></div>
          </div>
        </section>

        <section className="ghProofGridSection ghSection" id="referenssit" aria-labelledby="proof-grid-title">
          <div className="ghShell">
            <div className="ghSectionIntro"><p className="ghEyebrow">03 / Toimitusesimerkit</p><h2 id="proof-grid-title">NÄIN TYÖ<br />VALMISTUU.</h2><p>Katso kolme konkreettista esitystapaa: oman verkkosivumme käyttäjäpolku, kuvasta tehtävän somejulkaisun konsepti sekä toimialasivun rakenne. Vain oma julkaistu työ on merkitty toteutukseksi.</p></div>
            <Service3DCarousel items={proofLinks} />
            <a className="ghTextLink ghSectionLink" href="/referenssit">Katso erilliset työnäytteet ja referenssit <span aria-hidden="true">↗</span></a>
          </div>
        </section>

        <section className="ghResources ghSection" id="resurssit" aria-labelledby="resources-title">
          <div className="ghShell">
            <div className="ghSectionIntro"><p className="ghEyebrow">Resurssit / asiantuntijuus</p><h2 id="resources-title">Tietoa ennen päätöstä.</h2><p>Kaksi käytännön opasta ostopäätöksen tueksi. Lisää sisältöä löytyy resurssisivulta.</p></div>
            <div className="ghGuideList">
              {guides.slice(0, 2).map(([label, title, copy, href]) => <a className="ghGuideRow" href={href} key={href}><span className="ghEyebrow">{label}</span><span><strong>{title}</strong><small>{copy}</small></span><span className="ghGuideArrow" aria-hidden="true">↗</span></a>)}
            </div>
            <a className="ghTextLink ghSectionLink" href="/resurssit">Kaikki resurssit <span aria-hidden="true">↗</span></a>
          </div>
        </section>

        <section className="ghFounder ghSection" id="yritys" aria-labelledby="founder-title">
          <div className="ghShell ghFounderGrid">
            <div className="ghFounderIdentity"><Image src="/ghoulhouse-mark.svg" alt="" width={176} height={176} /><p>GhoulHouse Oy<br /><span>Helsinki · suora yhteys Hannaan</span></p></div>
            <div className="ghSectionIntro"><p className="ghEyebrow">04 / GhoulHouse</p><h2 id="founder-title">HANNA NYHOLM.<br />GHOULHOUSE.</h2><p>Hanna Nyholm on GhoulHouse Oy:n yrittäjä ja yhteyshenkilö. Hän vastaa projektin aloituksesta ja työn etenemisen yhteensovittamisesta. Sovimme tehtävät, materiaalit ja hyväksynnät ennen toteutusta.</p><a className="ghTextLink" href="mailto:hanna@ghoulhouse.fi">hanna@ghoulhouse.fi <span aria-hidden="true">↗</span></a></div>
          </div>
        </section>

        <section className="ghContact ghSection" id="yhteys" aria-labelledby="contact-title">
          <div className="ghShell ghContactGrid">
            <div className="ghSectionIntro"><p className="ghEyebrow">05 / Yhteys</p><h2 id="contact-title">ON AIKA<br />NÄKYÄ.</h2><p>Kerro yrityksestäsi ja siitä, mitä haluat parantaa. Palaamme asiaan ehdotuksella sopivasta seuraavasta askeleesta.</p><p className="ghContactNote">Ei sitoumusta yhteydenotosta.</p></div>
            <div className="ghForm">{leadError && <div className="ghServerFormError" role="alert" aria-live="assertive"><strong>Lomaketta ei lähetetty.</strong><p>{leadError}</p></div>}<LeadForm compact mode="proposal" defaultService={selectedService} /></div>
          </div>
        </section>
      </main>
      <footer className="ghFooter">
        <div className="ghShell ghSwissFooterMasthead" aria-hidden="true">GHOULHOUSE<span>.</span></div>
        <div className="ghShell ghFooterMain"><div><Brand footer /><p className="ghFooterTagline">Hyvä työ pitää näkyä.<br />Verkkosivut · Social · SEO.</p></div><div className="ghFooterCompany"><p>GhoulHouse Oy</p><p>Y-tunnus 3651127-5 · Helsinki</p><a href="mailto:hello@ghoulhouse.fi">hello@ghoulhouse.fi</a></div><nav aria-label="Alatunnisteen navigaatio">{navigation.map(([url, label]) => <a key={url} href={url}>{label}</a>)}<a href="/#yritys">GhoulHouse / tekijä</a><a href="/tietosuoja">Tietosuoja</a></nav></div>
        <div className="ghShell ghFooterBottom"><span>© 2026 GhoulHouse Oy</span><a href="#top">Takaisin ylös ↑</a></div>
      </footer>
    </div>
  );
}
