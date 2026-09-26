import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Official GhoulHouse_Mark_Small_Color.svg geometry from the supplied logo pack.
// Render PNG on demand, so Apple/PWA icons use the same real mark as favicon.svg.
const allowedSizes = new Set([180, 192, 512]);

export async function GET(
  _request: Request,
  context: { params: Promise<{ size: string }> },
) {
  const size = Number((await context.params).size);
  if (!allowedSizes.has(size)) {
    return new Response('Not found', { status: 404 });
  }

  return new ImageResponse(
    (
      <div style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F7F4EF',
      }}>
        <svg width={size} height={size} viewBox="0 0 512 512" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <g strokeLinecap="round" strokeLinejoin="round">
            <path d="M256 30 482 256 256 482 30 256Z" stroke="#161411" strokeWidth="22" />
            <path d="M145 238 256 132 367 238" stroke="#161411" strokeWidth="28" />
            <path d="M177 236 188 337H324L335 236" stroke="#161411" strokeWidth="28" />
            <path d="M219 337 206 392 205 438M293 337 307 392 307 438"
              stroke="#161411" strokeWidth="26" />
            <path d="M205 438 174 452M205 438 208 463M205 438 234 454M307 438 276 454M307 438 305 463M307 438 338 451"
              stroke="#161411" strokeWidth="22" />
            <rect x="214" y="247" width="84" height="68" rx="5"
              fill="#C83830" stroke="#161411" strokeWidth="22" />
          </g>
        </svg>
      </div>
    ),
    { width: size, height: size },
  );
}
