import Container from '@/components/ui/Container';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink text-ghost border-t border-signal">
      <Container className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold text-signal mb-4">GhoulHouse Oy</h3>
            <p className="text-ghost/80 text-sm leading-relaxed">
              Työmaakuvista valmista Instagram- ja Facebook-sisältöä.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-ghost mb-4">Pikalinkit</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#problem" className="text-ghost/70 hover:text-signal transition-colors">Ongelma</a></li>
              <li><a href="#mechanism" className="text-ghost/70 hover:text-signal transition-colors">Miten se toimii</a></li>
              <li><a href="#pricing" className="text-ghost/70 hover:text-signal transition-colors">Hinta</a></li>
              <li><a href="#faq" className="text-ghost/70 hover:text-signal transition-colors">UKK</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-ghost mb-4">Yhteystiedot</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:hanna.n-96@hotmail.com" className="text-ghost/70 hover:text-signal transition-colors">
                  hanna.n-96@hotmail.com
                </a>
              </li>
              <li className="text-ghost/70">Helsinki, Suomi</li>
              <li className="text-ghost/70">ghoulhouse.fi</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-ghost/20 pt-8 text-sm text-ghost/60">
          <p>© {currentYear} GhoulHouse Oy. Kaikki oikeudet pidätetään.</p>
        </div>
      </Container>
    </footer>
  );
}
