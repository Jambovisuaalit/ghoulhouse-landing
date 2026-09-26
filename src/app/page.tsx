import Image from 'next/image';
import LeadForm from '@/components/LeadForm';
import './homepage.css';

const navigation = [
  ['/verkkosivut-yritykselle', 'Verkkosivut'],
  ['/some-sisallontuotanto', 'Social'],
  ['/resurssit', 'SEO & resurssit'],
  ['/referenssit', 'Referenssit'],
] as const;

const services = [
  {
    index: '01',
    title: 'VERKKOSIVUT',
    body: 'Selkeä palvelurakenne, oma työnäyttö ja yhteydenotto samassa toimivassa kokonaisuudessa.',
    href: '/verkkosivut-yritykselle',
    link: 'Tutustu verkkosivuihin',
  },
  {
    index: '02',
    title: 'SOCIAL',
    body: 'Oman työn kuvat ja faktat suunnitelluiksi julkaisuiksi Instagramiin ja Facebookiin.',
    meta: 'SOME 12 · 12 sisältöä / 30 päivää · 490 € + ALV',
    href: '/some-sisallontuotanto',
    link: 'Tutustu sisällöntuotantoon',
  },
  {
    index: '03',
    title: 'SEO',
    body: 'Hakukonenäkyvyyden perusta: ymmärrettävät sisällöt, sivurakenne ja löydettävät palvelut.',
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
  ['WEBSITES', 'Palvelut ja yhteydenotto', 'Julkaistu GhoulHousen verkkosivurakenne.', '/verkkosivut-yritykselle'],
  ['SOCIAL', 'Sisältötuotannon malli', 'SOME 12 -palvelun sisältö ja toimitustapa.', '/some-sisallontuotanto'],
  ['TOIMIALA', 'Työn näyttäminen verkossa', 'Rakennusalan verkkosivujen toimialakohtainen rakenne.', '/verkkosivut/rakennus'],
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

      <header className="ghHeader">
        <div className="ghShell ghHeaderInner">
          <Brand />
          <nav className="ghDesktopNav" aria-label="Päänavigaatio">
            {navigation.map(([url, label]) => <a key={url} href={url}>{label}</a>)}
          </nav>
          <a className="ghButton ghHeaderCta" href="#yhteys">Pyydä ehdotus <span aria-hidden="true">↗</span></a>
          <details className="mobileNav ghMobileNav">
            <summary aria-label="Avaa valikko">Valikko <span aria-hidden="true">+</span></summary>
            <nav aria-label="Mobiilinavigaatio">
              {navigation.map(([url, label]) => <a key={url} href={url}>{label}</a>)}
              <a href="#yhteys">Pyydä ehdotus</a>
            </nav>
          </details>
        </div>
      </header>

      <main id="main">
        <section className="ghHero ghHeroEditorial" id="top" aria-labelledby="hero-title">
          <div className="ghShell ghHeroGrid">
            <div className="ghHeroCopy">
              <p className="ghEyebrow">GhoulHouse Oy · Digitaalinen näkyvyys palveluyrityksille</p>
              <h1 id="hero-title">HYVÄ TYÖ<br /><span>PITÄÄ NÄKYÄ.</span></h1>
              <p className="ghLead">Verkkosivut, sisältö ja hakukonenäkyvyys suomalaisille palveluyrityksille.</p>
              <div className="ghHeroActions">
                <a className="ghButton" href="#yhteys">Pyydä ehdotus <span aria-hidden="true">↗</span></a>
              </div>
              <p className="ghHeroFootnote">Yksi selkeä ehdotus yrityksenne tilanteen perusteella.</p>
            </div>
            <aside className="ghHeroEditorialPanel" aria-label="GhoulHousen toimintatapa">
              <div className="ghHeroPanelTop"><span>GH / 01</span><span>Helsinki · Suomi</span></div>
              <Image src="/ghoulhouse-mark.svg" alt="" width={116} height={116} priority className="ghHeroPanelMark" />
              <p>TEHTY TYÖ.<br />SELKEÄ VIESTI.<br />LÖYDETTÄVÄ YRITYS.</p>
              <div className="ghHeroPanelBottom"><span>WEBSITES</span><span>SOCIAL</span><span>SEO</span></div>
            </aside>
          </div>
        </section>

        {/* Analytics consent is placed after the hero, in normal flow on the homepage. */}
        <div id="gh-consent-inflow" className="ghConsentSlot" />

        <section className="ghSelected ghSection" id="esimerkit" aria-labelledby="selected-title">
          <div className="ghShell ghSelectedGrid">
            <div className="ghSectionIntro">
              <p className="ghEyebrow">Oma toteutus / julkaistu</p>
              <h2 id="selected-title">Näytä työ.<br />Älä vain kuvaile sitä.</h2>
              <p>Esimerkkinä oma julkaistu sivustomme: palvelut, asiantuntijasisällöt ja yhteydenotto löytyvät yhdestä rakenteesta.</p>
              <a className="ghTextLink" href="/referenssit">Katso toteutukset ja työnäytteet <span aria-hidden="true">↗</span></a>
            </div>
            <a className="ghSelectedCase" href="https://ghoulhouse.fi/" target="_blank" rel="noopener noreferrer" aria-label="Avaa julkaistu GhoulHousen verkkosivusto uudessa välilehdessä">
              <div className="ghSelectedCaseTop"><span>GH / OMA TOTEUTUS</span><span>ghoulhouse.fi ↗</span></div>
              <div className="ghSelectedCaseDisplay">
                <Image src="/ghoulhouse-site-proof.png" alt="Kuvakaappaus GhoulHousen julkaistusta ghoulhouse.fi-etusivusta." width={1440} height={900} sizes="(max-width: 767px) 100vw, 50vw" className="ghSelectedScreenshot" />
              </div>
              <div className="ghSelectedCaseFoot"><strong>GhoulHousen julkaistu verkkosivusto</strong><span>Oma sivusto — ei asiakasreferenssi eikä tulosväite.</span></div>
            </a>
          </div>
        </section>

        <section className="ghServices ghSection" id="palvelut" aria-labelledby="services-title">
          <div className="ghShell">
            <div className="ghSectionIntro ghServicesIntro">
              <p className="ghEyebrow">Kolme palvelua, yksi kokonaisuus</p>
              <h2 id="services-title">Mitä yrityksenne<br />tarvitsee näkyäkseen?</h2>
              <p>Aloitamme olennaisesta. Verkkosivut, jatkuva sisältö ja löydettävyys voidaan toteuttaa erikseen tai yhdessä.</p>
            </div>
            <div className="ghServiceList">
              {services.map((service) => (
                <article key={service.index} className="ghServiceCard">
                  <span className="ghServiceIndex">{service.index} / 03</span>
                  <div><h3>{service.title}</h3><p>{service.body}</p>{'meta' in service && <p className="ghServiceMeta">{service.meta}</p>}</div>
                  <a className="ghTextLink" href={service.href}>{service.link} <span aria-hidden="true">↗</span></a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="ghProcess ghSection" id="toiminta" aria-labelledby="process-title">
          <div className="ghShell">
            <div className="ghSectionIntro"><p className="ghEyebrow">Yhteistyömalli</p><h2 id="process-title">Selkeästi alusta<br />julkaisuun asti.</h2></div>
            <ol className="ghSteps">
              {steps.map(([title, copy], i) => <li key={title}><div className="ghStepTop"><span>{String(i + 1).padStart(2, '0')}</span>{i < 3 && <span aria-hidden="true">→</span>}</div><h3>{title}</h3><p>{copy}</p></li>)}
            </ol>
          </div>
        </section>

        <section className="ghProofGridSection ghSection" id="referenssit" aria-labelledby="proof-grid-title">
          <div className="ghShell">
            <div className="ghSectionIntro"><p className="ghEyebrow">Palveluiden esittely</p><h2 id="proof-grid-title">Kolme tapaa tehdä<br />työ näkyväksi.</h2><p>Alla olevat nostot esittelevät palveluita ja toimialaratkaisuja, eivät toteutuneita asiakastöitä tai asiakastuloksia.</p></div>
            <div className="ghEditorialGrid">
              {proofLinks.map(([type, title, copy, href]) => <a className="ghEditorialCard" href={href} key={type}><span className="ghEyebrow">{type}</span><h3>{title}</h3><p>{copy}</p><span className="ghEditorialCardArrow" aria-hidden="true">↗</span></a>)}
            </div>
            <a className="ghTextLink ghSectionLink" href="/referenssit">Katso erilliset työnäytteet ja referenssit <span aria-hidden="true">↗</span></a>
          </div>
        </section>

        <section className="ghResources ghSection" id="resurssit" aria-labelledby="resources-title">
          <div className="ghShell">
            <div className="ghSectionIntro"><p className="ghEyebrow">Resurssit / asiantuntijuus</p><h2 id="resources-title">Tietoa ennen päätöstä.</h2><p>Käytännön oppaat verkkosivujen, sisällön ja yrityksen näkyvyyden suunnitteluun.</p></div>
            <div className="ghGuideList">
              {guides.map(([label, title, copy, href]) => <a className="ghGuideRow" href={href} key={href}><span className="ghEyebrow">{label}</span><span><strong>{title}</strong><small>{copy}</small></span><span className="ghGuideArrow" aria-hidden="true">↗</span></a>)}
            </div>
            <a className="ghTextLink ghSectionLink" href="/resurssit">Kaikki resurssit <span aria-hidden="true">↗</span></a>
          </div>
        </section>

        <section className="ghFounder ghSection" aria-labelledby="founder-title">
          <div className="ghShell ghFounderGrid">
            <div className="ghFounderIdentity"><Image src="/ghoulhouse-mark.svg" alt="" width={176} height={176} /><p>GhoulHouse Oy<br /><span>Helsinki</span></p></div>
            <div className="ghSectionIntro"><p className="ghEyebrow">Yhteys suoraan tekijään</p><h2 id="founder-title">Hanna Nyholm.<br />GhoulHouse.</h2><p>GhoulHouse rakentaa palveluyritysten verkkonäkyvyyttä verkkosivujen, sisällön ja löydettävyyden kautta. Sovimme tehtävät ja hyväksynnät ennen toteutusta.</p><a className="ghTextLink" href="mailto:hanna@ghoulhouse.fi">hanna@ghoulhouse.fi <span aria-hidden="true">↗</span></a></div>
          </div>
        </section>

        <section className="ghContact ghSection" id="yhteys" aria-labelledby="contact-title">
          <div className="ghShell ghContactGrid">
            <div className="ghSectionIntro"><p className="ghEyebrow">Aloitetaan yrityksenne tilanteesta</p><h2 id="contact-title">ONKO TEILLÄ HYVÄ PALVELU,<br />MUTTA VERKOSSA SE EI VIELÄ NÄY?</h2><p>Kerro yrityksestäsi ja siitä, mitä haluat parantaa. Palaamme asiaan ehdotuksella sopivasta seuraavasta askeleesta.</p><p className="ghContactNote">Ei sitoumusta yhteydenotosta.</p></div>
            <div className="ghForm">{leadError && <div className="ghServerFormError" role="alert" aria-live="assertive"><strong>Lomaketta ei lähetetty.</strong><p>{leadError}</p></div>}<LeadForm compact mode="proposal" defaultService={selectedService} /></div>
          </div>
        </section>
      </main>
      <footer className="ghFooter">
        <div className="ghShell ghFooterMain"><div><Brand footer /><p className="ghFooterTagline">Hyvä työ pitää näkyä.<br />Verkkosivut · Social · SEO.</p></div><div className="ghFooterCompany"><p>GhoulHouse Oy</p><p>Y-tunnus 3651127-5 · Helsinki</p><a href="mailto:hello@ghoulhouse.fi">hello@ghoulhouse.fi</a></div><nav aria-label="Alatunnisteen navigaatio">{navigation.map(([url, label]) => <a key={url} href={url}>{label}</a>)}<a href="/tietosuoja">Tietosuoja</a></nav></div>
        <div className="ghShell ghFooterBottom"><span>© 2026 GhoulHouse Oy</span><a href="#top">Takaisin ylös ↑</a></div>
      </footer>
    </div>
  );
}
