import Reveal from '@/components/ui/Reveal';

const faqs = [
  ['Tarvitseeko meidän kuvata erikseen?', 'Ei lähtökohtaisesti. Palvelu perustuu olemassa oleviin työmaa-, referenssi- ja yrityskuviin.'],
  ['Montako sisältöä pakettiin kuuluu?', '12 alkuperäistä sisältöä 30 päivän aikana. Ne sovitetaan Instagramiin ja Facebookiin.'],
  ['Sisältyykö mainonta?', 'Ei. Maksettu mainonta ei kuulu Some 12 -pakettiin.'],
  ['Onko sopimus määräaikainen?', 'Ei. Palvelu on kuukausittain irtisanottava 30 päivän jaksoissa.'],
  ['Voimmeko nähdä toteutuksen ennen ostoa?', 'Kyllä. Pää-CTA on kaksi yrityskohtaista konseptiesimerkkiä ennen varsinaista tarjousta.'],
];

export default function FAQ() {
  return (
    <section id="faq" className="bg-white py-16 sm:py-24" aria-labelledby="faq-title">
      <div className="container-wide max-w-5xl">
        <Reveal>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-signal">FAQ</p>
          <h2 id="faq-title" className="mt-4 text-ink">Yleisimmät kysymykset</h2>
        </Reveal>
        <div className="mt-8 border-t-2 border-ink">
          {faqs.map(([question, answer]) => (
            <details key={question} className="group border-b border-ink/25">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 font-bold text-ink">
                {question}
                <span aria-hidden="true" className="text-signal transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="max-w-3xl pb-6 pr-10 text-ink/70">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
