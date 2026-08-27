import type { LeadInput } from './lead';

export class LeadDeliveryError extends Error {
  constructor(
    public readonly code: 'not_configured' | 'delivery_failed',
    message: string
  ) {
    super(message);
    this.name = 'LeadDeliveryError';
  }
}

function leadAsText(lead: LeadInput) {
  return [
    'Uusi GhoulHouse sisältöesimerkkipyyntö',
    '',
    `Yritys: ${lead.company}`,
    `Nimi: ${lead.name}`,
    `Sähköposti: ${lead.email}`,
    `Verkkosivu / Instagram: ${lead.profile}`,
    `Puhelin: ${lead.phone || '-'}`,
    `Verkkosivu: ${lead.website || '-'}`,
    `Instagram: ${lead.instagram || '-'}`,
    '',
    'Viesti:',
    lead.message || '-',
  ].join('\n');
}

async function deliverToWebhook(lead: LeadInput) {
  const url = process.env.LEAD_WEBHOOK_URL;

  if (!url || !url.startsWith('https://')) {
    throw new LeadDeliveryError(
      'not_configured',
      'Secure lead webhook is not configured.'
    );
  }

  const headers: Record<string, string> = {
    'content-type': 'application/json',
  };

  if (process.env.LEAD_WEBHOOK_TOKEN) {
    headers.authorization = `Bearer ${process.env.LEAD_WEBHOOK_TOKEN}`;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      source: 'ghoulhouse.fi',
      type: 'content_examples_request',
      lead,
      receivedAt: new Date().toISOString(),
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new LeadDeliveryError('delivery_failed', 'Webhook delivery failed.');
  }
}

async function deliverWithResend(lead: LeadInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_TO_EMAIL;
  const from = process.env.LEAD_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    throw new LeadDeliveryError(
      'not_configured',
      'Resend lead delivery is not configured.'
    );
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: lead.email,
      subject: `GhoulHouse — 2 sisältöesimerkkiä — ${lead.company}`,
      text: leadAsText(lead),
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new LeadDeliveryError('delivery_failed', 'Email delivery failed.');
  }
}

export async function deliverLead(lead: LeadInput) {
  const mode = process.env.LEAD_DELIVERY_MODE;

  if (mode === 'webhook') {
    await deliverToWebhook(lead);
    return;
  }

  if (mode === 'resend') {
    await deliverWithResend(lead);
    return;
  }

  throw new LeadDeliveryError(
    'not_configured',
    'Lead delivery mode is not configured.'
  );
}
