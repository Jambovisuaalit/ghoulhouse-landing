'use client';

import { motion, useReducedMotion } from 'framer-motion';

type HeroProps = {
  onCtaClick: () => void;
};

export default function Hero({ onCtaClick }: HeroProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section id="top" className="relative overflow-hidden bg-ink text-ghost">
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:radial-gradient(#F7F4EF_1px,transparent_1px)] [background-size:18px_18px]" />
      <div className="container-wide relative flex min-h-[78svh] flex-col justify-end py-16 sm:py-20 lg:min-h-[86svh] lg:py-24">
        <motion.p
          className="mb-6 text-sm font-black uppercase tracking-[0.18em] text-signal"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          Some 12 · 490 € / 30 päivää + ALV
        </motion.p>

        <motion.h1
          className="max-w-5xl text-balance text-[clamp(3.2rem,10vw,8.5rem)] font-black uppercase leading-[0.88] tracking-[-0.055em]"
          initial={reduceMotion ? false : { opacity: 0, y: 36 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
        >
          Työmaakuvat sisään.
          <span className="block text-signal">Valmis some ulos.</span>
        </motion.h1>

        <motion.div
          className="mt-8 grid max-w-3xl gap-6 md:grid-cols-[1fr_auto] md:items-end"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18 }}
        >
          <p className="max-w-2xl text-lg text-ghost/80 sm:text-xl">
            GhoulHouse tekee olemassa olevista työmaa- ja referenssikuvista jatkuvan Instagram- ja Facebook-sisällön.
          </p>
          <button type="button" className="btn btn-primary w-full md:w-auto" onClick={onCtaClick}>
            Pyydä 2 sisältöesimerkkiä
          </button>
        </motion.div>
      </div>
    </section>
  );
}
