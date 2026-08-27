import type { Metadata, Viewport } from 'next';
import { Anton } from 'next/font/google';
import { siteConfig } from '@/config/site';
import './globals.css';

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GhoulHouse — Työmaakuvat sisään. Valmis some ulos.',
  description:
    'GhoulHouse tekee työmaamateriaalista 12 valmista Instagram- ja Facebook-sisältöä 30 päiväksi. START 490 € + ALV.',
  metadataBase: new URL(siteConfig.company.domain),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'GhoulHouse — Työmaakuvat sisään. Valmis some ulos.',
    description:
      'Teette hyvää työtä. Me pidämme huolen, että asiakkaat myös näkevät sen.',
    url: '/',
    siteName: 'GhoulHouse',
    locale: 'fi_FI',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'GhoulHouse — Työmaakuvat sisään. Valmis some ulos.',
    description:
      'Teette hyvää työtä. Me pidämme huolen, että asiakkaat myös näkevät sen.',
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

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.company.legalName,
  url: siteConfig.company.domain,
  founder: {
    '@type': 'Person',
    name: siteConfig.company.founder,
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Helsinki',
    addressCountry: 'FI',
  },
  areaServed: {
    '@type': 'Country',
    name: 'Finland',
  },
  description:
    'Tuotteistettu sosiaalisen median sisältö- ja hallintapalvelu suomalaisille paikallisille palveluyrityksille.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fi">
      <body className={anton.variable}>
        {children}
        <script
          id="ghoulhouse-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
