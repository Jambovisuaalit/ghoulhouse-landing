import Container from '@/components/ui/Container';
import ContactTrigger from '@/components/contact/ContactTrigger';
import { siteConfig } from '@/config/site';

export default function FinalCTA() {
  return (
    <section className="overflow-hidden border-t border-signal bg-ink py-16 text-ghost md:py-20">
      <Container>
        <div className="grid grid-cols-1 gap-9 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="type-label mb-4 text-signal">Seuraava askel</p>
            <h2 className="type-display max-w-[9ch] text-ghost">
              Näytä meille<span className="block">työsi.</span>
            </h2>
          </div>
          <div className="border-t border-ghost/25 pt-6 lg:col-span-4 lg:col-start-9">
            <p className="type-editorial mb-6 max-w-md text-ghost/75">
              Lähetä yrityksen tiedot ja verkkosivu tai Instagram. Saat kaksi yrityskohtaista konseptiesimerkkiä siitä, miltä sisältö voisi näyttää. Työmaakuvia pyydämme vain tarvittaessa.
            </p>
            <ContactTrigger className="btn btn-primary w-full justify-between text-left md:w-auto md:min-w-[310px]">
              <span>{siteConfig.cta.primary}</span><span aria-hidden="true">→</span>
            </ContactTrigger>
            <p className="type-caption mt-4 uppercase tracking-[0.06em] text-ghost/65">
              Ei sitoutumista · konseptiesimerkki ei ole asiakastyö
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
