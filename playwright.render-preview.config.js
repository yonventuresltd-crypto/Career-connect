import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: 'launch-gates.spec.js',
  timeout: 30000,
  expect: { timeout: 6000 },
  fullyParallel: false,
  reporter: 'list',
  webServer: {
    command: 'VITE_APP_ENV=production VITE_ENABLE_REAL_APPLICATIONS=false VITE_ENABLE_CV_UPLOADS=false npm run build && npm run preview -- --host 0.0.0.0 --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: false,
    timeout: 120000
  },
  use: { baseURL: 'http://127.0.0.1:4173', browserName: 'chromium', headless: true, viewport: { width: 1365, height: 900 } }
});
