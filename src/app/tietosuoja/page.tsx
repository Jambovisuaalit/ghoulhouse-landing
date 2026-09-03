import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import Footer from '@/components/layout/Footer';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Tietosuojaseloste | GhoulHouse',
  description: 'GhoulHousen verkkosivun yhteydenottojen tietosuojaseloste.',
  alternates: { canonical: '/tietosuoja' },
};

const sections = [
  {
    title: '1. Rekisterinpitäjä',
    content: `${siteConfig.company.legalName}, Y-tunnus ${siteConfig.company.businessId}, kotipaikka ${siteConfig.company.domicile}. ${siteConfig.company.registrationStatus}. Tietosuoja-asioissa voit ottaa yhteyttä verkkosivun yhteydenottolomakkeella.`,
  },
  {
    title: '2. Käsittelyn tarkoitus ja peruste',
    content: 'Käsittelemme tietoja yhteydenottoihin, keskustelu- ja demopyyntöihin vastaamiseksi sekä mahdollisen asiakassuhteen valmistelemiseksi. Käsittely perustuu pyyntöösi ennen mahdollista sopimusta ja Ghoulhousen oikeutettuun etuun hoitaa yritysviestintää.',
  },
  {
    title: '3. Käsiteltävät tiedot',
    content: 'Lomakkeella antamasi yritys, nimi, sähköpostiosoite, verkkosivu tai Instagram-profiili sekä valinnaiset puhelin- ja viestitiedot. Palvelun suojaamiseksi käsittelemme lyhytaikaisesti myös teknisiä pyyntötietoja väärinkäytösten rajoittamiseen.',
  },
  {
    title: '4. Tietolähteet ja vastaanottajat',
    content: 'Tiedot saadaan sinulta. Tietoja voivat käsitellä Ghoulhousen lukuun sivuston hosting- ja viestinvälityspalvelut vain palvelun toteuttamisen edellyttämässä laajuudessa. Emme myy henkilötietoja.',
  },
  {
    title: '5. Säilytys',
    content: 'Säilytämme yhteydenottotietoja vain niin kauan kuin pyynnön käsittely, mahdollinen asiakassuhde tai lakisääteinen velvollisuus sitä edellyttää. Tarpeettomat tiedot poistetaan.',
  },
  {
    title: '6. Oikeutesi',
    content: 'Voit pyytää pääsyä tietoihisi, niiden oikaisua tai poistamista, käsittelyn rajoittamista tai vastustaa käsittelyä sovellettavan lain mukaisesti. Voit myös tehdä valituksen valvontaviranomaiselle.',
  },
] as const;

export default function PrivacyPage() {
  return (
    <>
      <header className="border-b border-ink/20 bg-paper">
        <Container className="flex min-h-[72px] items-center justify-between gap-4">
          <Link href="/" aria-label="GhoulHouse — etusivu">
            <Image src="/logo-horizontal.svg" alt="GhoulHouse" width={1400} height={460} priority className="h-[38px] w-auto sm:h-[46px]" />
          </Link>
          <Link href="/" className="type-ui uppercase text-ink underline underline-offset-4">Etusivulle</Link>
        </Container>
      </header>
      <main className="bg-paper py-14 text-ink md:py-20">
        <Container>
          <div className="max-w-3xl">
            <p className="type-label text-signal">Juridinen / päivitetty 3.9.2026</p>
            <h1 className="type-section-title mt-4 text-ink">Tietosuojaseloste</h1>
            <p className="type-editorial mt-6 text-muted">Tämä seloste koskee ghoulhouse.fi-sivuston yhteydenotto- ja demopyyntöjä.</p>
            <div className="mt-10 border-t border-ink">
              {sections.map((section) => (
                <section key={section.title} className="border-b border-ink/20 py-6">
                  <h2 className="text-xl font-black uppercase tracking-[-0.02em]">{section.title}</h2>
                  <p className="mt-3 max-w-2xl leading-7 text-muted">{section.content}</p>
                </section>
              ))}
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
