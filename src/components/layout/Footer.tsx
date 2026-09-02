import Image from 'next/image';
import Container from '@/components/ui/Container';
import { siteConfig } from '@/config/site';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/20 bg-black py-12 text-white">
      <Container>
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Image src="/logo-horizontal-white.svg" alt="GhoulHouse" width={1400} height={460} className="h-auto w-[220px]" />
            <p className="mt-6 max-w-md text-sm leading-6 text-white/55">
              Työmaakuvista suunnitelmallinen ja julkaisuvalmis sisältökuukausi Instagramiin ja Facebookiin.
            </p>
          </div>
          <div className="md:col-span-3 md:col-start-7">
            <p className="type-label text-signal">Yritys</p>
            <div className="mt-4 space-y-2 text-sm font-bold text-white/70">
              <p>{siteConfig.company.legalName}</p>
              <p>Y-tunnus {siteConfig.company.businessId}</p>
              <p>Kotipaikka {siteConfig.company.domicile}</p>
              <p className="text-white/65">{siteConfig.company.registrationStatus}</p>
            </div>
          </div>
          <div className="md:col-span-3">
            <p className="type-label text-signal">Linkit</p>
            <div className="mt-4 space-y-2 text-sm font-bold text-white/70">
              <p><a className="footer-link" href="/#yhteydenotto">Yhteydenotto</a></p>
              <p><a className="footer-link" href="/#hinta">Palvelun sisältö ja hinta</a></p>
              <p><a className="footer-link" href={siteConfig.legal.privacyPath}>Tietosuojaseloste</a></p>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-white/20 pt-5 text-xs font-bold uppercase tracking-[0.1em] text-white/65">
          © {year} {siteConfig.company.legalName}
        </div>
      </Container>
    </footer>
  );
}
