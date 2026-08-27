import Link from 'next/link';
import Container from '@/components/ui/Container';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink text-ghost border-t border-signal">
      <Container className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold text-signal mb-4">GhoulHouse</h3>
            <p className="text-ghost/80 text-sm leading-relaxed">
              Muutamme työmaakuvasi valmiiksi some-sisällöksi.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-ghost mb-4">Pika­linkit</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#problem" className="text-ghost/70 hover:text-signal transition-colors">
                  Ongelma
                </a>
              </li>
              <li>
                <a href="#mechanism" className="text-ghost/70 hover:text-signal transition-colors">
                  Miten se toimii
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-ghost/70 hover:text-signal transition-colors">
                  Hinta
                </a>
              </li>
              <li>
                <a href="#faq" className="text-ghost/70 hover:text-signal transition-colors">
                  UKK
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-ghost mb-4">Yhteystiedot</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-ghost/70">
                <a href="mailto:hei@ghoulhouse.fi" className="hover:text-signal transition-colors">
                  hei@ghoulhouse.fi
                </a>
              </li>
              <li className="text-ghost/70">Helsinki, Suomi</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold text-ghost mb-4">Seuraa meitä</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://instagram.com/ghoulhousefinland"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ghost/70 hover:text-signal transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/company/ghoulhouse"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ghost/70 hover:text-signal transition-colors"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-ghost/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p className="text-ghost/60">
            © {currentYear} GhoulHouse Oy. Kaikki oikeudet pidätetään.
          </p>
          <div className="flex gap-6 text-ghost/60">
            <a href="/privacy" className="hover:text-signal transition-colors">
              Tietosuoja
            </a>
            <a href="/terms" className="hover:text-signal transition-colors">
              Käyttöehdot
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
