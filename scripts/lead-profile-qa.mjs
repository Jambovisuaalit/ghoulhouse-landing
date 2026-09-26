import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

const source = readFileSync('src/lib/lead.ts', 'utf8');
const javascript = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const exports = {};
runInNewContext(javascript, { exports, URL });
const { validateLead, NO_PROFILE_YET } = exports;
function assert(condition, message) { if (!condition) throw Error(message); }
const base = { intent: 'booking', company: 'Koe Oy', name: 'Testikäyttäjä', email: 'test@example.invalid' };
const without = validateLead({ ...base, profile: NO_PROFILE_YET });
assert(without.ok, 'Explicit no-profile choice must be accepted.');
assert(without.data.profile === NO_PROFILE_YET, 'No-profile choice must be preserved for sales handoff.');
assert(!without.data.website && !without.data.instagram, 'No-profile choice must not invent a URL.');
assert(!validateLead({ ...base, profile: '' }).ok, 'Blank profile without explicit choice is not allowed.');
assert(!validateLead({ ...base, profile: 'satunnainen merkkijono' }).ok, 'Invalid arbitrary profile must remain invalid.');
assert(validateLead({ ...base, profile: 'esimerkki.fi' }).ok, 'Existing website profiles still work.');
assert(validateLead({ ...base, profile: '@esimerkki' }).ok, 'Existing Instagram profiles still work.');
console.log('Lead profile QA PASS: no-channel explicit choice, invalid input, website and Instagram.');
