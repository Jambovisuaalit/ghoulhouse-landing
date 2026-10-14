import ArrowUpRight from '@/components/ArrowUpRight';
import Image from 'next/image';
import Link from 'next/link';
import { siteNavigation } from '@/data/site-navigation';

type Props = { home?: boolean; inquiryHref?: string; inquiryLabel?: string };

// Confirmed public profiles and review destination supplied by GhoulHouse.
const socialLinks = [
  { name: 'Instagram', symbol: 'IG', url: 'https://www.instagram.com/ghoulhouse.fi/' },
  { name: 'Google Business', symbol: 'GO', url: 'https://share.google/1LDmIXRgEryPBneud' },
  { name: 'Hanna Nyholm LinkedIn', symbol: 'IN', url: 'https://fi.linkedin.com/in/hanna-nyholm-1b5213434' },
];

/** Shared contact section and site navigation. */
export default function LiquidGlassFooter({ home = false, inquiryHref, inquiryLabel }: Props) {
  const contactHref = home ? '/?intent=photos#yhteys' : (inquiryHref || '/?intent=photos#yhteys');
  const topHref = home ? '#top' : '/#top';

  return (
    <footer className={home ? 'ghFooter ghLiquidFooter' : 'ghGlobalFooter ghLiquidFooter'}>
      <div className="ghLiquidFooterShell">
        <div className="ghLiquidFooterRim">
          <div className="ghLiquidFooterSurface">

            {!home && <div className="ghLiquidFooterInvite">
              <div className="ghLiquidFooterStatement">
                <p className="ghLiquidFooterEyebrow">SEURAAVA ASKEL / YHTEISTYÖ</p>
                <h2>TEHDÄÄN TYÖSTÄ<br /><span>NÄKYVÄÄ.</span></h2>
                <p>{home ? 'Työmaakuvat valmiiksi some-sisällöiksi remontti- ja LVI-yrityksille Uudellamaalla. Verkkosivut ja SEO ovat lisäpalveluita.' : 'Social, verkkosivut ja SEO palveluyrityksille. Kerro tilanteestanne — ehdotamme sopivaa seuraavaa askelta.'}</p>
              </div>
              <div className="ghLiquidFooterInviteActions">
                <a href={contactHref} className="ghLiquidFooterButton">
                  <span>{inquiryLabel || 'Pyydä 2 sisältöesimerkkiä'}</span>
                  <span aria-hidden="true"><ArrowUpRight /></span>
                </a>
                <a href="mailto:hello@ghoulhouse.fi" className="ghLiquidFooterMail">
                  Tai lähetä sähköpostia <span aria-hidden="true"><ArrowUpRight /></span>
                </a>
              </div>
            </div>}

            <div className="ghLiquidFooterLinks">
              <div className="ghLiquidFooterBrandBlock">
                <Link className="ghLiquidFooterBrand" href="/" aria-label="GhoulHouse — etusivu">
                  <Image className="ghOfficialFooterLogo" src="/ghoulhouse-logo-reverse.svg" width={205} height={67} alt="" />
                </Link>
                <p>Hyvä työ pitää näkyä.<br />Rakennamme näkyvyyttä oikealle työlle.</p>
                <div className="ghLiquidFooterSocial" aria-label="Sosiaalisen median kanavat">
                  {socialLinks.map(({ name, symbol, url }) => (
                    <a key={name} href={url} target="_blank" rel="noopener noreferrer"
                       aria-label={`GhoulHouse ${name}, avautuu uuteen välilehteen`}>
                      {symbol}<span aria-hidden="true"><ArrowUpRight /></span>
                    </a>
                  ))}
                </div>
              </div>

              <nav className="ghLiquidFooterNav" aria-label="Alatunnisteen navigaatio">
                <h3>PALVELUT & SISÄLTÖ</h3>
                {siteNavigation.map(({ href, label }) => (
                  <Link key={href} href={href}>{label}<span aria-hidden="true"><ArrowUpRight /></span></Link>
                ))}
              </nav>

              <div className="ghLiquidFooterContact">
                <h3>YHTEYSTIEDOT</h3>
                <p>GhoulHouse Oy<br />Helsinki, Suomi</p>
                <a href="mailto:hanna@ghoulhouse.fi">Hanna Nyholm <span aria-hidden="true"><ArrowUpRight /></span></a>
                <a href="mailto:hello@ghoulhouse.fi">hello@ghoulhouse.fi</a>
                <span className="ghLiquidFooterBusinessId">Y-TUNNUS 3651127-5</span>
              </div>

              <nav className="ghLiquidFooterNav ghLiquidFooterUtility" aria-label="Muut linkit">
                <h3>LISÄTIETOJA</h3>
                <Link href="/#yritys">GhoulHouse / tekijä <span aria-hidden="true"><ArrowUpRight /></span></Link>
                <a href="https://g.page/r/CS7zBJkyvEZREAE/review" target="_blank" rel="noopener noreferrer">Jätä Google-arvostelu <span aria-hidden="true"><ArrowUpRight /></span></a>
                <Link href="/tietosuoja">Tietosuoja <span aria-hidden="true"><ArrowUpRight /></span></Link>
                <a href={contactHref}>Yhteydenotto <span aria-hidden="true"><ArrowUpRight /></span></a>
              </nav>
            </div>
          </div>
        </div>

        {!home && <div className="ghLiquidFooterWordmark" aria-hidden="true"><Image className="ghOfficialWordmark" src="/ghoulhouse-wordmark-white.svg" width={1000} height={200} alt="" /></div>}
        <div className="ghLiquidFooterBottom">
          <span>© 2026 GhoulHouse Oy. Kaikki oikeudet pidätetään.</span>
          <span>HELSINKI · SOCIAL / VERKKOSIVUT / SEO</span>
          <a href={topHref}>Takaisin ylös <span aria-hidden="true">↑</span></a>
        </div>
      </div>
    </footer>
  );
}
