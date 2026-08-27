import SectionHeading from '@/components/ui/SectionHeading';
import { customerResponsibilities, deliverables } from '@/lib/content';

export default function Deliverables() {
  return (
    <section id="sisalto" className="section bg-ghost">
      <div className="shell">
        <SectionHeading
          eyebrow="04 / TOIMITUS"
          title="12 sisältöä. Yksi tuotantomanifesti."
          intro="Palvelun arvo ei synny ominaisuuslistasta vaan siitä, että vastuut, output ja rytmi ovat ostajalle selkeitä."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
          <div className="output-manifest">
            <div className="flex items-center justify-between gap-4 border-b border-ink/20 py-4">
              <p className="eyebrow text-ink">GHOULHOUSE / OUTPUT</p>
              <span className="font-mono text-xs text-signal">10 ITEMS</span>
            </div>

            <ul>
              {deliverables.map((item, index) => (
                <li key={item} className="output-row">
                  <span className="output-row-index">{String(index + 1).padStart(2, '0')}</span>
                  <strong>{item}</strong>
                </li>
              ))}
            </ul>
          </div>

          <aside className="client-band">
            <p className="eyebrow text-signal">CLIENT / INPUT</p>
            <h3 className="mt-5 max-w-[10ch] font-display text-4xl font-black uppercase leading-[0.9] tracking-[-0.05em]">
              Te toimitatte faktat. Me teemme niistä sisällön.
            </h3>

            <ul className="mt-8">
              {customerResponsibilities.map((item, index) => (
                <li key={item} className="grid grid-cols-[34px_1fr] gap-3 text-sm leading-6 text-ghost/75">
                  <span className="font-mono text-xs text-signal">{String(index + 1).padStart(2, '0')}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="mt-8 border-t border-ghost/15 pt-5 text-sm leading-6 text-ghost/50">
              Vaativa asiakaspalvelu, reklamaatiot, myyntineuvottelut ja tarjoukset jäävät asiakkaan vastuulle.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
