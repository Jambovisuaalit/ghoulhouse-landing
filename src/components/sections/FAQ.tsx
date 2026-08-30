import Container from '@/components/ui/Container';

export const faqItems = [
  {
    question: 'Mitä materiaalia meidän pitää toimittaa?',
    answer:
      'Työmaakuvat, lyhyt kuvaus kohteesta ja olennaiset faktat riittävät alkuun. Puhelimella otettu aito materiaali sopii hyvin, kun työvaihe tai valmis lopputulos näkyy selkeästi.',
  },
  {
    question: 'Tarkoittaako 12 sisältöä 24 alkuperäistä postausta?',
    answer:
      'Ei. Palveluun kuuluu 12 alkuperäistä ydinsisältöä / 30 päivää. Ne sovitetaan Instagramiin ja Facebookiin. Kyse ei ole 24 erillisestä alkuperäissisällöstä.',
  },
  {
    question: 'Sisältyykö maksettu mainonta?',
    answer:
      'Ei. SOME 12 -palvelu keskittyy orgaaniseen sisältöön ja sen julkaisemiseen. Maksettu mainonta ei sisälly palveluun.',
  },
  {
    question: 'Sisältyykö kuvauspäivä tai jatkuva video- ja Reels-videotuotanto?',
    answer:
      'Ei tähän palveluun. GhoulHouse työskentelee ensisijaisesti asiakkaan toimittaman materiaalin kanssa. Erilliset kuvauspäivät tai laajempi videotuotanto eivät kuulu peruspalveluun.',
  },
  {
    question: 'Kuinka korjaukset hoidetaan?',
    answer:
      'Palveluun kuuluu yksi koottu korjauskierros. Asiakas tarkistaa faktat ja sävyn ennen julkaisua.',
  },
  {
    question: 'Kuinka pitkä sopimus on?',
    answer:
      'Palvelu toimii 30 päivän jaksoissa ja on kuukausittain irtisanottava sovittujen ehtojen mukaisesti.',
  },
  {
    question: 'Mitä palveluun ei kuulu?',
    answer:
      'Maksettu mainonta, päivittäinen kommentti- ja viestihallinta, jatkuva video- ja Reels-videotuotanto, kuvauspäivät ja Instagramin sekä Facebookin ulkopuoliset kanavat eivät sisälly SOME 12 -palveluun. Mahdolliset lisätyöt sovitaan aina erikseen.',
  },
  {
    question: 'Lupaako GhoulHouse liidejä tai myyntiä?',
    answer:
      'Ei. GhoulHouse sitoutuu sovittuun sisältötoimitukseen, ei tiettyyn liidi-, myynti-, seuraaja- tai tavoittavuustulokseen.',
  },
] as const;

export default function FAQ() {
  return (
    <section id="faq" className="bg-ghost py-16 md:py-24">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="type-label mb-4 text-signal">
              UKK
            </p>
            <h2 className="type-section-title max-w-[10ch] text-ink">
              Selkeät vastaukset.
            </h2>
          </div>

          <div className="border-t-2 border-ink lg:col-span-8">
            {faqItems.map((item, index) => (
              <details
                key={item.question}
                className="group border-b border-ink/25"
              >
                <summary className="grid cursor-pointer list-none grid-cols-[52px_1fr_auto] gap-4 py-5 text-left">
                  <span className="type-label text-signal">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="type-ui text-ink">{item.question}</span>
                  <span
                    aria-hidden="true"
                    className="text-xl font-black text-ink transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="max-w-[62ch] pb-6 pl-[68px] text-[0.95rem] leading-[1.6] text-ink/70">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
