import Image from 'next/image';
import Link from 'next/link';
import { siteNavigation } from '@/data/site-navigation';

type Props = { home?: boolean };

// Show only configured, valid external profiles. Never render placeholder links.
const socialLinks = [
  { name: 'Instagram', symbol: 'IG', url: process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim() },
  { name: 'LinkedIn', symbol: 'IN', url: process.env.NEXT_PUBLIC_LINKEDIN_URL?.trim() },
].filter((item): item is { name: string; symbol: string; url: string } =>
  Boolean(item.url && /^https:\/\//i.test(item.url)),
);

/** Original, dependency-free adaptation of a layered glass/metal footer.
 * Every link and CTA works in SSR without JavaScript. No fake newsletter
 * signup: use the existing enquiry form and email until opt-in is implemented.
 */
export default function LiquidGlassFooter({ home = false }: Props) {
  const contactHref = home ? '#yhteys' : '/#yhteys';
  const topHref = home ? '#top' : '/#top';

  return (
    <footer className={home ? 'ghFooter ghLiquidFooter' : 'ghGlobalFooter ghLiquidFooter'}>
      <div className="ghLiquidFooterAmbient" aria-hidden="true" />
      <div className="ghLiquidFooterShell">
        <div className="ghLiquidFooterRim">
          <div className="ghLiquidFooterSurface">
            <div className="ghLiquidFooterMeta" aria-hidden="true">
              <span>GH / 2026 — INDEPENDENT DIGITAL STUDIO</span>
              <span>HELSINKI, FINLAND</span>
            </div>

            <div className="ghLiquidFooterInvite">
              <div className="ghLiquidFooterStatement">
                <p className="ghLiquidFooterEyebrow">SEURAAVA ASKEL / YHTEISTYÖ</p>
                <h2>TEHDÄÄN TYÖSTÄ<br /><span>NÄKYVÄÄ.</span></h2>
                <p>Verkkosivut, Social ja SEO suomalaisille palveluyrityksille. Kerro tilanteestanne — ehdotamme sopivaa seuraavaa askelta.</p>
              </div>
              <div className="ghLiquidFooterInviteActions">
                <a href={contactHref} className="ghLiquidFooterButton">
                  <span>Pyydä ehdotus</span>
                  <span aria-hidden="true">↗</span>
                </a>
                <a href="mailto:hello@ghoulhouse.fi" className="ghLiquidFooterMail">
                  Tai lähetä sähköpostia <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>

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
                      {symbol}<span aria-hidden="true">↗</span>
                    </a>
                  ))}
                </div>
              </div>

              <nav className="ghLiquidFooterNav" aria-label="Alatunnisteen navigaatio">
                <h3>PALVELUT & SISÄLTÖ</h3>
                {siteNavigation.map(({ href, label }) => (
                  <Link key={href} href={href}>{label}<span aria-hidden="true">↗</span></Link>
                ))}
              </nav>

              <div className="ghLiquidFooterContact">
                <h3>YHTEYSTIEDOT</h3>
                <p>GhoulHouse Oy<br />Helsinki, Suomi</p>
                <a href="mailto:hanna@ghoulhouse.fi">Hanna Nyholm <span aria-hidden="true">↗</span></a>
                <a href="mailto:hello@ghoulhouse.fi">hello@ghoulhouse.fi</a>
                <span className="ghLiquidFooterBusinessId">Y-TUNNUS 3651127-5</span>
              </div>

              <nav className="ghLiquidFooterNav ghLiquidFooterUtility" aria-label="Muut linkit">
                <h3>LISÄTIETOJA</h3>
                <Link href="/#yritys">GhoulHouse / tekijä <span aria-hidden="true">↗</span></Link>
                <Link href="/tietosuoja">Tietosuoja <span aria-hidden="true">↗</span></Link>
                <a href={contactHref}>Yhteydenotto <span aria-hidden="true">↗</span></a>
              </nav>
            </div>
          </div>
        </div>

        <div className="ghLiquidFooterWordmark" aria-hidden="true"><Image className="ghOfficialWordmark" src="/ghoulhouse-wordmark-white.svg" width={1000} height={200} alt="" /></div>
        <div className="ghLiquidFooterBottom">
          <span>© 2026 GhoulHouse Oy. Kaikki oikeudet pidätetään.</span>
          <span>HELSINKI · VERKKOSIVUT / SOCIAL / SEO</span>
          <a href={topHref}>Takaisin ylös <span aria-hidden="true">↑</span></a>
        </div>
      </div>
    </footer>
  );
}
