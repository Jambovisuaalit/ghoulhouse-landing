import ArrowUpRight from '@/components/ArrowUpRight';
import Image from 'next/image';
import LeadForm from '@/components/LeadForm';
import { siteNavigation } from '@/data/site-navigation';
import LiquidGlassFooter from '@/components/LiquidGlassFooter';
import './homepage.css';
import './homepage-swiss.css';
import './editorial-home.css';

const services = [
  {
    index: '01',
    title: 'SOCIAL',
    kind: 'PÄÄPALVELU',
    body: 'Lähetät työmaakuvat ja työn faktat. Suunnittelemme, kirjoitamme ja julkaisemme 12 sisältöä Instagramiin ja Facebookiin 30 päivän aikana.',
    outputs: ['12 alkuperäistä sisältöä / 30 päivää', 'Instagram ja Facebook', 'Yksi korjauskierros ja kuukausiraportti'],
    meta: 'SOME 12 · 490 € + ALV / 30 päivää',
    href: '/some-sisallontuotanto',
    link: 'Katso Social-paketti',
  },
  {
    index: '02',
    title: 'VERKKOSIVUT',
    kind: 'LISÄPALVELU',
    body: 'Kun tarvitset myös selkeän kotipesän työllesi, rakennamme sivuston, josta asiakas löytää palvelut ja yhteydenoton.',
    outputs: ['Palvelu- ja toimialarakenne', 'Mobiilitoteutus ja yhteydenotto', 'Tekninen SEO ja julkaisu'],
    meta: 'Tarjous toteutuksen laajuuden perusteella',
    href: '/verkkosivut-yritykselle',
    link: 'Katso verkkosivutoteutus',
  },
  {
    index: '03',
    title: 'SEO',
    kind: 'LISÄPALVELU',
    body: 'Hakukone ja asiakas ymmärtävät, mitä palveluita tarjoatte ja millä alueella. Toteutuksen tarkka rajaus määritellään nykytilan perusteella.',
    outputs: ['Palvelu- ja toimialasivujen rakenne', 'Otsikot, kuvaukset ja sisältö', 'Sisäinen linkitys'],
    meta: 'Sisältö ja hinta sovitaan tarjouksessa',
    href: '/?service=seo#yhteys',
    link: 'Pyydä SEO-ehdotus',
  },
] as const;

const steps = [
  ['Lähetä kuvat', 'Toimitat omat työmaakuvat, työn faktat ja tarvittavat julkaisuluvat.'],
  ['Sisällöt', 'Suunnittelemme ja kirjoitamme 12 sisältöä materiaaleistasi.'],
  ['Hyväksyntä', 'Tarkistat sisällöt; palveluun kuuluu yksi koottu korjauskierros.'],
  ['Julkaisu', 'Julkaisemme hyväksytyt sisällöt Instagramissa ja Facebookissa sekä toimitamme kevyen raportin.'],
] as const;

const editorialRoutes = [
  ['01', 'RAKENNUS', 'Työmaakuvat, työn vaiheet ja valmiit kohteet.', '/rakennusyrityksille'],
  ['02', 'LVI', 'Asennukset ja tekninen työ ymmärrettävästi näkyville.', '/lvi-yrityksille'],
  ['03', 'INSTAGRAM', 'Kuvat ja tekstit yhtenäiseksi julkaisulinjaksi.', '/instagram-sisallontuotanto'],
] as const;

const guides = [
  ['01 / HINTA', 'Mitä 12 some-sisältöä maksaa?', 'Social-paketin sisältö ja 490 € + ALV / 30 päivän hinta.', '/some-sisallontuotanto/hinta'],
  ['02 / OPAS', 'Työmaakuvat sosiaaliseen mediaan', 'Mitä kuvata, jotta omasta työstä syntyy julkaistavaa sisältöä.', '/oppaat/tyomaakuvat-sosiaaliseen-mediaan'],
] as const;

function Brand() {
  return (
    <a className="ghBrand" href="/" aria-label="GhoulHouse — etusivu">
      <Image className="ghOfficialHeaderLogo" src="/ghoulhouse-logo.svg" alt="" width={175} height={58} priority />
      <span className="ghOfficialMobileLockup" aria-hidden="true">
        <Image className="ghOfficialMobileMark" src="/favicon.svg" alt="" width={35} height={35} priority />
        <Image className="ghOfficialMobileWordmark" src="/ghoulhouse-wordmark-black.svg" alt="" width={148} height={30} priority />
      </span>
    </a>
  );
}

const leadErrors: Record<string, string> = {
  validation: 'Tarkista pakolliset tiedot ja sähköpostiosoite. Lähetä lomake uudelleen.',
  invalid: 'Lomakkeen tietoja ei voitu käsitellä. Tarkista tiedot ja yritä uudelleen.',
  rate_limited: 'Lähetyksiä on tehty liian monta. Yritä hetken kuluttua uudelleen tai lähetä sähköpostia.',
  delivery: 'Lähetys ei onnistunut. Yritä uudelleen tai ota yhteyttä sähköpostitse.',
};

export default async function Home({ searchParams }: { searchParams: Promise<{ lead?: string; service?: string; intent?: string }> }) {
  const params = await searchParams;
  const leadError = params.lead && Object.prototype.hasOwnProperty.call(leadErrors, params.lead)
    ? leadErrors[params.lead]
    : null;
  const selectedService = params.service === 'seo' || params.service === 'social' || params.service === 'websites' ? params.service : undefined;
  return (
    <div className="homePage">
      <a className="skipLink" href="#main">Siirry pääsisältöön</a>

      <header className="ghHeader">
        <div className="ghShell ghHeaderInner">
          <Brand />
          <nav className="ghDesktopNav" aria-label="Päänavigaatio">
            {siteNavigation.map(({ href, label }) => <a key={href} href={href}>{label}</a>)}
          </nav>
          <a className="ghButton ghHeaderCta" href="/?intent=photos#yhteys">Pyydä 2 sisältöesimerkkiä <span aria-hidden="true"><ArrowUpRight /></span></a>
          <details className="mobileNav ghMobileNav">
            <summary aria-label="Avaa valikko">Valikko <span aria-hidden="true">+</span></summary>
            <nav aria-label="Mobiilinavigaatio">
              {siteNavigation.map(({ href, label }) => <a key={href} href={href}>{label}</a>)}
              <a href="/?intent=photos#yhteys">Pyydä 2 sisältöesimerkkiä</a>
            </nav>
          </details>
        </div>
      </header>

      <main id="main">
        <section className="ghHero ghHeroEditorial ghArtHero" id="top" aria-labelledby="hero-title">

          <div className="ghShell ghArtHeroLayout">
            <div className="ghArtHeroCopy">
              <p className="ghEyebrow ghArtHeroEyebrow">REMONTTI- JA LVI-YRITYKSILLE UUDELLAMAALLA</p>
              <h1 id="hero-title"><span>TYÖMAAKUVAT</span><span>SISÄÄN.</span><span>VALMIS SOME</span><span>ULOS.</span></h1>
              <div className="ghArtHeroBottom">
                <p className="ghLead">Muutamme omat työmaakuvanne valmiiksi Instagram- ja Facebook-sisällöiksi. Suunnittelu, tekstit ja julkaisu hoituvat puolestanne.</p>
                <p className="ghHeroOffer">12 sisältöä / 30 pv / 490 € + ALV. Ei jatkosopimusta. Jos sisällöt eivät valmistu, teemme ne ilmaiseksi.</p>
                <div className="ghArtHeroAction">
                  <div className="ghHeroActions">
                    <a className="ghButton" href="/?intent=photos#yhteys">Pyydä 2 sisältöesimerkkiä <span aria-hidden="true"><ArrowUpRight /></span></a>
                  </div>
                  <p className="ghHeroFootnote">Maksuttomat esimerkit omista kuvistanne. Saatte toimitusohjeet vastausviestissä.</p>
                </div>
              </div>
            </div>
            <figure className="ghArtHeroVisual">
              <div className="ghArtHeroImage">
                <Image src="/bathroom-concept-v2.webp"
                  alt="Havainnekuva keskeneräisestä kylpyhuoneremontista. Ei asiakkaan työmaa."
                  fill sizes="(max-width:767px) 100vw, (max-width:1023px) 54vw, 42vw" priority />
              </div>
              <figcaption>VISUAALINEN KONSEPTI / EI ASIAKASTYÖ</figcaption>
            </figure>
          </div>
        </section>

        {/* Analytics consent is placed after the hero, in normal flow on the homepage. */}
        <div id="gh-consent-inflow" className="ghConsentSlot" />

        <section className="ghServices ghSection" id="palvelut" aria-labelledby="services-title">
          <div className="ghShell">
            <div className="ghSectionIntro ghServicesIntro">
              <p className="ghEyebrow">01 / Palvelut</p>
              <h2 id="services-title">SOME ENSIN.<br />LISÄÄ TARPEEN MUKAAN.</h2>
              <p>Social on pääpalvelumme remontti- ja LVI-yrityksille. Verkkosivut ja SEO ovat erikseen sovittavia lisäpalveluita.</p>
            </div>
            <div className="ghServiceList">
              {services.map((service) => (
                <article key={service.index} className={`ghServiceCard${service.index === '01' ? '' : ' ghServiceCardSecondary'}`}>

                  <div className="ghServiceDetail"><span className="ghServiceKind">{service.kind}</span><h3>{service.title}</h3><p>{service.body}</p>{service.index === '01' && <ul className="ghServiceOutputs" aria-label={`${service.title} – toimituksen osat`}>{service.outputs.map((output) => <li key={output}>{output}</li>)}</ul>}{service.index === '01' && <p className="ghServiceMeta">{service.meta}</p>}</div>
                  <a className={service.index === '01' ? 'ghButton ghServiceCta' : 'ghTextLink ghServiceCta'} href={service.href}>{service.link} <span aria-hidden="true"><ArrowUpRight /></span></a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="ghConcepts ghSection" id="konseptit" aria-labelledby="concepts-title">
          <div className="ghShell">
            <div className="ghSectionIntro"><p className="ghEyebrow">Sisältökonseptit</p><h2 id="concepts-title">NÄIN TYÖSTÄ<br />TULEE SISÄLTÖÄ.</h2><p>Kolme havainnollistavaa julkaisuideaa. Kuvissa ei ole GhoulHousen asiakastöitä eikä niihin liity tulosväitteitä.</p></div>
            <div className="ghConceptGrid">
              <article className="ghConceptCard">
                <div className="ghConceptImage"><Image src="/proof-before.webp" alt="Havainnekuva keskeneräisestä remonttitilasta" width={420} height={560} sizes="(max-width: 767px) 100vw, 33vw" /><span className="ghConceptStamp">KONSEPTIESIMERKKI — EI ASIAKASTYÖ</span></div>
                <div className="ghConceptCopy"><span>01 / TYÖN VAIHE</span><h3>Ennen valmista pintaa näkyy varsinainen työ.</h3><p>Esimerkkijulkaisu kertoo, mitä työvaiheessa tehdään ja miksi sillä on merkitystä.</p></div>
              </article>
              <article className="ghConceptCard">
                <div className="ghConceptImage"><Image src="/bathroom-concept-v2.webp" alt="Havainnekuva kylpyhuoneesta, ei toteutettu asiakaskohde" width={1122} height={1402} sizes="(max-width: 767px) 100vw, 33vw" /><span className="ghConceptStamp">KONSEPTIESIMERKKI — EI ASIAKASTYÖ</span></div>
                <div className="ghConceptCopy"><span>02 / VALMIS KOHDE</span><h3>Valmis tila, selkeä kuvaus tehdystä työstä.</h3><p>Esimerkkijulkaisu yhdistää kohdekuvan ja asiakkaalle ymmärrettävän kuvatekstin.</p></div>
              </article>
              <article className="ghConceptCard">
                <div className="ghConceptImage ghConceptGraphic"><span className="ghConceptGraphicType">TYÖMAA<br />→ JULKAISU</span><span className="ghConceptGraphicRule">KUVAT · FAKTAT · TEKSTI</span><span className="ghConceptStamp">KONSEPTIESIMERKKI — EI ASIAKASTYÖ</span></div>
                <div className="ghConceptCopy"><span>03 / SISÄLTÖGRAFIIKKA</span><h3>Työkuvasta valmis somejulkaisu.</h3><p>Esimerkki näyttää, miten kuva, otsikko ja tarkentava teksti kootaan julkaistavaan muotoon.</p></div>
              </article>
            </div>
          </div>
        </section>

        <section className="ghSelected ghSection" id="esimerkit" aria-labelledby="selected-title">
          <div className="ghShell ghSelectedGrid">
            <div className="ghSectionIntro">
              <p className="ghEyebrow">02 / Valitut työt</p>
              <h2 id="selected-title">TYÖ PUHUU.<br /><em>NÄYTÄ SE.</em></h2>
              <p>Oma julkaistu verkkosivutoteutuksemme on ensimmäinen dokumentoitu työnäyte. Lisäämme asiakastöitä vasta julkaisuluvan ja todennettavan aineiston perusteella.</p>
              <a className="ghTextLink" href="/referenssit">Katso toteutukset ja työnäytteet <span aria-hidden="true"><ArrowUpRight /></span></a>
            </div>
            <a className="ghSelectedCase" href="/tyot/ghoulhouse-verkkosivut" aria-label="Tutustu GhoulHousen oman verkkosivuston toteutusesittelyyn">
              <div className="ghSelectedCaseTop"><span>GH / OMA TOTEUTUS</span><span>AVAA TOTEUTUSESITTELY <ArrowUpRight /></span></div>
              <div className="ghSelectedCaseDisplay">
                <Image src="/ghoulhouse-site-proof.png" alt="Kuvakaappaus GhoulHousen aiemmin julkaistusta ghoulhouse.fi-etusivusta." width={1440} height={900} sizes="(max-width: 767px) 100vw, 50vw" className="ghSelectedScreenshot" />
              </div>
              <div className="ghSelectedCaseFoot"><strong>GhoulHousen julkaistu verkkosivusto</strong><span>Oma sivusto — ei asiakasreferenssi. Kuvakaappaus aiemmasta versiosta.</span></div>
            </a>
          </div>
        </section>

        <section className="ghProcess ghSection" id="toiminta" aria-labelledby="process-title">
          <div className="ghShell">
            <div className="ghSectionIntro"><p className="ghEyebrow">Social / toimitus</p><h2 id="process-title">KUVISTA<br />JULKAISUIHIN.</h2></div>
            <ol className="ghSteps">
              {steps.map(([title, copy], i) => <li key={title}><div className="ghStepTop"><span>{String(i + 1).padStart(2, '0')}</span>{i < 3 && <span aria-hidden="true">→</span>}</div><h3>{title}</h3><p>{copy}</p></li>)}
            </ol>
          </div>
        </section>

        <section className="ghProofGridSection ghSection ghArtRoutesSection" id="referenssit" aria-labelledby="proof-grid-title">

          <div className="ghShell ghArtRoutesLayout">
            <div className="ghSectionIntro">
              <p className="ghEyebrow">03 / TOIMIALAT JA KANAVAT</p>
              <h2 id="proof-grid-title">JOKAISELLA<br /><em>TYÖLLÄ ON</em><br />TARINANSA.</h2>
              <p>Rakennusalan ja LVI-yritysten työstä syntyy sisältöä. Näin näytämme osaamisen eri palveluissa ja kanavissa — ilman keksittyjä asiakastuloksia.</p>
              <a className="ghTextLink ghSectionLink" href="/referenssit">Omat työt ja toteutusesimerkit <span aria-hidden="true"><ArrowUpRight /></span></a>
            </div>
            <nav className="ghArtRouteList" aria-label="Toimialojen ja kanavien palvelusivut">
              {editorialRoutes.map(([number,title,body,url]) => (
                <a key={url} className="ghArtRoute" href={url}>
                  <span className="ghArtRouteIndex">{number} / 03</span>
                  <span className="ghArtRouteMain"><strong>{title}</strong><small>{body}</small></span>
                  <span className="ghArtRouteArrow" aria-hidden="true"><ArrowUpRight /></span>
                </a>
              ))}
            </nav>
          </div>
        </section>

        <section className="ghResources ghSection" id="resurssit" aria-labelledby="resources-title">
          <div className="ghShell">
            <div className="ghSectionIntro"><p className="ghEyebrow">Resurssit / asiantuntijuus</p><h2 id="resources-title">Tietoa ennen päätöstä.</h2><p>Socialin hinta ja käytännön opas työmaakuvien hyödyntämiseen. Lisää sisältöä löytyy resurssisivulta.</p></div>
            <div className="ghGuideList">
              {guides.slice(0, 2).map(([label, title, copy, href]) => <a className="ghGuideRow" href={href} key={href}><span className="ghEyebrow">{label}</span><span><strong>{title}</strong><small>{copy}</small></span><span className="ghGuideArrow" aria-hidden="true"><ArrowUpRight /></span></a>)}
            </div>
            <a className="ghTextLink ghSectionLink" href="/resurssit">Kaikki resurssit <span aria-hidden="true"><ArrowUpRight /></span></a>
          </div>
        </section>

        <section className="ghFounder ghSection" id="yritys" aria-labelledby="founder-title">
          <div className="ghShell ghFounderGrid">
            <div className="ghFounderIdentity"><Image className="ghFounderPortrait" src="/hanna-nyholm-portrait.webp" alt="Hanna Nyholm, GhoulHouse Oy:n yrittäjä" width={960} height={1200} sizes="(max-width: 767px) 90vw, 420px" /><p>GhoulHouse Oy<br /><span>Helsinki · suora yhteys Hannaan</span></p></div>
            <div className="ghSectionIntro"><p className="ghEyebrow">04 / GhoulHouse</p><h2 id="founder-title">HANNA NYHOLM.<br />GHOULHOUSE.</h2><p>Hanna Nyholm on GhoulHouse Oy:n yrittäjä ja yhteyshenkilö. Hän vastaa projektin aloituksesta ja työn etenemisen yhteensovittamisesta. Sovimme tehtävät, materiaalit ja hyväksynnät ennen toteutusta.</p><a className="ghTextLink" href="mailto:hanna@ghoulhouse.fi">hanna@ghoulhouse.fi <span aria-hidden="true"><ArrowUpRight /></span></a></div>
          </div>
        </section>

        <section className="ghContact ghSection" id="yhteys" aria-labelledby="contact-title">
          <div className="ghShell ghContactGrid">
            <div className="ghSectionIntro"><p className="ghEyebrow">05 / Yhteys</p><h2 id="contact-title">ON AIKA<br />NÄKYÄ.</h2><p>{params.intent === 'photos' ? 'Pyydä kaksi maksutonta sisältöesimerkkiä. Käymme materiaalinne läpi ja sovimme kahden työkuvan toimitustavan vastausviestissä.' : 'Kerro yrityksestäsi ja siitä, mitä haluat parantaa. Palaamme asiaan ehdotuksella sopivasta seuraavasta askeleesta.'}</p><p className="ghContactNote">Ei sitoumusta yhteydenotosta.</p></div>
            <div className="ghForm">{leadError && <div className="ghServerFormError" role="alert" aria-live="assertive"><strong>Lomaketta ei lähetetty.</strong><p>{leadError}</p></div>}<LeadForm compact mode={params.intent === 'photos' ? 'social' : 'proposal'} defaultService={selectedService} /></div>
          </div>
        </section>
      </main>
      <LiquidGlassFooter home />
    </div>
  );
}
