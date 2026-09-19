import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';

const target = 'public/ghoulhouse-site-proof.png';
if (existsSync(target) && statSync(target).size > 10_000) {
  console.log('Published-site proof screenshot already present.');
  process.exit(0);
}
const browser = execFileSync('bash', ['-lc',
  'command -v google-chrome || command -v google-chrome-stable || command -v chromium || command -v chromium-browser'
], { encoding: 'utf8' }).trim();
if (!browser) throw new Error('Chrome not available for a genuine published-site capture.');
execFileSync(browser, [
  '--headless=new', '--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu',
  '--disable-dev-shm-usage', '--hide-scrollbars', '--no-first-run',
  '--window-size=1440,900', '--virtual-time-budget=7000',
  `--screenshot=${target}`, 'https://ghoulhouse.fi/'
], { encoding: 'utf8', timeout: 60_000, stdio: ['ignore','pipe','pipe'] });
const bytes = readFileSync(target);
if (bytes.length < 10_000 || bytes.subarray(0,8).toString('hex') !== '89504e470d0a1a0a')
  throw new Error('Published-site screenshot is missing or is not a valid PNG.');
console.log(`Captured actual ghoulhouse.fi at 1440×900 (${bytes.length} bytes).`);
