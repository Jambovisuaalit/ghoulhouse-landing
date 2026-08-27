'use client';

import { useState } from 'react';
import SectionHeading from '@/components/ui/SectionHeading';
import { faqItems } from '@/lib/content';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <section id="ukk" className="section bg-ink text-ghost">
      <div className="shell">
        <SectionHeading inverse eyebrow="09 / UKK" title="Oleellinen ennen kuin pyydät esimerkit." />
        <div className="mt-14 border-t border-ghost/15">
          {faqItems.map((item, index) => {
            const open = openIndex === index;
            const answerId = `faq-answer-${index}`;
            return (
              <article key={item.question} className="border-b border-ghost/15">
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : index)}
                  className="faq-button"
                  aria-expanded={open}
                  aria-controls={answerId}
                >
                  <span className="font-mono text-xs text-signal">{String(index + 1).padStart(2, '0')}</span>
                  <span className="text-left font-display text-xl font-black uppercase tracking-[-0.025em] sm:text-2xl">{item.question}</span>
                  <span aria-hidden="true" className="text-2xl text-signal">{open ? '−' : '+'}</span>
                </button>
                {open ? <div id={answerId} className="faq-answer"><p>{item.answer}</p></div> : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
