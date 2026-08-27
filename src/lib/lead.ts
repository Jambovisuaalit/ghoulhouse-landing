export interface LeadInput {
  company: string;
  name: string;
  email: string;
  phone?: string;
  website?: string;
  instagram?: string;
  message?: string;
}

export interface LeadValidationResult {
  ok: boolean;
  data?: LeadInput;
  errors?: Record<string, string>;
}

const limits = {
  company: 120,
  name: 120,
  email: 254,
  phone: 40,
  website: 300,
  instagram: 120,
  message: 1200,
} as const;

function clean(value: unknown, maxLength: number) {
  return typeof value === 'string'
    ? value.trim().replace(/\u0000/g, '').slice(0, maxLength)
    : '';
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidWebsite(value: string) {
  if (!value) return true;

  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

export function validateLead(input: unknown): LeadValidationResult {
  if (!input || typeof input !== 'object') {
    return { ok: false, errors: { form: 'Virheellinen lomakedata.' } };
  }

  const source = input as Record<string, unknown>;
  const data: LeadInput = {
    company: clean(source.company, limits.company),
    name: clean(source.name, limits.name),
    email: clean(source.email, limits.email).toLowerCase(),
    phone: clean(source.phone, limits.phone),
    website: clean(source.website, limits.website),
    instagram: clean(source.instagram, limits.instagram),
    message: clean(source.message, limits.message),
  };

  const errors: Record<string, string> = {};

  if (!data.company) errors.company = 'Yritys on pakollinen.';
  if (!data.name) errors.name = 'Nimi on pakollinen.';
  if (!data.email) {
    errors.email = 'Sähköposti on pakollinen.';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Tarkista sähköpostiosoite.';
  }
  if (data.website && !isValidWebsite(data.website)) {
    errors.website = 'Tarkista verkkosivun osoite.';
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, data };
}
