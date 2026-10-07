/** Explicit valid state when a company has not launched either channel. */
export const NO_PROFILE_YET = 'Ei vielä verkkosivua tai Instagramia';

export interface LeadInput {
  intent: 'booking' | 'photos';
  service?: 'websites' | 'social' | 'seo';
  company: string;
  name: string;
  email: string;
  profile: string;
  noProfile: boolean;
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

function isValidPhone(value: string) {
  return /^\+?[\d\s()-]+$/.test(value) && value.replace(/\D/g, '').length >= 6 && value.replace(/\D/g, '').length <= 15;
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
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { ok: false, errors: { form: 'Virheellinen lomakedata.' } };
  }

  const source = input as Record<string, unknown>;
  const explicitNoProfile =
    source.noProfile === true || source.noProfile === 'true' || source.noProfile === 'on';
  const rawProfile = clean(source.profile, limits.profile);
  const noProfile = explicitNoProfile || !rawProfile || rawProfile === NO_PROFILE_YET;
  const profile = noProfile ? NO_PROFILE_YET : rawProfile;
  const classifiedProfile = noProfile
    ? { website: '', instagram: '' }
    : profile
      ? classifyProfile(profile)
      : null;

  const contact = clean(source.contact, limits.email);
  const contactIsEmail = Boolean(contact && isValidEmail(contact));
  const contactIsPhone = Boolean(contact && isValidPhone(contact));
  const service = ['websites', 'social', 'seo'].includes(String(source.service))
    ? (source.service as 'websites' | 'social' | 'seo')
    : undefined;
  const data: LeadInput = {
    intent: source.intent === 'photos' ? 'photos' : 'booking',
    service,
    company: clean(source.company, limits.company),
    name: clean(source.name, limits.name),
    email: (contact ? (contactIsEmail ? contact : '') : clean(source.email, limits.email)).toLowerCase(),
    profile,
    noProfile,
    phone: contactIsPhone ? contact : clean(source.phone, limits.phone),
    website: classifiedProfile?.website || '',
    instagram: classifiedProfile?.instagram || '',
    message: clean(source.message, limits.message + 1),
  };

  const errors: Record<string, string> = {};

  if (!data.company) errors.company = 'Yritys on pakollinen.';
  if (!data.name) errors.name = 'Nimi on pakollinen.';
  if (typeof source.company === 'string' && /[\r\n]/.test(source.company)) {
    errors.company = 'Anna yrityksen nimi yhdellä rivillä.';
  }
  if (typeof source.name === 'string' && /[\r\n]/.test(source.name)) {
    errors.name = 'Anna nimi yhdellä rivillä.';
  }
  if (contact && !contactIsEmail && !contactIsPhone) {
    errors.contact = 'Anna toimiva sähköpostiosoite tai puhelinnumero.';
  } else if (!contact && !data.email && !data.phone) {
    errors.contact = 'Anna sähköpostiosoite tai puhelinnumero.';
  } else if (data.email && !isValidEmail(data.email)) {
    errors.email = 'Tarkista sähköpostiosoite.';
  } else if (data.phone && !isValidPhone(data.phone)) {
    errors.phone = 'Tarkista puhelinnumero.';
  }

  if (service === 'seo' && !data.website) {
    errors.profile = 'SEO-arviota varten anna nykyinen verkkosivu.';
  } else if (service === 'websites' && !noProfile && !data.website) {
    errors.profile = 'Anna nykyinen verkkosivu (esim. yritys.fi) tai jätä kenttä tyhjäksi.';
  } else if (!noProfile && !classifiedProfile) {
    errors.profile = 'Anna verkkosivu (esim. yritys.fi) tai Instagram (@yritys).';
  }

  if ((data.message?.length || 0) > limits.message) errors.message = 'Viesti saa olla enintään 1 200 merkkiä.';

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, data };
}
