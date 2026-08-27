import type { Metadata, Viewport } from 'next';
import './globals.css';

const siteUrl = 'https://ghoulhouse.fi';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'GhoulHouse | Työmaakuvat sisään. Valmis some ulos.',
    template: '%s | GhoulHouse',
  },
  description:
    'GhoulHouse muuttaa työmaa- ja referenssikuvat valmiiksi Instagram- ja Facebook-sisällöiksi suomalaisille remontti- ja palveluyrityksille.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'GhoulHouse | Työmaakuvat sisään. Valmis some ulos.',
    description: 'Teette hyvää työtä. Me pidämme huolen, että asiakkaat myös näkevät sen.',
    url: siteUrl,
    siteName: 'GhoulHouse',
    locale: 'fi_FI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GhoulHouse | Työmaakuvat sisään. Valmis some ulos.',
    description: 'Teette hyvää työtä. Me pidämme huolen, että asiakkaat myös näkevät sen.',
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fi">
      <body>{children}</body>
    </html>
  );
}
