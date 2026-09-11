const photo = 'https://images.unsplash.com/photo-1768321917661-d4f1a89d2185?auto=format&fit=crop&fm=jpg&q=88&w=1800';

const contentAngles = [
  ['01','TYÖNÄYTE','Valmis lopputulos tai työvaihe referenssiksi.'],
  ['02','ASIANTUNTIJAVINKKI','Käytännön vinkkejä ja alan tietoa.'],
  ['03','ONGELMA → RATKAISU','Yleiset haasteet ja miten sinä ratkaiset ne.'],
  ['04','PROSESSI','Työn vaiheet alusta loppuun.'],
  ['05','LUOTTAMUS','Tiimi, työtavat, laatu ja arvot.'],
  ['06','MYYNTI + UKK','Usein kysytyt kysymykset ja palvelun hyödyt.'],
] as const;

const faq = [
  ['Mitä materiaalia minun pitää toimittaa?','Työmaa-, referenssi- ja muita yrityksen omia kuvia sekä olennaiset projektifaktat.'],
  ['Kuinka nopeasti saan ensimmäiset julkaisut?','Aikataulu sovitaan materiaalien vastaanoton yhteydessä. Suunta hyväksytään ennen ajastusta.'],
  ['Voinko vaikuttaa sisältöihin?','Kyllä. Asiakas hyväksyy faktat ja julkaisusuunnan, ja palveluun kuuluu yksi koottu korjauskierros.'],
  ['Mitä jos minulla ei ole tarpeeksi kuvia?','Aloitetaan käytettävissä olevasta materiaalista ja sovitaan, mitä lisämateriaalia tarvitaan. Kuvauspäivät eivät sisälly SOME 12 -pakettiin.'],
  ['Voinko lopettaa milloin vain?','Ensimmäiset 30 päivää maksavat 490 € + ALV. Jatkosta ei ole sitoumusta.'],
] as const;

export default function Home() {
  return (
    <>
      <a className="skip" href="#main">Siirry pääsisältöön</a>
      <header className="siteHeader">
        <div className="shell headerInner">
          <a className="logo" href="#top" aria-label="GhoulHouse — sivun alku"><img src="/logo-horizontal.svg" alt="GhoulHouse" /></a>
          <nav aria-label="Päänavigaatio">
            <a href="#palvelu">Palvelu</a><a href="#esimerkit">Esimerkit</a><a href="#hinta">Hinta</a><a href="#ukk">UKK</a>
          </nav>
          <a className="headerCta" href="#yhteys"><span className="desktopOnly">PYYDÄ 2 MAKSUTONTA SISÄLTÖESIMERKKIÄ</span><span className="mobileOnly">2 ESIMERKKIÄ</span><b>→</b></a>
        </div>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="heroGlow" aria-hidden="true" />
          <div className="shell heroGrid">
            <div className="heroCopy">
              <p className="eyebrow">RAKENNUSALAN SOMEKUMPPANI</p>
              <h1><span>TYÖMAAKUVAT</span><span>SISÄÄN.</span><span className="red">VALMIS SOME</span><span className="red">ULOS.</span></h1>
              <p className="heroLead">GhoulHouse muuttaa työmaasi kuvat ammattimaiselta näyttäväksi, säännölliseksi somesisällöksi. Sinä teet työn. Me teemme siitä näkyvää.</p>
              <div className="heroActions">
                <a className="button primary" href="#yhteys">PYYDÄ 2 MAKSUTONTA SISÄLTÖESIMERKKIÄ <span>→</span></a>
                <a className="button secondary" href="#proof">KATSO RAW → VALMIS</a>
              </div>
              <div className="heroPrice"><strong>490 € + ALV / 30 PÄIVÄÄ</strong><span>12 sisältöä · Instagram + Facebook · ei sitoumusta jatkosta</span></div>
            </div>

            <div className="heroVisual" aria-label="GhoulHouse sisältökonsepti">
              <div className="heroPhoto">
                <img src={photo} alt="Remonttityömaan konseptikuva" />
                <div className="photoShade" />
                <span className="conceptBadge">KONSEPTIESIMERKKI — EI ASIAKASTYÖ</span>
                <div className="photoHeadline"><small>TYÖMAASTA</small><strong>JULKAISUKSI.</strong></div>
              </div>
              <div className="benefitStrip">
                <div><span className="miniIcon">⌁</span><p><b>SÄÄSTÄ AIKAA</b><small>Me hoidamme sisällön.</small></p></div>
                <div><span className="miniIcon">▥</span><p><b>NÄYTÄ OSAAMISTASI</b><small>Ammattitaito esille.</small></p></div>
                <div><span className="miniIcon">◎</span><p><b>KASVATA LUOTTAMUSTA</b><small>Enemmän näkyvyyttä.</small></p></div>
              </div>
            </div>
          </div>
        </section>

        <section className="proof" id="proof">
          <div className="shell proofGrid">
            <div className="proofIntro">
              <p className="eyebrow">KONSEPTIESIMERKKI — EI ASIAKASTYÖ</p>
              <h2>SAMA TYÖ.<br/><span className="red">PAREMPI</span><br/>JULKAISU.</h2>
              <p>Samat työmaakuvat, mutta ammattimainen viimeistely, sisältökulma ja teksti — valmiina julkaistavaksi.</p>
            </div>
            <div className="compare">
              <figure><div className="compareLabel"><b>RAW</b><span>TYÖMAAKUVA</span></div><div className="compareImage raw"><img src={photo} alt="Työmaakuva ennen sisältökäsittelyä" /></div></figure>
              <figure><div className="compareLabel final"><b>VALMIS</b><span>SOME-JULKAISU</span></div><div className="compareImage final"><img src={photo} alt="Sama kuva viimeisteltynä sisältökonseptina"/><div className="photoShade"/><div className="finalCopy"><strong>POHJATYÖ<br/>RATKAISEE<br/>LOPPUTULOKSEN.</strong></div></div></figure>
            </div>
          </div>
        </section>

        <section className="serviceBand" id="palvelu">
          <div className="shell">
            <div className="sectionHead darkHead"><div><p className="eyebrow">MITÄ SAAT</p><h2>TYÖMAAKUVISTA<br/>SÄÄNNÖLLINEN SISÄLTÖRYTMI.</h2></div><p>Me otamme työmaasi materiaalin ja muokkaamme sen valmiiksi, julkaisuiksi sosiaaliseen mediaan. Sinä keskityt olennaiseen — me hoidamme näkyvyyden.</p></div>
            <div className="benefitCards">
              <article><span>01</span><h3>KUVA</h3><p>Lähetät meille työmaakuvia ja lyhyitä muistiinpanoja suoraan puhelimesta.</p></article>
              <article><span>02</span><h3>TEKSTI</h3><p>Me kirjoitamme sopivan tekstin, nostamme oikeat näkökulmat ja lisäämme brändisi ilmeen.</p></article>
              <article><span>03</span><h3>JULKAISU</h3><p>Saat valmiit, julkaisuvalmiit sisällöt säännöllisesti — ilman lisätyötä.</p></article>
            </div>
          </div>
        </section>

        <section className="process">
          <div className="shell">
            <div className="sectionHead"><div><p className="eyebrow">MITÄ SÄ TOIMITAT</p><h2>MATERIAALI SISÄÄN.<br/><span className="red">JULKAISUT ULOS.</span></h2></div><p>Yksinkertainen prosessi. Maksimaalinen hyöty. Kolme askelta säännölliseen ja vaikuttavaan somenäkyvyyteen.</p></div>
            <ol className="processCards">
              <li><span>01</span><h3>LÄHETÄ MATERIAALIT</h3><p>Toimitat meille työmaakuvia ja lyhyitä muistiinpanoja aivan kuten ennenkin.</p></li>
              <li><span>02</span><h3>HYVÄKSY SUUNTA</h3><p>Me teemme sinulle sisällöt ja saat ne hyväksyttäväksi. Voit antaa palautetta ja toiveita.</p></li>
              <li><span>03</span><h3>NÄY SÄÄNNÖLLISESTI</h3><p>Saat valmiit julkaisut sovitusti ja yrityksesi pysyy aktiivisena somessa.</p></li>
            </ol>
          </div>
        </section>

        <section className="angles" id="esimerkit">
          <div className="shell">
            <div className="sectionHead darkHead"><div><p className="eyebrow">SISÄLTÖIDEAT</p><h2>KUUSI TAPAA<br/>TEHDÄ TYÖSTÄSI SISÄLTÖÄ.</h2></div><p>Monipuolista sisältöä, joka kertoo osaamisestasi, rakentaa luottamusta ja tuo palvelusi näkyväksi.</p></div>
            <div className="angleCards">{contentAngles.map(([n,title,copy]) => <article key={n}><span>{n}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
          </div>
        </section>

        <section className="pricing" id="hinta">
          <div className="shell pricingGrid">
            <div className="pricePitch"><p className="eyebrow">HINNOITTELU</p><h2>GHOULHOUSE<br/>SOME 12</h2><div className="bigPrice">490 € <small>+ ALV / 30 PÄIVÄÄ</small></div><p>12 valmista julkaisua kuukaudessa. Ei sitoumusta jatkosta.</p><a className="button primary" href="#yhteys">PYYDÄ 2 MAKSUTONTA SISÄLTÖESIMERKKIÄ <span>→</span></a></div>
            <div className="listPanel"><p className="eyebrow">SISÄLTÄÄ</p><ul><li>12 somejulkaisua kuukaudessa</li><li>Instagram + Facebook</li><li>Sisältösuunnittelu</li><li>Kuvien editointi ja somemuotoilu</li><li>Kuvatekstit, CTA:t ja hashtagit</li><li>Ajastus ja julkaiseminen</li><li>Yksi koottu korjauskierros</li><li>Kevyt kuukausiraportti</li></ul></div>
            <div className="listPanel"><p className="eyebrow">SOPII SINULLE, JOS</p><ul><li>Haluat säästää aikaa</li><li>Haluat näkyä säännöllisesti</li><li>Haluat näyttää ammattitaitosi</li><li>Haluat lisätä yhteydenottoja</li><li>Arvostat selkeää prosessia</li><li>Haluat pitää hinnan ennakoitavana</li></ul></div>
          </div>
        </section>

        <section className="founder">
          <div className="shell founderGrid">
            <div className="founderMark"><span>HN</span><small>PERUSTAJA / GHOULHOUSE</small></div>
            <div className="founderCopy"><p className="eyebrow">TAUSTALLA</p><h2>TEKIJÄ.<br/>SISÄLLÖN TAKANA.</h2><h3>HANNA NYHOLM</h3><p>Hanna vastaa GhoulHousen asiakastyöstä, sisältösuunnittelusta ja tuotannosta. Palvelu on rakennettu pienille palveluyrityksille, jotka haluavat tehdä jo dokumentoidusta työstään säännöllistä Instagram- ja Facebook-sisältöä.</p><a href="mailto:hanna@ghoulhouse.fi">hanna@ghoulhouse.fi →</a></div>
          </div>
        </section>

        <section className="faq" id="ukk">
          <div className="shell faqGrid"><div><p className="eyebrow">USEIN KYSYTTYÄ</p><h2>ENNEN KUIN<br/><span className="red">OSTAT.</span></h2></div><div className="faqItems">{faq.map(([q,a],i) => <details key={q}><summary><span>{String(i+1).padStart(2,'0')}</span><b>{q}</b><i>+</i></summary><p>{a}</p></details>)}</div></div>
        </section>

        <section className="contact" id="yhteys">
          <div className="shell contactGrid">
            <div className="contactCopy"><p className="eyebrow muted">ALOITA TÄNÄÄN</p><h2>NÄE OMA TYÖSI<br/><span className="red">VALMIINA JULKAISUNA.</span></h2><p>Saat kaksi maksutonta sisältöesimerkkiä omista työmaakuvistasi. Näet konkreettisesti, miltä yhteistyö näyttää — ilman sitoumuksia.</p><small>Konseptiesimerkit eivät sido jatkoon.</small></div>
            <form action="/api/leads" method="POST" className="leadForm">
              <input type="hidden" name="intent" value="photos" />
              <label>Nimi *<input name="name" required maxLength={120} autoComplete="name" /></label>
              <label>Yritys *<input name="company" required maxLength={120} autoComplete="organization" /></label>
              <label>Sähköposti *<input name="email" type="email" required maxLength={254} autoComplete="email" /></label>
              <label>Puhelinnumero<input name="phone" type="tel" maxLength={40} autoComplete="tel" /></label>
              <label className="wide">Verkkosivu tai Instagram *<input name="profile" required maxLength={300} placeholder="yritys.fi tai @yritys" /></label>
              <label className="wide">Mitä materiaalia sinulla on?<textarea name="message" rows={3} maxLength={1200} placeholder="Esim. kuvia, videoita, referenssejä..." /></label>
              <input className="trap" name="fax" tabIndex={-1} autoComplete="off" />
              <button type="submit">PYYDÄ 2 MAKSUTONTA SISÄLTÖESIMERKKIÄ →</button>
              <p className="formNote">Tietoja käytetään vain yhteydenoton käsittelyyn. <a href="/tietosuoja">Tietosuojaseloste.</a></p>
            </form>
          </div>
        </section>
      </main>

      <footer><div className="shell footerGrid"><div><img src="/logo-horizontal-white.svg" alt="GhoulHouse"/><p>Työmaasi ansaitsee tulla nähdyksi.</p></div><div><b>Ghoulhouse Oy</b><span>Y-tunnus 3651127-5</span><span>Kotipaikka Helsinki</span><span>Kaupparekisterissä 3.9.2026 alkaen</span></div><div><a href="#hinta">Palvelu ja hinta</a><a href="#yhteys">Yhteydenotto</a><a href="/tietosuoja">Tietosuojaseloste</a></div></div><div className="shell footerBottom"><span>© 2026 GhoulHouse Oy</span><span>KONSEPTIESIMERKKI — EI ASIAKASTYÖ</span></div></footer>
    </>
  );
}
