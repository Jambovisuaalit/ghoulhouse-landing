import Container from '@/components/ui/Container';

export default function Founder() {
  return (
    <section className="border-y border-bone bg-ghost py-16 md:py-24" aria-labelledby="founder-title">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-signal">GhoulHouse</p>
          <div>
            <h2 id="founder-title" className="text-ink">
              Yksi käytännön pullonkaula pois yrittäjän pöydältä
            </h2>
            <p className="mt-5 max-w-2xl text-ink/70">
              Teillä on jo työnjälki ja kuvat. GhoulHouse hoitaa niiden suunnittelun,
              viimeistelyn, tekstit ja julkaisut, jotta Instagram ja Facebook pysyvät aktiivisina
              ilman että sisältötyö jää yrittäjän vastuulle.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
