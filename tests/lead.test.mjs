import test from 'node:test';
import assert from 'node:assert/strict';
import { validateLead } from '../src/lib/lead.ts';

const base = { intent: 'photos', service: 'social', company: 'QA', name: 'QA' };

test('short form accepts either email or phone with optional Instagram', () => {
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
});

test('invalid or missing contact and invalid Instagram fail', () => {
  assert.equal(validateLead(base).errors.contact, 'Anna sähköpostiosoite tai puhelinnumero.');
  assert.equal(validateLead({ ...base, contact: 'abc' }).ok, false);
  assert.equal(validateLead({ ...base, contact: '123' }).ok, false);
  assert.equal(validateLead({ ...base, contact: 'qa@example.com', profile: 'invalid value' }).ok, false);
});

test('legacy form payload stays compatible and message limit is enforced', () => {
  const message = 'a'.repeat(1200);
  const result = validateLead({ ...base, email: 'qa@example.com', profile: 'example.com', message });
  assert.equal(result.ok, true);
  assert.equal(result.data.message, message);
  assert.equal(result.data.website, 'https://example.com');
  assert.equal(validateLead({ ...base, email: 'qa@example.com', message: message + 'a' }).ok, false);
});
