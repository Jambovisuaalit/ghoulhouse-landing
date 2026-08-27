import Image from 'next/image';
import Container from '@/components/ui/Container';

const conceptLabel = 'KONSEPTIESIMERKKI — EI ASIAKASTYÖ';

function ConceptBadge({ inverse = false }: { inverse?: boolean }) {
  return (
    <span
      className={`inline-flex w-fit px-2 py-1 text-[0.52rem] font-black uppercase tracking-[0.13em] ${
        inverse ? 'bg-ghost text-ink' : 'bg-ink text-ghost'
      }`}
    >
      {conceptLabel}
    </span>
  );
}

export default function Examples() {
  return (
    <section id="examples" className="bg-bone py-14 md:py-20">
      <Container>
        <div className="grid grid-cols-1 gap-6 border-b-2 border-ink pb-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="mb-4 text-[0.65rem] font-black uppercase tracking-[0.18em] text-signal sm:text-xs">
              Proof of craft / sisältöesimerkit
            </p>
            <h2 className="font-display text-[clamp(2.55rem,7vw,5.8rem)] font-black uppercase leading-[0.88] tracking-[-0.045em] text-ink">
              Ei vain kuva.
              <span className="block">Kulma, rakenne, toteutus.</span>
            </h2>
          </div>

          <div className="lg:col-span-4">
            <p className="max-w-md text-sm leading-relaxed text-ink/70">
              Sama työmaamateriaali voidaan muuttaa eri tarkoituksiin ilman
              keksittyä täytesisältöä. Alla näkyy mitä GhoulHouse tekee
              materiaalin ja valmiin julkaisun välissä.
            </p>
            <p className="mt-4 text-[0.62rem] font-black uppercase tracking-[0.14em] text-ink/50">
              Source → content angle → finished execution
            </p>
          </div>
        </div>

        <div className="border-x-2 border-b-2 border-ink">
          <article className="grid grid-cols-1 border-b-2 border-ink lg:grid-cols-[minmax(0,0.9fr)_160px_minmax(0,1.1fr)]">
            <div className="relative min-h-[250px] overflow-hidden bg-ink sm:min-h-[340px] lg:min-h-[520px]">
              <Image
                src="/work-detail.svg"
                alt="Konseptikuva remonttityön yksityiskohdasta lähdemateriaalina"
                fill
                sizes="(max-width: 1023px) 100vw, 42vw"
                className="object-cover grayscale contrast-125"
              />
              <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-4 p-4 sm:p-5">
                <ConceptBadge />
                <span className="bg-ghost px-2 py-1 text-[0.55rem] font-black uppercase tracking-[0.14em] text-ink">
                  01 / SOURCE
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-ink/95 p-4 text-ghost sm:p-5">
                <p className="text-[0.58rem] font-black uppercase tracking-[0.16em] text-signal">
                  Work phase
                </p>
                <p className="mt-2 font-display text-3xl font-black uppercase leading-none sm:text-4xl">
                  Työvaihe näyttää osaamisen.
                </p>
              </div>
            </div>

            <div className="flex min-h-[150px] flex-col justify-between border-y-2 border-ink bg-signal p-5 text-white lg:min-h-0 lg:border-x-2 lg:border-y-0">
              <span className="text-[0.58rem] font-black uppercase tracking-[0.16em] text-white/70">
                Content angle
              </span>
              <div>
                <p className="font-display text-3xl font-black uppercase leading-[0.92]">
                  Miksi tämä vaihe ratkaisee lopputuloksen?
                </p>
                <p className="mt-4 text-xs font-bold uppercase leading-relaxed tracking-[0.1em] text-white/75">
                  Detail → reason → expertise
                </p>
              </div>
              <span aria-hidden="true" className="mt-5 text-3xl font-black">
                →
              </span>
            </div>

            <div className="relative min-h-[360px] overflow-hidden bg-ghost p-5 text-ink sm:min-h-[440px] sm:p-7 lg:min-h-0">
              <div className="absolute right-5 top-5 text-[0.55rem] font-black uppercase tracking-[0.14em] text-ink/50">
                Finished execution
              </div>
              <div className="mt-12 grid h-[calc(100%-3rem)] grid-rows-[1fr_auto] border-2 border-ink bg-ghost">
                <div className="relative min-h-[220px] overflow-hidden">
                  <Image
                    src="/work-detail.svg"
                    alt="Sama työvaiheen konseptikuva rajattuna valmista julkaisua varten"
                    fill
                    sizes="(max-width: 1023px) 100vw, 45vw"
                    className="object-cover"
                  />
                  <span className="absolute left-3 top-3 bg-signal px-2 py-1 text-[0.55rem] font-black uppercase tracking-[0.14em] text-white">
                    Pohjatyö / 01
                  </span>
                </div>
                <div className="border-t-2 border-ink p-4 sm:p-5">
                  <p className="font-display text-[clamp(2rem,5vw,4.2rem)] font-black uppercase leading-[0.88] tracking-[-0.035em]">
                    Se mitä ei valmiissa pinnassa näe, ratkaisee lopputuloksen.
                  </p>
                  <p className="mt-4 max-w-xl text-sm font-bold leading-relaxed text-ink/60">
                    Sisältö tekee näkymättömästä ammattitaidosta ymmärrettävää.
                  </p>
                </div>
              </div>
            </div>
          </article>

          <div className="grid grid-cols-1 border-b-2 border-ink xl:grid-cols-2">
            <article className="border-b-2 border-ink xl:border-b-0 xl:border-r-2">
              <div className="grid grid-cols-[112px_1fr] sm:grid-cols-[150px_1fr]">
                <div className="flex flex-col justify-between bg-ink p-4 text-ghost sm:p-5">
                  <div>
                    <span className="text-[0.58rem] font-black uppercase tracking-[0.16em] text-signal">
                      02
                    </span>
                    <p className="mt-2 font-display text-2xl font-black uppercase leading-none">
                      Finished project
                    </p>
                  </div>
                  <span className="mt-8 text-[0.52rem] font-black uppercase leading-relaxed tracking-[0.12em] text-ghost/50">
                    Source → proof
                  </span>
                </div>

                <div className="relative min-h-[260px] overflow-hidden bg-ghost">
                  <Image
                    src="/finished-space.svg"
                    alt="Konseptikuva valmiista remonttikohteesta"
                    fill
                    sizes="(max-width: 1279px) 100vw, 42vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-x-4 bottom-4 border-2 border-ink bg-ghost p-4">
                    <p className="text-[0.55rem] font-black uppercase tracking-[0.14em] text-signal">
                      Content angle
                    </p>
                    <p className="mt-2 font-display text-3xl font-black uppercase leading-[0.9]">
                      Lopputulos ensin. Faktat heti perään.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 border-t-2 border-ink p-5 sm:flex-row sm:items-end sm:justify-between">
                <ConceptBadge />
                <p className="max-w-sm text-sm font-bold leading-relaxed text-ink/70">
                  Valmis kohde toimii referenssinä, kun kuva, työn rajaus ja
                  selkeä viesti muodostavat yhden julkaisun.
                </p>
              </div>
            </article>

            <article className="bg-ghost">
              <div className="grid min-h-[260px] grid-cols-1 sm:grid-cols-[0.82fr_1.18fr]">
                <div className="relative min-h-[220px] overflow-hidden border-b-2 border-ink sm:min-h-0 sm:border-b-0 sm:border-r-2">
                  <Image
                    src="/hero-renovation.svg"
                    alt="Konseptikuva remonttityöstä asiantuntijasisällön lähdemateriaalina"
                    fill
                    sizes="(max-width: 639px) 100vw, 28vw"
                    className="object-cover grayscale"
                  />
                  <span className="absolute left-3 top-3 bg-ink px-2 py-1 text-[0.55rem] font-black uppercase tracking-[0.14em] text-ghost">
                    03 / SOURCE
                  </span>
                </div>

                <div className="flex flex-col justify-between p-5 sm:p-6">
                  <div>
                    <p className="text-[0.58rem] font-black uppercase tracking-[0.16em] text-signal">
                      Expertise / content angle
                    </p>
                    <p className="mt-3 font-display text-[clamp(2.2rem,5vw,4rem)] font-black uppercase leading-[0.88] tracking-[-0.035em]">
                      Näytä mitä ammattilainen huomaa.
                    </p>
                  </div>
                  <div className="mt-8 border-l-4 border-signal pl-4">
                    <p className="text-sm font-bold leading-relaxed text-ink/70">
                      “Miksi tämä tehdään näin?” muuttaa tavallisen työmaakuvan
                      asiantuntijasisällöksi.
                    </p>
                  </div>
                </div>
              </div>
              <div className="border-t-2 border-ink p-5">
                <ConceptBadge />
              </div>
            </article>
          </div>

          <article className="grid grid-cols-1 border-b-2 border-ink lg:grid-cols-[0.8fr_1.2fr]">
            <div className="bg-ink p-5 text-ghost sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[0.58rem] font-black uppercase tracking-[0.16em] text-signal">
                    04 / Before / after
                  </span>
                  <h3 className="mt-3 font-display text-[clamp(2.5rem,6vw,5rem)] font-black uppercase leading-[0.88] tracking-[-0.04em]">
                    Muutos näkyviin yhdellä silmäyksellä.
                  </h3>
                </div>
                <span aria-hidden="true" className="text-4xl font-black text-signal">
                  →
                </span>
              </div>
              <p className="mt-6 max-w-lg text-sm leading-relaxed text-ghost/60">
                Ennen–jälkeen ei tarvitse olla geneerinen kuvapari. Rajaus,
                järjestys ja yksi selkeä havainto tekevät muutoksesta sisällön.
              </p>
              <div className="mt-8">
                <ConceptBadge inverse />
              </div>
            </div>

            <div className="grid min-h-[360px] grid-cols-2">
              <figure className="relative overflow-hidden border-r-2 border-ink">
                <Image
                  src="/hero-renovation-clean.svg"
                  alt="Ennen-vaihetta havainnollistava konseptikuva"
                  fill
                  sizes="(max-width: 1023px) 50vw, 30vw"
                  className="object-cover grayscale contrast-125"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-ink/95 p-3 text-[0.58rem] font-black uppercase tracking-[0.16em] text-ghost">
                  Before / source
                </figcaption>
              </figure>

              <figure className="relative overflow-hidden">
                <Image
                  src="/finished-space.svg"
                  alt="Jälkeen-vaihetta havainnollistava konseptikuva"
                  fill
                  sizes="(max-width: 1023px) 50vw, 30vw"
                  className="object-cover"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-signal p-3 text-[0.58rem] font-black uppercase tracking-[0.16em] text-white">
                  After / execution
                </figcaption>
              </figure>
            </div>
          </article>

          <article className="grid grid-cols-1 bg-ghost lg:grid-cols-12">
            <div className="border-b-2 border-ink p-5 sm:p-7 lg:col-span-4 lg:border-b-0 lg:border-r-2">
              <p className="text-[0.58rem] font-black uppercase tracking-[0.16em] text-signal">
                05 / Service / CTA
              </p>
              <h3 className="mt-3 font-display text-[clamp(2.4rem,5vw,4.7rem)] font-black uppercase leading-[0.88] tracking-[-0.04em] text-ink">
                Hyvä sisältö kertoo myös mitä tehdä seuraavaksi.
              </h3>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-ink/70">
                Palvelu, hyöty ja toimintakehotus voidaan rakentaa työkuvan
                ympärille ilman mainosbannerin tuntua.
              </p>
            </div>

            <div className="relative min-h-[390px] overflow-hidden bg-bone p-5 sm:p-7 lg:col-span-8">
              <div className="grid h-full min-h-[340px] grid-cols-1 border-2 border-ink bg-ghost md:grid-cols-[1fr_0.72fr]">
                <div className="relative min-h-[220px] overflow-hidden border-b-2 border-ink md:min-h-0 md:border-b-0 md:border-r-2">
                  <Image
                    src="/hero-renovation-clean.svg"
                    alt="Konseptikuva palvelu- ja CTA-julkaisun lähdemateriaalina"
                    fill
                    sizes="(max-width: 767px) 100vw, 42vw"
                    className="object-cover"
                  />
                  <span className="absolute left-3 top-3 bg-ink px-2 py-1 text-[0.55rem] font-black uppercase tracking-[0.14em] text-ghost">
                    Source
                  </span>
                </div>

                <div className="flex flex-col justify-between bg-signal p-5 text-white sm:p-6">
                  <div>
                    <p className="text-[0.55rem] font-black uppercase tracking-[0.14em] text-white/70">
                      Finished execution
                    </p>
                    <p className="mt-3 font-display text-[clamp(2.4rem,6vw,4.8rem)] font-black uppercase leading-[0.86] tracking-[-0.04em]">
                      Remontti mielessä?
                    </p>
                    <p className="mt-4 max-w-xs text-sm font-bold leading-relaxed text-white/80">
                      Näytä palvelu. Tee hyöty selväksi. Anna asiakkaalle
                      seuraava askel.
                    </p>
                  </div>
                  <div className="mt-8 border-t-2 border-white pt-4 text-sm font-black uppercase tracking-[0.12em]">
                    Pyydä arvio →
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <ConceptBadge />
              </div>
            </div>
          </article>
        </div>
      </Container>
    </section>
  );
}
