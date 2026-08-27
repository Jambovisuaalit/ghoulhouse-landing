import Container from '@/components/ui/Container';

export default function Audience() {
  return (
    <section className="bg-white py-16 md:py-24" aria-labelledby="audience-title">
      <Container>
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-signal">Kenelle</p>
            <h2 id="audience-title" className="text-ink">
              Remontti- ja korjausrakentamisen pienyrityksille
            </h2>
          </div>

          <div className="space-y-5 text-ink/75">
            <p>
              Palvelu sopii yrityksille, joilla syntyy jatkuvasti työmaa- ja referenssikuvia mutta
              niiden julkaiseminen jää epäsäännölliseksi.
            </p>
            <p>
              Jos materiaalia ei synny tai tavoitteena on ensisijaisesti maksettu liidimainonta,
              Some 12 ei ole oikea paketti.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
