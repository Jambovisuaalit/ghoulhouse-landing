import Image from 'next/image';
import LeadForm from '@/components/LeadForm';
import FunnelAnalytics from '@/components/analytics/FunnelAnalytics';

const workPhoto =
  'https://images.unsplash.com/photo-1768321917661-d4f1a89d2185?auto=format&fit=crop&q=86&w=1800';

const outcomes = [
  ['01', 'VALMIS RYTMI', '12 sisältöä / 30 päivää. Julkaiseminen ei jää työpäivän jälkeen tehtäväksi.'],
  ['02', 'TYÖ NÄKYVÄKSI', 'Olemassa olevat työmaakuvat muutetaan selkeäksi näytöksi osaamisesta.'],
  ['03', 'YHTENÄINEN ILME', 'Kuvat, copy ja julkaisut muodostavat johdonmukaisen kokonaisuuden Instagramiin ja Facebookiin.'],
] as const;

const steps = [
  ['01', 'LÄHETÄ', 'Työmaa- ja referenssikuvat sekä olennaiset projektifaktat.'],
  ['02', 'ME EDITOIMME', 'Valinta, kuvankäsittely, sisältökulma, copy ja CTA.'],
  ['03', 'HYVÄKSY', 'Näet suunnan ennen julkaisua. Palveluun kuuluu yksi koottu korjauskierros.'],
  ['04', 'JULKAISTAAN', 'Hyväksytyt sisällöt ajastetaan Instagramiin ja Facebookiin.'],
] as const;

const includes = [
  '12 alkuperäistä sisältöä / 30 päivää',
  'Instagram + Facebook',
  'Sisältösuunnittelu',
  'Kuvankäsittely ja somemuotoilu',
  'Copy, CTA:t ja julkaisutekstit',
  'Ajastus ja julkaiseminen',
  'Yksi koottu korjauskierros',
  'Kevyt kuukausiraportti',
] as const;

const faq = [
  ['Tarvitaanko uusi kuvauspäivä?', 'Ei lähtökohtaisesti. Palvelu rakennetaan asiakkaan olemassa olevan työmaa- ja referenssimateriaalin ympärille.'],
  ['Mitä jos materiaalia on vähän?', 'Aloitamme siitä mitä on ja kerromme täsmällisesti, mitä lisämateriaalia seuraavaa sisältöerää varten kannattaa kerätä.'],
  ['Voinko vaikuttaa sisältöihin?', 'Kyllä. Asiakas hyväksyy faktat ja julkaisusuunnan ennen ajastusta. Yksi koottu korjauskierros sisältyy palveluun.'],
  ['Onko 490 € jatkuva sopimus?', 'Ensimmäiset 30 päivää maksavat 490 € + ALV. Jatkosta ei synny automaattista sitoumusta.'],
] as const;

export default function Home() {
  return (
    <>
      <a className="skipLink" href="#main">Siirry pääsisältöön</a>
      <FunnelAnalytics />

      <header className="siteHeader">
        <div className="outerShell headerGrid">
          <a className="brandText" href="#top" aria-label="GhoulHouse — sivun alku">GhoulHouse</a>
          <nav className="desktopNav" aria-label="Päänavigaatio">
            <a href="#toiminta">Miten toimii</a>
            <a href="#palvelu">Palvelu</a>
            <a href="#hinta">Hinta</a>
            <a href="#ukk">UKK</a>
          </nav>
          <a className="button button--signal headerAction" href="#yhteys">PYYDÄ 2 ESIMERKKIÄ</a>
          <details className="mobileNav">
            <summary>MENU</summary>
            <nav aria-label="Mobiilinavigaatio">
              <a href="#toiminta">Miten toimii</a>
              <a href="#palvelu">Palvelu</a>
              <a href="#hinta">Hinta</a>
              <a href="#ukk">UKK</a>
              <a href="#yhteys">Pyydä 2 esimerkkiä</a>
            </nav>
          </details>
        </div>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="contentShell heroGrid">
            <div className="heroCopy">
              <p className="kicker">GHOULHOUSE / SISÄLTÖTUOTANTO REMONTTIYRITYKSILLE</p>
              <h1>
                <span>TYÖMAAKUVAT</span>
                <span>SISÄÄN.</span>
                <span>VALMIS SOME</span>
                <span>ULOS.</span>
              </h1>
              <p className="lead">GhoulHouse muuttaa olemassa olevat työmaa- ja referenssikuvat valmiiksi Instagram- ja Facebook-sisällöiksi — suunnittelusta julkaisuun.</p>
              <div className="heroActions">
                <a className="button button--signal" href="#yhteys">PYYDÄ 2 SISÄLTÖESIMERKKIÄ <span aria-hidden="true">→</span></a>
                <a className="textLink" href="#toiminta">Katso miten toimii</a>
              </div>
              <div className="offerLine" aria-label="Palvelun hinta ja sisältö">
                <strong>490 € + ALV / 30 PÄIVÄÄ</strong>
                <span>12 sisältöä · Instagram + Facebook · ei automaattista jatkoa</span>
              </div>
            </div>

            <figure className="proofStage" id="esimerkit" aria-labelledby="proof-caption">
              <div className="proofFrame proofFrame--raw">
                <span className="statusLabel">RAW</span>
                <Image
                  src={workPhoto}
                  alt="Remonttityömaan konseptikuva ennen sisältökäsittelyä"
                  fill
                  priority
                  sizes="(min-width: 1024px) 22vw, (min-width: 768px) 25vw, 50vw"
                />
              </div>
              <div className="editSeam" aria-hidden="true" />
              <div className="proofFrame proofFrame--final">
                <span className="statusLabel statusLabel--final">FINAL</span>
                <Image
                  src={workPhoto}
                  alt="Sama remonttityömaan konseptikuva viimeisteltynä somejulkaisun esimerkkikäsittelyssä"
                  fill
                  priority
                  sizes="(min-width: 1024px) 22vw, (min-width: 768px) 25vw, 50vw"
                />
                <div className="finalOverlay">
                  <small>TYÖMAA / 01</small>
                  <strong>POHJATYÖ<br />RATKAISEE<br />LOPPUTULOKSEN.</strong>
                </div>
              </div>
              <figcaption id="proof-caption">KONSEPTIESIMERKKI — EI ASIAKASTYÖ</figcaption>
            </figure>
          </div>
        </section>

        <section className="statement" aria-labelledby="statement-title">
          <div className="contentShell statementGrid">
            <p className="kicker kicker--inverse">01 / LÄHTÖKOHTA</p>
            <h2 id="statement-title">HYVÄ TYÖ EI TARVITSE ENEMPÄÄ PUHETTA. SE TARVITSEE NÄKYVYYTTÄ.</h2>
            <p>Materiaalia ei yleensä puutu. Prosessi puuttuu. GhoulHouse tekee jo syntyvästä materiaalista valmista, säännöllistä näyttöä yrityksen työstä.</p>
          </div>
        </section>

        <section className="outcomes" id="palvelu" aria-labelledby="outcomes-title">
          <div className="contentShell">
            <div className="sectionIntro">
              <p className="kicker">02 / MITÄ SAAT</p>
              <h2 id="outcomes-title">YKSI TUOTE.<br />KOLME SELKEÄÄ TULOSTA.</h2>
              <p>Ei kanavalistaa. Ei markkinointijargonia. Vain se, mitä yrittäjän arjessa muuttuu.</p>
            </div>
            <div className="outcomeGrid">
              {outcomes.map(([n, title, copy]) => (
                <article className="outcomeCard" key={n}>
                  <span>{n}</span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="process" id="toiminta" aria-labelledby="process-title">
          <div className="contentShell processGrid">
            <div className="processIntro">
              <p className="kicker">03 / PROSESSI</p>
              <h2 id="process-title">SINÄ TEET TYÖN.<br />ME TEEMME SIITÄ JULKAISTAVAA.</h2>
              <p>Neljä vaihetta. Yksi selkeä handoff. Ei raskasta onboardingia tai ylimääräistä tuotantoprosessia.</p>
            </div>
            <ol className="stepList">
              {steps.map(([n, title, copy]) => (
                <li key={n}>
                  <span className="stepNumber">{n}</span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="offer" id="hinta" aria-labelledby="offer-title">
          <div className="contentShell offerGrid">
            <div className="offerAnchor">
              <p className="kicker kicker--inverse">04 / GHOULHOUSE SOME 12</p>
              <h2 id="offer-title">12 SISÄLTÖÄ.<br />30 PÄIVÄÄ.<br /><span>490 € + ALV.</span></h2>
              <p>Yksi selkeä pilotti. Ei kolmea pakettia, lisämyyntilabyrinttia tai automaattista jatkoa.</p>
              <a className="button button--paper" href="#yhteys">PYYDÄ 2 ESIMERKKIÄ <span aria-hidden="true">→</span></a>
            </div>
            <div className="offerList" aria-label="Palveluun sisältyy">
              <p className="kicker kicker--inverse">SISÄLTYY</p>
              <ul>
                {includes.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, '0')}</span>{item}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className="founder" aria-labelledby="founder-title">
          <div className="contentShell founderGrid">
            <div className="founderIndex" aria-hidden="true">HN</div>
            <div className="founderCopy">
              <p className="kicker">05 / TEKIJÄ</p>
              <h2 id="founder-title">HANNA NYHOLM.<br />SISÄLLÖN TAKANA.</h2>
              <p>Hanna vastaa GhoulHousen asiakastyöstä, sisältösuunnittelusta ja tuotannosta. Palvelu on rakennettu pienille käytännönläheisille yrityksille, joilla on jo näyttöä työstä mutta liian vähän aikaa tehdä siitä sisältöä.</p>
              <a className="textLink" href="mailto:hanna@ghoulhouse.fi">hanna@ghoulhouse.fi</a>
            </div>
          </div>
        </section>

        <section className="faq" id="ukk" aria-labelledby="faq-title">
          <div className="contentShell faqGrid">
            <div className="faqIntro">
              <p className="kicker">06 / UKK</p>
              <h2 id="faq-title">ENNEN KUIN<br />PYYDÄT DEMON.</h2>
            </div>
            <div className="faqList">
              {faq.map(([question, answer], index) => (
                <details key={question}>
                  <summary><span>{String(index + 1).padStart(2, '0')}</span><b>{question}</b><i aria-hidden="true">+</i></summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="contact" id="yhteys" aria-labelledby="contact-title">
          <div className="contentShell contactGrid">
            <div className="contactCopy">
              <p className="kicker">07 / ALOITA</p>
              <h2 id="contact-title">NÄE OMA TYÖSI<br />VALMIINA JULKAISUNA.</h2>
              <p>Saat kaksi maksutonta sisältöesimerkkiä yrityksesi nykyisestä materiaalista. Näet ensin lopputuloksen suunnan. Päätät vasta sen jälkeen jatkosta.</p>
              <div className="contactMeta">
                <span>2 konseptiesimerkkiä</span>
                <span>0 €</span>
                <span>Ei sitoumusta</span>
              </div>
            </div>
            <div className="formSurface">
              <LeadForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="siteFooter">
        <div className="contentShell footerGrid">
          <div>
            <p className="footerBrand">GhoulHouse</p>
            <p>Työmaakuvat sisään. Valmis some ulos.</p>
          </div>
          <div>
            <p>Ghoulhouse Oy</p>
            <p>Y-tunnus 3651127-5</p>
            <p>Helsinki, Suomi</p>
          </div>
          <nav aria-label="Alatunnisteen navigaatio">
            <a href="#toiminta">Miten toimii</a>
            <a href="#hinta">Hinta</a>
            <a href="#yhteys">Yhteys</a>
            <a href="/tietosuoja">Tietosuoja</a>
          </nav>
        </div>
        <div className="contentShell footerBottom">
          <span>© 2026 GhoulHouse Oy</span>
          <span>DISTINCTIVE / CONTROLLED / FUNCTIONAL</span>
        </div>
      </footer>
    </>
  );
}
