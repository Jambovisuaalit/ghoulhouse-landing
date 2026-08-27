import Image from 'next/image';
import Container from '@/components/ui/Container';

export default function Mechanism() {
  return (
    <section
      id="mechanism"
      className="overflow-hidden border-y-2 border-ink bg-ink py-16 text-ghost md:py-24"
      aria-labelledby="mechanism-title"
    >
      <Container>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-signal">
              Signature / RAW → FINAL
            </p>
            <h2
              id="mechanism-title"
              className="font-display text-[clamp(1.75rem,6vw,6.5rem)] font-black uppercase leading-[0.88] tracking-[-0.04em] sm:text-[clamp(2.8rem,6vw,6.5rem)]"
            >
              Työmaamateriaali
              <span className="block text-signal">→ GhoulHouse →</span>
              valmis sisältö.
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-ghost/70 lg:col-span-4">
            Materiaali on jo olemassa. GhoulHouse tekee siitä suunnitellun,
            kirjoitetun, visuaalisesti viimeistellyn ja julkaisuvalmiin
            kokonaisuuden.
          </p>
        </div>

        <div className="mt-12 grid border-2 border-ghost/35 lg:grid-cols-[1fr_0.55fr_1fr]">
          <figure className="relative min-h-[340px] border-b border-ghost/35 lg:border-b-0 lg:border-r">
            <Image
              src="/hero-renovation-clean.svg"
              alt="Raakamateriaalia havainnollistava konseptikuva"
              fill
              sizes="(max-width: 1023px) 100vw, 38vw"
              className="object-cover grayscale contrast-125"
            />
            <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-ink/95 px-5 py-4 text-xs font-bold uppercase tracking-[0.15em]">
              <span>01 / RAW</span>
              <span className="text-ghost/60">Työmaalta</span>
            </figcaption>
          </figure>

          <div className="flex min-h-[220px] flex-col items-center justify-center border-b border-ghost/35 bg-signal px-8 py-12 text-center text-white lg:min-h-0 lg:border-b-0 lg:border-r">
            <Image
              src="/mark-white.svg"
              alt=""
              width={128}
              height={128}
              className="h-24 w-24"
            />
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em]">
              Rajaus · idea · copy
              <br />
              design · CTA
            </p>
          </div>

          <figure className="relative min-h-[340px] bg-ghost text-ink">
            <Image
              src="/finished-space.svg"
              alt="Viimeisteltyä sisältöä havainnollistava konseptikuva"
              fill
              sizes="(max-width: 1023px) 100vw, 38vw"
              className="object-cover"
            />
            <div className="absolute inset-x-5 bottom-16 border-2 border-ink bg-ghost p-4">
              <span className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-signal">
                GHOULHOUSE / FINAL
              </span>
              <p className="mt-2 max-w-[22ch] font-display text-2xl font-black uppercase leading-none">
                Työ näyttää yhtä hyvältä kuin se on.
              </p>
            </div>
            <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-ghost px-5 py-4 text-xs font-bold uppercase tracking-[0.15em] text-ink">
              <span>02 / FINAL</span>
              <span>KONSEPTIESIMERKKI — EI ASIAKASTYÖ</span>
            </figcaption>
          </figure>
        </div>

        <p className="mt-6 border-t border-ghost/25 pt-5 text-xs font-bold uppercase tracking-[0.15em] text-ghost/60">
          Työmaamateriaali → valmis sisältö → julkaisu → jatkuva näkyvyys
        </p>
      </Container>
    </section>
  );
}
