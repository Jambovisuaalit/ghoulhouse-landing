import Container from '@/components/ui/Container';

const included = [
  ['12 alkuperäistä sisältöä / 30 päivää', 'Sisällöt sovitetaan Instagramiin ja Facebookiin.'],
  ['Sisältösuunnittelu', 'Valitsemme materiaalista toimivat aiheet ja rakennamme julkaisurytmin.'],
  ['Kuvien valinta ja viimeistely', 'Käsittely, rajaus ja tarvittava kevyt grafiikka.'],
  ['Tekstit ja CTA:t', 'Jokaiselle sisällölle selkeä julkaisuteksti ja toimintakehotus.'],
  ['Ajastus ja julkaisu', 'Hyväksytyt sisällöt ajastetaan ja julkaistaan molempiin kanaviin.'],
  ['Yksi koottu korjauskierros', 'Palautteet toimitetaan yhtenä kierroksena ennen julkaisemista.'],
  ['Kevyt kuukausikooste', 'Yhteenveto julkaisemisesta ja olennaisista kanavamittareista.'],
];

export default function Deliverables() {
  return (
    <section className="bg-white py-16 md:py-24" aria-labelledby="deliverables-title">
      <Container>
        <h2 id="deliverables-title" className="mb-12 text-ink">
          Mitä Some 12 sisältää
        </h2>

        <div className="max-w-3xl space-y-5">
          {included.map(([title, body]) => (
            <div key={title} className="flex gap-4">
              <div
                aria-hidden="true"
                className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-signal text-sm font-bold text-white"
              >
                ✓
              </div>
              <div>
                <h3 className="mb-1 font-bold text-ink">{title}</h3>
                <p className="text-sm text-ink/70">{body}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 max-w-3xl border-t border-bone pt-6 text-sm text-ink/60">
          Ei sisällä maksettua mainontaa, kuvaus- tai videopäiviä, päivittäistä community
          managementia, rajattomia muutoksia tai tulostakuuta.
        </p>
      </Container>
    </section>
  );
}
