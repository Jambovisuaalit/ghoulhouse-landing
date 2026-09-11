import type { Metadata, Viewport } from 'next';
import { Anton, Montserrat } from 'next/font/google';
import { siteConfig } from '@/config/site';
import PlausibleAnalytics from '@/components/analytics/PlausibleAnalytics';
import './globals.css';
import './brand-v5.css';
import './design-system-1-1-1.css';

const anton = Anton({ weight: '400', subsets: ['latin'], variable: '--font-display', display: 'swap' });
const montserrat = Montserrat({ weight: ['400', '500', '600', '700', '800', '900'], subsets: ['latin'], variable: '--font-body', display: 'swap' });

const title = 'GhoulHouse | Työmaakuvat sisään. Valmis some ulos.';
const description = 'GhoulHouse tekee remontti- ja rakennusyritysten työmaakuvista valmista Instagram- ja Facebook-sisältöä. 12 sisältöä / 30 päivää, 490 € + ALV.';
const indexable = process.env.VERCEL_ENV === 'production';

export const metadata: Metadata = {
  metadataBase: new URL('https://ghoulhouse.fi'),
  title,
  description,
  applicationName: 'GhoulHouse',
  creator: siteConfig.company.legalName,
  publisher: siteConfig.company.legalName,
  alternates: { canonical: '/' },
  robots: indexable ? { index: true, follow: true } : { index: false, follow: false, nocache: true },
  openGraph: {
    title,
    description,
    url: '/',
    siteName: 'GhoulHouse',
    locale: 'fi_FI',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'GhoulHouse — Työmaakuvat sisään. Valmis some ulos.' }],
  },
  twitter: { card: 'summary_large_image', title, description, images: ['/opengraph-image'] },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#F3EEE5',
  colorScheme: 'light',
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.company.legalName,
  alternateName: siteConfig.company.brand,
  url: 'https://ghoulhouse.fi',
  foundingDate: siteConfig.company.registrationDate,
  identifier: { '@type': 'PropertyValue', name: 'Y-tunnus', value: siteConfig.company.businessId },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fi">
      <body className={`${anton.variable} ${montserrat.variable}`}>
        {children}
        <PlausibleAnalytics />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </body>
    </html>
  );
}
