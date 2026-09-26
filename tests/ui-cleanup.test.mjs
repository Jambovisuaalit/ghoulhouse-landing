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
  assert.equal((form.match(/<ProfileChoice\\b/g) || []).length, 1);
  assert.doesNotMatch(form, /leadProfileNoWebsite|lead-profile-options/);
  assert.match(form, /checked=\\{noProfile\\}/);
  assert.match(form, /setProfileValue\\(''\\)/);
  const choice = source('src/components/ProfileChoice.tsx');
  assert.match(choice, /name="noProfile"/);
});

test('mobile proof screenshot stays whole and hero microcopy is legible', () => {
  const css = source('src/app/editorial-home.css');
  assert.match(css, /ghSelectedCaseDisplay \\{[^}]*aspect-ratio:16 \\/ 10/);
  assert.match(css, /ghSelectedCaseDisplay \\.ghSelectedScreenshot \\{[^}]*object-fit:contain/);
  assert.match(css, /ghArtHero \\.ghHeroFootnote \\{ font-size:13px/);
});
