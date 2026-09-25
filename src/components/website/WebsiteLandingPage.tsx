import Link from 'next/link';
import type { ReactNode } from 'react';
import LeadForm from '@/components/LeadForm';
import { websiteMainFacts, websiteResources, type WebsiteVertical } from '@/data/website';

type Props = {
  vertical?: WebsiteVertical;
  heading?: string;
  introduction?: string;
  eyebrow?: string;
  contactHeading?: string;
  contactIntroduction?: string;
  children?: ReactNode;
};

export default function WebsiteLandingPage({ vertical, heading, introduction, eyebrow, contactHeading, contactIntroduction, children }: Props) {
  const title = heading ?? vertical?.h1 ?? 'Verkkosivut yritykselle, rakennettu ostamista varten.';
  const intro = introduction ?? vertical?.intro ?? 'GhoulHouse rakentaa yrityksen verkkosivun palveluista, oikeasta työnäytöstä ja selkeästä yhteydenottopolusta. Ei geneeristä yritysjargonia.';

  return (
    <main className="websitePage">
      <section className="websiteHero">
        <div className="contentShell websiteHeroGrid">
          <div className="websiteHeroCopy">
            <p className="kicker">{eyebrow ?? vertical?.label ?? 'VERKKOSIVUT YRITYKSELLE'}</p>
            <h1>{title}</h1>
            <p className="websiteLead">{intro}</p>
            <div className="heroActions">
              <a className="button button--signal" href="#yhteys">PYYDÄ VERKKOSIVUARVIO <span aria-hidden="true">→</span></a>
              <Link className="textLink" href="/verkkosivut/hinta">Katso rakenne ja hinta</Link>
            </div>
            <div className="offerLine"><strong>1 SELKEÄ TOTEUTUS</strong><span>Rakenne · sisältö · näyttö · yhteydenotto · julkaisu</span></div>
          </div>
          <div className="websiteProofPanel" aria-label="Verkkosivun rakenne">
            <span>01 / PALVELUT</span><span>02 / REFERENSSIT</span><span>03 / LUOTTAMUS</span><span className="signalText">04 / YHTEYDENOTTO →</span>
          </div>
        </div>
      </section>

      <section className="websiteFactRail" aria-label="Verkkosivutoteutuksen pääperiaatteet">
        <div className="contentShell websiteFactGrid">
          {websiteMainFacts.map(([n, label, copy]) => <div key={n}><strong>{n}</strong><b>{label}</b><span>{copy}</span></div>)}
        </div>
      </section>

      <section className="websiteSection">
        <div className="contentShell websiteTwoCol">
          <div><p className="kicker">LÄHTÖKOHTA</p><h2>HYVÄ SIVU EI ALOITA DESIGNISTA.</h2></div>
          <div className="websiteCopy">
            <p>Ensin päätetään mitä asiakkaan pitää ymmärtää, mitä näyttöä hän tarvitsee ja mikä seuraava askel on. Vasta sen jälkeen rakennetaan visuaalinen toteutus.</p>
            <p>Jos yrityksellä on jo toimiva sisältö, sitä ei vaihdeta uuteen vain vaihtamisen vuoksi. Puutteet korjataan ja toimiva materiaali säilytetään.</p>
          </div>
        </div>
      </section>

      <section className="websiteSection websiteSection--dark">
        <div className="contentShell">
          <div className="sectionIntro"><p className="kicker kicker--inverse">TOTEUTUS</p><div><h2>MITÄ SIVUSTOON RAKENNETAAN?</h2></div></div>
          <div className="websiteCards">
            {(vertical?.deliverables ?? ['Sivustorakenne ja navigaatio', 'Palvelusivut ja ostamista tukeva copy', 'Referenssit ja työnäyttö', 'Yhteydenotto ja tarjouspyyntö', 'Mobiilioptimointi', 'Tekninen SEO ja julkaisu']).map((item, i) => (
              <article key={item}><span>{String(i + 1).padStart(2, '0')}</span><h3>{item}</h3><p>Suunnitellaan osaksi samaa käyttäjäpolkua, ei irralliseksi ominaisuudeksi.</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="websiteSection">
        <div className="contentShell websiteTwoCol">
          <div><p className="kicker">PROOF</p><h2>REFERENSSI ON TODISTE, EI KORISTE.</h2></div>
          <div className="websiteProofList">
            {(vertical?.proof ?? ['Oikeat projektit ja kohteet', 'Varmennetut yritys- ja palvelufaktat', 'Selkeä kuvaus tehdystä työstä']).map((item, i) => <div key={item}><span>{String(i + 1).padStart(2, '0')}</span><p>{item}</p></div>)}
            <div className="heroActions"><Link className="textLink" href="/referenssit">Katso referenssiperiaate →</Link>{vertical?.slug === 'rakennus' ? <Link className="textLink" href="/rakennusyrityksille">Rakennusalan Social →</Link> : null}{vertical?.slug === 'lvi' ? <Link className="textLink" href="/lvi-yrityksille">LVI-alan Social →</Link> : null}</div>
          </div>
        </div>
      </section>

      <section className="websiteSection websiteSection--soft">
        <div className="contentShell websiteTwoCol">
          <div><p className="kicker">SOPII ERITYISESTI</p><h2>RAKENNUS. LVI. SÄHKÖ.</h2></div>
          <nav className="websiteVerticalNav" aria-label="Verkkosivut vertikaaleittain">
            <Link href="/verkkosivut/rakennus">Rakennusyritykselle</Link>
            <Link href="/verkkosivut/lvi">LVI-yritykselle</Link>
            <Link href="/verkkosivut/sahko">Sähköyritykselle</Link>
          </nav>
        </div>
      </section>

      <section className="websiteSection">
        <div className="contentShell">
          <div className="sectionIntro"><p className="kicker">RESURSSIT</p><div><h2>SEURAAVA ASKEL.</h2></div></div>
          <div className="websiteResourceGrid"><Link href="/oppaat/verkkosivut-itse-vai-ammattilaiselta"><span>Verkkosivut: tee itse vai ammattilaiselta?</span><p>Milloin oma tekeminen riittää ja milloin kannattaa ulkoistaa?</p><b>OPAS →</b></Link>{websiteResources.map(([label, copy, href]) => <Link key={href} href={href}><span>{label}</span><p>{copy}</p><b>→</b></Link>)}</div>
        </div>
      </section>

      {children}
      <section className="contact" id="yhteys" aria-labelledby="website-contact-title">
        <div className="contentShell contactGrid">
          <div className="contactCopy"><p className="kicker">ALOITA</p><h2 id="website-contact-title">{contactHeading ?? 'KATSOTAAN YRITYKSENNE LÄHTÖTILANNE.'}</h2><p>{contactIntroduction ?? 'Lähetä yrityksen nimi ja mahdollinen nykyinen verkkosivu. Ehdotamme, mitä kannattaa säilyttää, korjata tai rakentaa alusta.'}</p></div>
          <div className="formSurface"><LeadForm mode="proposal" defaultService="websites" /></div>
        </div>
      </section>
    </main>
  );
}
