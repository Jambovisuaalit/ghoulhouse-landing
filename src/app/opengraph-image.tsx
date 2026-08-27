/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og';

export const alt = 'GhoulHouse — Työmaakuvat sisään. Valmis some ulos.';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

const markSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <g stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round">
    <path d="M256 28 484 256 256 484 28 256Z" stroke-width="16"/>
    <path d="M132 229C169 211 201 183 226 151L257 112 289 153C315 184 346 211 381 229L355 241 334 220H178L157 241Z" stroke-width="12"/>
    <path d="M178 223 188 342H324L334 223" stroke-width="12"/>
    <path d="M219 342C224 365 216 383 201 399L203 430M293 342C288 366 297 384 312 399L309 430" stroke-width="13"/>
    <path d="M203 430 176 445M203 430 205 457M203 430 229 446M309 430 282 446M309 430 307 457M309 430 337 444" stroke-width="12"/>
    <path d="M286 342V279C286 267 293 260 301 260S316 267 316 279V342" stroke-width="10"/>
    <rect x="202" y="252" width="66" height="62" fill="#C9282D" stroke-width="11"/>
    <path d="M235 254V312M204 283H266" stroke-width="7"/>
    <path d="M190 328 266 322M190 299 202 298M270 321 282 320" stroke-width="7"/>
  </g>
</svg>
`;

const markDataUrl = `data:image/svg+xml,${encodeURIComponent(markSvg)}`;

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
          background: '#111111',
          color: '#F7F4EF',
          padding: '56px 64px',
          fontFamily: 'Arial, Helvetica, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <img src={markDataUrl} alt="" width="92" height="92" />
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#E6DFD5',
            }}
          >
            ghoulhouse.fi
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 78,
              lineHeight: 0.94,
              fontWeight: 900,
              letterSpacing: '-0.045em',
              textTransform: 'uppercase',
              maxWidth: 930,
            }}
          >
            TYÖMAAKUVAT SISÄÄN.
          </div>
          <div
            style={{
              fontSize: 78,
              lineHeight: 0.94,
              fontWeight: 900,
              letterSpacing: '-0.045em',
              textTransform: 'uppercase',
              color: '#C9282D',
              maxWidth: 930,
            }}
          >
            VALMIS SOME ULOS.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            borderTop: '2px solid #E6DFD5',
            paddingTop: 24,
          }}
        >
          <div
            style={{
              display: 'flex',
              maxWidth: 690,
              fontSize: 25,
              lineHeight: 1.35,
              color: '#E6DFD5',
            }}
          >
            Teette hyvää työtä. Me pidämme huolen, että asiakkaat myös näkevät sen.
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 30,
              fontWeight: 900,
              color: '#F7F4EF',
            }}
          >
            490 € + ALV / 30 PÄIVÄÄ
          </div>
        </div>
      </div>
    ),
    size
  );
}
