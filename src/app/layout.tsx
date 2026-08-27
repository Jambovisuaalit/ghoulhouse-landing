import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GhoulHouse | Työmaakuvat sisään. Valmis SOME ulos.',
  description: 'GhoulHouse muuttaa työmaakuvasi valmiiksi some-sisällöksi. Suomalaisten palveluyrityksia varten.',
  metadataBase: new URL('https://ghoulhouse.fi'),
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
  canonical: 'https://ghoulhouse.fi',
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
      </head>
      <body>{children}</body>
    </html>
  );
}
