import Image from 'next/image';
import Container from '@/components/ui/Container';
import { siteConfig } from '@/config/site';

const navItems = [
  ['Palvelu', '#palvelu'],
  ['Miten toimii', '#miten-toimii'],
  ['Hinta', '#hinta'],
  ['Esimerkit', '#esimerkit'],
  ['UKK', '#faq'],
] as const;

export default function Navigation() {
  return (
    <div className="nav-slot">
      <header className="nav-shell">
        <Container>
          <nav className="flex min-h-[72px] items-center justify-between gap-3 sm:gap-5" aria-label="Päänavigaatio">
            <a href="#top" className="shrink-0" aria-label="GhoulHouse — sivun alku">
              <span className="sr-only">GhoulHouse</span>
              <Image
                src="/logo-horizontal.svg"
                alt="GhoulHouse"
                width={1280}
                height={260}
                priority
                className="h-[34px] w-auto sm:h-[42px]"
              />
            </a>

            <div className="hidden items-center gap-6 lg:flex">
              {navItems.map(([label, href]) => (
                <a key={href} href={href} className="type-ui uppercase text-ink hover:text-signal">
                  {label}
                </a>
              ))}
            </div>

            <a
              className="nav-cta btn btn-primary min-h-11 px-3 text-[0.64rem] sm:px-4 sm:text-[0.7rem]"
              href="#laheta-kuvat"
              aria-label={siteConfig.cta.primary}
            >
              <span className="hidden md:inline">{siteConfig.cta.primary}</span>
              <span className="md:hidden">2 ESIMERKKIÄ</span>
            </a>
          </nav>
        </Container>
      </header>
    </div>
  );
}
