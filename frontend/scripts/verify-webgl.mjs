import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const baseUrl = process.env.CRESCENT_TEST_URL || 'http://127.0.0.1:5173/';
const outDir = new URL('../tmp/visual-checks/', import.meta.url);
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined;

async function checkViewport(browser, name, viewport) {
  const page = await browser.newPage({ viewport });
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.waitForSelector('.webgl-hero-scene canvas', { timeout: 10000 });
  await page.waitForTimeout(900);
  const canvasStats = await page.locator('.webgl-hero-scene canvas').evaluate((canvas) => {
    const context = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!context) return { supported: false, nonEmpty: false, sampled: 0 };
    const width = Math.min(canvas.width, 80);
    const height = Math.min(canvas.height, 80);
    const data = new Uint8Array(width * height * 4);
    context.readPixels(0, 0, width, height, context.RGBA, context.UNSIGNED_BYTE, data);
    let lit = 0;
    for (let index = 0; index < data.length; index += 4) {
      if (data[index] || data[index + 1] || data[index + 2]) lit += 1;
    }
    return { supported: true, nonEmpty: lit > 20, sampled: lit };
  });
  await page.screenshot({ path: new URL(`${name}.png`, outDir).pathname, fullPage: false });
  await page.close();
  return { name, viewport, canvasStats };
}

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ executablePath });
const results = [
  await checkViewport(browser, 'desktop-home', { width: 1440, height: 1000 }),
  await checkViewport(browser, 'mobile-home', { width: 390, height: 844 }),
];
await browser.close();

console.log(JSON.stringify(results, null, 2));

if (results.some((result) => !result.canvasStats.nonEmpty)) {
  process.exitCode = 1;
}
