export const deliverables = [
  '12 alkuperäistä sisältöä / 30 päivää',
  'Instagram- ja Facebook-adaptaatiot',
  'Sisältösuunnittelu',
  'Kevyt kuvankäsittely ja grafiikat',
  'Copywriting ja toimintakehotukset',
  'Ajastus ja julkaiseminen',
  'Yksi koottu korjauskierros',
  'WhatsApp-kommunikaatio',
  'Kuukausittainen tulosyhteenveto',
  'Onboarding ja materiaaliohjeistus',
] as const;

export const managedExtras = [
  'Jatkuva sisältöoptimointi',
  'Aiheiden, formaattien ja CTA:iden analyysi',
  'Julkaisurytmin optimointi',
  'Sisältöpankin ylläpito',
  'Lyhyt viikoittainen tilannepäivitys',
  'Rajattu community management',
  'Yksi konkreettinen kehitysehdotus / kuukausi',
] as const;

export const customerResponsibilities = [
  'Kuvat ja muu sovittu materiaali',
  'Projektien ja palveluiden oikeat faktat',
  'Sisältöjen hyväksyntä sovitussa aikataulussa',
  'Tarvittavat käyttöoikeudet somekanaviin',
] as const;

export const processSteps = [
  {
    number: '01',
    title: 'Materiaali sisään',
    body: 'Toimitat työmaa- ja referenssikuvat sekä faktat. Materiaalin ei tarvitse olla valmiiksi markkinointikäyttöön viimeisteltyä.',
  },
  {
    number: '02',
    title: 'Sisältöbatch',
    body: 'Valitsemme aiheet, käsittelemme kuvat, rakennamme grafiikat ja kirjoitamme julkaisutekstit sekä CTA:t.',
  },
  {
    number: '03',
    title: 'Hyväksyntä',
    body: 'Saat sisällöt koottuna tarkistettavaksi. Pakettiin kuuluu yksi koottu korjauskierros.',
  },
  {
    number: '04',
    title: 'Julkaisu',
    body: 'Hyväksytyt sisällöt ajastetaan Instagramiin ja Facebookiin. Kuukauden lopussa saat yhteenvedon toteutuksesta.',
  },
] as const;

export const faqItems = [
  {
    question: 'Tarkoittaako 12 sisältöä 24 erillistä postausta?',
    answer:
      'Ei. Palvelu sisältää 12 alkuperäistä sisältöä, jotka adaptoidaan Instagramiin ja Facebookiin. Kyse ei ole 24 erikseen tuotetusta sisällöstä.',
  },
  {
    question: 'Tarvitseeko meidän järjestää kuvauspäivä?',
    answer:
      'Ei. Palvelun lähtökohta on hyödyntää kuvia ja materiaalia, joita teillä syntyy työn yhteydessä. Erillinen valokuvaus tai videotuotanto ei kuulu peruspalveluun.',
  },
  {
    question: 'Sisältyykö maksettu mainonta?',
    answer:
      'Ei. START ja MANAGED keskittyvät orgaaniseen Instagram- ja Facebook-sisältöön. Maksettu mainonta hinnoitellaan erikseen, jos se myöhemmin lisätään palveluun.',
  },
  {
    question: 'Lupaatteko liidejä tai myyntiä?',
    answer:
      'Emme. GhoulHouse lupaa sovitun sisällöntuotannon ja hallinnan. Tavoittavuus, liidit, seuraajamäärä, myynti tai liikevaihto eivät ole taattuja tuloksia.',
  },
  {
    question: 'Mitä tapahtuu kolmen ensimmäisen palvelujakson jälkeen?',
    answer:
      'Palvelujaksot 1–3 ovat START-hinnalla 490 € + ALV / 30 päivää. Palvelujaksosta 4 alkaen palvelu jatkuu MANAGED-tasolla 790 € + ALV / 30 päivää.',
  },
  {
    question: 'Voiko palvelun lopettaa?',
    answer:
      'Kyllä. Palvelu on kuukausittain irtisanottava sovittujen sopimusehtojen mukaisesti. Tarkat laskutus- ja päättymisehdot vahvistetaan tarjouksessa ja sopimuksessa.',
  },
  {
    question: 'Mitä meidän pitää itse hoitaa?',
    answer:
      'Te toimitatte materiaalit ja oikeat faktat, hyväksytte sisällöt ja annatte tarvittavat käyttöoikeudet. Vaativa asiakaspalvelu, reklamaatiot, myyntineuvottelut ja tarjoukset pysyvät teillä.',
  },
] as const;
