import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/playwright',
  timeout: 60_000,
  retries: 0,
  workers: 1,
  use: {
    headless: true,
    viewport: { width: 1280, height: 800 },
    actionTimeout: 15_000,
    baseURL: 'http://127.0.0.1:5174',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});