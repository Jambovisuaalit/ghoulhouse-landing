import Container from '@/components/ui/Container';

export default function Founder() {
  return (
    <section className="bg-white py-16 md:py-24">
      <Container>
        <div className="max-w-3xl">
          <h2 className="text-ink mb-8">Hanna Nyholm</h2>
          <p className="text-ink/70 text-lg leading-relaxed mb-6">
            <strong>Perustaja, GhoulHouse Oy</strong>
          </p>
          <p className="text-ink/80 text-lg leading-relaxed mb-6">
            Hannan taustalla on yli 10 vuoden kokemus digitaalisesta markkinoinnista ja 
            sisällöntuotannosta. Hän on työskennellyt pienten ja suurten yritysten kanssa, 
            mutta huomasi tyhjön: paikalliset palveluyritykset yksinkertaisesti eivät pysty 
            hallitsemaan ammattimaista some-läsnäoloa.
          </p>
          <p className="text-ink/80 text-lg leading-relaxed mb-6">
            GhoulHouse ratkaisee tämän: muodostaa pragmaattisen, kustannustehokkaasti skaalautuvan 
            palvelun, joka muuttaa olemassa olevat työmaakuvat valmiiksi some-sisällöksi.
          </p>
          <p className="text-ink/70 text-sm">
            <strong>Helsinki</strong> • 
            <a href="mailto:hanna@ghoulhouse.fi" className="text-signal hover:underline ml-2">
              hanna@ghoulhouse.fi
            </a>
          </p>
        </div>
      </Container>
    </section>
  );
}
