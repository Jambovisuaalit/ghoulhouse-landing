import Container from '@/components/ui/Container';

const deliverables = [
  ['12 alkuperäistä sisältöä / 30 päivää', 'Ydinsisällöt rakennetaan asiakkaan toimittamasta työmaamateriaalista ja sovitetaan Instagramiin ja Facebookiin.'],
  ['Sisällön suunnittelu', 'Sisältökulmat ja julkaisujärjestys suunnitellaan yhden palvelujakson kokonaisuudeksi.'],
  ['Kuvien käsittely ja grafiikka', 'Asiakkaan materiaali viimeistellään julkaistavaan muotoon palvelun rajauksen mukaisesti.'],
  ['Copywriting ja CTA:t', 'Jokaiselle sisällölle kirjoitetaan julkaisuteksti ja selkeä toimintakehote.'],
  ['Ajastus ja julkaisu', 'Hyväksytyt sisällöt ajastetaan ja julkaistaan Instagramissa ja Facebookissa.'],
  ['Kevyt palvelujakson raportti', 'Palvelujakson lopuksi toimitetaan tiivis yhteenveto saatavilla olevista perustunnusluvuista.'],
  ['Yksi koottu muokkauskierros', 'Asiakas tarkistaa faktat ja sävyn ennen julkaisua. Yksi koottu korjauskierros sisältyy palveluun.'],
] as const;

export default function Deliverables() {
  return (
    <section className="bg-white py-16 md:py-24">
      <Container>
        <h2 className="text-ink mb-12">Mitä saat</h2>

        <div className="max-w-3xl space-y-4">
          {deliverables.map(([title, description]) => (
            <div key={title} className="flex gap-4">
              <div className="flex-shrink-0 w-6 h-6 bg-signal rounded-full flex items-center justify-center text-white text-sm font-bold mt-1" aria-hidden="true">
                ✓
              </div>
              <div>
                <h3 className="font-bold text-ink mb-1">{title}</h3>
                <p className="text-ink/70 text-sm">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
