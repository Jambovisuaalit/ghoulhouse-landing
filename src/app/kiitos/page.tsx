import type { Metadata } from 'next';
import Link from 'next/link';
import Container from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Kiitos | GhoulHouse',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-black py-20 text-white">
      <Container>
        <p className="type-label text-signal">Pyyntö vastaanotettu</p>
        <h1 className="type-display mt-5 max-w-[10ch] text-white">
          KIITOS.
          <span className="block text-signal">SEURAAVAKSI KUVAT.</span>
        </h1>
        <p className="type-editorial mt-7 max-w-2xl text-white/70">
          Käymme yrityksesi tiedot läpi ja sovimme kahden työkuvan toimitustavan vastausviestissä.
        </p>
        <Link href="/" className="btn btn-inverse mt-8 w-auto">
          TAKAISIN ETUSIVULLE
        </Link>
      </Container>
    </main>
  );
}
