import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

for (const scenario of ['matching', 'wrong-sha', 'production', 'changed-head']) {
  test(`preview resolver: ${scenario}`, () => {
    const dir = mkdtempSync(join(tmpdir(), 'gh-preview-'));
    const preload = join(dir, 'mock.mjs');
    const sha = 'a'.repeat(40);
    const host = 'ghoulhouse-home-test-info-32533854s-projects.vercel.app';
    writeFileSync(preload, `
      let clock = 0;
      Date.now = () => clock++ < 2 ? 0 : 360001;
      globalThis.setTimeout = fn => { fn(); return 0; };
      globalThis.fetch = async url => {
        let data;
        if (url.includes('/pulls/')) data = {head:{sha:'${scenario === 'changed-head' ? 'b'.repeat(40) : sha}'}};
        else if (url.includes('/deployments?')) data = [];
        else if (url.includes('/comments?')) data = [{user:{id:35613825},performed_via_github_app:{id:8329},body:'https://${host}'}];
        else if (url.endsWith('/api/qa-version')) data = {sha:'${scenario === 'wrong-sha' ? 'b'.repeat(40) : sha}',environment:'${scenario === 'production' ? 'production' : 'preview'}',url:'${host}'};
        else throw Error('Unexpected request: '+url);
        return new Response(JSON.stringify(data), {status:200});
      };
    `);
    try {
      const result = spawnSync(process.execPath, ['--import', preload, resolve('scripts/resolve-preview.mjs')], {
        cwd: dir, encoding: 'utf8', timeout: 5000,
        env: { ...process.env, GITHUB_REPOSITORY: 'test/repo', GITHUB_TOKEN: 'mock', QA_HEAD_SHA: sha, QA_PR_NUMBER: '79', GITHUB_OUTPUT: join(dir, 'output') },
      });
      assert.equal(result.status, scenario === 'matching' ? 0 : 1, result.stderr);
      if (scenario !== 'matching') assert.match(result.stderr, /PR head changed|No successful Preview/);
    } finally { rmSync(dir, {recursive:true,force:true}); }
  });
}
