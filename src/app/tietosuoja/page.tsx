import type { Metadata } from 'next';
import Container from '@/components/ui/Container';
import PageIntro from '@/components/ui/PageIntro';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Tietosuoja — GhoulHouse',
  description: 'Tietoa siitä, miten GhoulHouse käsittelee verkkosivun kautta annettuja henkilötietoja.',
  alternates: { canonical: '/tietosuoja' },
};

export default function PrivacyPage() {
  return (
    <main id="main-content" className="min-h-screen bg-ghost">
      <PageIntro
        eyebrow="Legal"
        title="TIETOSUOJA"
        description="Tämä seloste kuvaa verkkosivun yhteydenotto- ja sisältöesimerkkipyyntöjen yhteydessä tapahtuvaa henkilötietojen käsittelyä."
      />
      <section className="border-b-2 border-ink py-12 md:py-16">
        <Container className="max-w-4xl">
          <div className="type-editorial space-y-8 text-ink/70">
            <section><h2 className="text-2xl font-extrabold uppercase text-ink">Rekisterinpitäjä</h2><p className="mt-3">{siteConfig.company.legalName}, Helsinki, Suomi. Tietosuoja-asioissa yhteydenotto voidaan tehdä sivuston yhteydenottokanavan kautta.</p></section>
            <section><h2 className="text-2xl font-extrabold uppercase text-ink">Mitä tietoja käsitellään</h2><p className="mt-3">Yrityksen nimi, yhteyshenkilön nimi, sähköposti, verkkosivu tai Instagram-profiili sekä vapaaehtoisesti puhelinnumero ja viesti.</p></section>
            <section><h2 className="text-2xl font-extrabold uppercase text-ink">Käyttötarkoitus</h2><p className="mt-3">Tietoja käytetään sisältöesimerkkipyynnön käsittelyyn, siihen liittyvään yhteydenottoon sekä mahdollisen asiakassuhteen valmisteluun.</p></section>
            <section><h2 className="text-2xl font-extrabold uppercase text-ink">Säilytys ja oikeudet</h2><p className="mt-3">Tietoja säilytetään vain tarpeellisen ajan. Voit pyytää pääsyä tietoihisi, niiden oikaisua tai poistamista sekä käyttää muita soveltuvan tietosuojalainsäädännön mukaisia oikeuksiasi.</p></section>
          </div>
        </Container>
      </section>
    </main>
  );
}
