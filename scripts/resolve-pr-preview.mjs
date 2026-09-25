import assert from 'node:assert/strict';
import { appendFile } from 'node:fs/promises';

// Resolve by BOTH branch AND exact head SHA; never exercise an earlier Ready preview.
const token = process.env.VERCEL_TOKEN;
const sha = process.env.PR_HEAD_SHA;
const branch = process.env.PR_HEAD_REF;
assert(token, 'Missing GitHub Actions secret VERCEL_TOKEN: preview QA is fail-closed.');
assert(/^[0-9a-f]{40}$/.test(sha || ''), 'PR_HEAD_SHA is missing or invalid.');
assert(branch, 'PR_HEAD_REF is missing.');
const projectId = 'prj_4St4iNqJbNIbdpsoOaftanarvDLW';
const teamId = 'team_zwsvoePoiBeskRuyl2Iar883';
const endpoint = 'https://api.vercel.com';
const headers = { Authorization: 'Bearer ' + token };
const query = new URLSearchParams({ projectId, teamId, limit: '50', target: 'preview' });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let selected;
for (let attempt = 0; attempt < 60; attempt++) {
  const response = await fetch(endpoint + '/v6/deployments?' + query, { headers });
  assert(response.ok, 'Vercel list-deployments failed: HTTP ' + response.status);
  const result = await response.json();
  selected = (result.deployments || []).find((d) =>
    (d.meta?.githubCommitSha || d.gitSource?.sha) === sha &&
    (d.meta?.githubCommitRef || d.gitSource?.ref) === branch &&
    d.target !== 'production'
  );
  if (selected?.readyState === 'ERROR' || selected?.readyState === 'CANCELED') throw Error('Matching preview failed: ' + selected.id);
  if (selected?.readyState === 'READY') break;
  await sleep(8000);
}
assert(selected?.readyState === 'READY', 'No READY Vercel preview matches this exact PR head SHA and branch.');
const verify = await fetch(endpoint + '/v13/deployments/' + encodeURIComponent(selected.id) + '?teamId=' + teamId, { headers });
assert(verify.ok, 'Could not verify matching deployment: HTTP ' + verify.status);
const deployment = await verify.json();
assert.equal(deployment.meta?.githubCommitSha, sha, 'Resolved deployment SHA mismatch');
assert.equal(deployment.meta?.githubCommitRef, branch, 'Resolved deployment branch mismatch');
assert.equal(deployment.readyState, 'READY', 'Resolved deployment is not Ready');
const url = 'https://' + deployment.url;
console.log('Verified PR preview: ' + url + ' / ' + sha);
await appendFile(process.env.GITHUB_ENV, 'QA_BASE_URL=' + url + '\n');
