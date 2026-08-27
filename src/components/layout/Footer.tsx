import Container from '@/components/ui/Container';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-signal bg-ink text-ghost">
      <Container className="py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-3 text-lg font-bold text-signal">GhoulHouse</h3>
            <p className="max-w-sm text-sm leading-relaxed text-ghost/75">
              Työmaakuvat sisään. Valmis some ulos.
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-bold text-ghost">Palvelu</h4>
            <p className="text-sm text-ghost/70">
              12 sisältöä / 30 päivää
              <br />
              Instagram + Facebook
              <br />
              490 € + ALV
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-bold text-ghost">Pikalinkit</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#examples" className="text-ghost/70 transition-colors hover:text-signal">
                  Esimerkit
                </a>
              </li>
              <li>
                <a href="#process" className="text-ghost/70 transition-colors hover:text-signal">
                  Prosessi
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-ghost/70 transition-colors hover:text-signal">
                  Hinta
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-ghost/20 pt-6 text-sm text-ghost/55">
          © {currentYear} GhoulHouse Oy
        </div>
      </Container>
    </footer>
  );
}
