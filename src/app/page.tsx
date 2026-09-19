import Image from 'next/image';
import LeadForm from '@/components/LeadForm';
import FunnelAnalytics from '@/components/analytics/FunnelAnalytics';
import './homepage.css';

const benefits = [
  [
    'Työsi tulee näkyväksi.',
    'Työmaa- ja referenssikuvista syntyy selkeä, tunnistettava julkaisulinja. Hyvä työ ei jää vain puhelimesi kuvagalleriaan.',
  ],
  [
    'Some pysyy mukana arjessa.',
    '12 sisältöä / 30 päivää. Julkaiseminen ei jää työpäivän jälkeen tehtäväksi.',
  ],
  [
    'Yrityksesi näyttää itseltään.',
    'Kuvat, tekstit ja julkaisut muodostavat yhden johdonmukaisen kokonaisuuden. Asiakkaasi tunnistavat sinut.',
  ],
] as const;
const steps = [
  ['Lähetä', 'Toimita työmaa- ja referenssikuvat sekä olennaiset projektifaktat.'],
  ['Me teemme', 'Valitsemme materiaalin, käsittelemme kuvat ja kirjoitamme julkaisutekstit.'],
  ['Hyväksy', 'Näet sisällöt ennen julkaisua. Yksi koottu korjauskierros kuuluu hintaan.'],
  ['Julkaistaan', 'Hyväksytyt sisällöt ajastetaan Instagramiin ja Facebookiin.'],
] as const;
const includes = [
  ['12 alkuperäistä sisältöä', 'Sovitetaan Instagramiin ja Facebookiin.'],
  ['Suunnittelu, kuvat ja tekstit', 'Kuukausirytmi, somemuotoilu ja selkeät toimintakehotteet.'],
  ['Hyväksyntä ja julkaiseminen', 'Yksi koottu korjauskierros, ajastus ja julkaisut.'],
  ['Kevyt kuukausiraportti', 'Näet, mitä julkaistiin ja miten sisällöt toimivat.'],
] as const;
const faq = [
  [
    'Tarvitaanko uusi kuvauspäivä?',
    'Ei lähtökohtaisesti. Palvelu rakennetaan asiakkaan olemassa olevan työmaa- ja referenssimateriaalin ympärille.',
  ],
  [
    'Mitä jos materiaalia on vähän?',
    'Aloitamme siitä mitä on ja kerromme täsmällisesti, mitä lisämateriaalia seuraavaa sisältöerää varten kannattaa kerätä.',
  ],
  [
    'Voinko vaikuttaa sisältöihin?',
    'Kyllä. Hyväksyt faktat ja sisällöt ennen ajastusta. Yksi koottu korjauskierros sisältyy palveluun.',
  ],
  [
    'Onko 490 € jatkuva sopimus?',
    'Ensimmäiset 30 päivää maksavat 490 € + ALV. Jatkosta ei synny automaattista sitoumusta.',
  ],
  [
    'Mitä hintaan ei sisälly?',
    'Maksettu mainonta, kuvauspäivät ja raskas videotuotanto eivät sisälly pakettiin. Sisällöt tehdään toimittamastasi materiaalista Instagramiin ja Facebookiin.',
  ],
  [
    'Kuinka nopeasti julkaiseminen alkaa?',
    'Tuotanto alkaa, kun tarvittavat materiaalit ja faktatiedot on vastaanotettu. Julkaiseminen etenee sovitun tuotanto- ja hyväksyntärytmin mukaisesti.',
  ],
] as const;
const navigation = [
  ['/some-sisallontuotanto', 'Some'],
  ['/verkkosivut-yritykselle', 'Verkkosivut'],
  ['/referenssit', 'Referenssit'],
  ['/resurssit', 'Resurssit'],
] as const;

function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <a className="ghBrand" href={footer ? '#top' : '/'} aria-label="GhoulHouse — etusivu">
      <Image src="/favicon.svg" alt="" width={40} height={40} priority={!footer} />
      <span>GhoulHouse</span>
    </a>
  );
}

export default function Home() {
  return (
    <div className="homePage">
      <a className="skipLink" href="#main">
        Siirry pääsisältöön
      </a>
      <FunnelAnalytics />
      <header className="ghHeader">
        <div className="ghShell ghHeaderInner">
          <Brand />
          <nav className="ghDesktopNav" aria-label="Päänavigaatio">
            {navigation.map(([url, label]) => (
              <a key={url} href={url}>
                {label}
              </a>
            ))}
          </nav>
          <a className="ghButton ghHeaderCta" href="#yhteys">
            Pyydä 2 esimerkkiä <span aria-hidden="true">↗</span>
          </a>
          <details className="mobileNav ghMobileNav">
            <summary aria-label="Avaa valikko">
              Valikko <span aria-hidden="true">+</span>
            </summary>
            <nav aria-label="Mobiilinavigaatio">
              {navigation.map(([url, label]) => (
                <a key={url} href={url}>
                  {label}
                </a>
              ))}
              <a href="#yhteys">Pyydä 2 esimerkkiä</a>
            </nav>
          </details>
        </div>
      </header>

      <main id="main">
        <section className="ghHero" id="top" aria-labelledby="hero-title">
          <div className="ghShell ghHeroGrid">
            <div className="ghHeroCopy">
              <p className="ghEyebrow">Somea remontti- ja LVI-yrityksille</p>
              <h1 id="hero-title">
                TYÖMAAKUVAT
                <br />
                SISÄÄN.
                <br />
                <span>
                  VALMIS SOME
                  <br />
                  ULOS.
                </span>
              </h1>
              <p className="ghLead">
                Sinä teet hyvää työtä. Me teemme työmaakuvistasi valmiit Instagram- ja
                Facebook-sisällöt — suunnittelusta julkaisuun.
              </p>
              <div className="ghHeroActions">
                <a className="ghButton" href="#yhteys">
                  Pyydä 2 sisältöesimerkkiä <span aria-hidden="true">↗</span>
                </a>
              </div>
              <p className="ghHeroPrice">
                <strong>490 € + ALV / 30 päivää</strong>
                <span>12 sisältöä. Ei automaattista jatkoa.</span>
              </p>
            </div>
            <figure className="ghProof" id="esimerkit" aria-labelledby="proof-caption">
              <div className="ghProofComposition">
                <div className="ghRaw">
                  <p className="ghImageLabel">Sinun kuvasi</p>
                  <Image
                    src="/bathroom-concept-v2.webp"
                    alt="Konseptikuva kylpyhuoneesta raakamateriaalina"
                    width={1122}
                    height={1402}
                    sizes="(min-width: 1024px) 150px, 25vw"
                    priority
                  />
                  <span className="ghProofArrow" aria-hidden="true">
                    →
                  </span>
                </div>
                <div className="ghFinished">
                  <p className="ghImageLabel">Valmis julkaisu</p>
                  <div className="ghPost">
                    <div className="ghPostPhoto">
                      <Image
                        src="/bathroom-concept-v2.webp"
                        alt="Sama kylpyhuonekuva osana valmista somejulkaisun konseptia"
                        fill
                        sizes="(min-width: 1440px) 390px, (min-width: 1024px) 30vw, (min-width: 640px) 58vw, 65vw"
                        priority
                      />
                    </div>
                    <div className="ghPostCopy">
                      <span>Kylpyhuoneremontti</span>
                      <strong>
                        Hyvä työ näkyy
                        <br />
                        yksityiskohdissa.
                      </strong>
                      <p>
                        Suunnitteletko remonttia?
                        <br />
                        Kysy lisää palveluistamme.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <figcaption id="proof-caption">
                Konseptiesimerkki — ei asiakastyö.
                <br />
                Kuva luotu tekoälyllä. Sama kuva, valmis julkaisu.
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="ghBenefits ghSection" id="palvelu" aria-labelledby="benefits-title">
          <div className="ghShell ghBenefitsGrid">
            <div className="ghSectionIntro">
              <p className="ghEyebrow">Hyvä työ ansaitsee näkyä</p>
              <h2 id="benefits-title">
                Puhelimessasi on jo
                <br />
                paljon kerrottavaa.
              </h2>
              <p>
                Materiaalia ei yleensä puutu. Prosessi puuttuu. Teemme jo syntyvästä materiaalista
                säännöllistä näyttöä yrityksesi työstä.
              </p>
            </div>
            <div className="ghBenefitList">
              {benefits.map(([title, copy]) => (
                <article key={title}>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="ghOffer ghSection" id="hinta" aria-labelledby="offer-title">
          <div className="ghShell ghOfferGrid">
            <div className="ghOfferAnchor">
              <p className="ghEyebrow">GhoulHouse Some 12</p>
              <h2 id="offer-title">
                12 SISÄLTÖÄ.
                <br />
                30 PÄIVÄÄ.
                <br />
                490 € <span>+ ALV.</span>
              </h2>
              <p>Yksi selkeä paketti. Ensimmäiset 30 päivää ilman automaattista jatkoa.</p>
              <a className="ghButton" href="#yhteys">
                Pyydä 2 sisältöesimerkkiä <span aria-hidden="true">↗</span>
              </a>
            </div>
            <div className="ghInclusions" id="naytto">
              <p className="ghEyebrow">Suunnittelusta julkaisuun</p>
              <ul>
                {includes.map(([title, copy]) => (
                  <li key={title}>
                    <h3>{title}</h3>
                    <p>{copy}</p>
                  </li>
                ))}
              </ul>
              <p className="ghScope">
                Sinulta kuvat ja projektin faktat. Meiltä valmis sisältö. Kuvauspäivät ja maksettu
                mainonta eivät sisälly pakettiin.
              </p>
            </div>
          </div>
        </section>

        <section className="ghProcess ghSection" id="toiminta" aria-labelledby="process-title">
          <div className="ghShell">
            <div className="ghSectionIntro">
              <p className="ghEyebrow">Näin se toimii</p>
              <h2 id="process-title">
                Sinä tunnet työsi.
                <br />
                Me hoidamme sen näkyviin.
              </h2>
            </div>
            <ol className="ghSteps">
              {steps.map(([title, copy], i) => (
                <li key={title}>
                  <div className="ghStepTop">
                    <span>{String(i + 1).padStart(2, '0')}</span>
                    {i < 3 && <span aria-hidden="true">→</span>}
                  </div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="ghFounder ghSection" aria-labelledby="founder-title">
          <div className="ghShell ghFounderGrid">
            <div className="ghFounderIdentity">
              <Image src="/ghoulhouse-mark.svg" alt="" width={176} height={176} />
              <p>
                GhoulHouse Oy
                <br />
                <span>Helsinki</span>
              </p>
            </div>
            <div className="ghSectionIntro">
              <p className="ghEyebrow">Suoraan tekijän kanssa</p>
              <h2 id="founder-title">
                Hanna Nyholm.
                <br />
                Sisällön takana.
              </h2>
              <p>
                Vastaan GhoulHousen asiakastyöstä, sisältösuunnittelusta ja tuotannosta. Tehtäväni
                on tehdä yrityksesi hyvä työ näkyväksi selkeästi ja säännöllisesti.
              </p>
              <p>
                Sisällöt tehdään sinun yrityksesi näköisiksi. Näet ja hyväksyt ne aina ennen
                julkaisua.
              </p>
              <a className="ghTextLink" href="mailto:hanna@ghoulhouse.fi">
                hanna@ghoulhouse.fi <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>

        <div className="ghClosing">
          <section className="ghFaq ghSection" id="ukk" aria-labelledby="faq-title">
            <div className="ghShell ghFaqGrid">
              <div className="ghSectionIntro">
                <p className="ghEyebrow">Hyvä tietää</p>
                <h2 id="faq-title">
                  Ennen kuin
                  <br />
                  aloitetaan.
                </h2>
              </div>
              <div className="ghFaqList">
                {faq.map(([question, answer]) => (
                  <details key={question}>
                    <summary>
                      {question}
                      <span aria-hidden="true">+</span>
                    </summary>
                    <p>{answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
          <section className="ghContact ghSection" id="yhteys" aria-labelledby="contact-title">
            <div className="ghShell ghContactGrid">
              <div className="ghSectionIntro">
                <p className="ghEyebrow">Kaksi esimerkkiä. Maksutta.</p>
                <h2 id="contact-title">
                  NÄE OMA TYÖSI
                  <br />
                  VALMIINA
                  <br />
                  JULKAISUNA.
                </h2>
                <p>
                  Saat kaksi maksutonta sisältöesimerkkiä yrityksesi nykyisestä materiaalista. Näet
                  ensin suunnan. Päätät vasta sitten jatkosta.
                </p>
                <p className="ghContactNote">Ei sitoumusta. Ei myyntipalaveripakkoa.</p>
              </div>
              <div className="ghForm">
                <LeadForm compact />
              </div>
            </div>
          </section>
        </div>
      </main>
      <footer className="ghFooter">
        <div className="ghShell ghFooterMain">
          <div>
            <Brand footer />
            <p className="ghFooterTagline">
              Työmaakuvat sisään.
              <br />
              Valmis some ulos.
            </p>
          </div>
          <div className="ghFooterCompany">
            <p>GhoulHouse Oy</p>
            <p>Y-tunnus 3651127-5 · Helsinki</p>
            <a href="mailto:hello@ghoulhouse.fi">hello@ghoulhouse.fi</a>
          </div>
          <nav aria-label="Alatunnisteen navigaatio">
            {navigation.map(([url, label]) => (
              <a key={url} href={url}>
                {label}
              </a>
            ))}
            <a href="/tietosuoja">Tietosuoja</a>
          </nav>
        </div>
        <div className="ghShell ghFooterBottom">
          <span>© 2026 GhoulHouse Oy</span>
          <a href="#top">Takaisin ylös ↑</a>
        </div>
      </footer>
    </div>
  );
}
