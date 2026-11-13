import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: 'launch-gates.spec.js',
  timeout: 30000,
  expect: { timeout: 6000 },
  fullyParallel: false,
  reporter: 'list',
  webServer: {
    command: 'VITE_ENABLE_REAL_APPLICATIONS=false VITE_ENABLE_CV_UPLOADS=false npm run dev -- --host 0.0.0.0 --port 5174',
    url: 'http://127.0.0.1:5174',
    reuseExistingServer: false,
    timeout: 30000,
    env: { VITE_ENABLE_REAL_APPLICATIONS: 'false', VITE_ENABLE_CV_UPLOADS: 'false' }
  },
  use: { baseURL: 'http://127.0.0.1:5174', browserName: 'chromium', headless: true, viewport: { width: 1365, height: 900 } }
});
