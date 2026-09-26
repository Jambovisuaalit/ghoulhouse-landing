import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/** Public build identity only; no credentials or customer data. */
export function GET() {
  return NextResponse.json({
    sha: process.env.VERCEL_GIT_COMMIT_SHA || null,
    environment: process.env.VERCEL_ENV || 'local',
    url: process.env.VERCEL_URL || null,
  }, { headers: { 'cache-control': 'no-store, max-age=0' } });
}
