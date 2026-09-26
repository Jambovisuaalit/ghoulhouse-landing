/** Curated internal links: relevant next step per Social route, never a generic sitemap dump. */
export type RelatedSocialLink = { href: string; label: string; description: string };

const links: Record<string, RelatedSocialLink[]> = {
  'some-sisallontuotanto': [
    { href: '/some-12', label: 'SOME 12 -sisältöpaketti', description: 'Mitä 12 julkaisun 30 päivän pakettiin kuuluu?' },
    { href: '/some-sisallontuotanto/hinta', label: 'Some-sisällöntuotannon hinta', description: 'Hinta, toimitus ja asiakkaalta tarvittava materiaali.' },
    { href: '/instagram-sisallontuotanto', label: 'Instagram-sisällöntuotanto', description: 'Julkaisumuodot ja yhtenäinen Instagram-sisältö.' },
    { href: '/rakennusyrityksille', label: 'Rakennusyritysten some', description: 'Työmaiden ja valmiiden kohteiden sisältöideat.' },
    { href: '/lvi-yrityksille', label: 'LVI-yritysten some', description: 'Teknisen työn näyttäminen asiakkaille.' },
  ],
  'some-12': [
    { href: '/some-sisallontuotanto/hinta', label: 'Mitä some-sisällöntuotanto maksaa?', description: 'Paketin toimitussisältö ja hinnoittelun erittely.' },
    { href: '/some-sisallontuotanto', label: 'Näin sisällöntuotanto toimii', description: 'Ulkoistamisen käytännöt ja työnkulku ennen tilausta.' },
    { href: '/instagram-sisallontuotanto', label: 'Instagramin sisältömuodot', description: 'Minkälaisia julkaisuja kuvista voi rakentaa?' },
    { href: '/oppaat/tyomaakuvat-sosiaaliseen-mediaan', label: 'Työmaakuvat someen -opas', description: 'Näin valmistelet materiaalit ensimmäiseen erään.' },
  ],
  'rakennusyrityksille': [
    { href: '/some-12', label: 'SOME 12 rakennusyritykselle', description: 'Kuukausierän sisältö ja aloituksen ehdot.' },
    { href: '/oppaat/rakennusyrityksen-some', label: 'Rakennusyrityksen some -opas', description: 'Kohteet ja työvaiheet sisältöaiheina.' },
    { href: '/oppaat/tyomaakuvat-sosiaaliseen-mediaan', label: 'Työmaakuvat julkaisuiksi', description: 'Mitä kuvia työmaalta kannattaa kerätä?' },
    { href: '/verkkosivut/rakennus', label: 'Rakennusyrityksen verkkosivut', description: 'Näytä palvelut ja valmistuneet kohteet myös verkossa.' },
  ],
  'lvi-yrityksille': [
    { href: '/some-12', label: 'SOME 12 LVI-yritykselle', description: 'Kiinteä sisältöerä yrityksen omista kuvista.' },
    { href: '/verkkosivut/lvi', label: 'LVI-yrityksen verkkosivut', description: 'Selitä palvelut ja tekninen osaaminen verkkosivulla.' },
    { href: '/instagram-sisallontuotanto', label: 'Instagram-sisällöntuotanto', description: 'Asennukset, työvaiheet ja valmistuneet kohteet.' },
    { href: '/some-sisallontuotanto', label: 'Ulkoistettu some-sisällöntuotanto', description: 'Miten jatkuva tuotanto ja hyväksyntä toimivat?' },
  ],
  'instagram-sisallontuotanto': [
    { href: '/some-sisallontuotanto', label: 'Some-sisällöntuotanto yritykselle', description: 'Miten kanavia ja sisältöjä suunnitellaan yhdessä?' },
    { href: '/some-12', label: 'SOME 12 -paketti', description: '12 valmista sisältöä Instagramiin ja Facebookiin.' },
    { href: '/some-sisallontuotanto/hinta', label: 'Instagram-sisällöntuotannon hinta', description: 'Katso kiinteän SOME 12 -erän hinnoittelu.' },
    { href: '/oppaat/tyomaakuvat-sosiaaliseen-mediaan', label: 'Kuvausohje työmaalle', description: 'Valmistele Instagram-julkaisujen kuvamateriaali.' },
  ],
  'saneerausyrityksille': [
    { href: '/some-12', label: 'SOME 12 -sisältöpaketti', description: 'Remonttikuvista 12 sisältöä 30 päivässä.' },
    { href: '/oppaat/tyomaakuvat-sosiaaliseen-mediaan', label: 'Ennen–jälkeen-kuvat someen', description: 'Kuvamateriaalin valinta ja julkaisun taustatiedot.' },
    { href: '/some-sisallontuotanto/hinta', label: 'Sisällöntuotannon hinta', description: 'Mitä valmis kuukausierä maksaa?' },
    { href: '/verkkosivut/rakennus', label: 'Remonttikohteet verkkosivuille', description: 'Näytä toteutukset ja yhteydenotto myös verkkosivulla.' },
  ],
  'some-sisallontuotanto/hinta': [
    { href: '/some-12', label: 'Tutustu SOME 12 -pakettiin', description: 'Valmis sisältöerä ja aloitusvaiheet.' },
    { href: '/some-sisallontuotanto', label: 'Miten sisällöntuotanto toimii?', description: 'Työnkulku ja asiakkaan osallistuminen.' },
    { href: '/instagram-sisallontuotanto', label: 'Instagram-julkaisujen suunnittelu', description: 'Sisältömuodot oman materiaalin pohjalta.' },
    { href: '/rakennusyrityksille', label: 'Rakennusalan some-sisällöt', description: 'Toimialakohtaiset esimerkit ja työmaakuvat.' },
  ],
};

const fallbackLinks = links['some-sisallontuotanto'];

export function getRelatedSocialLinks(slug: string): RelatedSocialLink[] {
  return (links[slug] ?? fallbackLinks)
    .filter((link) => link.href !== '/' + slug)
    .filter((link, index, all) => all.findIndex((item) => item.href === link.href) === index);
}
