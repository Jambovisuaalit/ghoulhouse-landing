import { ImageResponse } from 'next/og';

export const alt = 'GhoulHouse — Työmaakuvat sisään. Valmis some ulos.';
export const size = { width: 1200, height: 630 };
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
          background: '#F3EEE5',
          color: '#161411',
          padding: '54px 64px',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', fontSize: 22, fontWeight: 800, letterSpacing: '-0.035em' }}>GhoulHouse</div>
          <div style={{ display: 'flex', fontSize: 17, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8C8278' }}>ghoulhouse.fi</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'stretch', gap: 28 }}>
          <div style={{ width: 8, background: '#C83830' }} />
          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 960 }}>
            <div style={{ display: 'flex', fontSize: 82, lineHeight: 0.9, fontWeight: 900, letterSpacing: '-0.05em', textTransform: 'uppercase' }}>TYÖMAAKUVAT SISÄÄN.</div>
            <div style={{ display: 'flex', fontSize: 82, lineHeight: 0.9, fontWeight: 900, letterSpacing: '-0.05em', textTransform: 'uppercase', color: '#C83830' }}>VALMIS SOME ULOS.</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderTop: '1px solid #161411', paddingTop: 22 }}>
          <div style={{ display: 'flex', maxWidth: 700, fontSize: 24, lineHeight: 1.35 }}>12 sisältöä / 30 päivää · Instagram + Facebook</div>
          <div style={{ display: 'flex', fontSize: 28, fontWeight: 800 }}>490 € + ALV</div>
        </div>
      </div>
    ),
    size
  );
}
