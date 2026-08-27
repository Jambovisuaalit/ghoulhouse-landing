import Image from 'next/image';
import Container from '@/components/ui/Container';

export default function Mechanism() {
  return (
    <section
      id="mechanism"
      className="overflow-hidden border-y-2 border-ink bg-ink py-14 text-ghost md:py-20"
      aria-labelledby="mechanism-title"
    >
      <Container>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-9">
            <p className="mb-4 text-[0.65rem] font-black uppercase tracking-[0.18em] text-signal sm:text-xs">
              Signature / RAW → FINAL
            </p>
            <h2
              id="mechanism-title"
              className="font-display text-[clamp(2.45rem,8.5vw,5rem)] font-black uppercase leading-[0.86] tracking-[-0.045em] sm:text-[clamp(3.6rem,6.2vw,6.4rem)]"
            >
              Worksite material
              <span className="block text-signal">→ GhoulHouse →</span>
              ready social content.
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-relaxed text-ghost/65 lg:col-span-3 lg:pb-1">
            Sama materiaali. Selkeämpi rajaus, rakenne ja viesti.
          </p>
        </div>

        <details className="group mt-9 border-y border-ghost/25 md:mt-12">
          <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
            <div className="grid grid-cols-1 lg:min-h-[500px] lg:grid-cols-[minmax(0,0.88fr)_128px_minmax(0,1.12fr)]">
              <figure className="relative min-h-[190px] overflow-hidden border-b border-ghost/25 bg-bone lg:min-h-0 lg:border-b-0 lg:border-r">
                <Image
                  src="/hero-renovation-clean.svg"
                  alt="Raaka työmaamateriaali ennen GhoulHouse-käsittelyä"
                  fill
                  sizes="(max-width: 1023px) 100vw, 40vw"
                  className="object-cover grayscale contrast-125 transition-transform duration-500 group-open:scale-[1.015]"
                />
                <div className="absolute inset-0 bg-ink/10" aria-hidden="true" />

                <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-ink/95 via-ink/75 to-transparent px-4 pb-4 pt-14 sm:px-5 sm:pb-5">
                  <div>
                    <span className="block text-[0.58rem] font-black uppercase tracking-[0.16em] text-signal">
                      01 / RAW
                    </span>
                    <span className="mt-1 block font-display text-2xl font-black uppercase leading-none text-ghost sm:text-3xl">
                      Worksite material
                    </span>
                  </div>
                  <span className="text-[0.58rem] font-bold uppercase tracking-[0.12em] text-ghost/60">
                    sisään
                  </span>
                </figcaption>
              </figure>

              <div className="relative flex min-h-[74px] items-center justify-between gap-4 overflow-hidden bg-signal px-5 text-white lg:min-h-0 lg:flex-col lg:justify-center lg:px-3 lg:py-8">
                <Image
                  src="/mark-white.svg"
                  alt=""
                  width={80}
                  height={80}
                  className="h-11 w-11 shrink-0 transition-transform duration-500 group-open:rotate-[-4deg] group-open:scale-105 lg:h-16 lg:w-16"
                />

                <div className="flex items-center gap-2 text-[0.58rem] font-black uppercase tracking-[0.14em] lg:flex-col lg:gap-3 lg:text-center">
                  <span>Crop</span>
                  <span aria-hidden="true" className="text-white/60">→</span>
                  <span>Structure</span>
                  <span aria-hidden="true" className="text-white/60">→</span>
                  <span>Copy</span>
                  <span aria-hidden="true" className="text-white/60">→</span>
                  <span>Graphic</span>
                </div>

                <span className="hidden font-display text-lg font-black uppercase leading-none lg:block">
                  GhoulHouse
                </span>
              </div>

              <figure className="relative min-h-[285px] overflow-hidden bg-ghost text-ink lg:min-h-0">
                <Image
                  src="/finished-space.svg"
                  alt="GhoulHouse-käsittelyn jälkeen syntyvää valmista somejulkaisua havainnollistava konseptikuva"
                  fill
                  sizes="(max-width: 1023px) 100vw, 48vw"
                  className="object-cover transition-transform duration-500 group-open:scale-[1.025]"
                />

                <div className="absolute inset-x-4 bottom-12 border-2 border-ink bg-ghost/95 p-4 sm:inset-x-6 sm:bottom-14 sm:p-5 lg:inset-x-8 lg:bottom-16 lg:p-6">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[0.56rem] font-black uppercase tracking-[0.16em] text-signal">
                      GhoulHouse / final
                    </span>
                    <span className="text-[0.56rem] font-black uppercase tracking-[0.14em] text-ink/50">
                      Ready social content
                    </span>
                  </div>
                  <p className="mt-3 max-w-[14ch] font-display text-[clamp(2rem,7vw,4.6rem)] font-black uppercase leading-[0.86] tracking-[-0.035em]">
                    Valmis some ulos.
                  </p>
                  <p className="mt-3 max-w-sm text-xs font-bold leading-relaxed text-ink/65 sm:text-sm">
                    Rajattu, kirjoitettu ja julkaisuvalmis.
                  </p>
                </div>

                <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-ink px-4 py-3 text-[0.52rem] font-black uppercase tracking-[0.12em] text-ghost sm:px-6 sm:text-[0.58rem]">
                  <span>02 / FINAL</span>
                  <span>KONSEPTIESIMERKKI — EI ASIAKASTYÖ</span>
                </figcaption>
              </figure>
            </div>

            <div className="flex min-h-14 items-center justify-between gap-5 border-t border-ghost/25 py-4 text-[0.62rem] font-black uppercase tracking-[0.14em] text-ghost/70">
              <span>Näytä muunnoksen rakenne</span>
              <span
                aria-hidden="true"
                className="text-xl leading-none text-signal transition-transform duration-300 group-open:rotate-45"
              >
                +
              </span>
            </div>
          </summary>

          <div className="border-t border-ghost/25 py-5 sm:py-6">
            <p className="font-display text-[clamp(1.75rem,4.4vw,4.1rem)] font-black uppercase leading-[0.95] tracking-[-0.025em] text-ghost">
              Crop <span className="text-signal">→</span> structure{' '}
              <span className="text-signal">→</span> copy{' '}
              <span className="text-signal">→</span> graphic treatment
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ghost/60">
              GhoulHouse ei keksi työstä uutta todellisuutta. Se tekee olemassa
              olevasta materiaalista selkeän, tunnistettavan ja julkaisuvalmiin
              kokonaisuuden.
            </p>
          </div>
        </details>
      </Container>
    </section>
  );
}
