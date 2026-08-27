import { NextResponse } from 'next/server';

type DemoRequest = {
  company?: string;
  name?: string;
  email?: string;
  phone?: string;
  website?: string;
  instagram?: string;
  message?: string;
  companyWebsite?: string;
  startedAt?: string;
};

function clean(value: unknown, max = 240) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export async function POST(request: Request) {
  let body: DemoRequest;
  try {
    body = (await request.json()) as DemoRequest;
  } catch {
    return NextResponse.json({ message: 'Virheellinen pyyntö.' }, { status: 400 });
  }

  if (clean(body.companyWebsite)) {
    return NextResponse.json({ message: 'Kiitos.' }, { status: 200 });
  }

  const startedAt = Number(body.startedAt ?? 0);
  if (startedAt && Date.now() - startedAt < 2500) {
    return NextResponse.json({ message: 'Lähetys estettiin. Yritä uudelleen hetken kuluttua.' }, { status: 429 });
  }

  const company = clean(body.company, 120);
  const name = clean(body.name, 120);
  const email = clean(body.email, 160);
  const phone = clean(body.phone, 40);
  const website = clean(body.website);
  const instagram = clean(body.instagram, 120);
  const message = clean(body.message, 1200);

  if (!company || !name || !email || !email.includes('@')) {
    return NextResponse.json({ message: 'Täytä yritys, nimi ja voimassa oleva sähköposti.' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_TO_EMAIL;
  const from = process.env.LEAD_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    return NextResponse.json(
      { message: 'Lomakkeen sähköpostireititys ei ole vielä käytössä. Ota yhteyttä GhoulHouseen muuta kautta.' },
      { status: 503 }
    );
  }

  const text = [
    `Yritys: ${company}`,
    `Nimi: ${name}`,
    `Sähköposti: ${email}`,
    `Puhelin: ${phone || '—'}`,
    `Verkkosivu: ${website || '—'}`,
    `Instagram: ${instagram || '—'}`,
    '',
    `Viesti: ${message || '—'}`,
  ].join('\n');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `GhoulHouse demo request — ${company}`,
      text,
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ message: 'Pyyntöä ei voitu lähettää. Yritä myöhemmin uudelleen.' }, { status: 502 });
  }

  return NextResponse.json({ message: 'Kiitos. Pyyntö on lähetetty.' }, { status: 201 });
}
