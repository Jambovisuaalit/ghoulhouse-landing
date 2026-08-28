import { NextRequest, NextResponse } from 'next/server';
import { validateLead } from '@/lib/lead';
import { deliverLead, LeadDeliveryError } from '@/lib/lead-delivery';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const MAX_BUCKETS_BEFORE_PRUNE = 1_000;
const buckets = new Map<string, { count: number; resetAt: number }>();

function json(
  body: Record<string, unknown>,
  status: number,
  headers: Record<string, string> = {}
) {
  return NextResponse.json(body, {
    status,
    headers: {
      'cache-control': 'no-store, max-age=0',
      ...headers,
    },
  });
}

function getClientKey(request: NextRequest) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function pruneExpiredBuckets(now: number) {
  if (buckets.size < MAX_BUCKETS_BEFORE_PRUNE) return;

  for (const [key, value] of buckets) {
    if (value.resetAt <= now) buckets.delete(key);
  }
}

function checkRateLimit(key: string) {
  const now = Date.now();
  pruneExpiredBuckets(now);

  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { limited: false, retryAfter: 0 };
  }

  current.count += 1;
  buckets.set(key, current);

  return {
    limited: current.count > MAX_REQUESTS,
    retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
  };
}

function isCrossSiteRequest(request: NextRequest) {
  const site = request.headers.get('sec-fetch-site');
  return Boolean(site && !['same-origin', 'same-site', 'none'].includes(site));
}

export async function POST(request: NextRequest) {
  if (isCrossSiteRequest(request)) {
    return json({ ok: false, code: 'cross_site_request' }, 403);
  }

  const contentLength = Number(request.headers.get('content-length') || 0);

  if (contentLength > 20_000) {
    return json({ ok: false, code: 'payload_too_large' }, 413);
  }

  const clientKey = getClientKey(request);
  const rateLimit = checkRateLimit(clientKey);

  if (rateLimit.limited) {
    return json(
      { ok: false, code: 'rate_limited' },
      429,
      { 'retry-after': String(rateLimit.retryAfter) }
    );
  }

  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return json({ ok: false, code: 'invalid_json' }, 400);
  }

  if (typeof body.fax === 'string' && body.fax.trim()) {
    return json({ ok: true }, 201);
  }

  const validation = validateLead(body);

  if (!validation.ok || !validation.data) {
    return json(
      {
        ok: false,
        code: 'validation_error',
        errors: validation.errors || {},
      },
      400
    );
  }

  try {
    await deliverLead(validation.data);
    return json({ ok: true }, 201);
  } catch (error) {
    if (error instanceof LeadDeliveryError) {
      const status = error.code === 'not_configured' ? 503 : 502;

      return json(
        {
          ok: false,
          code:
            error.code === 'not_configured'
              ? 'delivery_unavailable'
              : 'delivery_failed',
        },
        status
      );
    }

    return json({ ok: false, code: 'delivery_failed' }, 502);
  }
}
