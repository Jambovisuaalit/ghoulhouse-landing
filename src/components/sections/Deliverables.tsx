import Container from '@/components/ui/Container';

export default function Deliverables() {
  return (
    <section className="bg-white py-16 md:py-24">
      <Container>
        <h2 className="text-ink mb-12">Mitä saat</h2>

        <div className="max-w-3xl">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-6 h-6 bg-signal rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">
                ✓
              </div>
              <div>
                <h3 className="font-bold text-ink mb-1">~12 alkuperäistä sisällönpalasetta kuukaudessa</h3>
                <p className="text-ink/70 text-sm">
                  Instagram- ja Facebook-versiota jokaista, valmis käytettäväksi.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-6 h-6 bg-signal rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">
                ✓
              </div>
              <div>
                <h3 className="font-bold text-ink mb-1">Sisällön suunnittelu</h3>
                <p className="text-ink/70 text-sm">
                  Koordinoimme, mihin aineistoon rakennamme ja milloin julkaisemme.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-6 h-6 bg-signal rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">
                ✓
              </div>
              <div>
                <h3 className="font-bold text-ink mb-1">Kuvan käsittely ja grafiikka</h3>
                <p className="text-ink/70 text-sm">
                  Valaistus, väri, sommittelu, logot ja tekstigrafiikka.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-6 h-6 bg-signal rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">
                ✓
              </div>
              <div>
                <h3 className="font-bold text-ink mb-1">Kopiointi ja kehotukset</h3>
                <p className="text-ink/70 text-sm">
                  Kuvaava teksti ja selkeä call-to-action jokaiselle postille.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-6 h-6 bg-signal rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">
                ✓
              </div>
              <div>
                <h3 className="font-bold text-ink mb-1">Ajoitus ja julkaisu</h3>
                <p className="text-ink/70 text-sm">
                  Me hallinnoimme aikataulun ja julkaisemme sopiviin aikoihin.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-6 h-6 bg-signal rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">
                ✓
              </div>
              <div>
                <h3 className="font-bold text-ink mb-1">Tuloskertomukset</h3>
                <p className="text-ink/70 text-sm">
                  Kuukausittainen yhteenveto: näkymät, sitoutuminen, seuraajien kasvu.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-6 h-6 bg-signal rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">
                ✓
              </div>
              <div>
                <h3 className="font-bold text-ink mb-1">Yksi muokkauskierros</h3>
                <p className="text-ink/70 text-sm">
                  Palauta sisältö hyväksyttäväksi. Me korjaamme ja otetaan uudelleen.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-6 h-6 bg-signal rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">
                ✓
              </div>
              <div>
                <h3 className="font-bold text-ink mb-1">WhatsApp-yhteys</h3>
                <p className="text-ink/70 text-sm">
                  Nopea kommunikaatio ja kysymysten vastaaminen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
