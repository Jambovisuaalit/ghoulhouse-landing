import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const source = (path) => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('unused homepage clients and obsolete contact form remain removed', () => {
  for (const path of [
    'src/components/HeroDotGrid.tsx',
    'src/components/Service3DCarousel.tsx',
    'src/components/sections/FinalCTA.tsx',
    'src/components/contact/LeadForm.tsx',
  ]) assert.equal(existsSync(new URL('../' + path, import.meta.url)), false, path);
});

test('only one opt-out choice appears in the homepage form', () => {
  const form = source('src/components/LeadForm.tsx');
  assert.equal(form.split('<ProfileChoice').length - 1, 1);
  assert.ok(!form.includes('leadProfileNoWebsite'));
  assert.ok(!form.includes('lead-profile-options'));
  assert.ok(form.includes('checked={noProfile}'));
  assert.ok(form.includes("setProfileValue('')"));
  assert.ok(source('src/components/ProfileChoice.tsx').includes('name="noProfile"'));
});

test('mobile proof screenshot stays whole and hero microcopy is legible', () => {
  const css = source('src/app/editorial-home.css');
  assert.ok(css.includes('aspect-ratio:16 / 10;'));
  assert.ok(css.includes('object-fit:contain;'));
  assert.ok(css.includes('font-size:13px; line-height:1.55;'));
});
