import Container from '@/components/ui/Container';
import ContactTrigger from '@/components/contact/ContactTrigger';
import { siteConfig } from '@/config/site';

export default function FinalCTA() {
  return (
    <section id="yhteydenotto" className="hero-surface bg-black py-20 text-white md:py-28" aria-labelledby="final-cta-title">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="type-label text-signal">Seuraava askel</p>
            <h2 id="final-cta-title" className="type-display final-title mt-5 text-white">
              <span className="final-title-mobile">
                <span className="block">TYÖT ON JO</span>
                <span className="block">TEHTY.</span>
                <span className="mt-[0.08em] block text-signal">TEHDÄÄN NE</span>
                <span className="block text-signal">MYÖS</span>
                <span className="block text-signal">NÄKYVIKSI.</span>
              </span>
              <span className="final-title-desktop">
                TYÖT ON JO TEHTY.
                <span className="block text-signal">TEHDÄÄN NE MYÖS NÄKYVIKSI.</span>
              </span>
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="type-editorial text-white/70">
              Ei raskasta markkinointiprojektia. Selkeä sisältökuukausi kerrallaan.
            </p>
            <div className="mt-7 grid gap-3">
              <ContactTrigger className="btn btn-primary w-full">{siteConfig.cta.primary}</ContactTrigger>
              <ContactTrigger intent="photos" className="btn btn-inverse w-full">{siteConfig.cta.secondary}</ContactTrigger>
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.09em] text-white/55">
              Työkuvien toimitustapa sovitaan yhteydenoton jälkeen.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
