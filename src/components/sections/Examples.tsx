import Container from '@/components/ui/Container';

export default function Examples() {
  return (
    <section className="bg-bone py-16 md:py-24">
      <Container>
        <h2 className="text-ink mb-12">Konseptiesimerkkejä tuotantotavasta</h2>

        <div className="space-y-8 text-sm text-ink/70">
          <div className="bg-white p-6 rounded border-l-4 border-signal">
            <p className="text-xs font-bold text-signal mb-2">KONSEPTIESIMERKKI — EI ASIAKASTYÖ</p>
            <p className="text-ink">
              Työmaakuva → selkeä ennen–jälkeen-julkaisu, jossa työn vaihe, toteutus ja lopputulos kerrotaan ymmärrettävästi.
            </p>
          </div>

          <div className="bg-white p-6 rounded border-l-4 border-signal">
            <p className="text-xs font-bold text-signal mb-2">KONSEPTIESIMERKKI — EI ASIAKASTYÖ</p>
            <p className="text-ink">
              Työvaiheen kuva → asiantuntijasisältö, joka kertoo mitä työssä tehdään ja miksi vaihe vaikuttaa lopputulokseen.
            </p>
          </div>

          <div className="bg-white p-6 rounded border-l-4 border-signal">
            <p className="text-xs font-bold text-signal mb-2">KONSEPTIESIMERKKI — EI ASIAKASTYÖ</p>
            <p className="text-ink">
              Valmiin kohteen kuvat → Instagram- ja Facebook-sisältö, jossa työn lopputulos esitellään ilman tekaistuja asiakaslausuntoja tai tulosväitteitä.
            </p>
          </div>
        </div>

        <p className="text-ink/60 text-xs mt-8 pt-8 border-t border-ink/20">
          Kaikki tämän osion esimerkit ovat konseptuaalisia. Ne eivät ole asiakastöitä, asiakastuloksia tai tuloslupauksia.
        </p>
      </Container>
    </section>
  );
}
