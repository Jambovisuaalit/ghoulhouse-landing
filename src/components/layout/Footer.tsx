import Image from 'next/image';
import Container from '@/components/ui/Container';
import { siteConfig } from '@/config/site';

export default function Footer() {
  return (
    <footer className="border-t-2 border-signal bg-ink text-ghost">
      <Container className="py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-6">
            <Image
              src="/logo-horizontal-white.svg"
              alt="GhoulHouse"
              width={1400}
              height={460}
              className="h-auto w-[220px] md:w-[280px]"
            />
            <p className="mt-6 max-w-md text-sm leading-relaxed text-ghost/70">
              Tuotteistettu sosiaalisen median sisältö- ja hallintapalvelu
              suomalaisille paikallisille palveluyrityksille.
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-signal">
              Sivusto
            </p>
            <ul className="space-y-3 text-sm text-ghost/75">
              <li><a href="#mechanism">Näin toimii</a></li>
              <li><a href="#deliverables">Mitä saat</a></li>
              <li><a href="#pricing">Hinta</a></li>
              <li><a href="#faq">UKK</a></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-signal">
              Yritys
            </p>
            <div className="space-y-2 text-sm text-ghost/75">
              <p>{siteConfig.company.legalName}</p>
              <p>{siteConfig.company.founder} · Founder</p>
              <p>{siteConfig.company.location}</p>
              <p>ghoulhouse.fi</p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-ghost/20 pt-6 text-xs text-ghost/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {siteConfig.company.legalName}</p>
          <a href="#top" className="font-bold uppercase tracking-[0.12em] text-ghost/70">
            Takaisin ylös ↑
          </a>
        </div>
      </Container>
    </footer>
  );
}
