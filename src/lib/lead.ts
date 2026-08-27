export interface LeadInput {
  company: string;
  name: string;
  email: string;
  profile: string;
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
  profile: 300,
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

function isInstagramProfile(value: string) {
  return (
    /^@[A-Za-z0-9._]{1,30}$/.test(value) ||
    /^https?:\/\/(www\.)?instagram\.com\/[A-Za-z0-9._]+\/?(?:\?.*)?$/i.test(value) ||
    /^(www\.)?instagram\.com\/[A-Za-z0-9._]+\/?$/i.test(value)
  );
}

function normalizeWebsite(value: string) {
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

function isValidWebsite(value: string) {
  if (!value || /\s/.test(value)) return false;

  try {
    const url = new URL(normalizeWebsite(value));
    return (
      (url.protocol === 'https:' || url.protocol === 'http:') &&
      url.hostname.includes('.') &&
      !url.hostname.startsWith('.') &&
      !url.hostname.endsWith('.')
    );
  } catch {
    return false;
  }
}

function classifyProfile(value: string) {
  if (isInstagramProfile(value)) {
    return {
      instagram: value,
      website: '',
    };
  }

  if (isValidWebsite(value)) {
    return {
      instagram: '',
      website: normalizeWebsite(value),
    };
  }

  return null;
}

export function validateLead(input: unknown): LeadValidationResult {
  if (!input || typeof input !== 'object') {
    return { ok: false, errors: { form: 'Virheellinen lomakedata.' } };
  }

  const source = input as Record<string, unknown>;
  const profile = clean(source.profile, limits.profile);
  const classifiedProfile = profile ? classifyProfile(profile) : null;

  const data: LeadInput = {
    company: clean(source.company, limits.company),
    name: clean(source.name, limits.name),
    email: clean(source.email, limits.email).toLowerCase(),
    profile,
    phone: clean(source.phone, limits.phone),
    website: classifiedProfile?.website || '',
    instagram: classifiedProfile?.instagram || '',
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

  if (!profile) {
    errors.profile = 'Verkkosivu tai Instagram on pakollinen.';
  } else if (!classifiedProfile) {
    errors.profile = 'Anna verkkosivu (esim. yritys.fi) tai Instagram (@yritys).';
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, data };
}
