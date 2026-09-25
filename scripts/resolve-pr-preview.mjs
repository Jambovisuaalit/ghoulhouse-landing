import assert from 'node:assert/strict';
import { appendFile } from 'node:fs/promises';

// Resolve a deployment bound to THIS pull request head SHA and branch.
// First use GitHub's deployment records (short-lived GITHUB_TOKEN, no Vercel credential).
// If the integration does not publish a deployment URL there, use a team-scoped Vercel token.
const sha = process.env.PR_HEAD_SHA;
const branch = process.env.PR_HEAD_REF;
assert(/^[0-9a-f]{40}$/.test(sha || ''), 'PR_HEAD_SHA is missing or invalid.');
assert(branch, 'PR_HEAD_REF is missing.');
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let url;

async function githubPreview() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY;
  if (!token || !repo) return null;
  const headers = {
    Authorization: 'Bearer ' + token,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  const root = 'https://api.github.com/repos/' + repo;
  for (let attempt = 0; attempt < 60; attempt++) {
    const query = new URLSearchParams({ sha, per_page: '100' });
    const response = await fetch(root + '/deployments?' + query, { headers });
    if (!response.ok) {
      console.warn('GitHub deployments unavailable (HTTP ' + response.status + '); using Vercel API.');
      return null;
    }
    const records = await response.json();
    const deployments = records.filter((d) =>
      d.sha === sha &&
      d.ref === branch &&
      !d.production_environment &&
      /preview/i.test(d.environment || '')
    );
    for (const deployment of deployments) {
      const statusesResponse = await fetch(root + '/deployments/' + deployment.id + '/statuses?per_page=20', { headers });
      if (!statusesResponse.ok) continue;
      const statuses = await statusesResponse.json();
      const ready = statuses.find((status) => status.state === 'success' && status.environment_url);
      if (!ready) continue;
      const candidate = new URL(ready.environment_url);
      if (candidate.protocol === 'https:' && (candidate.hostname === 'vercel.app' || candidate.hostname.endsWith('.vercel.app'))) {
        console.log('GitHub deployment verified for PR head SHA ' + sha + ' and branch ' + branch + '.');
        return candidate.origin;
      }
    }
    if (deployments.some((d) => d.task === 'error')) throw new Error('Matching GitHub preview deployment failed.');
    if (deployments.length === 0 && attempt >= 2) return null;
    await sleep(8000);
  }
  return null;
}

url = await githubPreview();
if (!url) {
  const token = process.env.VERCEL_TOKEN;
  assert(token, 'No matching GitHub Preview deployment; set a team-scoped VERCEL_TOKEN to verify Vercel directly.');
  const projectId = 'prj_4St4iNqJbNIbdpsoOaftanarvDLW';
  const teamId = 'team_zwsvoePoiBeskRuyl2Iar883';
  const endpoint = 'https://api.vercel.com';
  const headers = { Authorization: 'Bearer ' + token };
  const query = new URLSearchParams({ projectId, teamId, limit: '50', target: 'preview' });
  let selected;
  for (let attempt = 0; attempt < 60; attempt++) {
    const response = await fetch(endpoint + '/v6/deployments?' + query, { headers });
    assert(response.ok, 'Vercel list-deployments failed: HTTP ' + response.status + '. Check team-scoped VERCEL_TOKEN.');
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
  url = 'https://' + deployment.url;
}

const probe = await fetch(url, { redirect: 'manual' });
assert(probe.ok || probe.status === 307 || probe.status === 308, 'Verified preview failed HTTP probe: ' + probe.status);
console.log('Verified PR preview: ' + url + ' / ' + sha);
await appendFile(process.env.GITHUB_ENV, 'QA_BASE_URL=' + url + '\n');
