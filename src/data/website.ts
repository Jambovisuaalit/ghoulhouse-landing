export type WebsiteVertical = {
  slug: string;
  label: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  pain: string[];
  deliverables: string[];
  proof: string[];
  faq: Array<[string, string]>;
};

export const websiteVerticals: Record<string, WebsiteVertical> = {
  rakennus: {
    slug: 'rakennus',
    label: 'RAKENNUSYRITYKSEN VERKKOSIVUT',
    title: 'Verkkosivut rakennusyritykselle | GhoulHouse',
    description: 'Selkeät verkkosivut rakennusyritykselle: palvelut, referenssit, yhteydenotto ja teknisesti valmis kokonaisuus.',
    h1: 'Verkkosivut, jotka näyttävät mitä rakennusyritys oikeasti tekee.',
    intro: 'Rakennusyrityksen sivuston pitää tehdä työ näkyväksi nopeasti: mitä rakennetaan, millaisia kohteita on tehty ja miten tarjouspyyntö jätetään.',
    pain: ['Palvelut jäävät yleiselle tasolle.', 'Hyvät kohteet eivät muodosta uskottavaa referenssipolkua.', 'Yhteydenotto vaatii liikaa etsimistä tai arvaamista.'],
    deliverables: ['Selkeä palvelurakenne', 'Referenssit ja kohdekohtainen näyttö', 'Mobiili ensin -rakenne', 'Yhteydenotto ja tarjouspyyntöpolku', 'Perus-SEO ja tekninen julkaisuvalmius'],
    proof: ['Projektitiedot ennen markkinointiväitteitä', 'Oikeat kohdekuvat ja työn vaiheet', 'Referenssit ilman keksittyjä tuloslupauksia'],
    faq: [['Tarvitaanko uudet kuvat?', 'Ei välttämättä. Sivusto voidaan rakentaa olemassa olevasta kohde- ja projektimateriaalista.'], ['Voiko vanhan sivuston sisällön siirtää?', 'Kyllä. Sisältö voidaan auditoida ja järjestää uudelleen sen sijaan, että kaikkea kirjoitetaan tyhjästä.']]
  },
  lvi: {
    slug: 'lvi',
    label: 'LVI-YRITYKSEN VERKKOSIVUT',
    title: 'Verkkosivut LVI-yritykselle | GhoulHouse',
    description: 'LVI-yrityksen verkkosivut, joissa tekninen työ muuttuu selkeäksi palveluksi, referensseiksi ja yhteydenotoiksi.',
    h1: 'LVI-yrityksen työ ymmärrettäväksi jo ensimmäisellä ruudulla.',
    intro: 'LVI-palvelu voi olla teknisesti monimutkainen. Verkkosivun tehtävä on tehdä palvelu, kohteet ja seuraava askel asiakkaalle ymmärrettäväksi.',
    pain: ['Tekninen palvelu ei avaudu maallikolle.', 'Palveluvalikoima on vaikea hahmottaa.', 'Referensseissä ei kerrota mitä kohteessa tehtiin.'],
    deliverables: ['Palvelut asiakkaan kielellä', 'Työvaiheisiin perustuva näyttö', 'Usein kysytyt kysymykset', 'Yhteydenottopolku', 'SEO-perusrakenne'],
    proof: ['Projektifaktat tarkistetaan ennen julkaisua', 'Tekniset ratkaisut avataan ilman turhaa jargonia', 'Referenssit sidotaan tehtyyn työhön'],
    faq: [['Voiko sivustolla käyttää nykyisiä projektikuvia?', 'Kyllä. Olemassa oleva työmaa- ja kohdemateriaali on usein paras lähtökohta.'], ['Entä jos palveluita on paljon?', 'Palvelut ryhmitellään asiakkaan ongelmien ja ostotilanteiden mukaan, ei pelkän sisäisen organisaation mukaan.']]
  },
  sahko: {
    slug: 'sahko',
    label: 'SÄHKÖYRITYKSEN VERKKOSIVUT',
    title: 'Verkkosivut sähköyritykselle | GhoulHouse',
    description: 'Sähköyrityksen verkkosivut, joissa palvelut, osaaminen, referenssit ja yhteydenotto löytyvät ilman turhaa kitkaa.',
    h1: 'Sähköyrityksen palvelut selkeästi. Yhteydenotto ilman kitkaa.',
    intro: 'Sähkötyössä asiakas haluaa nopeasti tietää mitä tehdään, kenelle palvelu sopii ja miten työn saa liikkeelle.',
    pain: ['Palvelulista ei kerro asiakkaalle mitä kannattaa tilata.', 'Osaaminen jää yritysesittelyn taakse.', 'Yhteydenotto ei ole rakennettu ostotilanteen ympärille.'],
    deliverables: ['Palvelu- ja kohderakenne', 'Referenssit ja työnäytteet', 'Mobiilioptimoitu yhteydenotto', 'Luottamusta rakentava yritysesittely', 'Tekninen SEO-perusta'],
    proof: ['Todelliset palvelut ja kohteet', 'Yrityksen omat faktat näkyviin', 'Ei keksittyjä asiakastuloksia tai testimonial-lupauksia'],
    faq: [['Sopiiko tämä pienelle sähköurakoitsijalle?', 'Kyllä. Rakenne voidaan mitoittaa palvelumäärän, kohderyhmän ja nykyisen materiaalin mukaan.'], ['Voiko sivuston päivittää itse?', 'Rakenne voidaan toteuttaa niin, että sovitut sisältöalueet ovat myöhemmin ylläpidettäviä.']]
  }
};

export const websiteMainFacts = [
  ['01', 'RAKENNE', 'Palvelut, kohteet ja yhteydenotto samassa selkeässä polussa.'],
  ['02', 'NÄYTTÖ', 'Referenssit perustuvat oikeaan työhön ja varmennettaviin projektifaktoihin.'],
  ['03', 'JULKAISU', 'Mobiili, tekninen SEO, nopeus ja julkaisuvalmius kuuluvat toteutukseen.'],
] as const;

export const websiteResources = [
  ['Verkkosivut yritykselle', 'Mitä hyvä yrityssivusto tarvitsee ennen toteutusta.', '/verkkosivut-yritykselle'],
  ['Verkkosivujen hinta', 'Mistä verkkosivuprojektin työ ja kustannus muodostuvat.', '/verkkosivut/hinta'],
  ['Referenssit', 'Miten oikea työnäyttö rakennetaan ilman keksittyjä tulosväitteitä.', '/referenssit'],
] as const;
