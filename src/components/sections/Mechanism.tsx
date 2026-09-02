import Image from 'next/image';
import Container from '@/components/ui/Container';

const rawPhoto =
  'https://images.unsplash.com/photo-1768321917661-d4f1a89d2185?auto=format&fit=crop&fm=jpg&q=85&w=1800';
const finishedBathroom =
  'https://images.unsplash.com/photo-1771929662486-f793e08f0f16?auto=format&fit=crop&fm=jpg&q=85&w=1800';
const finishedBathroomAlt =
  'https://images.unsplash.com/photo-1741282306943-2f2e4c4e0aa5?auto=format&fit=crop&fm=jpg&q=85&w=1800';

const frames = [
  {
    image: rawPhoto,
    index: '01',
    label: 'RAAKA',
    caption: 'Työmaalta sellaisenaan',
  },
  {
    image: rawPhoto,
    index: '02',
    label: 'KULMA',
    caption: 'Työvaiheesta asiantuntijasisältö',
  },
  {
    image: finishedBathroom,
    index: '03',
    label: 'KOHDE',
    caption: 'Valmis tila referenssiksi',
  },
  {
    image: finishedBathroomAlt,
    index: '04',
    label: 'JULKAISU',
    caption: 'Kuva, rakenne ja viesti yhdessä',
  },
] as const;

export default function Mechanism() {
  return (
    <section
      id="mechanism"
      className="border-y border-ink bg-ink text-ghost"
      aria-labelledby="mechanism-title"
    >
      <Container className="mechanism-intro py-14 md:py-20">
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="type-label mb-4 text-signal">Työmaalta julkaisuun</p>
            <h2
              id="mechanism-title"
              className="type-display max-w-[12ch] text-ghost"
            >
              Sama työ.
              <span className="block text-signal">Parempi näyttö.</span>
            </h2>
          </div>
          <div className="mechanism-intro__support lg:col-span-4">
            <p className="font-editorial-accent text-[clamp(1.55rem,2.4vw,2.15rem)] leading-[1.05] text-ghost">
              Ei uutta kuvauspäivää.
            </p>
            <p className="type-editorial mt-3 max-w-md text-ghost/65">
              Työmaalla jo syntyvä materiaali saa selkeän rajauksen, sisältökulman
              ja julkaisuvalmiin muodon.
            </p>
          </div>
        </div>
      </Container>

      <div className="mechanism-raw">
        <div className="mechanism-raw__sticky">
          <div className="mechanism-raw__copy mechanism-raw__copy--raw">
            <span className="type-label text-signal">01 / RAAKA</span>
            <h3>Puhelimesta.</h3>
            <p>Työmaakuva. Materiaali sellaisena kuin se syntyy.</p>
          </div>

          <div
            className="mechanism-raw__stage"
            aria-label="Raakamateriaalista valmiiksi somejulkaisuksi"
          >
            <div className="mechanism-raw__image mechanism-raw__image--source">
              <Image
                src={rawPhoto}
                alt="Remonttityömaan kuvareferenssi ennen sisältökäsittelyä"
                fill
                sizes="(max-width: 1099px) 100vw, 58vw"
                className="object-cover"
              />
              <div className="mechanism-raw__technical" aria-hidden="true">
                <span>RAAKA / 01</span>
                <span>TYÖMAAMATERIAALI</span>
                <span>KÄSITTELEMÄTÖN</span>
              </div>
            </div>

            <div className="mechanism-raw__image mechanism-raw__image--final">
              <Image
                src={rawPhoto}
                alt="Sama remonttikuva osana viimeisteltyä GhoulHouse-sisältökonseptia"
                fill
                sizes="(max-width: 1099px) 100vw, 58vw"
                className="object-cover"
              />
              <div className="mechanism-raw__final-frame" aria-hidden="true" />
              <div className="mechanism-raw__final-copy">
                <span className="type-label text-signal">GHOULHOUSE / VALMIS</span>
                <strong>Pohjatyö ratkaisee lopputuloksen.</strong>
                <small>KONSEPTIESIMERKKI — EI ASIAKASTYÖ</small>
              </div>
            </div>

            <div className="mechanism-raw__divider" aria-hidden="true">
              <span />
            </div>
          </div>

          <div className="mechanism-raw__copy mechanism-raw__copy--final">
            <span className="type-label text-signal">02 / JULKAISU</span>
            <h3>Näkyväksi.</h3>
            <p>Rajaus, sisältökulma, teksti ja toimintakehotus valmiina.</p>
          </div>
        </div>
      </div>

      <div className="mechanism-film">
        <div className="mechanism-film__sticky">
          <div className="mechanism-film__header">
            <p className="type-label text-signal">Sisältöesimerkit</p>
            <h3>Yksi materiaali. Useampi käyttö.</h3>
          </div>

          <div
            className="mechanism-film__viewport"
            tabIndex={0}
            role="region"
            aria-label="GhoulHouse-sisältöesimerkit"
          >
            <div className="mechanism-film__track">
              {frames.map((frame) => (
                <figure className="mechanism-film__frame" key={frame.index}>
                  <div className="mechanism-film__perforation" aria-hidden="true" />
                  <div className="mechanism-film__image">
                    <Image
                      src={frame.image}
                      alt=""
                      fill
                      sizes="(max-width: 1099px) 82vw, 38vw"
                      className="object-cover"
                    />
                    <span>{frame.label}</span>
                  </div>
                  <figcaption>
                    <strong>{frame.index}</strong>
                    <p>{frame.caption}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          <p className="type-caption mt-4 text-ghost/55">
            Kuvareferenssit: Unsplash · konseptiesimerkkejä, ei GhoulHousen
            asiakastöitä.
          </p>
        </div>
      </div>
    </section>
  );
}
