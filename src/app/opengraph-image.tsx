import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'GhoulHouse — Työmaakuvat sisään. Valmis some ulos.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#111111',
          color: '#F7F4EF',
          padding: '64px',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, fontWeight: 700, letterSpacing: '0.12em' }}>
          <span>GHOULHOUSE</span>
          <span style={{ color: '#C9282D' }}>HELSINKI</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 88, lineHeight: 0.88, fontWeight: 900, letterSpacing: '-0.055em' }}>
          <span>TYÖMAAKUVAT SISÄÄN.</span>
          <span style={{ color: '#C9282D' }}>VALMIS SOME ULOS.</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 26 }}>
          <span>12 sisältöä / 30 päivää · Instagram + Facebook</span>
          <span>490 € + ALV</span>
        </div>
      </div>
    ),
    size
  );
}
