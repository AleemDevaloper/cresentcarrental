import { test, expect } from '@playwright/test';

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

for (const p of pages) {
  test(`visual: ${p}`, async ({ page, baseURL }) => {
    await page.goto(baseURL + p, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400); // allow animations
    const path = p === '/' ? 'home' : p.replace(/\//g, '_').replace(/^_/, '');
    await page.screenshot({ path: `tests/playwright/screenshots/${path}.png` });
  });
}
