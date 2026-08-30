import Image from 'next/image';
import Container from '@/components/ui/Container';

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
              <p>GhoulHouse Oy</p>
              <p>ghoulhouse.fi</p>
              <p>Yhteystiedot: [TARKISTA]</p>
            </div>
          </div>
          <div className="md:col-span-3">
            <p className="type-label text-signal">Juridinen</p>
            <div className="mt-4 space-y-2 text-sm font-bold text-white/70">
              <p>Tietosuojaseloste: [TARKISTA URL]</p>
              <p>Palveluehdot / scope: [TARKISTA URL]</p>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-white/20 pt-5 text-xs font-bold uppercase tracking-[0.1em] text-white/40">
          © {year} GhoulHouse Oy
        </div>
      </Container>
    </footer>
  );
}
