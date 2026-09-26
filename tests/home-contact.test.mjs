import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// The homepage must have exactly one native form, including the no-JS
// photo-demo retry path. Duplicate markup previously left two competing forms.
test('homepage contact section has one heading and one intent-aware form', () => {
  const source = readFileSync(new URL('../src/app/page.tsx', import.meta.url), 'utf8');
  const contact = source.match(/<section className="ghContact ghSection"[\s\S]*?<\/section>/)?.[0];
  assert.ok(contact, 'Homepage contact section missing');
  assert.equal((contact.match(/id="contact-title"/g) || []).length, 1);
  assert.equal((contact.match(/<LeadForm\b/g) || []).length, 1);
  assert.match(contact, /mode=\{params\.intent === 'photos' \? 'social' : 'proposal'\}/);
  assert.equal((contact.match(/className="ghServerFormError"/g) || []).length, 1);
});
