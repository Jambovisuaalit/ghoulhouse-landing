import Image from 'next/image';
import Container from '@/components/ui/Container';
import { siteConfig } from '@/config/site';

export default function Footer() {
  return (
    <footer className="border-t border-signal bg-ink text-ghost">
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-6">
            <Image
              src="/logo-horizontal-white.svg"
              alt="GhoulHouse"
              width={1400}
              height={460}
              className="h-auto w-[220px] sm:w-[260px]"
            />
            <p className="type-caption mt-6 max-w-md text-ghost/70">
              Tuotteistettu sosiaalisen median sisällöntuotanto- ja
              ylläpitopalvelu Uudenmaan remontti- ja korjausrakentamisen
              yrityksille. Työmaa- ja referenssikuvista valmiit Instagram- ja
              Facebook-sisällöt.
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="type-label mb-4 text-signal">Sivusto</p>
            <ul className="type-ui space-y-3 text-ghost/75">
              <li><a href="#kenelle">Kenelle</a></li>
              <li><a href="#mechanism">Näin toimii</a></li>
              <li><a href="#deliverables">Mitä saat</a></li>
              <li><a href="#pricing">Hinta</a></li>
              <li><a href="#faq">UKK</a></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="type-label mb-4 text-signal">Yritys</p>
            <div className="type-ui space-y-2 text-ghost/75">
              <p>{siteConfig.company.legalName}</p>
              <p>{siteConfig.company.founder} · Perustaja</p>
              <p>{siteConfig.company.location}</p>
              <p>ghoulhouse.fi</p>
            </div>
          </div>
        </div>

        <div className="type-caption mt-12 flex flex-col gap-3 border-t border-ghost/20 pt-6 text-ghost/65 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <p>© 2026 {siteConfig.company.legalName}</p>
            {siteConfig.legal.privacyPath && (
              <a
                href={siteConfig.legal.privacyPath}
                className="font-bold uppercase tracking-[0.1em] text-ghost/70 hover:text-ghost"
              >
                Tietosuoja
              </a>
            )}
            {siteConfig.legal.termsPath && (
              <a
                href={siteConfig.legal.termsPath}
                className="font-bold uppercase tracking-[0.1em] text-ghost/70 hover:text-ghost"
              >
                Ehdot
              </a>
            )}
          </div>
          <a href="#top" className="font-bold uppercase tracking-[0.12em] text-ghost/70">
            Takaisin ylös ↑
          </a>
        </div>
      </Container>
    </footer>
  );
}
