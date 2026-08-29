import type { Metadata } from 'next';
import Container from '@/components/ui/Container';
import PageIntro from '@/components/ui/PageIntro';
import ContactTrigger from '@/components/contact/ContactTrigger';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Yhteys — GhoulHouse',
  description: 'Pyydä kaksi yrityskohtaista sisältöesimerkkiä GhoulHouselta.',
  alternates: { canonical: '/yhteys' },
};

export default function ContactPage() {
  return (
    <main id="main-content" className="min-h-screen bg-ghost">
      <PageIntro
        eyebrow="Yhteys"
        title="PYYDÄ 2 SISÄLTÖESIMERKKIÄ."
        description="Anna yrityksen perustiedot ja verkkosivu tai Instagram. GhoulHouse käyttää niitä ensimmäisenä lähdemateriaalina."
      />
      <section className="border-b-2 border-ink py-12 md:py-16">
        <Container className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="border-y-2 border-ink">
              {[
                ['01', 'Lähetä yrityksen perustiedot.'],
                ['02', 'Käymme läpi verkkosivun tai Instagram-profiilin.'],
                ['03', 'Pyydämme työmaakuvia vain tarvittaessa.'],
                ['04', 'Saat kaksi yrityskohtaista konseptiesimerkkiä.'],
              ].map(([number, text]) => (
                <div key={number} className="grid grid-cols-[54px_1fr] border-b border-ink/20 py-5 last:border-b-0">
                  <span className="type-label text-signal">{number}</span>
                  <p className="type-ui text-ink">{text}</p>
                </div>
              ))}
            </div>
          </div>
          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="border-2 border-ink bg-white p-6">
              <p className="type-label text-signal">Seuraava askel</p>
              <ContactTrigger className="btn btn-primary mt-5 w-full justify-between">
                <span>{siteConfig.cta.primary}</span>
                <span aria-hidden="true">→</span>
              </ContactTrigger>
            </div>
          </aside>
        </Container>
      </section>
    </main>
  );
}
