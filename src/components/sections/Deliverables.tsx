import SectionHeading from '@/components/ui/SectionHeading';
import { customerResponsibilities, deliverables } from '@/lib/content';

export default function Deliverables() {
  return (
    <section id="sisalto" className="section bg-ghost">
      <div className="shell">
        <SectionHeading
          eyebrow="04 / TOIMITUS"
          title="12 alkuperäistä sisältöä. Yksi selkeä kuukausiprosessi."
          intro="Paketti on rajattu tarkoituksella. Mitä vähemmän epäselvyyttä toimituksessa on, sitä helpompi palvelu on ostaa, hyväksyä ja tuottaa hyvin."
        />
        <div className="mt-14 grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="border border-ink/15 bg-white">
            <p className="eyebrow border-b border-ink/15 p-5 text-signal">GHOULHOUSE HOITAA</p>
            <ul className="grid sm:grid-cols-2">
              {deliverables.map((item, index) => (
                <li key={item} className="flex min-h-24 gap-4 border-b border-ink/10 p-5 sm:border-r sm:odd:border-r sm:even:border-r-0">
                  <span className="font-mono text-xs text-signal">{String(index + 1).padStart(2, '0')}</span>
                  <span className="font-bold leading-6 text-ink">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <aside className="border border-ink/15 bg-ink p-6 text-ghost lg:p-8">
            <p className="eyebrow text-bone">ASIAKAS TOIMITTAA</p>
            <ul className="mt-8 space-y-5">
              {customerResponsibilities.map((item) => (
                <li key={item} className="border-t border-ghost/15 pt-4 text-base leading-6 text-ghost/75">{item}</li>
              ))}
            </ul>
            <p className="mt-10 text-sm leading-6 text-ghost/50">
              Vaativa asiakaspalvelu, reklamaatiot, myyntineuvottelut ja tarjoukset jäävät asiakkaan vastuulle.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
