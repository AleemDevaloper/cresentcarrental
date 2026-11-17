import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const pages = [
  '/',
  '/about',
  '/solutions',
  '/products',
  '/services',
  '/case-studies',
  '/pricing',
  '/team',
  '/careers',
  '/contact',
  '/demo',
  '/blog',
];

const localsDir = path.resolve('tests/playwright/screenshots');
const liveDir = path.resolve('tests/playwright/live_screenshots');
const diffsDir = path.resolve('tests/playwright/diffs');
if (!fs.existsSync(liveDir)) fs.mkdirSync(liveDir, { recursive: true });
if (!fs.existsSync(diffsDir)) fs.mkdirSync(diffsDir, { recursive: true });

const sites = [
  { name: 'zylvoo', base: 'https://zylvoo.com' },
  { name: 'xovo', base: 'https://xovotechnologies.com' },
];

for (const site of sites) {
  for (const p of pages) {
    test(`${site.name} ${p}`, async ({ page }) => {
      const full = site.base + (p === '/' ? '/' : p);
      await page.goto(full, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
      const name = p === '/' ? 'home' : p.replace(/\//g, '_').replace(/^_/, '');
      const livePath = path.join(liveDir, `${site.name}_${name}.png`);
      await page.screenshot({ path: livePath });

      const localPath = path.join(localsDir, `${name}.png`);
      if (!fs.existsSync(localPath)) {
        console.warn('Local screenshot missing for', name);
        return;
      }

      const img1 = PNG.sync.read(fs.readFileSync(localPath));
      const img2 = PNG.sync.read(fs.readFileSync(livePath));
      const { width, height } = img1;
      const diff = new PNG({ width, height });
      const mism = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.12 });
      const diffPath = path.join(diffsDir, `${site.name}_${name}_diff.png`);
      fs.writeFileSync(diffPath, PNG.sync.write(diff));
      console.log(`${site.name} ${name}: ${mism} pixels differ — diff -> ${diffPath}`);
    });
  }
}
