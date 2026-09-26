import { execFileSync } from 'node:child_process';
import { mkdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const chrome = execFileSync(
  'bash',
  ['-lc', 'command -v google-chrome || command -v google-chrome-stable || command -v chromium || command -v chromium-browser'],
  { encoding: 'utf8' }
).trim();
const output = 'qa-artifacts/proof-pricing';
mkdirSync(output, { recursive: true });

for (const [name, path] of [
  ['referenssit', '/referenssit'],
  ['hinta', '/verkkosivut/hinta'],
]) {
  const response = await fetch('http://127.0.0.1:3000' + path);
  if (!response.ok) throw new Error(`${path} returned ${response.status}`);
  const html = await response.text();
  const headings = [...html.matchAll(/<h1\b[^>]*>/g)];
  if (headings.length !== 1) throw new Error(`${path} has ${headings.length} H1 headings`);

  for (const width of [390, 768, 1440]) {
    const file = join(output, `${name}-${width}.png`);
    execFileSync(chrome, [
      '--headless=new', '--no-sandbox', '--disable-dev-shm-usage',
      '--hide-scrollbars', '--disable-gpu', '--virtual-time-budget=2000',
      `--window-size=${width},900`, `--screenshot=${file}`,
      'http://127.0.0.1:3000' + path,
    ], { stdio: 'ignore', timeout: 30000 });
    if (statSync(file).size < 5000) throw new Error(`Screenshot is unexpectedly small: ${file}`);
    console.log(file);
  }
}
