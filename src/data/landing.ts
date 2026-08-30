export type ProofItem = {
  label: string;
  value: string;
};

export type ProcessStep = {
  number: `0${1 | 2 | 3}`;
  title: string;
  body: string;
};

export type ContentExample = {
  title: string;
  eyebrow: string;
  copy: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export const proofItems: ProofItem[] = [
  { label: 'Sisältö', value: '12 sisältöä / 30 päivää' },
  { label: 'Kanavat', value: 'Instagram + Facebook' },
  { label: 'Korjaukset', value: 'Yksi koottu korjauskierros' },
  { label: 'Raportointi', value: 'Kevyt kuukausiraportti' },
  { label: 'Lähtömateriaali', value: 'Asiakas toimittaa kuvat ja faktat' },
];

export const problemItems = [
  'Kuvat jäävät puhelimeen.',
  'Julkaiseminen on epäsäännöllistä.',
  'Tekstien kirjoittaminen jää yrittäjälle.',
  'Referenssit eivät muodosta jatkuvaa sisältöä.',
] as const;

export const solutionItems = [
  'Asiakas toimittaa työkuvat ja tarvittavat faktat.',
  'GhoulHouse suunnittelee kuukausirytmin.',
  'Kuvat käsitellään oikeisiin formaatteihin.',
  'Tekstit, CTA:t ja hashtagit tehdään valmiiksi.',
  'Sisällöt ajastetaan ja julkaistaan sovitusti.',
] as const;

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'LÄHETÄ MATERIAALIT',
    body: 'Asiakas toimittaa työkuvat ja tarvittavat projektifaktat.',
  },
  {
    number: '02',
    title: 'HYVÄKSY SUUNTA',
    body: 'GhoulHouse rakentaa sisältörytmin, käsittelee kuvat ja kirjoittaa tekstit.',
  },
  {
    number: '03',
    title: 'NÄY SÄÄNNÖLLISESTI',
    body: 'Hyväksytyt sisällöt ajastetaan Instagramiin ja Facebookiin.',
  },
];

export const offerIncludes = [
  '12 sisältöä',
  'Instagram + Facebook',
  'Sisältösuunnittelu',
  'Kuvankäsittely ja formaattisovitus',
  'Kuvatekstit, CTA:t ja hashtagit',
  'Ajastus ja julkaiseminen',
  'Yksi koottu korjauskierros',
  'Kevyt kuukausiraportti',
] as const;

export const offerExcludes = [
  'Maksettu mainonta',
  'Kuvauspäivät',
  'Verkkosivuprojektit',
  'Jatkuva yhteisömanagerointi',
  'Raskas videotuotanto',
  'Rajattomat korjaukset',
  'Liidi- tai myyntitakuu',
] as const;

export const contentExamples: ContentExample[] = [
  {
    eyebrow: '01 / TYÖNÄYTE',
    title: 'Työnäyte',
    copy: 'Valmis kohde, työvaihe tai yksityiskohta rakennetaan selkeäksi referenssijulkaisuksi.',
  },
  {
    eyebrow: '02 / VINKKI',
    title: 'Asiantuntijavinkki',
    copy: 'Yksi käytännön havainto työmaalta nostetaan helposti ymmärrettäväksi neuvoksi.',
  },
  {
    eyebrow: '03 / RATKAISU',
    title: 'Ongelma–ratkaisu',
    copy: 'Tyypillinen asiakkaan ongelma ja tapa, jolla työ ratkaisee sen, tuodaan näkyväksi.',
  },
  {
    eyebrow: '04 / PROSESSI',
    title: 'Prosessi',
    copy: 'Työvaiheista tehdään selkeä eteneminen ilman perusteettomia ennen–jälkeen-väitteitä.',
  },
  {
    eyebrow: '05 / LUOTTAMUS',
    title: 'Luottamus',
    copy: 'Palvelun toimintatapa, työn huolellisuus ja faktat tuodaan näkyviin ilman keksittyjä tuloksia.',
  },
  {
    eyebrow: '06 / FAQ',
    title: 'Myynti ja FAQ',
    copy: 'Palvelun ostamista hidastava kysymys vastataan suoraan ja konkreettisesti.',
  },
];

export const faqItems: FaqItem[] = [
  {
    question: 'Kuinka paljon tämä vaatii aikaa asiakkaalta?',
    answer:
      'Asiakas toimittaa työkuvat ja tarvittavat projektifaktat sekä hyväksyy sisällöt ennen julkaisua. Palvelun tarkoitus on pitää asiakkaan oma sisältötyö mahdollisimman vähäisenä, mutta tarkkaa ajansäästöä ei luvata.',
  },
  {
    question: 'Millaisia kuvia tarvitaan?',
    answer:
      'Työmaa-, referenssi- ja muut yrityksen omat kuvat, joiden käyttöoikeus on asiakkaalla. Kuvan yhteyteen tarvitaan olennaiset faktat, jotta sisältöä ei rakenneta oletusten varaan.',
  },
  {
    question: 'Kuka hyväksyy sisällöt?',
    answer:
      'Asiakas hyväksyy faktat, kuvien käyttöoikeuden ja julkaisusuunnan ennen ajastusta. Palveluun kuuluu yksi koottu korjauskierros.',
  },
  {
    question: 'Saako palvelun lopettaa kuukauden jälkeen?',
    answer:
      'Kyllä. SOME 12 on 30 päivän palvelujakso ja kuukausittain irtisanottava sovittujen ehtojen mukaisesti.',
  },
  {
    question: 'Sisältyykö maksettu mainonta?',
    answer:
      'Ei. SOME 12 sisältää orgaanisen Instagram- ja Facebook-sisällön suunnittelun, viimeistelyn, ajastuksen ja julkaisemisen. Maksettu mainonta ei kuulu pakettiin.',
  },
  {
    question: 'Voitteko luvata liidejä tai myyntiä?',
    answer:
      'Ei. GhoulHouse sitoutuu sovittuun sisältötoimitukseen, ei tiettyyn liidi-, myynti-, seuraaja- tai tavoittavuustulokseen.',
  },
];
