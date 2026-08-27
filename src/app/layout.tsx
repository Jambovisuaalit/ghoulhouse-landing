import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GhoulHouse | Työmaakuvat sisään. Valmis SOME ulos.',
  description: 'GhoulHouse muuttaa työmaakuvasi valmiiksi some-sisällöksi. Suomalaisten palveluyrityksia varten.',
  metadataBase: new URL('https://ghoulhouse.fi'),
  alternates: {
    canonical: 'https://ghoulhouse.fi',
  },
  openGraph: {
    title: 'GhoulHouse | Työmaakuvat sisään. Valmis SOME ulos.',
    description: 'Teette hyvää työtä. Me pidämme huolen, että asiakkaat myös näkevät sen.',
    url: 'https://ghoulhouse.fi',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GhoulHouse | Työmaakuvat sisään. Valmis SOME ulos.',
    description: 'Teette hyvää työtä. Me pidämme huolen, että asiakkaat myös näkevät sen.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fi">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#111111" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: 'GhoulHouse Oy',
              url: 'https://ghoulhouse.fi',
              areaServed: 'FI',
              serviceType: 'Social Media Management',
              description: 'Productized social media content creation for Finnish local service businesses',
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
