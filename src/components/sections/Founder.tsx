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
            GhoulHouse on tuotteistettu sosiaalisen median sisältöpalvelu, joka auttaa remontti- ja korjausrakentamisen yrityksiä muuttamaan olemassa olevan työmaamateriaalin julkaistavaksi sisällöksi.
          </p>
          <p className="text-ink/80 text-lg leading-relaxed mb-6">
            Palvelun tavoite on tehdä sisällöntuotannosta asiakkaalle selkeä prosessi: materiaalit sisään, sisällöt hyväksyntään ja valmiit julkaisut ulos.
          </p>
          <p className="text-ink/70 text-sm">
            <strong>Helsinki</strong>
          </p>
        </div>
      </Container>
    </section>
  );
}
