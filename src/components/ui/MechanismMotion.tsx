'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const frames = [
  { kicker: 'RAW', title: 'Työmaakuvat', body: 'Materiaali syntyy jo työn ohessa.' },
  { kicker: 'GHOULHOUSE', title: 'Valinta + editointi + copy', body: 'Raaka materiaali muutetaan johdonmukaiseksi sisältöbatchiksi.' },
  { kicker: 'READY', title: 'Valmis some', body: 'Hyväksytty sisältö ajastetaan Instagramiin ja Facebookiin.' },
] as const;

export default function MechanismMotion() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const shift = useTransform(scrollYProgress, [0, 1], reduceMotion ? ['0%', '0%'] : ['5%', '-5%']);

  return (
    <div ref={ref} className="mechanism-track">
      <motion.div className="mechanism-rail" style={{ x: shift }}>
        {frames.map((frame, index) => (
          <article key={frame.kicker} className="mechanism-frame">
            <p className="eyebrow text-signal">{frame.kicker}</p>
            <p className="mt-5 font-display text-[clamp(2rem,4.5vw,4.5rem)] font-black uppercase leading-[0.9] tracking-[-0.055em]">
              {frame.title}
            </p>
            <p className="mt-5 max-w-md text-base text-ghost/65">{frame.body}</p>
            <span aria-hidden="true" className="absolute bottom-5 right-5 font-mono text-xs text-ghost/35">0{index + 1}</span>
          </article>
        ))}
      </motion.div>
    </div>
  );
}
