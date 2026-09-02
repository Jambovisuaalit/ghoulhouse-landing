import Image from 'next/image';
import Container from '@/components/ui/Container';

const conceptPhoto =
  'https://images.unsplash.com/photo-1768321917661-d4f1a89d2185?auto=format&fit=crop&fm=jpg&q=85&w=1800';

export default function Mechanism() {
  return (
    <section
      id="raw-final"
      className="border-y border-ink bg-ink py-16 text-ghost md:py-24"
      aria-labelledby="mechanism-title"
    >
      <Container>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="type-label text-signal">RAW → FINAL</p>
            <h2 id="mechanism-title" className="type-display mt-4 max-w-[11ch] text-ghost">
              SAMA TYÖ.
              <span className="block text-signal">PAREMPI JULKAISU.</span>
            </h2>
          </div>
          <p className="type-editorial max-w-md text-ghost/65 lg:col-span-4">
            Työmaalla jo syntyvä kuva saa rajauksen, sisältökulman, copytekstin ja julkaisuvalmiin esityksen.
          </p>
        </div>

        <div
          className="raw-final-grid mt-10 grid overflow-hidden border-2 border-ghost/25 bg-black md:grid-cols-2"
          aria-label="Raakamateriaalista valmiiksi somejulkaisuksi"
        >
          <figure className="raw-final-panel border-b border-ghost/20 md:border-b-0 md:border-r">
            <div className="flex items-center justify-between border-b border-ghost/20 px-4 py-3">
              <span className="type-label text-signal">RAW / IMG_4821.JPG</span>
              <span className="type-caption text-ghost/45">TYÖMAAMATERIAALI</span>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={conceptPhoto}
                alt="Remonttityömaan konseptikuva ennen sisältökäsittelyä"
                fill
                sizes="(max-width: 767px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <figcaption className="p-4 text-sm font-semibold text-ghost/65">
              Tavallinen puhelinkuva työmaalta.
            </figcaption>
          </figure>

          <figure className="raw-final-panel">
            <div className="flex items-center justify-between border-b border-ghost/20 px-4 py-3">
              <span className="type-label text-signal">FINAL / READY TO PUBLISH</span>
              <span className="type-caption text-ghost/45">GHOULHOUSE</span>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={conceptPhoto}
                alt="Sama remonttikuva osana viimeisteltyä GhoulHouse-konseptijulkaisua"
                fill
                sizes="(max-width: 767px) 100vw, 50vw"
                className="object-cover contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent" aria-hidden="true" />
              <div className="absolute inset-x-5 bottom-5 border-l-4 border-signal pl-4">
                <span className="type-label text-signal">TYÖVAIHE / ASIANTUNTIJASISÄLTÖ</span>
                <strong className="mt-2 block max-w-[16ch] text-2xl font-black uppercase leading-[0.95] text-white md:text-3xl">
                  Pohjatyö ratkaisee lopputuloksen.
                </strong>
              </div>
            </div>
            <figcaption className="flex flex-wrap items-center justify-between gap-2 p-4">
              <span className="text-sm font-semibold text-ghost/65">Rajaus + sisältökulma + copy + formaatti.</span>
              <strong className="type-caption text-signal">KONSEPTIESIMERKKI — EI ASIAKASTYÖ</strong>
            </figcaption>
          </figure>
        </div>

        <ol className="mt-8 grid gap-px border border-ghost/20 bg-ghost/20 md:grid-cols-3">
          {[
            ['01', 'LÄHETÄ', 'Työkuvat ja olennaiset faktat.'],
            ['02', 'GHOULHOUSE', 'Valinta, editointi, sisältökulma ja copy.'],
            ['03', 'JULKAISE', 'Valmis sisältö Instagramiin ja Facebookiin.'],
          ].map(([number, title, copy]) => (
            <li key={number} className="bg-ink p-5">
              <span className="type-label text-signal">{number}</span>
              <h3 className="mt-3 text-xl font-black uppercase text-ghost">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-ghost/60">{copy}</p>
            </li>
          ))}
        </ol>

        <p className="type-caption mt-4 text-ghost/45">
          Nykyinen kuva on konseptireferenssi. V2:n lopulliseen proof-osioon lukitaan neljä aitoa RAW → FINAL -kuvaparia.
        </p>
      </Container>
    </section>
  );
}
