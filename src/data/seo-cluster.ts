export type SeoClusterPage = {
  slug: string; title: string; description: string; h1: string; eyebrow: string; intro: string;
  painPoints: string[]; examples: string[]; process: string[]; faq: Array<[string, string]>;
};

export const seoClusterPages: Record<string, SeoClusterPage> = {
  'rakennusyrityksille': {
    slug: 'rakennusyrityksille', title: 'Some-sisällöntuotanto rakennusyrityksille | GhoulHouse',
    description: 'Rakennusyrityksen työmaakuvista valmiit Instagram- ja Facebook-sisällöt. GhoulHouse SOME 12: 12 sisältöä 30 päivässä, 490 € + ALV.',
    h1: 'Työmaakuvista valmis some rakennusyritykselle.', eyebrow: 'RAKENNUSYRITYSTEN SOME-SISÄLLÖT',
    intro: 'Rakennusyrityksessä syntyy jatkuvasti kuvaa, projektifaktaa ja työn jälkeä. Ongelma on usein se, että materiaali jää puhelimeen. GhoulHouse tekee siitä julkaistavan kuukausierän.',
    painPoints: ['Työmaakuvat syntyvät, mutta kukaan ei ehdi tehdä niistä julkaisuja.', 'Referenssit jäävät irrallisiksi kuvapinoiksi ilman selkeää tarinaa.', 'Yrittäjän ei tarvitse saada uutta markkinointiprojektia hoidettavakseen.'],
    examples: ['Työmaa nyt: mitä kohteessa tapahtuu juuri tällä viikolla.', 'Valmis kohde: työn jälki, ratkaisu ja lopputulos samassa julkaisussa.', 'Ennen / jälkeen: muutos näkyväksi ilman raskasta videotuotantoa.', 'Tekijä ja prosessi: yrityksen osaaminen esiin työn kautta.'],
    process: ['Kokoamme työmaa- ja referenssimateriaalin yhteen erään.', 'Valitsemme kuvat, kirjoitamme julkaisut ja rakennamme visuaalisen rytmin.', 'Asiakas tarkistaa faktat ja tekee yhden kootun korjauskierroksen.', 'Hyväksytyt sisällöt ajastetaan Instagramiin ja Facebookiin.'],
    faq: [['Tarvitseeko rakennusyritys uuden kuvauspäivän?', 'Ei lähtökohtaisesti. SOME 12 rakennetaan olemassa olevasta työmaa- ja referenssimateriaalista.'], ['Voiko sisältöihin lisätä projektitietoja?', 'Kyllä. Projektin olennaiset faktat toimivat copyjen lähtötietona ja asiakas tarkistaa faktat ennen julkaisua.'], ['Mitä ensimmäinen kuukausi maksaa?', 'SOME 12 maksaa 490 € + ALV / 30 päivää ilman automaattista jatkoa.']]
  },
  'lvi-yrityksille': {
    slug: 'lvi-yrityksille', title: 'Some-sisällöntuotanto LVI-yrityksille | GhoulHouse',
    description: 'LVI-yrityksen työmaa-, putki- ja kylpyhuoneremonttikuvista valmiit some-sisällöt. 12 sisältöä / 30 päivää, 490 € + ALV.',
    h1: 'LVI-yrityksen työmaakuvista valmis some.', eyebrow: 'LVI-YRITYSTEN SOME-SISÄLLÖT',
    intro: 'LVI-työ on konkreettista, mutta ulospäin helposti näkymätöntä. GhoulHouse tekee asennuksista, työvaiheista ja valmiista kohteista selkeää sisältöä ilman erillistä kuvauspäivää.',
    painPoints: ['Putki- ja märkätilätyöstä syntyy kuvia, mutta ne eivät muutu julkaisuiksi.', 'Asiakkaalle vaikea tekninen työ pitäisi pystyä näyttämään ymmärrettävästi.', 'Sisällön tekeminen ei saa viedä asentajien tai yrittäjän työaikaa.'],
    examples: ['Työvaihe: mitä tehdään ja miksi sillä on merkitystä.', 'Kylpyhuoneremontti: lähtötilanne, ratkaisu ja valmis pinta.', 'Yksityiskohta: putkisto, kaluste, materiaali tai tekninen toteutus.', 'Usein kysytty: yksi asiakkaan kysymys yhdeksi hyödylliseksi julkaisuksi.'],
    process: ['Keräämme kohteista syntyneet kuvat ja lyhyet projektifaktat.', 'Muutamme teknisen työn ymmärrettäviksi sisältökulmiksi.', 'Rakennamme 12 julkaisun erän ja yhden koontikorjauskierroksen.', 'Ajastamme hyväksytyt sisällöt Instagramiin ja Facebookiin.'],
    faq: [['Sopiiko palvelu myös kylpyhuoneremontteihin?', 'Kyllä. Kylpyhuone-, märkätila- ja LVI-työ sopivat hyvin visuaaliseen työmaapohjaiseen sisältöön.'], ['Pitääkö tekniset tiedot tarkistaa?', 'Kyllä. Asiakas hyväksyy faktat ja julkaisusuunnan ennen ajastusta.'], ['Mitä jos työmaakuvia on vähän?', 'Aloitamme käytettävissä olevasta materiaalista ja annamme seuraavaa erää varten täsmälliset kuvausohjeet.']]
  },
  'some-sisallontuotanto': {
    slug: 'some-sisallontuotanto', title: 'Some-sisällöntuotanto yrityksille | GhoulHouse',
    description: 'Ulkoistettu some-sisällöntuotanto yrityksille, joilla on omaa kuva- ja projektimateriaalia. 12 sisältöä 30 päivässä, 490 € + ALV.',
    h1: 'Some-sisällöntuotanto alkaa yrityksen omasta työstä.', eyebrow: 'SOME-SISÄLLÖNTUOTANTO',
    intro: 'GhoulHouse ei aloita tyhjästä sisältökalenterista. Tuotanto rakennetaan yrityksen omasta työstä, kuvista ja projektifaktoista, jotta julkaisut pysyvät käytännönläheisinä ja todennettavina.',
    painPoints: ['Sisällöntuotanto on epäsäännöllistä, vaikka materiaalia syntyy.', 'Yrittäjä joutuu itse miettimään mitä julkaistaan ja milloin.', 'Ulkoistaminen tuntuu raskaalta, jos jokainen julkaisu vaatii uuden briiffin.'],
    examples: ['Työmaapäivitykset, referenssit ja valmiit kohteet.', 'Prosessi- ja materiaalisisällöt, jotka näyttävät miten työ tehdään.', 'Usein kysytyt kysymykset muutettuna lyhyiksi julkaisuiksi.', 'CTA-sisällöt, jotka ohjaavat kiinnostuneen yhteydenottoon.'],
    process: ['Sovitaan lähtömateriaali ja kuukauden olennaiset projektit.', 'GhoulHouse suunnittelee, kirjoittaa, käsittelee ja kokoaa sisällöt.', 'Asiakas tarkistaa yhden koontierän.', 'Sisällöt julkaistaan sovituissa kanavissa.'],
    faq: [['Mitä some-sisällöntuotanto sisältää?', 'SOME 12 sisältää 12 alkuperäistä sisältöä 30 päivässä, Instagramin ja Facebookin, suunnittelun, kuvankäsittelyn, copyt, ajastuksen, yhden korjauskierroksen ja kevyen kuukausiraportin.'], ['Tarvitaanko jatkuva sopimus?', 'Ei. Ensimmäiset 30 päivää ovat 490 € + ALV, eikä jatko synny automaattisesti.'], ['Kuka tekee sisällöt?', 'Hanna Nyholm vastaa GhoulHousen asiakastyöstä, sisältösuunnittelusta ja tuotannosta.']]
  },
  'instagram-sisallontuotanto': {
    slug: 'instagram-sisallontuotanto', title: 'Instagram-sisällöntuotanto yrityksille | GhoulHouse',
    description: 'Valmiit Instagram-sisällöt yrityksen omista työmaa- ja referenssikuvista. GhoulHouse SOME 12: 12 sisältöä 30 päivässä.',
    h1: 'Instagram-sisällöt yrityksen omista työmaakuvista.', eyebrow: 'INSTAGRAM-SISÄLLÖNTUOTANTO',
    intro: 'Instagramissa yrityksen työn pitää näkyä ennen kuin siitä voidaan kertoa enempää. GhoulHouse rakentaa työmaa- ja referenssikuvista yhtenäisen julkaisulinjan, jossa kuva, teksti ja CTA toimivat yhdessä.',
    painPoints: ['Instagram-profiili ei päivity työn tahdissa.', 'Hyvät kuvat eivät muodosta tunnistettavaa kokonaisuutta.', 'Postauksen kirjoittaminen jää aina viimeiseksi tehtäväksi.'],
    examples: ['Carousel: lähtötilanne → työvaihe → valmis kohde.', 'Yksittäinen referenssikuva vahvalla projektifaktalla.', 'Tekijä- ja prosessisisältö, joka näyttää yrityksen osaamista.', 'FAQ-postaus, joka vastaa asiakkaan ennen ostoa esittämään kysymykseen.'],
    process: ['Valitsemme Instagramiin sopivat kuvat ja aiheet.', 'Rakennamme julkaisujen copyt, rakenteen ja CTA:t.', 'Koko 12 sisällön erä tarkistetaan yhtenä kokonaisuutena.', 'Hyväksytyt julkaisut ajastetaan Instagramiin ja tarvittaessa Facebookiin.'],
    faq: [['Tehdäänkö Reelsejä?', 'Reelsejä voidaan tehdä, kun käytettävissä on sopivaa materiaalia. SOME 12:n ydin on 12 valmista sisältöä kuukaudessa.'], ['Voiko Instagram-sisältö käyttää olemassa olevia kuvia?', 'Kyllä. Palvelu on rakennettu yrityksen omien työmaa- ja referenssikuvien ympärille.'], ['Miten sisältöjen tyyli päätetään?', 'Visuaalinen ja tekstillinen linja rakennetaan yrityksen työn, materiaalin ja kohderyhmän perusteella.']]
  },
  'saneerausyrityksille': {
    slug: 'saneerausyrityksille', title: 'Some-sisällöntuotanto saneerausyrityksille | GhoulHouse',
    description: 'Saneerausyrityksen työmaa-, ennen-jälkeen- ja referenssikuvista valmiit some-sisällöt. 12 sisältöä 30 päivässä, 490 € + ALV.',
    h1: 'Saneerauskohteista valmis some.',
    eyebrow: 'SANEERAUSYRITYSTEN SOME-SISÄLLÖT',
    intro: 'Saneeraustyössä muutos on jo itsessään sisältöä: lähtötilanne, työvaiheet, ratkaisut ja valmis kohde. GhoulHouse tekee tästä materiaalista selkeän kuukausierän ilman erillistä kuvauspäivää.',
    painPoints: ['Ennen-jälkeen-kuvat syntyvät, mutta ne jäävät puhelimeen.', 'Remontin työvaiheet ovat kiinnostavia, mutta niitä ei ehditä sanoittaa julkaisuiksi.', 'Valmiista kohteista ei synny jatkuvaa referenssisisältöä.'],
    examples: ['Ennen / jälkeen: muutos näkyväksi yhdellä julkaisulla.', 'Työvaihe: mitä kohteessa tehtiin ja miksi.', 'Valmis kohde: lopputulos, materiaalit ja työn rajaus.', 'Usein kysytty: remontin vaihe tai ratkaisu asiakkaan näkökulmasta.'],
    process: ['Keräämme saneerauskohteiden kuvat ja varmennetut projektifaktat.', 'Valitsemme kuvista julkaisukulmat ja kirjoitamme sisällöt.', 'Asiakas tarkistaa faktat ja tekee yhden kootun korjauskierroksen.', 'Hyväksytyt sisällöt ajastetaan Instagramiin ja Facebookiin.'],
    faq: [['Tarvitaanko uusi kuvauspäivä?', 'Ei lähtökohtaisesti. SOME 12 rakennetaan yrityksen olemassa olevasta työmaa- ja referenssimateriaalista.'], ['Voiko ennen-jälkeen-kuvia käyttää?', 'Kyllä, kun kuvat ovat yrityksen omia tai niiden käyttöoikeus on kunnossa ja kohteen faktat voidaan varmistaa.'], ['Mitä ensimmäinen kuukausi maksaa?', 'SOME 12 maksaa 490 € + ALV / 30 päivää ilman automaattista jatkoa.']]
  },
  'some-sisallontuotanto/hinta': {
    slug: 'some-sisallontuotanto/hinta', title: 'Some-sisällöntuotannon hinta | GhoulHouse',
    description: 'SOME 12 maksaa 490 € + ALV / 30 päivää. Katso mitä hintaan sisältyy, miten tuotanto etenee ja mitä asiakkaalta tarvitaan.',
    h1: 'Some-sisällöntuotannon hinta ilman markkinointipakettien sumua.',
    eyebrow: 'SOME 12 / HINTA',
    intro: 'Yksi selkeä tuotantoerä: 12 valmista Instagram- ja Facebook-sisältöä 30 päivässä. Suunnittelu, copy, kuvankäsittely, ajastus ja yksi korjauskierros kuuluvat samaan kokonaisuuteen.',
    painPoints: ['Hinta ei kerro mitä konkreettisesti saa.', 'Jatkuva sopimus tekee kokeilusta tarpeettoman raskaan.', 'Sisältöpalvelun tuotantovaiheet jäävät helposti epäselviksi.'],
    examples: ['12 sisältöä: yksi kuukausierä, ei epämääräistä tuntityötä.', 'Instagram + Facebook: sama tuotanto hyödynnetään kahdessa kanavassa.', 'Yksi koottu korjauskierros: hyväksyntä yhdellä kertaa.', '490 € + ALV: hinta tiedossa ennen aloitusta.'],
    process: ['Lähtömateriaalin vastaanotto ja kuukauden tärkeimpien kohteiden valinta.', '12 sisällön suunnittelu, copy, kuvankäsittely ja somemuotoilu.', 'Yksi koottu hyväksyntä- ja korjauskierros.', 'Ajastus, julkaiseminen ja kevyt kuukausiraportti.'],
    faq: [['Paljonko SOME 12 maksaa?', '490 € + ALV / 30 päivää.'], ['Onko palvelussa jatkuva sopimus?', 'Ei. Ensimmäinen 30 päivän tuotantoerä on oma kokonaisuutensa ja jatkosta päätetään erikseen.'], ['Mitä asiakkaan pitää toimittaa?', 'Yrityksen omat työmaa-, referenssi- tai projektikuvat sekä olennaiset faktat kohteista.']]
  },
  'referenssit': {
    slug: 'referenssit', title: 'Rakennus- ja LVI-yritysten referenssisisällöt | GhoulHouse',
    description: 'Muuta valmistuneet kohteet, ennen-jälkeen-kuvat ja työvaiheet julkaistaviksi referenssisisällöiksi. GhoulHouse SOME 12.',
    h1: 'Referenssikuvat, joista asiakas ymmärtää työn jäljen.', eyebrow: 'REFERENSSISISÄLLÖT',
    intro: 'Referenssi ei ole vain valmis kuva. Se on lähtötilanne, tehty työ, ratkaisu ja lopputulos. GhoulHouse rakentaa tästä rakenteesta sisältöjä, joita potentiaalinen asiakas pystyy vertaamaan omaan tilanteeseensa.',
    painPoints: ['Valmiit kohteet jäävät verkkosivulle, vaikka niitä voisi hyödyntää kuukausia.', 'Ennen-jälkeen-kuvat puuttuvat tai niiden konteksti jää kertomatta.', 'Potentiaalinen asiakas ei näe, mitä yritys oikeasti teki.'],
    examples: ['Kohdekortti: lähtötilanne, työ ja lopputulos.', 'Ennen / jälkeen -julkaisu, jossa muutos on pääosassa.', 'Materiaalivalinta tai yksityiskohta perusteluineen.', 'Lyhyt asiakaskohteen tarina ilman keksittyjä tulosväitteitä.'],
    process: ['Keräämme kohteen kuvat ja varmennetut projektifaktat.', 'Muodostamme referenssistä yhden tai useamman sisältökulman.', 'Asiakas tarkistaa faktat ja hyväksyy koontierän.', 'Valmis sisältö voidaan ajastaa osaksi kuukausirytmiä.'],
    faq: [['Voiko referenssistä tehdä useamman julkaisun?', 'Kyllä, jos kohteesta on riittävästi erilaista materiaalia ja jokaisella julkaisulla on oma selkeä näkökulmansa.'], ['Käytetäänkö keksittyjä asiakaslupauksia?', 'Ei. Referenssisisällöt perustuvat käytettävissä olevaan materiaaliin ja varmennettuihin projektifaktoihin.'], ['Onko referenssisivu sama asia kuin SOME 12?', 'Referenssisisällöt ovat yksi tuotannon sisältörooli. SOME 12 kokoaa ne yhteen muiden työmaa-, prosessi- ja FAQ-sisältöjen kanssa.']]
  },
  'some-12': {
    slug: 'some-12', title: 'SOME 12 — 12 some-sisältöä 30 päivässä | GhoulHouse',
    description: 'GhoulHouse SOME 12: 12 valmista Instagram- ja Facebook-sisältöä 30 päivässä. Suunnittelu, kuvankäsittely, copy, julkaisu ja yksi korjauskierros. 490 € + ALV.',
    h1: '12 valmista some-sisältöä 30 päivässä.', eyebrow: 'GHOULHOUSE SOME 12',
    intro: 'SOME 12 on yksi selkeä tuotantoerä: yrityksen omasta työstä rakennetaan 12 julkaisukelpoista sisältöä 30 päivässä. Hinta on 490 € + ALV, eikä jatko synny automaattisesti.',
    painPoints: ['Someen tarvitaan jatkuvuutta, mutta erillistä markkinointiprojektia ei haluta.', 'Sisältöjen suunnittelu, kirjoittaminen ja julkaiseminen vievät yrittäjän aikaa.', 'Ostettavan palvelun pitää olla helppo aloittaa ja helppo arvioida.'],
    examples: ['4 sisältöroolia: työmaa, valmis kohde, prosessi ja hyödyllinen tieto.', '12 julkaisua, jotka muodostavat yhden kuukauden rytmin.', 'Instagram + Facebook ilman erillistä kanavakohtaista tuotantoprojektia.', 'Yksi koottu korjauskierros ennen ajastusta.'],
    process: ['Lähtöpalaveri ja materiaalin vastaanotto.', '12 sisällön suunnittelu, copy, kuvankäsittely ja somemuotoilu.', 'Yksi koottu hyväksyntä- ja korjauskierros.', 'Ajastus, julkaisu ja kevyt kuukausiraportti.'],
    faq: [['Mitä SOME 12 maksaa?', '490 € + ALV / 30 päivää.'], ['Mitä hintaan sisältyy?', '12 alkuperäistä sisältöä, Instagram + Facebook, suunnittelu, kuvankäsittely, copyt, CTA:t, ajastus, julkaiseminen, yksi korjauskierros ja kevyt kuukausiraportti.'], ['Jatkuuko palvelu automaattisesti?', 'Ei. Ensimmäiset 30 päivää ovat oma pilottinsa ja jatkosta päätetään erikseen.']]
  }
};
