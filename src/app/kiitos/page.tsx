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

type ConfirmationQuery = { intent?: string; service?: string };

const proposals = {
  websites: {
    heading: 'VERKKOSIVUT.',
    copy: 'Verkkosivuja koskeva ehdotuspyyntösi on vastaanotettu. Käymme läpi yrityksesi tiedot ja mahdollisen nykyisen sivuston sekä otamme yhteyttä sopiaksemme seuraavasta askeleesta.',
  },
  social: {
    heading: 'SOME-EHDOTUS.',
    copy: 'Some-sisällöntuotantoa koskeva ehdotuspyyntösi on vastaanotettu. Käymme läpi yrityksesi tiedot ja otamme yhteyttä sopiaksemme seuraavasta askeleesta.',
  },
  seo: {
    heading: 'HAKUNÄKYVYYS.',
    copy: 'Hakukonenäkyvyyttä koskeva ehdotuspyyntösi on vastaanotettu. Käymme läpi yrityksesi tiedot ja otamme yhteyttä sopiaksemme seuraavasta askeleesta.',
  },
} as const;

export default async function ThankYouPage({ searchParams }: { searchParams: Promise<ConfirmationQuery> }) {
  const params = await searchParams;
  const proposal = params.intent === 'booking';
  const photos = params.intent === 'photos';
  const service = params.service;
  const serviceCopy = proposal && (service === 'websites' || service === 'social' || service === 'seo')
    ? proposals[service]
    : null;
  const heading = photos ? 'SEURAAVAKSI KUVAT.' : serviceCopy?.heading ?? 'SEURAAVA ASKEL.';
  const copy = photos
    ? 'Pyyntösi kahdesta sisältöesimerkistä on vastaanotettu. Käymme yrityksesi tiedot läpi ja sovimme kahden työkuvan toimitustavan vastausviestissä.'
    : serviceCopy?.copy ?? 'Yhteydenottopyyntösi on vastaanotettu. Käymme yrityksesi tiedot läpi ja otamme yhteyttä sopiaksemme seuraavasta askeleesta.';

  return (
    <main className="min-h-screen bg-black py-20 text-white">
      <Container>
        <p className="type-label text-signal">Pyyntö vastaanotettu</p>
        <h1 className="type-display mt-5 max-w-[10ch] text-white">
          KIITOS.
          <span className="block text-signal">{heading}</span>
        </h1>
        <p className="type-editorial mt-7 max-w-2xl text-white/70">{copy}</p>
        <Link href="/" className="btn btn-inverse mt-8 w-auto">
          TAKAISIN ETUSIVULLE
        </Link>
      </Container>
    </main>
  );
}
