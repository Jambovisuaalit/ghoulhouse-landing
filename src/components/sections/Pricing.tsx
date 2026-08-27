import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';

interface PricingProps {
  onCtaClick: () => void;
}

const startItems = [
  '12 alkuperäistä sisältöä / 30 päivää',
  'Instagram + Facebook',
  'Sisällön suunnittelu',
  'Kuvien käsittely ja grafiikka',
  'Copywriting ja CTA:t',
  'Ajastus ja julkaisu',
  'Kevyt palvelujakson raportti',
  '1 koottu muokkauskierros',
];

const managedItems = [
  'Kaikki START-palvelun sisältö',
  'Jatkuva sisältöoptimointi',
  'Aiheiden ja CTA:iden kehittäminen',
  'Julkaisurytmin optimointi',
  'Sisältöpankin ylläpito',
  'Palvelujakson kehityssuositukset',
];

export default function Pricing({ onCtaClick }: PricingProps) {
  return (
    <section id="pricing" className="bg-white py-16 md:py-24">
      <Container>
        <h2 className="text-ink mb-12">Hinta</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl">
          <div className="border-2 border-bone p-8 rounded">
            <h3 className="text-2xl font-bold text-ink mb-2">START</h3>
            <p className="text-ink/60 text-sm mb-6">Palvelujaksot 1–3</p>

            <div className="mb-6">
              <p className="text-sm text-ink/70 mb-2">30 päivän palvelujakso</p>
              <p className="text-4xl font-bold text-signal">490 €</p>
              <p className="text-sm text-ink/70">+ ALV</p>
            </div>

            <ul className="space-y-3 mb-8 text-sm">
              {startItems.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-signal font-bold mt-0.5" aria-hidden="true">✓</span>
                  <span className="text-ink/80">{item}</span>
                </li>
              ))}
            </ul>

            <Button variant="primary" className="w-full" onClick={onCtaClick}>
              PYYDÄ 2 SISÄLTÖESIMERKKIÄ
            </Button>
          </div>

          <div className="border-2 border-signal p-8 rounded bg-ghost/30">
            <h3 className="text-2xl font-bold text-ink mb-2">MANAGED</h3>
            <p className="text-ink/60 text-sm mb-6">Palvelujaksosta 4 alkaen</p>

            <div className="mb-6">
              <p className="text-sm text-ink/70 mb-2">30 päivän palvelujakso</p>
              <p className="text-4xl font-bold text-signal">790 €</p>
              <p className="text-sm text-ink/70">+ ALV</p>
            </div>

            <ul className="space-y-3 mb-8 text-sm">
              {managedItems.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-signal font-bold mt-0.5" aria-hidden="true">✓</span>
                  <span className="text-ink/80">{item}</span>
                </li>
              ))}
            </ul>

            <Button variant="primary" className="w-full" onClick={onCtaClick}>
              PYYDÄ 2 SISÄLTÖESIMERKKIÄ
            </Button>
          </div>
        </div>

        <div className="max-w-3xl mt-12 pt-8 border-t border-bone">
          <h3 className="font-bold text-ink mb-4">Yleistä hinnoittelusta</h3>
          <ul className="space-y-3 text-sm text-ink/70">
            <li className="flex gap-2"><span aria-hidden="true">•</span><span>Palvelu toimitetaan 30 päivän jaksoissa.</span></li>
            <li className="flex gap-2"><span aria-hidden="true">•</span><span>Seuraavan palvelujakson voi irtisanoa sovittujen ehtojen mukaisesti.</span></li>
            <li className="flex gap-2"><span aria-hidden="true">•</span><span>Maksettu mainonta ei sisälly palveluun.</span></li>
            <li className="flex gap-2"><span aria-hidden="true">•</span><span>Asiakas toimittaa riittävän määrän työmaakuvia tai videomateriaalia.</span></li>
          </ul>
        </div>
      </Container>
    </section>
  );
}
