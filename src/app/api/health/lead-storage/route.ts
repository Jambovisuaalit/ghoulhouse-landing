import { NextRequest, NextResponse } from 'next/server';
import { checkLeadStorageHealth, LeadStorageError } from '@/lib/lead-storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await checkLeadStorageHealth(request.headers.get('x-vercel-oidc-token'));

    return NextResponse.json(
      { ok: true },
      {
        status: 200,
        headers: { 'cache-control': 'no-store, max-age=0' },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        code:
          error instanceof LeadStorageError && error.code === 'not_configured'
            ? 'not_configured'
            : 'unavailable',
      },
      {
        status: 503,
        headers: { 'cache-control': 'no-store, max-age=0' },
      }
    );
  }
}
