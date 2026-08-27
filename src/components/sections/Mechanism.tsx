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
            <p className="type-label mb-4 text-signal">
              Signature / RAW → FINAL
            </p>
            <h2
              id="mechanism-title"
              className="type-display max-w-[13ch] text-ghost"
            >
              Worksite material
              <span className="block text-signal">→ GhoulHouse →</span>
              ready social content.
            </h2>
          </div>

          <p className="type-editorial max-w-sm text-ghost/65 lg:col-span-3 lg:pb-1">
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
                    <span className="type-label block text-signal">
                      01 / RAW
                    </span>
                    <span className="mt-1 block text-xl font-extrabold uppercase leading-tight tracking-[-0.02em] text-ghost sm:text-2xl">
                      Worksite material
                    </span>
                  </div>
                  <span className="type-caption uppercase tracking-[0.06em] text-ghost/65">
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
                  className="hidden h-11 w-11 shrink-0 transition-transform duration-500 group-open:rotate-[-4deg] group-open:scale-105 sm:block lg:h-16 lg:w-16"
                />

                <div className="type-label flex items-center gap-2 lg:flex-col lg:gap-3 lg:text-center">
                  <span>Crop</span>
                  <span aria-hidden="true" className="text-white/60">→</span>
                  <span>Structure</span>
                  <span aria-hidden="true" className="text-white/60">→</span>
                  <span>Copy</span>
                  <span aria-hidden="true" className="text-white/60">→</span>
                  <span>Graphic</span>
                </div>

                <span className="type-ui hidden uppercase tracking-[0.04em] lg:block">
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
                    <span className="type-label text-signal">
                      GhoulHouse / final
                    </span>
                    <span className="type-caption uppercase tracking-[0.06em] text-ink/55">
                      Ready social content
                    </span>
                  </div>
                  <p className="mt-3 max-w-[14ch] text-[clamp(1.9rem,5vw,3.5rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.035em]">
                    Valmis some ulos.
                  </p>
                  <p className="type-caption mt-3 max-w-sm text-ink/65">
                    Rajattu, kirjoitettu ja julkaisuvalmis.
                  </p>
                </div>

                <figcaption className="type-caption absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-ink px-4 py-3 uppercase tracking-[0.06em] text-ghost sm:px-6">
                  <span>02 / FINAL</span>
                  <span>KONSEPTIESIMERKKI — EI ASIAKASTYÖ</span>
                </figcaption>
              </figure>
            </div>

            <div className="type-label flex min-h-14 items-center justify-between gap-5 border-t border-ghost/25 py-4 text-ghost/70">
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
            <p className="text-[clamp(1.65rem,3.6vw,3rem)] font-extrabold uppercase leading-[1] tracking-[-0.03em] text-ghost">
              Crop <span className="text-signal">→</span> structure{' '}
              <span className="text-signal">→</span> copy{' '}
              <span className="text-signal">→</span> graphic treatment
            </p>
            <p className="type-editorial mt-3 max-w-2xl text-ghost/65">
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
