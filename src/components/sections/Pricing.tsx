import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';

interface PricingProps {
  onCtaClick?: () => void;
}

export default function Pricing({ onCtaClick }: PricingProps) {
  return (
    <section id="pricing" className="bg-white py-16 md:py-24">
      <Container>
        <h2 className="text-ink mb-12">Hinta</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl">
          {/* START Plan */}
          <div className="border-2 border-bone p-8 rounded">
            <h3 className="text-2xl font-bold text-ink mb-2">START</h3>
            <p className="text-ink/60 text-sm mb-6">Ensimmäiset 3 kuukautta</p>

            <div className="mb-6">
              <p className="text-sm text-ink/70 mb-2">per kuukausi</p>
              <p className="text-4xl font-bold text-signal">
                490€
              </p>
              <p className="text-sm text-ink/70">+ alv</p>
            </div>

            <ul className="space-y-3 mb-8 text-sm">
              <li className="flex gap-3">
                <span className="text-signal font-bold mt-0.5">✓</span>
                <span className="text-ink/80">~12 sisältönpalasta / kk</span>
              </li>
              <li className="flex gap-3">
                <span className="text-signal font-bold mt-0.5">✓</span>
                <span className="text-ink/80">Instagram + Facebook</span>
              </li>
              <li className="flex gap-3">
                <span className="text-signal font-bold mt-0.5">✓</span>
                <span className="text-ink/80">Sisällön suunnittelu</span>
              </li>
              <li className="flex gap-3">
                <span className="text-signal font-bold mt-0.5">✓</span>
                <span className="text-ink/80">Kuvan käsittely & grafiikka</span>
              </li>
              <li className="flex gap-3">
                <span className="text-signal font-bold mt-0.5">✓</span>
                <span className="text-ink/80">Kopiointi ja CTA:t</span>
              </li>
              <li className="flex gap-3">
                <span className="text-signal font-bold mt-0.5">✓</span>
                <span className="text-ink/80">Ajoitus ja julkaisu</span>
              </li>
              <li className="flex gap-3">
                <span className="text-signal font-bold mt-0.5">✓</span>
                <span className="text-ink/80">Tuloskertomukset</span>
              </li>
              <li className="flex gap-3">
                <span className="text-signal font-bold mt-0.5">✓</span>
                <span className="text-ink/80">1 muokkauskierros</span>
              </li>
            </ul>

            <Button
              variant="secondary"
              className="w-full"
              onClick={onCtaClick}
            >
              Aloita
            </Button>
          </div>

          {/* MANAGED Plan */}
          <div className="border-2 border-signal p-8 rounded bg-ghost/30">
            <h3 className="text-2xl font-bold text-ink mb-2">MANAGED</h3>
            <p className="text-ink/60 text-sm mb-6">Kuukauden jälkeen 4</p>

            <div className="mb-6">
              <p className="text-sm text-ink/70 mb-2">per kuukausi</p>
              <p className="text-4xl font-bold text-signal">
                790€
              </p>
              <p className="text-sm text-ink/70">+ alv</p>
            </div>

            <ul className="space-y-3 mb-8 text-sm">
              <li className="flex gap-3">
                <span className="text-signal font-bold mt-0.5">✓</span>
                <span className="text-ink/80">Kaikki STARTissa</span>
              </li>
              <li className="flex gap-3">
                <span className="text-signal font-bold mt-0.5">✓</span>
                <span className="text-ink/80">Jatkuva optimointi</span>
              </li>
              <li className="flex gap-3">
                <span className="text-signal font-bold mt-0.5">✓</span>
                <span className="text-ink/80">Aiheanalyysi & CTA-testaus</span>
              </li>
              <li className="flex gap-3">
                <span className="text-signal font-bold mt-0.5">✓</span>
                <span className="text-ink/80">Julkaisurytmin optimointi</span>
              </li>
              <li className="flex gap-3">
                <span className="text-signal font-bold mt-0.5">✓</span>
                <span className="text-ink/80">Sisällönpankin ylläpito</span>
              </li>
              <li className="flex gap-3">
                <span className="text-signal font-bold mt-0.5">✓</span>
                <span className="text-ink/80">Viikottain tilannekatsaus</span>
              </li>
              <li className="flex gap-3">
                <span className="text-signal font-bold mt-0.5">✓</span>
                <span className="text-ink/80">Rajallinen yhteisövaltaus</span>
              </li>
              <li className="flex gap-3">
                <span className="text-signal font-bold mt-0.5">✓</span>
                <span className="text-ink/80">Kuukausittain kehityssuositus</span>
              </li>
            </ul>

            <Button
              variant="primary"
              className="w-full"
              onClick={onCtaClick}
            >
              Pyydä esimerkit
            </Button>
          </div>
        </div>

        <div className="max-w-3xl mt-12 pt-8 border-t border-bone">
          <h3 className="font-bold text-ink mb-4">Yleistä hinnoittelusta</h3>
          <ul className="space-y-3 text-sm text-ink/70">
            <li className="flex gap-2">
              <span>•</span>
              <span>Ei kiinteistä sopimuksia. Voit perua milloin tahansa.</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Ei mainoskustannuksia — tämä on orgaaninen sisällöntoiminta.</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Tarvitsemme riittävän määrän työmaakuvia tai videota kuukaudessa.</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Hinnat ovat ilmoitettu ilman alv:ta. Alv lisätään loppuun.</span>
            </li>
          </ul>
        </div>
      </Container>
    </section>
  );
}
