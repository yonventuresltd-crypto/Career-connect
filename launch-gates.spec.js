import { test, expect } from '@playwright/test';

test('public application submissions are closed by default', async ({ page }) => {
  await page.route('**/rest/v1/jobs**', route => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
  await page.goto('/');
  await page.getByRole('button', { name: 'Find Jobs', exact: true }).click();
  await page.getByRole('button', { name: 'Frontend Engineer' }).click();
  await page.getByRole('button', { name: 'Apply for this role' }).click();
  await expect(page.locator('.apply-modal')).toHaveCount(0);
});

test('CV upload control is disabled by default for a signed-in seeker', async ({ page }) => {
  const user = { id: '11111111-1111-4111-8111-111111111111', email: 'staging-seeker@example.test', aud: 'authenticated', role: 'authenticated', app_metadata: { provider: 'email', providers: ['email'] }, user_metadata: { full_name: 'Staging Seeker', account_type: 'seeker' }, email_confirmed_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  const session = { access_token: 'test-session-token', token_type: 'bearer', expires_in: 3600, refresh_token: 'test-refresh-token', user };
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (!url.hostname.endsWith('supabase.co')) return route.continue();
    const json = (data, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(data) });
    if (url.pathname.endsWith('/auth/v1/token')) return json(session);
    if (url.pathname.endsWith('/auth/v1/user')) return json(user);
    if (url.pathname.includes('/storage/v1/object/list/')) return json([]);
    if (url.pathname.includes('/rest/v1/profiles')) return json({ id: user.id, full_name: 'Staging Seeker', account_type: 'seeker', location: 'Asaba' });
    if (url.pathname.includes('/rest/v1/')) return json([]);
    return json({});
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByLabel('Email address').fill(user.email);
  await page.getByLabel('Password').fill('A-strong-staging-password-123');
  await page.getByRole('button', { name: 'Log in', exact: true }).last().click();
  const upload = page.locator('.upload-mini input[type="file"]');
  await expect(upload).toBeDisabled();
  await expect(page.getByText('CV uploads are paused while launch checks are in progress.')).toBeVisible();
});
