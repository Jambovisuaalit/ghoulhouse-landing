import Image from 'next/image';
import Container from '@/components/ui/Container';

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
                width={1400}
                height={460}
                priority
                className="h-[38px] w-auto sm:h-[48px]"
              />
            </a>

            <div className="hidden items-center gap-6 lg:flex">
              {navItems.map(([label, href]) => (
                <a key={href} href={href} className="type-ui uppercase text-ink hover:text-signal">
                  {label}
                </a>
              ))}
            </div>

            <a className="nav-cta btn btn-primary min-h-11 px-4 text-[0.68rem] sm:px-5 sm:text-[0.72rem]" href="#laheta-kuvat">
              <span className="hidden sm:inline">LÄHETÄ 2 TYÖKUVAA</span>
              <span className="sm:hidden">LÄHETÄ KUVAT</span>
            </a>
          </nav>
        </Container>
      </header>
    </div>
  );
}
