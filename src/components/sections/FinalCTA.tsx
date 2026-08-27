import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';
import { siteConfig } from '@/config/site';

interface FinalCTAProps {
  onCtaClick: () => void;
}

export default function FinalCTA({ onCtaClick }: FinalCTAProps) {
  return (
    <section className="overflow-hidden bg-signal py-16 text-white md:py-24">
      <Container>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="type-label mb-4 text-white/75">
              Seuraava askel
            </p>
            <h2 className="type-display max-w-[9ch] text-white">
              Näytä meille
              <span className="block">työsi.</span>
            </h2>
          </div>

          <div className="lg:col-span-4">
            <p className="type-editorial mb-6 max-w-md text-white/90">
              Lähetä yrityksen tiedot ja verkkosivu tai Instagram. Saat kaksi
              yrityskohtaista konseptiesimerkkiä siitä, miltä sisältö voisi
              näyttää. Jos tarvitsemme työmaakuvia, pyydämme ne erikseen.
            </p>
            <Button
              variant="secondary"
              size="lg"
              onClick={onCtaClick}
              className="w-full border-white bg-white text-ink hover:border-ink md:w-auto"
            >
              {siteConfig.cta.primary}
            </Button>
            <p className="type-caption mt-4 uppercase tracking-[0.06em] text-white/75">
              Ei sitoutumista · konseptiesimerkki ei ole asiakastyö
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
