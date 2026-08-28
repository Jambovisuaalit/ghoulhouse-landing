import Image from 'next/image';
import Container from '@/components/ui/Container';
import ContactTrigger from '@/components/contact/ContactTrigger';
import { siteConfig } from '@/config/site';

export default function Footer() {
  const { contact } = siteConfig;
  const hasDirectContact = Boolean(contact.email || contact.phone || contact.instagramUrl);
  const phoneHref = contact.phone ? `tel:${contact.phone.replace(/[^+\d]/g, '')}` : null;

  return (
    <footer className="border-t-2 border-signal bg-ink text-ghost">
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          <div className="md:col-span-2 lg:col-span-5">
            <div className="inline-flex items-center gap-3" aria-label="GhoulHouse">
              <Image
                src="/mark-white.svg"
                alt=""
                width={112}
                height={112}
                className="h-12 w-12 shrink-0 sm:h-14 sm:w-14"
              />
              <span className="font-display text-[2rem] uppercase leading-none tracking-[-0.025em] text-ghost sm:text-[2.35rem]">
                GhoulHouse
              </span>
            </div>
            <p className="type-caption mt-6 max-w-md text-ghost/70">
              Tuotteistettu sosiaalisen median sisältö- ja hallintapalvelu suomalaisille
              paikallisille palveluyrityksille.
            </p>
          </div>

          <div className="lg:col-span-2">
            <p className="type-label mb-4 text-signal-on-dark">Sivusto</p>
            <ul className="type-ui space-y-3 text-ghost/75">
              <li>
                <a href="#mechanism">Näin toimii</a>
              </li>
              <li>
                <a href="#deliverables">Mitä saat</a>
              </li>
              <li>
                <a href="#pricing">Hinta</a>
              </li>
              <li>
                <a href="#faq">UKK</a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <p className="type-label mb-4 text-signal-on-dark">Yhteys</p>
            <div className="type-ui space-y-3 text-ghost/75">
              {contact.email && (
                <a className="block" href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
              )}
              {contact.phone && phoneHref && (
                <a className="block" href={phoneHref}>
                  {contact.phone}
                </a>
              )}
              {contact.instagramUrl && (
                <a className="block" href={contact.instagramUrl} target="_blank" rel="noreferrer">
                  Instagram ↗
                </a>
              )}
              {!hasDirectContact && (
                <ContactTrigger className="type-cta inline-flex min-h-11 items-center gap-2 text-ghost underline decoration-signal decoration-2 underline-offset-4 hover:text-white">
                  <span>Pyydä 2 sisältöesimerkkiä</span>
                  <span aria-hidden="true">→</span>
                </ContactTrigger>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <p className="type-label mb-4 text-signal-on-dark">Yritys</p>
            <div className="type-ui space-y-2 text-ghost/75">
              <p>{siteConfig.company.legalName}</p>
              <p>{siteConfig.company.founder} · Founder</p>
              <p>{siteConfig.company.location}</p>
              <a className="block" href="https://ghoulhouse.fi">
                ghoulhouse.fi
              </a>
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
