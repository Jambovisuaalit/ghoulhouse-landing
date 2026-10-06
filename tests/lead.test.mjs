import test from 'node:test';
import assert from 'node:assert/strict';
import { validateLead } from '../src/lib/lead.ts';

const base = { intent: 'photos', service: 'social', company: 'QA', name: 'QA' };

test('short form accepts either email or phone with optional Instagram or website', () => {
  const email = validateLead({ ...base, contact: 'qa@example.com' });
  assert.equal(email.ok, true);
  assert.equal(email.data.email, 'qa@example.com');
  assert.equal(email.data.noProfile, true);
  assert.equal(email.data.profile, 'Ei vielä verkkosivua tai Instagramia');

  const phone = validateLead({ ...base, contact: '+358 40 123 4567', profile: '@yritys' });
  assert.equal(phone.ok, true);
  assert.equal(phone.data.email, '');
  assert.equal(phone.data.phone, '+358 40 123 4567');
  assert.equal(phone.data.instagram, '@yritys');

  const website = validateLead({ ...base, contact: 'qa@example.com', profile: 'example.com' });
  assert.equal(website.ok, true);
  assert.equal(website.data.website, 'https://example.com');
});

test('invalid or missing contact and invalid profile fail', () => {
  assert.equal(validateLead(base).errors.contact, 'Anna sähköpostiosoite tai puhelinnumero.');
  assert.equal(validateLead({ ...base, contact: 'abc' }).ok, false);
  assert.equal(validateLead({ ...base, contact: '123' }).ok, false);
  assert.equal(validateLead({ ...base, contact: 'qa@example.com', profile: 'invalid value' }).ok, false);
});

test('website inquiry accepts no current site but rejects an Instagram handle in the website field', () => {
  const noSite = validateLead({
    intent: 'booking',
    service: 'websites',
    company: 'QA',
    name: 'QA',
    contact: 'qa@example.com',
  });
  assert.equal(noSite.ok, true);

  const instagramOnly = validateLead({
    intent: 'booking',
    service: 'websites',
    company: 'QA',
    name: 'QA',
    contact: 'qa@example.com',
    profile: '@yritys',
  });
  assert.equal(instagramOnly.ok, false);
  assert.equal(instagramOnly.errors.profile, 'Anna nykyinen verkkosivu (esim. yritys.fi) tai jätä kenttä tyhjäksi.');
});

test('SEO inquiry requires a valid website and rejects an Instagram-only profile', () => {
  const missing = validateLead({
    intent: 'booking',
    service: 'seo',
    company: 'QA',
    name: 'QA',
    contact: 'qa@example.com',
  });
  assert.equal(missing.ok, false);
  assert.equal(missing.errors.profile, 'SEO-arviota varten anna nykyinen verkkosivu.');

  const instagramOnly = validateLead({
    intent: 'booking',
    service: 'seo',
    company: 'QA',
    name: 'QA',
    contact: 'qa@example.com',
    profile: '@yritys',
  });
  assert.equal(instagramOnly.ok, false);

  const website = validateLead({
    intent: 'booking',
    service: 'seo',
    company: 'QA',
    name: 'QA',
    contact: 'qa@example.com',
    profile: 'example.com',
  });
  assert.equal(website.ok, true);
  assert.equal(website.data.website, 'https://example.com');
});

test('legacy form payload stays compatible and message limit is enforced', () => {
  const message = 'a'.repeat(1200);
  const result = validateLead({ ...base, email: 'qa@example.com', profile: 'example.com', message });
  assert.equal(result.ok, true);
  assert.equal(result.data.message, message);
  assert.equal(result.data.website, 'https://example.com');
  assert.equal(validateLead({ ...base, email: 'qa@example.com', message: message + 'a' }).ok, false);
});
