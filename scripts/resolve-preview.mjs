import { mkdir, writeFile, appendFile, readFile } from 'node:fs/promises';

const { GITHUB_REPOSITORY: repo, GITHUB_TOKEN: token, QA_HEAD_SHA: sha, QA_PR_NUMBER: pr } = process.env;
if (!/^[\w.-]+\/[\w.-]+$/.test(repo || '') || !/^[a-f0-9]{40}$/.test(sha || '') || !/^\d+$/.test(pr || '')) throw Error('Missing PR identity');
const api = async path => {
  const response = await fetch(`https://api.github.com/repos/${repo}/${path}`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' } });
  if (!response.ok) throw Error(`GitHub API: ${response.status}`);
  return response.json();
};
const checkHead = async () => {
  if ((await api(`pulls/${pr}`)).head.sha !== sha) throw Error('PR head changed; rerun QA for the latest commit');
};
const verifyIdentity = async url => {
  const response = await fetch(`${url}/api/qa-version`, { cache: 'no-store' });
  if (!response.ok) return null;
  const identity = await response.json();
  if (identity.sha !== sha || identity.environment !== 'preview') return null;
  if (!/^ghoulhouse-home-[a-z0-9]+-info-32533854s-projects\.vercel\.app$/.test(identity.url || '')) return null;
  return `https://${identity.url}`;
};
const record = async (url, deploymentId) => {
  if (await verifyIdentity(url) !== url) throw Error('Preview build identity mismatch');
  await checkHead();
  await mkdir('qa-artifacts/preview', { recursive: true });
  await writeFile('qa-artifacts/preview/deployment.json', JSON.stringify({ sha, pr, deploymentId, url }, null, 2));
  await appendFile(process.env.GITHUB_OUTPUT, `url=${url}\n`);
  console.log(`QA bound to PR #${pr}, SHA ${sha}, deployment ${deploymentId}`);
};
if (process.env.QA_RECHECK_URL) {
  const evidence = JSON.parse(await readFile('qa-artifacts/preview/deployment.json', 'utf8'));
  const expected = process.env.QA_RECHECK_URL;
  if (evidence.url !== expected || evidence.sha !== sha || String(evidence.pr) !== pr) throw Error('Tested deployment evidence mismatch');
  await checkHead();
  if (await verifyIdentity(expected) !== expected) throw Error('Tested deployment identity changed');
  console.log(`Rechecked the tested deployment: ${expected} at ${sha}`);
  process.exit(0);
}
const deadline = Date.now() + 360_000;
while (Date.now() < deadline) {
  await checkHead();
  const deployments = await api(`deployments?sha=${sha}&per_page=100`);
  for (const deployment of deployments) {
    if (deployment.sha !== sha || deployment.creator?.login !== 'vercel[bot]' || deployment.environment?.toLowerCase() !== 'preview') continue;
    const statuses = await api(`deployments/${deployment.id}/statuses?per_page=1`);
    const status = statuses[0];
    if (status?.state !== 'success') continue;
    const url = new URL(status.environment_url);
    if (url.protocol !== 'https:' || !/^ghoulhouse-home-[a-z0-9-]+-info-32533854s-projects\.vercel\.app$/.test(url.hostname)) throw Error('Unexpected deployment URL');
    const immutable = await verifyIdentity(url.origin);
    if (!immutable) continue;
    await record(immutable, deployment.id);
    process.exit(0);
  }
  // Some Vercel installations publish PR comments but no deployment records.
  // The bot URL is discovery only: the hosted build must attest the exact SHA,
  // Preview environment and immutable deployment URL, which is checked again.
  const comments = await api(`issues/${pr}/comments?per_page=100`);
  for (const comment of comments) {
    if (comment.user?.id !== 35613825 || comment.performed_via_github_app?.id !== 8329) continue;
    const matches = comment.body.matchAll(/https:\/\/ghoulhouse-home-[a-z0-9-]+-info-32533854s-projects\.vercel\.app/g);
    for (const match of matches) {
      const immutable = await verifyIdentity(match[0]).catch(() => null);
      if (!immutable) continue;
      await record(immutable, `verified-build:${immutable}`);
      process.exit(0);
    }
  }
  await new Promise(resolve => setTimeout(resolve, 10_000));
}
throw Error('No successful Preview deployment for the exact PR head SHA');
