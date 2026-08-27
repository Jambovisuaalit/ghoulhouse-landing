import Container from '@/components/ui/Container';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    id: 'materials',
    question: 'Mitä materiaaleja minun on lähetettävä?',
    answer: 'Työmaakuvia, videoita ja asiakastarinoita. Mitä tahansa, jonka kuvaa työmaallasi. Ei tarvitse olla ammattimaista — tarpeeksi hyvä puhelinkamera, ja me käsittelemme loput.',
  },
  {
    id: 'posts-per-platform',
    question: 'Onko tämä 12 postia per some-alusta?',
    answer: 'Kyllä. ~12 alkuperäistä sisältönpalasta kuukaudessa, joista jokainen on Instagram- ja Facebook-versio. Joten kokonaisuudessaan ~24 julkaisua kuukaudessa kahden alustan yli.',
  },
  {
    id: 'ads-included',
    question: 'Sisältyvätkö mainokset?',
    answer: 'Ei. GhoulHouse on orgaaninen sisällöntoiminta. Me emme hallinnoi mainoksia tai mainoslaskuja. Jos haluat maksettuja mainoksia, se on erillinen palvelu.',
  },
  {
    id: 'photoshoots',
    question: 'Sisältyykö valokuvaus?',
    answer: 'Ei. Me työskenntelemme aineiston kanssa, jonka sinulla on jo — työmaakuvat, puhelimen videot ja asiakastarinat. Jos tarvitset valokuvaajaa, neuvomme, mutta se on erillinen palvelu.',
  },
  {
    id: 'revisions',
    question: 'Kuinka muokkauksia käsitellään?',
    answer: 'Kun toimme sisällön hyväksyttäväksi, voit antaa palautetta. Yksi kierros muokkauksista sisältyy. Tarpeen jälkeen lisämuokkauksista voidaan neuvotella.',
  },
  {
    id: 'contract-terms',
    question: 'Onko sopimuksessa kiinteisiä ehtoja?',
    answer: 'Ei. Voit peruuttaa milloin tahansa ilman sakkoja. Me luotamme siihen, että tulokset puhuvat puolestaan.',
  },
  {
    id: 'month-4-onwards',
    question: 'Mitä tapahtuu neljännen kuukauden jälkeen?',
    answer: 'Hinnat nousevat alennustasolta normaalihintoihin. START (490 €) muuttuu MANAGED (790 €), joka sisältää valinnaisen optimoinnin, analytiikan ja yhteistyötukea.',
  },
  {
    id: 'cancellation',
    question: 'Voiko perua milloin tahansa?',
    answer: 'Kyllä. Voit perua ilman sanomista tai sakkoja. Luotamme siihen, että palvelun laatu tekee sen tarpeettomaksi.',
  },
];

'use client';

import { useState } from 'react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-ghost py-16 md:py-24">
      <Container>
        <h2 className="text-ink mb-12">Usein kysytyt kysymykset</h2>

        <div className="max-w-2xl space-y-4">
          {faqItems.map((item, index) => (
            <div key={item.id} className="border border-bone rounded overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left px-6 py-4 bg-white hover:bg-bone/50 transition-colors flex justify-between items-center"
                aria-expanded={openIndex === index}
              >
                <span className="font-bold text-ink">{item.question}</span>
                <svg
                  className={`w-5 h-5 text-signal transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 bg-ghost/50 border-t border-bone text-ink/80">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
