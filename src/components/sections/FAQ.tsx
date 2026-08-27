'use client';

import { useState } from 'react';
import Container from '@/components/ui/Container';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: 'Mitä materiaaleja minun on lähetettävä?',
    answer: 'Työmaakuvia, videoita ja asiakastarinoita. Mitä tahansa, jonka kuvaa tai kuvaa tympäristy töilläsi. Ei tarvitse olla ammattimaista — tarpeeksi hyvä puhelin kamerassa, ja me käsittelemme loput.',
  },
  {
    question: 'Onko tämä 12 postia per some-alusta?',
    answer: 'Kyllä. ~12 alkuperäistä sisältönpalasta kuukaudessa, joista jokainen on Instagram- ja Facebook-versio. Joten kokonaisuudessaan ~24 julkaisua kuukaudessa kahden alustan yli.',
  },
  {
    question: 'Sisältyvätkö mainokset?',
    answer: 'Ei. GhoulHouse on orgaaninen sisällöntoiminta. Me emme hallinnoi mainoksia tai mainoslaskuja. Jos haluat maksettuja mainoksia, se on erillinen palvelu.',
  },
  {
    question: 'Sisältyykö valokuvaus?',
    answer: 'Ei. Me työskenntelemme aineiston kanssa, jonka sinulla on jo — työmaakuvat, puhelimet videot ja asiakastarinat. Jos tarvitset valokuvaajaa, neuvomme, mutta se on erillinen palvelu.',
  },
  {
    question: 'Kuinka muokkauksia käsitellään?',
    answer: 'Kun toimme sisällön hyväksyttäväksi, voit antaa palautetta. Yksi kierros muokkauksista sisältyy. Tarpeen jälkeen lisämuokkauksista voidaan neuvotella.',
  },
  {
    question: 'Onko sopimuksessa kiinteistä ehtoja?',
    answer: 'Ei. Voit peruuttaa milloin tahansa ilman sakkoja. Me luotamme siihen, että tulokset puhuvat puolestaan.',
  },
  {
    question: 'Mitkä tapahtuu neljännen kuukauden jälkeen?',
    answer: 'Hinnat nousevat alennustasolta normaalihintoihin. START (490€) muuttuu MANAGED (790€), joka sisältää valinnaisen optimoinnin, analytiikan ja yhteistyjöksi tukea.',
  },
  {
    question: 'Voiko perua milloin tahansa?',
    answer: 'Kyllä. Voit perua ilman sanomista tai sakkoja. Kuitenkin olemme integroineet prosessiin, niin etä hinnat ja palvelut vapauttavat helpoimman prosessin muutokselle.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-ghost py-16 md:py-24">
      <Container>
        <h2 className="text-ink mb-12">Usein kysytyt kysymykset</h2>

        <div className="max-w-2xl space-y-4">
          {faqItems.map((item, index) => (
            <div key={index} className="border border-bone rounded overflow-hidden">
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
