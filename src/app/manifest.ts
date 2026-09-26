import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'GhoulHouse',
    short_name: 'GhoulHouse',
    description: 'Työmaakuvat sisään. Valmis some ulos.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F7F4EF',
    theme_color: '#F7F4EF',
    icons: [
      { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/brand-icons/192', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/brand-icons/512', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  };
}
