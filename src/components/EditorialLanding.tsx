import Image from 'next/image';
import LeadForm from '@/components/contact/LeadForm';
import { siteConfig } from '@/config/site';
import {
  contentExamples,
  faqItems,
  offerExcludes,
  offerIncludes,
  processSteps,
} from '@/data/landing';

const conceptPhoto =
  'https://images.unsplash.com/photo-1768321917661-d4f1a89d2185?auto=format&fit=crop&fm=jpg&q=88&w=1800';

const navItems = [
  ['Palvelu', '#palvelu'],
  ['Miten toimii', '#miten-toimii'],
  ['Esimerkit', '#esimerkit'],
  ['Hinta', '#hinta'],
] as const;

export default function EditorialLanding() {
  return (
    <>
      <header className="v3-nav">
        <div className="v3-container v3-nav__inner">
          <a href="#top" className="v3-nav__brand" aria-label="GhoulHouse — sivun alku">
            <Image
              src="/logo-horizontal.svg"
              alt="GhoulHouse"
              width={1280}
              height={260}
              priority
            />
          </a>

          <nav className="v3-nav__links" aria-label="Päänavigaatio">
            {navItems.map(([label, href]) => (
              <a key={href} href={href}>{label}</a>
            ))}
          </nav>

          <a className="v3-nav__cta" href="#laheta-kuvat" aria-label={siteConfig.cta.primary}>
            <span className="v3-nav__cta-long">PYYDÄ 2 ESIMERKKIÄ</span>
            <span className="v3-nav__cta-short">2 ESIMERKKIÄ</span>
          </a>
        </div>
      </header>

      <main id="main-content">
        <section id="top" className="v3-hero" aria-labelledby="hero-title">
          <div className="v3-container v3-hero__grid">
            <div className="v3-hero__copy">
              <p className="v3-kicker">SISÄLTÖPALVELU REMONTTI- JA RAKENNUSYRITYKSILLE</p>
              <h1 id="hero-title" className="v3-hero__title">
                <span>TYÖMAAKUVAT</span>
                <span>SISÄÄN.</span>
                <span className="v3-signal">VALMIS SOME ULOS.</span>
              </h1>
              <p className="v3-hero__lead">
                GhoulHouse tekee remontti- ja rakennusyritysten työmaakuvista valmista sisältöä Instagramiin ja Facebookiin — ilman tekstien kirjoittamista tai Canvan säätämistä.
              </p>

              <div className="v3-hero__actions">
                <a href="#laheta-kuvat" className="v3-button v3-button--primary" aria-label={siteConfig.cta.primary}>
                  PYYDÄ 2 MAKSUTONTA SISÄLTÖESIMERKKIÄ
                </a>
                <a href="#raw-final" className="v3-text-link">Katso miten se toimii <span aria-hidden="true">↓</span></a>
              </div>

              <div className="v3-hero__price">
                <strong>490 € + ALV / 30 PÄIVÄÄ</strong>
                <span>12 sisältöä · Instagram + Facebook · ei sitoumusta jatkosta</span>
              </div>
            </div>

            <aside className="v3-hero__poster" aria-label="GhoulHouse SOME 12 -palvelu">
              <div className="v3-hero__poster-top">
                <span>GHOULHOUSE</span>
                <span>SOME 12</span>
              </div>
              <div className="v3-hero__poster-number" aria-hidden="true">12</div>
              <div className="v3-hero__poster-bottom">
                <div><strong>30</strong><span>PÄIVÄÄ</span></div>
                <div><strong>02</strong><span>KANAVAA</span></div>
                <div><strong>01</strong><span>TEKIJÄ</span></div>
              </div>
            </aside>
          </div>
        </section>

        <section id="raw-final" className="v3-proof" aria-labelledby="proof-title">
          <div className="v3-container">
            <div className="v3-section-head v3-section-head--dark">
              <div>
                <p className="v3-kicker v3-kicker--dark">RAW → VALMIS</p>
                <h2 id="proof-title">SAMA TYÖ. <span className="v3-signal">PAREMPI JULKAISU.</span></h2>
              </div>
              <p>Työmaalla jo syntyvä kuva saa rajauksen, sisältökulman, tekstin ja julkaisuvalmiin esityksen.</p>
            </div>

            <div className="raw-final-grid v3-proof__grid" aria-label="Raakamateriaalista valmiiksi somejulkaisuksi">
              <figure className="raw-final-panel v3-proof__panel">
                <div className="v3-proof__panel-meta">
                  <span>RAW</span>
                  <span>IMG_4821.JPG</span>
                </div>
                <div className="v3-proof__image">
                  <Image
                    src={conceptPhoto}
                    alt="Remonttityömaan konseptikuva ennen sisältökäsittelyä"
                    fill
                    sizes="(max-width: 767px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <figcaption>Tavallinen työmaakuva sellaisena kuin se syntyy puhelimeen.</figcaption>
              </figure>

              <figure className="raw-final-panel v3-proof__panel v3-proof__panel--final">
                <div className="v3-proof__panel-meta">
                  <span>VALMIS</span>
                  <span>GHOULHOUSE</span>
                </div>
                <div className="v3-proof__image">
                  <Image
                    src={conceptPhoto}
                    alt="Sama remonttikuva osana viimeisteltyä GhoulHouse-konseptijulkaisua"
                    fill
                    sizes="(max-width: 767px) 100vw, 50vw"
                    className="object-cover contrast-110"
                  />
                  <div className="v3-proof__shade" aria-hidden="true" />
                  <div className="v3-proof__editorial">
                    <span>TYÖVAIHE / ASIANTUNTIJASISÄLTÖ</span>
                    <strong>Pohjatyö ratkaisee lopputuloksen.</strong>
                  </div>
                </div>
                <figcaption>
                  <span>Rajaus + sisältökulma + teksti + formaatti.</span>
                  <strong>KONSEPTIESIMERKKI — EI ASIAKASTYÖ</strong>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section id="palvelu" className="v3-service" aria-labelledby="service-title">
          <div className="v3-container">
            <div className="v3-section-head">
              <div>
                <p className="v3-kicker">MITÄ GHOULHOUSE TEKEE</p>
                <h2 id="service-title">TYÖMAAKUVISTA <span className="v3-signal">SÄÄNNÖLLINEN SISÄLTÖRYTMI.</span></h2>
              </div>
              <p>Työmailta syntyy jo materiaalia. GhoulHouse muuttaa sen valmiiksi sisällöksi niin, ettei yrittäjän tarvitse rakentaa jokaista julkaisua alusta itse.</p>
            </div>

            <div className="v3-capabilities">
              <article>
                <span>01</span>
                <h3>KUVA</h3>
                <p>Valinta, rajaus, kevyt kuvankäsittely ja oikea formaatti.</p>
              </article>
              <article>
                <span>02</span>
                <h3>TEKSTI</h3>
                <p>Sisältökulma, kuvateksti, CTA ja tarvittavat hashtagit.</p>
              </article>
              <article>
                <span>03</span>
                <h3>JULKAISU</h3>
                <p>Kuukausirytmi, hyväksyntä, ajastus ja julkaiseminen sovitusti.</p>
              </article>
            </div>
          </div>
        </section>

        <section id="miten-toimii" className="v3-process" aria-labelledby="process-title">
          <div className="v3-container">
            <div className="v3-process__intro">
              <p className="v3-kicker">03 VAIHETTA</p>
              <h2 id="process-title">MATERIAALI SISÄÄN. <span className="v3-signal">JULKAISUT ULOS.</span></h2>
            </div>

            <ol className="v3-process__steps">
              {processSteps.map((step) => (
                <li key={step.number}>
                  <span className="v3-process__number">{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="esimerkit" className="v3-examples" aria-labelledby="examples-title">
          <div className="v3-container">
            <div className="v3-section-head">
              <div>
                <p className="v3-kicker">SISÄLTÖSUUNNAT / 06</p>
                <h2 id="examples-title">KUUSI TAPAA TEHDÄ <span className="v3-signal">TYÖSTÄ SISÄLTÖÄ.</span></h2>
              </div>
              <p>Nämä ovat sisältökategorioita, eivät asiakkaan hyväksymiä julkaisuja tai toteutuneita tuloksia.</p>
            </div>

            <div className="v3-examples__index">
              {contentExamples.map((item, index) => (
                <article key={item.title}>
                  <span className="v3-examples__number">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <p className="v3-examples__eyebrow">{item.eyebrow.split(' / ')[1]}</p>
                    <h3>{item.title}</h3>
                    <p>{item.copy}</p>
                  </div>
                </article>
              ))}
            </div>

            <p className="v3-disclosure">KONSEPTIESIMERKKI — EI ASIAKASTYÖ</p>
          </div>
        </section>

        <section id="hinta" className="v3-pricing" aria-labelledby="pricing-title">
          <div className="v3-container">
            <div className="v3-pricing__shell" data-offer-card data-offer-name={siteConfig.offer.name} data-offer-price={siteConfig.offer.price}>
              <div className="v3-pricing__offer">
                <p className="v3-kicker v3-kicker--dark">GHOULHOUSE SOME 12</p>
                <h2 id="pricing-title"><span>490 €</span><small>+ ALV / 30 PÄIVÄÄ</small></h2>
                <p>Ensimmäiset 30 päivää 490 € + ALV. Ei sitoumusta jatkosta.</p>
                <a href="#laheta-kuvat" className="v3-button v3-button--primary">{siteConfig.cta.primary}</a>
              </div>

              <div className="v3-pricing__scope">
                <p className="v3-pricing__scope-title">SISÄLTYY</p>
                <ul>
                  {offerIncludes.map((item) => <li key={item}>{item}</li>)}
                </ul>
                <p className="v3-pricing__excludes">
                  <strong>Ei sisällä:</strong> {offerExcludes.join(' · ')}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="v3-founder" aria-labelledby="founder-title">
          <div className="v3-container v3-founder__grid">
            <div className="v3-founder__mark" aria-hidden="true">HN</div>
            <div className="v3-founder__copy">
              <p className="v3-kicker">PERUSTAJA / HANNA NYHOLM</p>
              <h2 id="founder-title">YKSI YHTEYSHENKILÖ <span className="v3-signal">SUUNNITTELUSTA JULKAISUUN.</span></h2>
              <p>Hanna vastaa GhoulHousen asiakastyöstä, sisältösuunnittelusta ja tuotannosta. Palvelu on rakennettu pienille palveluyrityksille, jotka haluavat tehdä jo dokumentoidusta työstään säännöllistä Instagram- ja Facebook-sisältöä.</p>
            </div>
          </div>
        </section>

        <section id="faq" className="v3-faq" aria-labelledby="faq-title">
          <div className="v3-container v3-faq__grid">
            <div className="v3-faq__intro">
              <p className="v3-kicker">UKK</p>
              <h2 id="faq-title">ENNEN KUIN <span className="v3-signal">OSTAT.</span></h2>
            </div>
            <div className="v3-faq__items">
              {faqItems.map((item, index) => (
                <details key={item.question}>
                  <summary>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <strong>{item.question}</strong>
                    <i aria-hidden="true">+</i>
                  </summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="laheta-kuvat" className="v3-cta" aria-labelledby="cta-title">
          <div className="v3-container v3-cta__grid">
            <div className="v3-cta__copy">
              <p className="v3-kicker v3-kicker--dark">2 MAKSUTONTA SISÄLTÖESIMERKKIÄ</p>
              <h2 id="cta-title">NÄE OMA TYÖSI <span className="v3-signal">VALMIINA JULKAISUNA.</span></h2>
              <p>Lähetä yrityksesi perustiedot. Sovimme vastausviestissä kahden työkuvan toimitustavan ja teemme niistä kaksi GhoulHouse-konseptiesimerkkiä.</p>
              <span className="v3-cta__note">Konseptiesimerkit eivät sido jatkoon.</span>
            </div>
            <div className="v3-cta__form">
              <LeadForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="v3-footer">
        <div className="v3-container v3-footer__grid">
          <div>
            <Image src="/logo-horizontal-white.svg" alt="GhoulHouse" width={1400} height={460} />
            <p>Työmaakuvista suunnitelmallinen sisältökuukausi Instagramiin ja Facebookiin.</p>
          </div>
          <div>
            <strong>{siteConfig.company.legalName}</strong>
            <span>Y-tunnus {siteConfig.company.businessId}</span>
            <span>{siteConfig.company.domicile}</span>
          </div>
          <div>
            <a href="#hinta">Palvelu ja hinta</a>
            <a href="#laheta-kuvat">Yhteydenotto</a>
            <a href={siteConfig.legal.privacyPath}>Tietosuojaseloste</a>
          </div>
        </div>
      </footer>
    </>
  );
}
