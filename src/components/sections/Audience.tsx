import Container from '@/components/ui/Container';

export default function Audience() {
  return (
    <section className="bg-ghost py-16 md:py-24">
      <Container>
        <h2 className="text-ink mb-8">Kelle tämä on tarkoitettu</h2>

        <div className="max-w-3xl space-y-6 text-ink/80">
          <p className="text-lg leading-relaxed">
            GhoulHouse on suunniteltu <strong>paikallisille palveluyrityksille</strong> Suomessa.
          </p>

          <p className="text-lg leading-relaxed">
            Erityisesti:
          </p>

          <ul className="space-y-3 text-lg">
            <li className="flex gap-3">
              <span className="text-signal font-bold mt-1">✓</span>
              <span>Rakentamisen, remontoinnin ja korjauspalvelujen yritykset</span>
            </li>
            <li className="flex gap-3">
              <span className="text-signal font-bold mt-1">✓</span>
              <span>Omistajavetoinen toiminta (2–10 henkilöä)</span>
            </li>
            <li className="flex gap-3">
              <span className="text-signal font-bold mt-1">✓</span>
              <span>Laadukasta työtä ja selkeät viitteet olemassa</span>
            </li>
            <li className="flex gap-3">
              <span className="text-signal font-bold mt-1">✓</span>
              <span>Heikko tai epäjohdonmukainen some-läsnäolo</span>
            </li>
            <li className="flex gap-3">
              <span className="text-signal font-bold mt-1">✓</span>
              <span>Omistaja ei halua käyttää aikaa sisällön suunnitteluun ja jakamiseen</span>
            </li>
          </ul>

          <div className="bg-white p-6 rounded border-l-4 border-signal mt-8">
            <p className="text-ink font-bold mb-2">Mitä GhoulHouse EI takaa</p>
            <p className="text-sm text-ink/70">
              Me emme lupaa johtavan kasvua, määriteltyjä konversiota tai johtava. 
              Me tuotamme laadukasta, johdonmukaista sisältöä. Tulokset riippuvat sinun brandiistasi, 
              tuotteistasi ja asiakkaista.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
