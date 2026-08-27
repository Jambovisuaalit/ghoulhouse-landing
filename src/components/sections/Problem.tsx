import Container from '@/components/ui/Container';

export default function Problem() {
  return (
    <section id="problem" className="bg-ghost py-16 md:py-24">
      <Container>
        <div className="max-w-3xl">
          <h2 className="text-ink mb-8">Hyvää työtä, näkymätöntä asiakkaille</h2>

          <div className="space-y-6 text-ink/80">
            <p className="text-lg leading-relaxed">
              Valokuvat ja videot työmaalta ovat jo olemassa. Ne kuvaavat laadukasta työtä, asiakastapauksia ja 
              referenssejä.
            </p>

            <p className="text-lg leading-relaxed">
              Mutta ne jäävät puhelimeen. WhatsApp-ketjuihin. Kansioihin. Ne eivät tule osaksi johdonmukaista, 
              uskottavaa some-läsnäoloa.
            </p>

            <p className="text-lg leading-relaxed">
              Potentiaaliset asiakkaat eivät näe, mitä pystyt tekemään.
            </p>

            <p className="text-lg leading-relaxed">
              GhoulHouse ratkaisee tämän: muutamme olemassa olevan material pois ja tuotamme valmiita, 
              visuaalisesti johdonmukaisia some-sisällöksi.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
