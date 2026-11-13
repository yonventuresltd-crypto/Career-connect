import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: 'demo.spec.js',
  timeout: 30000,
  expect: { timeout: 6000 },
  fullyParallel: false,
  reporter: 'list',
  webServer: {
    command: 'VITE_DEMO_MODE=true VITE_APP_ENV=demo VITE_ENABLE_REAL_APPLICATIONS=false VITE_ENABLE_CV_UPLOADS=false npm run build && npm run preview -- --host 0.0.0.0 --port 5176',
    url: 'http://127.0.0.1:5176',
    reuseExistingServer: false,
    timeout: 30000
  },
  use: { baseURL: 'http://127.0.0.1:5176', browserName: 'chromium', headless: true, viewport: { width: 1365, height: 900 } }
});
