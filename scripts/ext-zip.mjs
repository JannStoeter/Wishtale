// Packt extension/ zu extension-dist/wishtale-chrome-<version>.zip für den Chrome Web Store.
import { readFileSync, mkdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const v = JSON.parse(readFileSync('extension/manifest.json', 'utf8')).version;
mkdirSync('extension-dist', { recursive: true });
const out = `extension-dist/wishtale-chrome-${v}.zip`;
rmSync(out, { force: true });
execFileSync('zip', ['-r', '-X', `../${out}`, 'manifest.json', 'background.js', 'icons'], { cwd: 'extension', stdio: 'inherit' });
console.log('fertig:', out);
