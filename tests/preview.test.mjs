import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync, mkdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

for (const scenario of ['matching', 'wrong-sha', 'production', 'changed-head', 'alias', 'recheck', 'recheck-mismatch']) {
  test(`preview resolver: ${scenario}`, () => {
    const dir = mkdtempSync(join(tmpdir(), 'gh-preview-'));
    const preload = join(dir, 'mock.mjs');
    const sha = 'a'.repeat(40);
    const host = 'ghoulhouse-home-test-info-32533854s-projects.vercel.app';
    const success = ['matching', 'alias', 'recheck'].includes(scenario);
    const recheck = scenario.startsWith('recheck');
    if (recheck) {
      mkdirSync(join(dir, 'qa-artifacts/preview'), {recursive:true});
      writeFileSync(join(dir, 'qa-artifacts/preview/deployment.json'), JSON.stringify({sha,pr:'79',url:`https://${host}`,deploymentId:'original'}));
    }
    writeFileSync(preload, `
      let clock = 0;
      Date.now = () => clock++ < 2 ? 0 : 360001;
      globalThis.setTimeout = fn => { fn(); return 0; };
      globalThis.fetch = async url => {
        let data;
        if (url.includes('/pulls/')) data = {head:{sha:'${scenario === 'changed-head' ? 'b'.repeat(40) : sha}'}};
        else if (url.includes('/deployments?')) data = ${scenario === 'alias' ? JSON.stringify([{id:1,sha,creator:{login:'vercel[bot]'},environment:'Preview'}]) : '[]'};
        else if (url.includes('/statuses?')) data = [{state:'success', environment_url:'https://ghoulhouse-home-git-test-info-32533854s-projects.vercel.app'}];
        else if (url.includes('/comments?')) data = [{user:{id:35613825},performed_via_github_app:{id:8329},body:'https://${host}'}];
        else if (url.endsWith('/api/qa-version')) data = {sha:'${scenario === 'wrong-sha' ? 'b'.repeat(40) : sha}',environment:'${scenario === 'production' ? 'production' : 'preview'}',url:'${host}'};
        else throw Error('Unexpected request: '+url);
        return new Response(JSON.stringify(data), {status:200});
      };
    `);
    try {
      const result = spawnSync(process.execPath, ['--import', preload, resolve('scripts/resolve-preview.mjs')], {
        cwd: dir, encoding: 'utf8', timeout: 5000,
        env: { ...process.env, QA_RECHECK_URL: recheck ? `https://${scenario === 'recheck-mismatch' ? 'wrong.example.com' : host}` : '', GITHUB_REPOSITORY: 'test/repo', GITHUB_TOKEN: 'mock', QA_HEAD_SHA: sha, QA_PR_NUMBER: '79', GITHUB_OUTPUT: join(dir, 'output') },
      });
      assert.equal(result.status, success ? 0 : 1, result.stderr);
      if (!success) assert.match(result.stderr, /PR head changed|No successful Preview|evidence mismatch/);
      if (scenario === 'recheck') assert.equal(JSON.parse(readFileSync(join(dir, 'qa-artifacts/preview/deployment.json'))).deploymentId, 'original');
    } finally { rmSync(dir, {recursive:true,force:true}); }
  });
}
