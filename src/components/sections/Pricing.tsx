import SectionHeading from '@/components/ui/SectionHeading';
import { deliverables, managedExtras } from '@/lib/content';
import { siteConfig } from '@/lib/site';

export default function Pricing() {
  return (
    <section id="hinta" className="section bg-ghost">
      <div className="shell">
        <SectionHeading
          eyebrow="06 / HINNOITTELU"
          title="Ensin START. Sen jälkeen MANAGED."
          intro="Nämä eivät ole kaksi kilpailevaa pakettia. Palvelu alkaa START-jaksolla ja jatkuu palvelujaksosta 4 MANAGED-tasolla."
        />
        <div className="mt-14 grid border border-ink/20 lg:grid-cols-2">
          <article className="pricing-panel bg-white">
            <div className="flex items-start justify-between gap-4 border-b border-ink/15 pb-6">
              <div><p className="eyebrow text-signal">PALVELUJAKSOT 1–3</p><h3>START</h3></div>
              <span className="pricing-index">01</span>
            </div>
            <p className="price-display">490 €</p>
            <p className="price-meta">+ ALV / 30 päivän palvelujakso</p>
            <ul className="mt-8 space-y-3 text-sm text-ink/70">
              {deliverables.map((item) => <li key={item} className="border-t border-ink/10 pt-3">{item}</li>)}
            </ul>
          </article>
          <article className="pricing-panel bg-ink text-ghost">
            <div className="flex items-start justify-between gap-4 border-b border-ghost/15 pb-6">
              <div><p className="eyebrow text-signal">PALVELUJAKSOSTA 4</p><h3>MANAGED</h3></div>
              <span className="pricing-index text-ghost/20">02</span>
            </div>
            <p className="price-display text-ghost">790 €</p>
            <p className="price-meta text-ghost/55">+ ALV / 30 päivän palvelujakso</p>
            <p className="mt-8 text-sm font-bold uppercase tracking-[0.08em] text-ghost">START +</p>
            <ul className="mt-3 space-y-3 text-sm text-ghost/65">
              {managedExtras.map((item) => <li key={item} className="border-t border-ghost/10 pt-3">{item}</li>)}
            </ul>
          </article>
        </div>
        <div className="mt-8 flex flex-col gap-5 border-t border-ink/15 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-sm leading-6 text-ink/60">
            Palvelu on kuukausittain irtisanottava sopimusehtojen mukaisesti. Emme lupaa taattuja liidejä, myyntiä, seuraajia tai tavoittavuutta.
          </p>
          <a href="#demo" className="btn-primary shrink-0">{siteConfig.primaryCta}</a>
        </div>
      </div>
    </section>
  );
}
