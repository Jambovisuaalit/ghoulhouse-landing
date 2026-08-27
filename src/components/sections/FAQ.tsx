import Container from '@/components/ui/Container';

const items = [
  ['Tarvitseeko meidän kuvata erikseen?', 'Ei lähtökohtaisesti. Palvelu perustuu olemassa oleviin työmaa-, referenssi- ja yrityskuviin.'],
  ['Montako sisältöä pakettiin kuuluu?', '12 alkuperäistä sisältöä 30 päivän jakson aikana. Sisällöt sovitetaan Instagramiin ja Facebookiin.'],
  ['Sisältyykö maksettu mainonta?', 'Ei. Maksettu mainonta ei kuulu Some 12 -pakettiin.'],
  ['Onko sopimus määräaikainen?', 'Ei. Palvelu on kuukausittain irtisanottava 30 päivän jaksoissa.'],
  ['Voimmeko nähdä toteutuksen ennen ostoa?', 'Kyllä. Ennen tarjousta voimme tehdä kaksi yrityskohtaista konseptiesimerkkiä nykyisen materiaalinne pohjalta.'],
];

export default function FAQ() {
  return (
    <section id="faq" className="bg-white py-16 md:py-24" aria-labelledby="faq-title">
      <Container>
        <h2 id="faq-title" className="mb-8 text-ink">
          Usein kysyttyä
        </h2>

        <div className="max-w-4xl border-t-2 border-ink">
          {items.map(([question, answer]) => (
            <details key={question} className="border-b border-ink/20">
              <summary className="cursor-pointer py-5 font-bold text-ink">{question}</summary>
              <p className="max-w-3xl pb-6 text-ink/70">{answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
