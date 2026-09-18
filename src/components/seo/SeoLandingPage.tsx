import Link from 'next/link';
import LeadForm from '@/components/LeadForm';
import { seoClusterPages, type SeoClusterPage } from '@/data/seo-cluster';

const clusterLinks = Object.values(seoClusterPages);

export default function SeoLandingPage({ page }: { page: SeoClusterPage }) {
  return (
    <main className="seoPage">
      <section className="seoHero">
        <div className="contentShell seoHeroGrid">
          <div className="seoHeroCopy">
            <p className="kicker">{page.eyebrow}</p>
            <h1>{page.h1}</h1>
            <p className="seoLead">{page.intro}</p>
            <div className="heroActions">
              <a className="button button--signal" href="#yhteys">PYYDÄ 2 SISÄLTÖESIMERKKIÄ <span aria-hidden="true">→</span></a>
              <Link className="textLink" href="/">Takaisin etusivulle</Link>
            </div>
            <div className="offerLine"><strong>490 € + ALV / 30 PÄIVÄÄ</strong><span>12 sisältöä · Instagram + Facebook · ei automaattista jatkoa</span></div>
          </div>
          <div className="seoBrandBlock" aria-label="GhoulHouse brand headline">
            <span>TYÖMAAKUVAT</span><span>SISÄÄN.</span><span className="signalText">VALMIS SOME</span><span className="signalText">ULOS.</span>
          </div>
        </div>
      </section>
      <section className="seoSection"><div className="contentShell seoTwoCol">
        <div><p className="kicker">MIKÄ JÄÄ PÖYDÄLLE</p><h2>TYÖ ON TEHTY. SISÄLTÖ PUUTTUU.</h2></div>
        <ul className="seoList">{page.painPoints.map((item) => <li key={item}>{item}</li>)}</ul>
      </div></section>
      <section className="seoSection seoSection--dark"><div className="contentShell">
        <div className="sectionIntro"><p className="kicker kicker--inverse">SISÄLTÖESIMERKIT</p><div><h2>MITÄ TYÖSTÄ VOI JULKAISTA?</h2></div></div>
        <div className="seoCards">{page.examples.map((item, index) => <article key={item}><span>{String(index + 1).padStart(2, '0')}</span><h3>{item.split(':')[0]}</h3><p>{item.includes(':') ? item.split(':').slice(1).join(':').trim() : item}</p></article>)}</div>
      </div></section>
      <section className="seoSection"><div className="contentShell seoTwoCol">
        <div><p className="kicker">TUOTANTO</p><h2>NELJÄ VAIHETTA. YKSI KOONTI.</h2></div>
        <ol className="seoSteps">{page.process.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, '0')}</span><p>{item}</p></li>)}</ol>
      </div></section>
      <section className="seoSection seoSection--soft"><div className="contentShell seoTwoCol">
        <div><p className="kicker">UKK</p><h2>ENNEN KUIN ALOITAT.</h2></div>
        <div className="seoFaq">{page.faq.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div>
      </div></section>
      <section className="seoSection"><div className="contentShell seoClusterNav">
        <div><p className="kicker">SISÄLTÖKLUSTERI</p><h2>MUUT GHOULHOUSE-SIVUT</h2></div>
        <nav aria-label="GhoulHouse SEO-sivut">{clusterLinks.filter((item) => item.slug !== page.slug).map((item) => <Link key={item.slug} href={'/' + item.slug}>{item.h1}</Link>)}</nav>
      </div></section>
      <section className="contact" id="yhteys" aria-labelledby="seo-contact-title"><div className="contentShell contactGrid">
        <div className="contactCopy"><p className="kicker">ALOITA</p><h2 id="seo-contact-title">NÄE OMA TYÖSI VALMIINA JULKAISUNA.</h2><p>Saat kaksi maksutonta sisältöesimerkkiä yrityksesi nykyisestä materiaalista. Näet ensin lopputuloksen suunnan.</p></div>
        <div className="formSurface"><LeadForm /></div>
      </div></section>
    </main>
  );
}
