import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const layout = readFileSync(new URL('../src/app/layout.tsx', import.meta.url), 'utf8');

test('organization schema exposes address, contact point and service area', () => {
  assert.match(layout, /'@type': 'PostalAddress'/);
  assert.match(layout, /streetAddress: siteConfig\.company\.postalAddress\.street/);
  assert.match(layout, /email: 'hello@ghoulhouse\.fi'/);
  assert.match(layout, /contactType: 'sales'/);
  assert.match(layout, /name: 'Uusimaa'/);
});

test('founder schema links to verified public profile without conflating organization profiles', () => {
  assert.match(layout, /const founderProfiles = \[\s*'https:\/\/fi\.linkedin\.com\/in\/hanna-nyholm-1b5213434'/);
  assert.match(layout, /sameAs: organizationProfiles/);
  assert.match(layout, /sameAs: founderProfiles/);
});
