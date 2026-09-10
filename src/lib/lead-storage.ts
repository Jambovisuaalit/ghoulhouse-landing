import type { LeadInput } from './lead';

export class LeadStorageError extends Error {
  constructor(
    public readonly code: 'not_configured' | 'rate_limited' | 'storage_failed',
    message: string
  ) {
    super(message);
    this.name = 'LeadStorageError';
  }
}

function getSupabaseConfig() {
  const url =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const publishableKey =
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    '';

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

  const response = await fetch(`${url}/rest/v1/rpc/submit_ghoulhouse_lead`, {
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
      p_email: lead.email,
      p_profile: lead.profile,
      p_phone: lead.phone || null,
      p_website: lead.website || null,
      p_instagram: lead.instagram || null,
      p_message: lead.message || null,
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const detail = await response.text();

    if (detail.includes('rate_limited')) {
      throw new LeadStorageError('rate_limited', 'Lead rate limit exceeded.');
    }

    throw new LeadStorageError('storage_failed', 'Supabase lead storage failed.');
  }

  return (await response.json()) as string | null;
}
