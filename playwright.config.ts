import { defineConfig } from '@playwright/test';
import { loadAppConfig } from './src/config/environment';

const appConfig = loadAppConfig();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 60000,
  expect: { timeout: 10000 },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'test-results/junit/results.xml' }],
  ],
  use: {
    baseURL: appConfig.baseURL,
    actionTimeout: appConfig.actionTimeoutMs,
    navigationTimeout: appConfig.navigationTimeoutMs,
    screenshot: 'on',
    trace: 'on',
    video: 'on',
    headless: false,
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
