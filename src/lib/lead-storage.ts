import type { LeadInput } from './lead';

const DEFAULT_SUPABASE_URL = 'https://qkmyzbqhepapiowrttpz.supabase.co';
const DEFAULT_SUPABASE_PUBLISHABLE_KEY =
  'sb_publishable_b4zwfIhyyo-wdnqcxXRCgA_TxMl3puZ';

const LEAD_STORAGE_TIMEOUT_MS = 5_000;

export class LeadStorageError extends Error {
  readonly code: 'not_configured' | 'rate_limited' | 'storage_timeout' | 'storage_failed';

  constructor(
    code: 'not_configured' | 'rate_limited' | 'storage_timeout' | 'storage_failed',
    message: string
  ) {
    super(message);
    this.name = 'LeadStorageError';
    this.code = code;
  }
}

function getSupabaseConfig() {
  const url =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    DEFAULT_SUPABASE_URL;
  const publishableKey =
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    DEFAULT_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new LeadStorageError(
      'not_configured',
      'Supabase lead storage is not configured.'
    );
  }

  return {
    url: url.replace(/\/$/, ''),
    publishableKey,
  };
}

export async function storeLead(lead: LeadInput) {
  const { url, publishableKey } = getSupabaseConfig();

  let response: Response;

  try {
    response = await fetch(`${url}/rest/v1/rpc/submit_ghoulhouse_lead_v3`, {
      method: 'POST',
      headers: {
        apikey: publishableKey,
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        p_intent: lead.intent,
        p_company: lead.company,
        p_name: lead.name,
        p_email: lead.email || null,
        p_profile: lead.profile,
        p_phone: lead.phone || null,
        p_website: lead.website || null,
        p_instagram: lead.instagram || null,
        p_message: lead.message || null,
        p_service: lead.service || (lead.intent === 'photos' ? 'social' : null),
        p_no_profile: lead.noProfile,
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(LEAD_STORAGE_TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError')) {
      throw new LeadStorageError('storage_timeout', 'Supabase lead storage timed out.');
    }

    throw new LeadStorageError('storage_failed', 'Supabase lead storage request failed.');
  }

  if (!response.ok) {
    const detail = await response.text();

    if (detail.includes('rate_limited')) {
      throw new LeadStorageError('rate_limited', 'Lead rate limit exceeded.');
    }

    throw new LeadStorageError('storage_failed', 'Supabase lead storage failed.');
  }

  return (await response.json()) as string | null;
}
