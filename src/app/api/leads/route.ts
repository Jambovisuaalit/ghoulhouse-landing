import { NextRequest, NextResponse } from 'next/server';
import { validateLead } from '@/lib/lead';
import { deliverLead, LeadDeliveryError } from '@/lib/lead-delivery';

export const runtime = 'nodejs';

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const buckets = new Map<string, { count: number; resetAt: number }>();

function getClientKey(request: NextRequest) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function isRateLimited(key: string) {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  current.count += 1;
  buckets.set(key, current);
  return current.count > MAX_REQUESTS;
}

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get('content-length') || 0);

  if (contentLength > 20_000) {
    return NextResponse.json(
      { ok: false, code: 'payload_too_large' },
      { status: 413 }
    );
  }

  const clientKey = getClientKey(request);
  if (isRateLimited(clientKey)) {
    return NextResponse.json(
      { ok: false, code: 'rate_limited' },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, code: 'invalid_json' },
      { status: 400 }
    );
  }

  if (typeof body.fax === 'string' && body.fax.trim()) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const validation = validateLead(body);

  if (!validation.ok || !validation.data) {
    return NextResponse.json(
      {
        ok: false,
        code: 'validation_error',
        errors: validation.errors,
      },
      { status: 400 }
    );
  }

  try {
    await deliverLead(validation.data);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (error instanceof LeadDeliveryError) {
      const status = error.code === 'not_configured' ? 503 : 502;
      return NextResponse.json(
        {
          ok: false,
          code:
            error.code === 'not_configured'
              ? 'delivery_unavailable'
              : 'delivery_failed',
        },
        { status }
      );
    }

    return NextResponse.json(
      { ok: false, code: 'delivery_failed' },
      { status: 502 }
    );
  }
}
