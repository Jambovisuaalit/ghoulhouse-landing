import type { Metadata, Viewport } from 'next';
import './globals.css';
import { siteConfig } from '@/lib/site';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#111111',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.title,
  description: siteConfig.description,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    url: '/',
    title: siteConfig.title,
    description: siteConfig.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
  },
  icons: {
    icon: [{ url: '/brand/ghoulhouse-micro-primary.svg', type: 'image/svg+xml' }],
  },
  robots: { index: true, follow: true },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.legalName,
  url: siteConfig.url,
  founder: { '@type': 'Person', name: siteConfig.founder },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Helsinki',
    addressCountry: 'FI',
  },
  logo: `${siteConfig.url}/brand/ghoulhouse-lockup-horizontal-primary.svg`,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fi">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </body>
    </html>
  );
}
