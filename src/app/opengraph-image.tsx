import { ImageResponse } from 'next/og';

export const alt = 'GhoulHouse — Työmaakuvat sisään. Valmis some ulos.';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px',
          background: '#111111',
          color: '#F7F4EF',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            color: '#C9282D',
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: 3,
            textTransform: 'uppercase',
          }}
        >
          GhoulHouse
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: 82,
            fontWeight: 900,
            lineHeight: 0.94,
          }}
        >
          <span>TYÖMAAKUVAT SISÄÄN.</span>
          <span style={{ color: '#C9282D' }}>VALMIS SOME ULOS.</span>
        </div>

        <div style={{ display: 'flex', fontSize: 26, opacity: 0.78 }}>
          12 sisältöä / 30 päivää · Instagram + Facebook
        </div>
      </div>
    ),
    size
  );
}
