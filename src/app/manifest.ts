import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'GhoulHouse',
    short_name: 'GhoulHouse',
    description: 'Työmaakuvat sisään. Valmis some ulos.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F7F4EF',
    theme_color: '#111111',
    icons: [
      { src: '/brand/ghoulhouse-micro-primary.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  };
}
