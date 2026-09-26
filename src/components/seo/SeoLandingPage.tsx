import Link from 'next/link';
import LeadForm from '@/components/LeadForm';
import type { SeoClusterPage } from '@/data/seo-cluster';
import { getRelatedSocialLinks } from '@/data/social-related-links';

export default function SeoLandingPage({ page }: { page: SeoClusterPage }) {
  const packagePage = page.slug === 'some-12';
  const overviewPage = page.slug === 'some-sisallontuotanto';
  const headings = page.headings;
  const relatedLinks = getRelatedSocialLinks(page.slug);

  return (
    <main className="seoPage">
      <section className="seoHero">
        <div className="contentShell seoHeroGrid">
          <div className="seoHeroCopy">
            <p className="kicker">{page.eyebrow}</p>
            <h1>{page.h1}</h1>
            <p className="seoLead">{page.intro}</p>
            <div className="heroActions">
              <a className="button button--signal" href="#yhteys">{packagePage ? 'PYYDÄ SOME 12 -ALOITUSTA' : 'PYYDÄ 2 SISÄLTÖESIMERKKIÄ'} <span aria-hidden="true">→</span></a>
              <Link className="textLink" href={packagePage ? '/some-sisallontuotanto/hinta' : '/some-12'}>
                {packagePage ? 'Katso hinnan erittely' : 'Katso SOME 12 -paketti'}
              </Link>
            </div>
            <div className="offerLine">
              <strong>{overviewPage ? 'SISÄLLÖNTUOTANTO YRITYKSEN OMASTA MATERIAALISTA' : '490 € + ALV / 30 PÄIVÄÄ'}</strong>
              <span>{overviewPage
                ? 'Suunnittelu · materiaalit · hyväksyntä · julkaisu — tutustu erikseen kiinteään SOME 12 -pakettiin'
                : '12 sisältöä · Instagram + Facebook · jatkosta sovitaan erikseen'}</span>
            </div>
          </div>
          <div className="seoBrandBlock" aria-label="GhoulHouse brand headline">
            <span>TYÖMAAKUVAT</span><span>SISÄÄN.</span><span className="signalText">VALMIS SOME</span><span className="signalText">ULOS.</span>
          </div>
        </div>
      </section>
      <section className="seoSection"><div className="contentShell seoTwoCol">
        <div><p className="kicker">MIKÄ JÄÄ PÖYDÄLLE</p><h2>{headings?.challenge ?? 'TYÖ ON TEHTY. SISÄLTÖ PUUTTUU.'}</h2></div>
        <ul className="seoList">{page.painPoints.map((item) => <li key={item}>{item}</li>)}</ul>
      </div></section>
      <section className="seoSection seoSection--dark"><div className="contentShell">
        <div className="sectionIntro"><p className="kicker kicker--inverse">SISÄLTÖESIMERKIT</p><div><h2>{headings?.examples ?? 'MITÄ TYÖSTÄ VOI JULKAISTA?'}</h2></div></div>
        <div className="seoCards">{page.examples.map((item, index) => <article key={item}><span>{String(index + 1).padStart(2, '0')}</span><h3>{item.split(':')[0]}</h3><p>{item.includes(':') ? item.split(':').slice(1).join(':').trim() : item}</p></article>)}</div>
      </div></section>
      <section className="seoSection"><div className="contentShell seoTwoCol">
        <div><p className="kicker">TUOTANTO</p><h2>{headings?.process ?? 'NELJÄ VAIHETTA. YKSI KOONTI.'}</h2></div>
        <ol className="seoSteps">{page.process.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, '0')}</span><p>{item}</p></li>)}</ol>
      </div></section>
      <section className="seoSection seoSection--soft"><div className="contentShell seoTwoCol">
        <div><p className="kicker">UKK</p><h2>{headings?.faq ?? 'ENNEN KUIN ALOITAT.'}</h2></div>
        <div className="seoFaq">{page.faq.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div>
      </div></section>
      <section className="seoSection"><div className="contentShell seoClusterNav">
        <div>
          <p className="kicker">AIHEESEEN LIITTYVÄT SIVUT</p>
          <h2>{headings?.related ?? 'JATKA AIHEESTA.'}</h2>
          <p className="seoRelatedIntro">Valitse seuraava aihe: palvelun sisältö, hinta, toimialakohtaiset esimerkit tai materiaalien valmistelu.</p>
        </div>
        <nav aria-label="Aiheeseen liittyvät GhoulHouse-sivut">
          {relatedLinks.map((item) => (
            <Link key={item.href} href={item.href}>
              <strong>{item.label}</strong>
              <span>{item.description}</span>
              <span className="seoRelatedArrow" aria-hidden="true">↗</span>
            </Link>
          ))}
        </nav>
      </div></section>
      <section className="contact" id="yhteys" aria-labelledby="seo-contact-title"><div className="contentShell contactGrid">
        <div className="contactCopy">
          <p className="kicker">{packagePage ? 'SOME 12 / ALOITUS' : 'ALOITA'}</p>
          <h2 id="seo-contact-title">{packagePage ? 'SOVITAAN ENSIMMÄINEN 30 PÄIVÄÄ.' : 'NÄE OMA TYÖSI VALMIINA JULKAISUNA.'}</h2>
          <p>{packagePage
            ? 'Kerro yrityksesi ja käytössä oleva kuvamateriaali. Varmistamme materiaalit ja sovimme SOME 12 -erän aloituksesta ennen tuotantoa.'
            : 'Saat kaksi maksutonta sisältöesimerkkiä yrityksesi nykyisestä materiaalista. Näet ensin lopputuloksen suunnan.'}</p>
        </div>
        <div className="formSurface">
          <LeadForm mode={packagePage ? 'proposal' : 'social'} defaultService={packagePage ? 'social' : undefined} />
        </div>
      </div></section>
    </main>
  );
}
