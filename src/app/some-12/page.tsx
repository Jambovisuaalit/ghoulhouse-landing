import type { Metadata } from 'next';
import Container from '@/components/ui/Container';
import PageIntro from '@/components/ui/PageIntro';
import ContactTrigger from '@/components/contact/ContactTrigger';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'GhoulHouse Some 12 — 12 sisältöä / 30 päivää',
  description:
    'Työmaakuvat sisään. Valmis some ulos. 12 alkuperäistä sisältöä Instagramiin ja Facebookiin 490 € + ALV.',
  alternates: { canonical: '/some-12' },
};

const notIncluded = [
  'Maksettu mainonta',
  'Kuvauspäivät',
  'Jatkuva videotuotanto',
  'Rajattomat revisiot',
  'Päivittäinen community management',
  'Liidi- tai myyntitakuu',
] as const;

export default function Some12Page() {
  return (
    <main id="main-content" className="min-h-screen bg-ghost">
      <PageIntro
        eyebrow="GhoulHouse Some 12"
        title="TYÖMAAKUVAT SISÄÄN. VALMIS SOME ULOS."
        description="Lähetä työmaa- ja referenssikuvat. GhoulHouse muuttaa ne valmiiksi Instagram- ja Facebook-sisällöiksi."
      />
      <section className="border-b-2 border-ink py-12 md:py-16">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="type-label text-signal">Mitä saat</p>
            <h2 className="type-section-title mt-4 uppercase text-ink">Yksi paketti. Selkeä output.</h2>
            <div className="mt-7 grid border-2 border-ink sm:grid-cols-2">
              {siteConfig.offer.start.includes.map((item, index) => (
                <div key={item} className="type-ui border-b border-ink/20 p-4 text-ink sm:odd:border-r">
                  <span className="mr-3 text-signal">{String(index + 1).padStart(2, '0')}</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="border-2 border-ink bg-white p-6">
              <p className="type-label text-signal">Hinta</p>
              <p className="type-price mt-4 text-ink">
                {siteConfig.offer.start.price} € {siteConfig.offer.start.vatLabel}
              </p>
              <p className="type-caption mt-2 uppercase tracking-[0.08em] text-ink/60">
                / {siteConfig.offer.start.period}
              </p>
              <ContactTrigger className="btn btn-primary mt-7 w-full justify-between">
                <span>{siteConfig.cta.primary}</span>
                <span aria-hidden="true">→</span>
              </ContactTrigger>
            </div>
          </aside>
        </Container>
      </section>
      <section className="border-b-2 border-ink bg-bone py-12 md:py-16">
        <Container className="grid gap-8 lg:grid-cols-2">
          <div>
            <p className="type-label text-signal">Kenelle</p>
            <h2 className="type-section-title mt-4 uppercase text-ink">
              Hyvä firma. Hyvä työnjälki. Heikko näkyvyys.
            </h2>
            <p className="type-editorial mt-6 text-ink/70">
              Ensimmäinen kohderyhmä on Uudenmaan 2–10 henkilön B2C-remonttiyritykset, joilla syntyy säännöllisesti kuvattavaa työnjälkeä.
            </p>
          </div>
          <div>
            <p className="type-label text-signal">Ei kuulu pakettiin</p>
            <ul className="mt-4 border-y-2 border-ink">
              {notIncluded.map((item) => (
                <li key={item} className="type-ui border-b border-ink/20 py-4 last:border-b-0">{item}</li>
              ))}
            </ul>
          </div>
        </Container>
      </section>
    </main>
  );
}
