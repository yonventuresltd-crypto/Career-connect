import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  testIgnore: ['launch-gates.spec.js','demo.spec.js'],
  timeout: 30000,
  expect: { timeout: 6000 },
  fullyParallel: false,
  reporter: 'list',
  webServer: { command: 'npm run dev -- --host 0.0.0.0 --port 5173', url: 'http://127.0.0.1:5173', reuseExistingServer: !process.env.CI, timeout: 30000, env: { VITE_ENABLE_REAL_APPLICATIONS: 'true', VITE_ENABLE_CV_UPLOADS: 'true' } },
  use: { baseURL: 'http://127.0.0.1:5173', browserName: 'chromium', headless: true, viewport: { width: 1365, height: 900 }, trace: 'retain-on-failure', screenshot: 'only-on-failure' }
});
