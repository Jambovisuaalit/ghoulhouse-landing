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

/** Specific, verifiable delivery explanations instead of the former repeated placeholder. */
export const websiteDeliverableDescriptions: Record<string, string> = {
  'Sivustorakenne ja navigaatio': 'Ryhmittelemme palvelut ja keskeiset sivut loogisesti. Kävijä löytää palvelun kuvauksen, työnäytteet ja yhteydenoton ilman ylimääräistä etsimistä.',
  'Palvelusivut ja ostamista tukeva copy': 'Kirjoitamme palveluista asiakkaan kysymyksiin vastaavat kuvaukset yrityksen omien tietojen pohjalta: mitä tehdään, kenelle ja miten yhteydenotto etenee.',
  'Referenssit ja työnäyttö': 'Kokoamme hyväksytyistä kohdekuvista ja varmennetuista projektifaktoista ymmärrettäviä työnäytteitä. Puuttuvia referenssejä tai tuloksia ei keksitä.',
  'Yhteydenotto ja tarjouspyyntö': 'Sijoitamme yhteydenottokehotteet sopiviin ostopäätöksen kohtiin ja rakennamme lomakkeen, jolla asiakkaan tarve välittyy yritykselle.',
  'Mobiilioptimointi': 'Tarkistamme otsikoiden, kuvien, valikoiden ja lomakkeiden luettavuuden ja toiminnan pienillä näytöillä sekä tavallisilla työpöytäleveyksillä.',
  'Tekninen SEO ja julkaisu': 'Määrittelemme sivukohtaiset otsikot, kuvaukset, sisäiset linkit, hakukoneohjeet ja sivustokartan sekä tarkistamme niiden toiminnan ennen julkaisua.',
  'Selkeä palvelurakenne': 'Erottamme urakointi- ja remonttipalvelut omiksi ymmärrettäviksi kokonaisuuksiksi, jotta asiakas tunnistaa tarvitsemansa työn.',
  'Referenssit ja kohdekohtainen näyttö': 'Kuvaamme kohteen lähtötilanteen, tehdyt työvaiheet ja lopputuloksen vain käytettävissä olevan ja asiakkaan hyväksymän aineiston pohjalta.',
  'Mobiili ensin -rakenne': 'Tärkeimmät palvelut, kohdekuvat ja tarjouspyyntö löytyvät helposti myös puhelimella työmaalla tai asiakkaan kotona.',
  'Yhteydenotto ja tarjouspyyntöpolku': 'Rakennamme reitin palvelusivulta tai kohde-esittelystä oikeaan yhteydenottolomakkeeseen, jossa tarve voidaan kuvata.',
  'Perus-SEO ja tekninen julkaisuvalmius': 'Tarkistamme rakennuspalvelujen sivujen otsikoinnin, metatiedot, linkityksen ja teknisen löydettävyyden ennen julkaisua.',
  'Palvelut asiakkaan kielellä': 'Avaamme LVI-palvelut ilman turhaa ammattijargonia: mistä työstä on kyse ja milloin asiakas tarvitsee sitä.',
  'Työvaiheisiin perustuva näyttö': 'Esittelemme hyväksyttyjen kohteiden asennuksia ja työvaiheita kuvien sekä asiakkaan tarkistamien teknisten tietojen avulla.',
  'Usein kysytyt kysymykset': 'Kokoamme palvelukohtaiset vastaukset esimerkiksi työn etenemisestä, valmistelusta ja tarjouspyynnön lähtötiedoista.',
  'Yhteydenottopolku': 'Asiakas pääsee suoraan asiaankuuluvalta LVI-palvelusivulta yhteydenottoon ilman, että hänen täytyy etsiä oikeaa kanavaa.',
  'SEO-perusrakenne': 'Suunnittelemme LVI-palveluille yksilölliset sivuotsikot ja niitä tukevan sisäisen linkityksen yrityksen todellisen palvelualueen mukaan.',
  'Palvelu- ja kohderakenne': 'Jaottelemme sähköalan palvelut ostopäätöstä helpottaviin ryhmiin ja kerromme, millaisiin kohteisiin työtä tehdään.',
  'Referenssit ja työnäytteet': 'Näytämme toteutuneita sähköalan kohteita vain hyväksytyillä kuvilla ja oikeilla projektitiedoilla.',
  'Mobiilioptimoitu yhteydenotto': 'Teemme puhelimella käytettävästä tarjouspyynnöstä selkeän ja helposti löydettävän palvelusivuilta.',
  'Luottamusta rakentava yritysesittely': 'Esitämme yrityksen vahvistamat osaamisalueet, yhteystiedot ja toimintatavan ilman keksittyjä kokemusvuosia tai asiakasväitteitä.',
  'Tekninen SEO-perusta': 'Rakennamme sähköpalveluille johdonmukaiset sivuotsikot, metatiedot, sisäiset linkit ja julkaisuvalmiin rakenteen.',
};
