import assert from 'node:assert/strict';

// Intentionally runs only for audit PR #77. Uses invented QA data, not a real prospect.
const sha = process.env.QA_EXPECTED_SHA;
assert(/^[0-9a-f]{40}$/.test(sha || ''), 'Expected PR commit SHA required for controlled lead QA.');
const base = 'http://127.0.0.1:3000';
const company = 'GhoulHouse QA API PR77 ' + sha.slice(0, 12);
const payload = {
  intent: 'booking',
  service: 'websites',
  company,
  name: 'GhoulHouse QA',
  email: 'qa-pr77@ghoulhouse.fi',
  profile: '',
  noProfile: '1',
  message: 'CONTROLLED QA ONLY: audit PR #77. Verify API, RPC, Resend and the website-specific thank-you page.',
};
const response = await fetch(base + '/api/leads', {
  method: 'POST',
  headers: { 'content-type': 'application/json', 'sec-fetch-site': 'same-origin' },
  body: JSON.stringify(payload),
});
const result = await response.text();
assert.equal(response.status, 201, 'Controlled synthetic lead must return HTTP 201; response: ' + result);
const confirmation = await fetch(base + '/kiitos?intent=booking&service=websites');
assert.equal(confirmation.status, 200, 'Website-specific confirmation must return HTTP 200.');
const html = await confirmation.text();
assert(html.includes('Verkkosivuja koskeva ehdotuspyyntösi'), 'Wrong website-specific confirmation copy.');
console.log('Controlled end-to-end API -> live RPC passed; company marker: ' + company);
console.log('Website-specific confirmation: HTTP 200. Verify Resend delivery separately.');
