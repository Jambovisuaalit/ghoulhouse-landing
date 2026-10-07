import { createHash } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { validateLead } from '@/lib/lead';
import { storeLead, LeadStorageError } from '@/lib/lead-storage';
import { confirmationPath } from '@/lib/lead-confirmation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

function redirect(request: NextRequest, destination: string) {
  return NextResponse.redirect(new URL(destination, request.url), 303);
}

/** All lead errors return to the existing contact section. */
function leadFailureRedirect(request: NextRequest, code: string, intent?: unknown, service?: unknown) {
  const params = new URLSearchParams({ lead: code });
  if (intent === 'photos') params.set('intent', 'photos');
  if (service === 'websites' || service === 'social' || service === 'seo') params.set('service', service);
  return redirect(request, `/?${params.toString()}#yhteys`);
}

function getClientRateKey(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  return createHash('sha256')
    .update(`ghoulhouse-lead-v1:${ip}`)
    .digest('hex');
}

function isCrossSiteRequest(request: NextRequest) {
  const site = request.headers.get('sec-fetch-site');
  return Boolean(site && !['same-origin', 'same-site', 'none'].includes(site));
}

async function readBody(request: NextRequest) {
  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const body: unknown = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      throw new Error('invalid_payload');
    }
    return {
      htmlForm: false,
      body: body as Record<string, unknown>,
    };
  }

  const formData = await request.formData();
  return {
    htmlForm: true,
    body: Object.fromEntries(formData.entries()),
  };
}

export async function POST(request: NextRequest) {
  if (isCrossSiteRequest(request)) {
    return json({ ok: false, code: 'cross_site_request' }, 403);
  }

  const contentLength = Number(request.headers.get('content-length') || 0);

  if (contentLength > 50_000) {
    return json({ ok: false, code: 'payload_too_large' }, 413);
  }

  const contentType = request.headers.get('content-type') || '';
  const htmlForm = !contentType.includes('application/json');

  let parsed: { htmlForm: boolean; body: Record<string, unknown> };

  try {
    parsed = await readBody(request);
  } catch {
    if (htmlForm) return leadFailureRedirect(request, 'invalid');
    return json({ ok: false, code: 'invalid_payload' }, 400);
  }

  if (typeof parsed.body.fax === 'string' && parsed.body.fax.trim()) {
    return parsed.htmlForm ? redirect(request, '/kiitos') : json({ ok: true }, 201);
  }

  const validation = validateLead(parsed.body);

  if (!validation.ok || !validation.data) {
    if (parsed.htmlForm) {
      return leadFailureRedirect(request, 'validation', parsed.body.intent, parsed.body.service);
    }

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
    await storeLead(
      validation.data,
      getClientRateKey(request),
      request.headers.get('x-vercel-oidc-token')
    );

    if (parsed.htmlForm) {
      return redirect(request, confirmationPath(validation.data.intent, validation.data.service));
    }

    return json({ ok: true }, 201);
  } catch (error) {
    if (error instanceof LeadStorageError) {
      if (error.code === 'invalid_payload') {
        if (parsed.htmlForm) {
          return leadFailureRedirect(request, 'validation', parsed.body.intent, parsed.body.service);
        }
        return json({ ok: false, code: 'validation_error', errors: { form: 'Tarkista lomakkeen tiedot.' } }, 400);
      }
      if (error.code === 'rate_limited') {
        if (parsed.htmlForm) {
          return leadFailureRedirect(request, 'rate_limited', parsed.body.intent, parsed.body.service);
        }

        return json(
          { ok: false, code: 'rate_limited' },
          429,
          { 'retry-after': String(error.retryAfterSeconds || 600) }
        );
      }

      if (parsed.htmlForm) {
        return leadFailureRedirect(request, 'delivery', parsed.body.intent, parsed.body.service);
      }

      return json(
        {
          ok: false,
          code:
            error.code === 'not_configured'
              ? 'delivery_unavailable'
              : error.code === 'storage_timeout'
                ? 'delivery_timeout'
                : 'delivery_failed',
        },
        error.code === 'not_configured' ? 503 : error.code === 'storage_timeout' ? 504 : 502
      );
    }

    if (parsed.htmlForm) {
      return leadFailureRedirect(request, 'delivery', parsed.body.intent, parsed.body.service);
    }

    return json({ ok: false, code: 'delivery_failed' }, 502);
  }
}
