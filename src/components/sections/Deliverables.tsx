import Container from '@/components/ui/Container';
import { siteConfig } from '@/config/site';

const grouped = [
  {
    label: 'OUTPUT',
    value: '12 alkuperäistä sisältöä / 30 päivää',
  },
  {
    label: 'KANAVAT',
    value: 'Instagram + Facebook',
  },
  {
    label: 'TUOTANTO',
    value: 'Suunnittelu · kevyt kuvankäsittely · grafiikka · copy · CTA:t',
  },
  {
    label: 'TOIMITUS',
    value: 'Ajastus · julkaisu · yksi koottu korjauskierros',
  },
  {
    label: 'YHTEISTYÖ',
    value: 'Onboarding · materiaaliohjeistus · WhatsApp-viestintä',
  },
  {
    label: 'SEURANTA',
    value: 'Kuukausittainen tulosyhteenveto',
  },
] as const;

export default function Deliverables() {
  return (
    <section id="deliverables" className="bg-ghost py-16 md:py-24">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="type-label mb-4 text-signal">
              START / toimitussisältö
            </p>
            <h2 className="type-section-title max-w-[12ch] text-ink">
              Yksi selkeä
              <span className="block">tuotantopaketti.</span>
            </h2>
            <p className="type-editorial mt-6 max-w-md text-ink/70">
              Palvelu on rajattu tarkoituksella. Sisältö, kanavat, toimitus ja
              korjauskierros ovat määritelty etukäteen.
            </p>
          </div>

          <div className="border-t-2 border-ink lg:col-span-7">
            {grouped.map((item) => (
              <div
                key={item.label}
                className="grid grid-cols-1 gap-2 border-b border-ink/30 py-5 sm:grid-cols-[150px_1fr]"
              >
                <span className="type-label text-signal">
                  {item.label}
                </span>
                <p className="type-ui text-ink">
                  {item.value}
                </p>
              </div>
            ))}

            <p className="type-caption mt-5 text-ink/60">
              START-hinta {siteConfig.offer.start.price} € {siteConfig.offer.start.vatLabel} /{' '}
              {siteConfig.offer.start.period}. Palvelujaksot 1–3.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
