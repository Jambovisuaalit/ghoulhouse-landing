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
      { src: '/android-chrome-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/android-chrome-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  };
}
