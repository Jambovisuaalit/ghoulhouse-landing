import Image from 'next/image';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import { siteConfig } from '@/config/site';

export default function Footer() {
  return (
    <footer className="border-t-2 border-signal bg-ink text-ghost">
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-6">
            <Link href="/" className="inline-flex" aria-label="GhoulHouse — etusivu">
              <Image
                src="/logo-horizontal-white.svg"
                alt="GhoulHouse"
                width={1400}
                height={460}
                className="h-auto w-[190px] sm:w-[230px]"
              />
            </Link>
            <p className="type-caption mt-6 max-w-md text-ghost/70">
              Tuotteistettu sosiaalisen median sisältö- ja hallintapalvelu suomalaisille paikallisille palveluyrityksille.
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="type-label mb-4 text-signal">Sivusto</p>
            <ul className="type-ui space-y-3 text-ghost/75">
              <li><Link href="/some-12">Some 12</Link></li>
              <li><Link href="/miten-toimii">Miten toimii</Link></li>
              <li><Link href="/caset">Caset</Link></li>
              <li><Link href="/meista">Meistä</Link></li>
              <li><Link href="/yhteys">Yhteys</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="type-label mb-4 text-signal">Yritys</p>
            <div className="type-ui space-y-2 text-ghost/75">
              <p>{siteConfig.company.legalName}</p>
              <p>{siteConfig.company.founder} · Founder</p>
              <p>{siteConfig.company.location}</p>
              <p>ghoulhouse.fi</p>
            </div>
          </div>
        </div>

        <div className="type-caption mt-12 flex flex-col gap-3 border-t border-ghost/20 pt-6 text-ghost/65 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <p>© 2026 {siteConfig.company.legalName}</p>
            <Link href={siteConfig.legal.privacyPath} className="font-bold uppercase tracking-[0.1em] text-ghost/70 hover:text-ghost">Tietosuoja</Link>
            <Link href={siteConfig.legal.cookiesPath} className="font-bold uppercase tracking-[0.1em] text-ghost/70 hover:text-ghost">Evästeet</Link>
            <Link href={siteConfig.legal.termsPath} className="font-bold uppercase tracking-[0.1em] text-ghost/70 hover:text-ghost">Käyttöehdot</Link>
          </div>
          <Link href="/" className="font-bold uppercase tracking-[0.12em] text-ghost/70">Etusivu ↑</Link>
        </div>
      </Container>
    </footer>
  );
}
