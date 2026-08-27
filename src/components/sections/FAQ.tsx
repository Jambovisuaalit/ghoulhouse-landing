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
    answer:
      'Työmaakuvat, lyhyt kuvaus kohteesta ja olennaiset faktat riittävät alkuun. Puhelimella otettu materiaali käy, kun työvaihe tai valmis lopputulos näkyy selkeästi.',
  },
  {
    question: 'Onko palvelussa 24 erillistä alkuperäispostausta?',
    answer:
      'Ei. Palveluun kuuluu 12 alkuperäistä ydinsisältöä 30 päivän palvelujaksolle. Sisällöt sovitetaan Instagramiin ja Facebookiin, mutta kyse ei ole 24 erillisestä alkuperäissisällöstä.',
  },
  {
    question: 'Sisältyvätkö maksetut mainokset?',
    answer:
      'Ei. Paketti keskittyy orgaaniseen sisällöntuotantoon, ajastukseen ja julkaisuun Instagramissa ja Facebookissa.',
  },
  {
    question: 'Sisältyykö valokuvaus?',
    answer:
      'Ei. Palvelu perustuu asiakkaan toimittamaan materiaaliin. Kuvauspäivät ja erillinen videotuotanto eivät sisälly tähän palveluun.',
  },
  {
    question: 'Kuinka muokkauksia käsitellään?',
    answer:
      'Yksi koottu muokkauskierros sisältyy palvelujaksoon. Mahdollisista lisämuutoksista sovitaan erikseen.',
  },
  {
    question: 'Kuinka pitkä palvelujakso on?',
    answer:
      'Yksi palvelujakso on 30 päivää. Seuraavan jakson voi irtisanoa sovittujen ehtojen mukaisesti.',
  },
  {
    question: 'Mitä tapahtuu palvelujaksosta 4 alkaen?',
    answer:
      'START maksaa 490 € + ALV / 30 päivää palvelujaksoilla 1–3. Palvelujaksosta 4 alkaen MANAGED maksaa 790 € + ALV / 30 päivää.',
  },
  {
    question: 'Lupaako GhoulHouse tietyn määrän liidejä tai myyntiä?',
    answer:
      'Ei. GhoulHouse sitoutuu sovittuun sisältötoimitukseen, ei tiettyyn liidi-, myynti-, seuraaja- tai tavoittavuustulokseen.',
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
            <div key={item.question} className="border border-bone rounded overflow-hidden">
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
                  aria-hidden="true"
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
