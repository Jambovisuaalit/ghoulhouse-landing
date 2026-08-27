import Container from '@/components/ui/Container';

const signals = [
  'Remontti-, korjausrakentamis- tai rakentamisen palveluyritys',
  'Noin 2–10 henkilöä ja omistajavetoinen päätöksenteko',
  'Kuluttaja-asiakkaille tehtävää aitoa projektityötä',
  'Työmailta syntyy kuvia, mutta IG/FB päivittyy epäsäännöllisesti',
  'Tarve jatkuvalle sisällölle ilman omaa sisällöntuotantotiimiä',
] as const;

export default function Audience() {
  return (
    <section className="bg-bone py-16 md:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-signal">
              Kenelle tämä on
            </p>
            <h2 className="font-display text-[clamp(2.8rem,5vw,5.5rem)] font-black uppercase leading-[0.9] tracking-[-0.04em] text-ink">
              Kun työ on hyvää,
              <span className="block">mutta some ei pysy mukana.</span>
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-ink/65">
              Ensimmäinen validointiniche on Uudenmaan remontti- ja
              korjausrakentamisen yritykset. Palvelumalli soveltuu myös muille
              paikallisille palveluyrityksille, joilla syntyy vastaavaa
              todistemateriaalia.
            </p>
          </div>

          <div className="border-t-2 border-ink lg:col-span-7">
            {signals.map((signal, index) => (
              <div
                key={signal}
                className="grid grid-cols-[54px_1fr] gap-4 border-b border-ink/25 py-5"
              >
                <span className="text-xs font-black text-signal">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="text-base font-bold leading-relaxed text-ink">
                  {signal}
                </p>
              </div>
            ))}

            <p className="mt-5 text-xs leading-relaxed text-ink/60">
              GhoulHouse ei takaa liidejä, myyntiä, seuraajakasvua tai
              tavoittavuutta. Palvelulupaus koskee sovittua sisältötoimitusta.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
