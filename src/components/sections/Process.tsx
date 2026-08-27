import Container from '@/components/ui/Container';

export default function Process() {
  return (
    <section id="process" className="bg-ghost py-16 md:py-24">
      <Container>
        <h2 className="text-ink mb-12">Prosessi</h2>

        <div className="max-w-3xl space-y-8">
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-signal text-white font-bold">
                1
              </div>
            </div>
            <div>
              <h3 className="font-bold text-ink mb-2">Materialâ’¨ä lähetetään</h3>
              <p className="text-ink/70">
                Lähetät kuvia, videoita ja asiakastarinoita WhatsAppissa tai sähköpostitse.
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-signal text-white font-bold">
                2
              </div>
            </div>
            <div>
              <h3 className="font-bold text-ink mb-2">GhoulHouse tuottaa</h3>
              <p className="text-ink/70">
                Käsittelemme, muokkaamme ja luomme valmiit Instagram- ja Facebook-postit.
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-signal text-white font-bold">
                3
              </div>
            </div>
            <div>
              <h3 className="font-bold text-ink mb-2">Hyväksyntä</h3>
              <p className="text-ink/70">
                Tarkistit postit. Voit palauttaa muokkauspyyntöjä — yksi kierros mukaan lukien.
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-signal text-white font-bold">
                4
              </div>
            </div>
            <div>
              <h3 className="font-bold text-ink mb-2">Julkaisu ja optimointi</h3>
              <p className="text-ink/70">
                Me ajastamme ja julkaisemme sopiviin aikoihin. Seuraamme tuloksia ja optimoimme tarvittaessa.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
