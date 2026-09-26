import test from 'node:test';
import assert from 'node:assert/strict';
import { validateLead } from '../src/lib/lead.ts';
const base = { intent: 'booking', service: 'websites', company: 'QA', name: 'QA', email: 'qa@example.com', profile: 'example.com' };
test('profile or explicit opt-out is required', () => {
  assert.equal(validateLead({ ...base, profile: '' }).ok, false);
  for (const noProfile of [true, 'true', 'on']) {
    const result = validateLead({ ...base, profile: '', noProfile });
    assert.equal(result.ok, true);
    assert.equal(result.data.noProfile, true);
    assert.equal(result.data.website, '');
  }
  assert.equal(validateLead({ ...base, profile: '', noProfile: 'false' }).ok, false);
  assert.equal(validateLead({ ...base, profile: 'invalid' }).ok, false);
});
test('message boundary preserves 1200 characters and rejects 1201', () => {
  const message = 'a'.repeat(1200);
  const result = validateLead({ ...base, message });
  assert.equal(result.ok, true);
  assert.equal(result.data.message, message);
  assert.equal(result.data.service, 'websites');
  assert.equal(validateLead({ ...base, message: message + 'a' }).ok, false);
});
test('opt-out clears stale profile data', () => {
  const result = validateLead({ ...base, noProfile: true });
  assert.equal(result.data.profile, '');
  assert.equal(result.data.website, '');
  assert.equal(result.data.instagram, '');
});

test('existing no-profile datalist value survives and uses the same explicit opt-out flag', () => {
  const result = validateLead({ ...base, profile: 'Ei vielä verkkosivua tai Instagramia' });
  assert.equal(result.ok, true);
  assert.equal(result.data.noProfile, true);
  assert.equal(result.data.profile, 'Ei vielä verkkosivua tai Instagramia');
  assert.equal(result.data.website, '');
  assert.equal(result.data.instagram, '');
});

test('checkbox takes precedence over a stale profile and validation stays active otherwise', () => {
  const checked = validateLead({ ...base, noProfile: 'true', profile: '@stale_profile' });
  assert.equal(checked.ok, true);
  assert.equal(checked.data.noProfile, true);
  assert.equal(checked.data.profile, '');
  assert.equal(checked.data.instagram, '');
  assert.equal(validateLead({ ...base, noProfile: 'false', profile: '@valid_profile' }).ok, true);
  assert.equal(validateLead({ ...base, noProfile: 'false', profile: 'invalid value' }).ok, false);
});
