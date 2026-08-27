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
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-white/70">
              Seuraava askel
            </p>
            <h2 className="font-display text-[clamp(3.5rem,8vw,9rem)] font-black uppercase leading-[0.8] tracking-[-0.045em]">
              Näytä meille
              <span className="block">työsi.</span>
            </h2>
          </div>

          <div className="lg:col-span-4">
            <p className="mb-6 max-w-md text-base leading-relaxed text-white/85">
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
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-white/70">
              Ei sitoutumista · konseptiesimerkki ei ole asiakastyö
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
