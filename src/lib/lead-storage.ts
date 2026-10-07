import type { LeadInput } from './lead';

const DEFAULT_SUPABASE_URL = 'https://qkmyzbqhepapiowrttpz.supabase.co';
const LEAD_STORAGE_TIMEOUT_MS = 6_000;

export class LeadStorageError extends Error {
  readonly code: 'not_configured' | 'rate_limited' | 'storage_timeout' | 'storage_failed' | 'invalid_payload';
  readonly retryAfterSeconds?: number;

  constructor(
    code: 'not_configured' | 'rate_limited' | 'storage_timeout' | 'storage_failed' | 'invalid_payload',
    message: string,
    retryAfterSeconds?: number
  ) {
    super(message);
    this.name = 'LeadStorageError';
    this.code = code;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

function getTrustedIngestUrl() {
  const url =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    DEFAULT_SUPABASE_URL;

  if (!url) {
    throw new LeadStorageError(
      'not_configured',
      'Trusted lead ingest is not configured.'
    );
  }

  return url.replace(/\/$/, '');
}

function requireWorkloadToken(workloadToken: string | null | undefined) {
  const token = workloadToken?.trim();

  if (!token) {
    throw new LeadStorageError(
      'not_configured',
      'Vercel workload identity is not available for this request.'
    );
  }

  return token;
}

function retryAfterSeconds(response: Response) {
  const value = Number(response.headers.get('retry-after') || 600);
  return Number.isFinite(value) && value > 0 ? Math.ceil(value) : 600;
}

export async function checkLeadStorageHealth(workloadToken: string | null | undefined) {
  const url = getTrustedIngestUrl();
  const token = requireWorkloadToken(workloadToken);

  let response: Response;

  try {
    response = await fetch(`${url}/functions/v1/ghoulhouse-lead-ingest`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
        accept: 'application/json',
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(LEAD_STORAGE_TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError')) {
      throw new LeadStorageError('storage_timeout', 'Trusted lead ingest health check timed out.');
    }

    throw new LeadStorageError('storage_failed', 'Trusted lead ingest health check failed.');
  }

  if (!response.ok) {
    throw new LeadStorageError('storage_failed', 'Trusted lead ingest health check was rejected.');
  }
  const payload = (await response.json()) as { ok?: boolean; storage?: { ready?: boolean }; notifications?: { ready?: boolean } };
  if (payload.ok !== true || payload.storage?.ready !== true || payload.notifications?.ready !== true) {
    throw new LeadStorageError('storage_failed', 'Trusted lead ingest is not ready.');
  }
}

export async function storeLead(
  lead: LeadInput,
  clientRateKey: string,
  workloadToken: string | null | undefined
) {
  const url = getTrustedIngestUrl();
  const token = requireWorkloadToken(workloadToken);

  if (!/^[0-9a-f]{64}$/.test(clientRateKey)) {
    throw new LeadStorageError('storage_failed', 'Trusted lead ingest client key is invalid.');
  }

  let response: Response;

  try {
    response = await fetch(`${url}/functions/v1/ghoulhouse-lead-ingest`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        accept: 'application/json',
        'content-type': 'application/json',
        'x-gh-client-key': clientRateKey,
      },
      body: JSON.stringify(lead),
      cache: 'no-store',
      signal: AbortSignal.timeout(LEAD_STORAGE_TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError')) {
      throw new LeadStorageError('storage_timeout', 'Trusted lead ingest timed out.');
    }

    throw new LeadStorageError('storage_failed', 'Trusted lead ingest request failed.');
  }

  if (response.status === 400) {
    throw new LeadStorageError('invalid_payload', 'Trusted lead ingest rejected the form data.');
  }

  if (response.status === 429) {
    throw new LeadStorageError(
      'rate_limited',
      'Lead rate limit exceeded.',
      retryAfterSeconds(response)
    );
  }

  if (!response.ok) {
    throw new LeadStorageError('storage_failed', 'Trusted lead ingest failed.');
  }

  const payload = (await response.json()) as { ok?: boolean; id?: string };

  if (!payload.ok || !payload.id) {
    throw new LeadStorageError('storage_failed', 'Trusted lead ingest returned an invalid response.');
  }

  return payload.id;
}
