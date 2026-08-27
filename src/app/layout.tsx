import type { Metadata, Viewport } from 'next';
import './globals.css';

const siteUrl = 'https://ghoulhouse.fi';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'GhoulHouse Oy | Työmaakuvat sisään. Valmis some ulos.',
  description:
    'GhoulHouse Oy muuttaa remontti- ja korjausrakentamisen yritysten työmaakuvat 12 valmiiksi Instagram- ja Facebook-sisällöksi 30 päivän palvelujaksolle.',
  applicationName: 'GhoulHouse Oy',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'GhoulHouse Oy | Työmaakuvat sisään. Valmis some ulos.',
    description:
      'Työmaakuvista 12 valmista Instagram- ja Facebook-sisältöä 30 päivän palvelujaksolle.',
    url: '/',
    siteName: 'GhoulHouse Oy',
    locale: 'fi_FI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GhoulHouse Oy | Työmaakuvat sisään. Valmis some ulos.',
    description:
      'Työmaakuvista 12 valmista Instagram- ja Facebook-sisältöä 30 päivän palvelujaksolle.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#111111',
  colorScheme: 'light',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fi">
      <body>{children}</body>
    </html>
  );
}
