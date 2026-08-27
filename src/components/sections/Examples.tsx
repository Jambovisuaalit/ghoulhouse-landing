import Container from '@/components/ui/Container';

export default function Examples() {
  return (
    <section className="bg-bone py-16 md:py-24">
      <Container>
        <h2 className="text-ink mb-12">Esimerkkejä tuloksista</h2>

        <div className="space-y-8 text-sm text-ink/70">
          <div className="bg-white p-6 rounded border-l-4 border-signal">
            <p className="text-xs font-bold text-signal mb-2">KONSEPTIESIMERKKI — EI ASIAKASTYÖ</p>
            <p className="text-ink">
              Ennen: Erääntyvät työmaakuvat ilman kontekstia. Jälkeen: Visuaalisesti yhtenevä sisältö, 
              teksti ja brandi.
            </p>
          </div>

          <div className="bg-white p-6 rounded border-l-4 border-signal">
            <p className="text-xs font-bold text-signal mb-2">KONSEPTIESIMERKKI — EI ASIAKASTYÖ</p>
            <p className="text-ink">
              Asiakkaan työmaavideo muutetaan 15–30 sekunnin Instagram Reels- tai TikTok-videoksi, 
              jolla on teksti, musiikki ja kutsu.
            </p>
          </div>

          <div className="bg-white p-6 rounded border-l-4 border-signal">
            <p className="text-xs font-bold text-signal mb-2">KONSEPTIESIMERKKI — EI ASIAKASTYÖ</p>
            <p className="text-ink">
              Asiakkaan potilaskertomukset ja referenssit muutetaan some-tarinoiksi, joita voidaan 
              jälleen käyttää.
            </p>
          </div>
        </div>

        <p className="text-ink/60 text-xs mt-8 pt-8 border-t border-ink/20">
          Kaikki esimerkit ovat konseptuaalisia. Aidot asiakastäitä esitellään pyynnistä.
        </p>
      </Container>
    </section>
  );
}
