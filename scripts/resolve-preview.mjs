import { mkdir, writeFile, appendFile } from 'node:fs/promises';

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
    if (url.protocol !== 'https:' || !/^ghoulhouse-home-[a-z0-9]+-info-32533854s-projects\.vercel\.app$/.test(url.hostname)) throw Error('Unexpected deployment URL');
    await checkHead();
    await mkdir('qa-artifacts/preview', { recursive: true });
    await writeFile('qa-artifacts/preview/deployment.json', JSON.stringify({ sha, pr, deploymentId: deployment.id, url: url.origin }, null, 2));
    await appendFile(process.env.GITHUB_OUTPUT, `url=${url.origin}\n`);
    console.log(`QA bound to PR #${pr}, SHA ${sha}, deployment ${deployment.id}`);
    process.exit(0);
  }
  await new Promise(resolve => setTimeout(resolve, 10_000));
}
throw Error('No successful Preview deployment for the exact PR head SHA');
