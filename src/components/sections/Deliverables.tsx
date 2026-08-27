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
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-signal">
              START / toimitussisältö
            </p>
            <h2 className="font-display text-[clamp(2.8rem,5vw,5.5rem)] font-black uppercase leading-[0.9] tracking-[-0.04em] text-ink">
              Yksi selkeä
              <span className="block">tuotantopaketti.</span>
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-ink/65">
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
                <span className="text-[0.65rem] font-black uppercase tracking-[0.15em] text-signal">
                  {item.label}
                </span>
                <p className="text-base font-bold leading-relaxed text-ink">
                  {item.value}
                </p>
              </div>
            ))}

            <p className="mt-5 text-xs leading-relaxed text-ink/55">
              START-hinta {siteConfig.offer.start.price} € {siteConfig.offer.start.vatLabel} /{' '}
              {siteConfig.offer.start.period}. Palvelujaksot 1–3.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
