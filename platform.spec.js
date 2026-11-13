import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const project = 'https://jhxsogcueczmbbnyrapf.supabase.co';
const ids = { seeker: '11111111-1111-4111-8111-111111111111', employer: '22222222-2222-4222-8222-222222222222', admin: '44444444-4444-4444-8444-444444444444' };
const liveJob = {
  id: '33333333-3333-4333-8333-333333333333', title: 'Frontend Engineer', company_name: 'Test Studio', category: 'Technology',
  location: 'Lagos, Nigeria', workplace: 'Hybrid', employment_type: 'Full-time', experience_level: 'Mid-level',
  salary_min: 6000000, salary_max: 9000000, currency: 'NGN', status: 'approved', description: 'Build useful tools for a growing Nigerian team.',
  responsibilities: 'Collaborate with product and design.', requirements: 'React and accessible UI experience.', qualifications: 'Relevant experience.', benefits: 'Health cover.',
  created_at: new Date().toISOString(), deadline: null, employer_id: ids.employer
};
const pendingJob = { ...liveJob, id: '55555555-5555-4555-8555-555555555555', title: 'Pending Review Role', status: 'pending', employer_id: ids.employer };
const users = {
  seeker: { id: ids.seeker, email: 'seeker@example.test', user_metadata: { full_name: 'Ada Seeker', account_type: 'seeker' } },
  employer: { id: ids.employer, email: 'employer@example.test', user_metadata: { full_name: 'Izu Employer', account_type: 'employer' } },
  admin: { id: ids.admin, email: 'admin@example.test', user_metadata: { full_name: 'Admin Tester', account_type: 'admin' } }
};

async function mockBackend(page) {
  let role = 'seeker';
  const createdJobs = [];
  const applications = [];
  const saved = [];
  const notifications = [];
  const reports = [];
  const signups = [];
  const user = () => ({ ...users[role], aud: 'authenticated', role: 'authenticated', app_metadata: { provider: 'email', providers: ['email'] }, email_confirmed_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
  const session = () => ({ access_token: `mock-${role}-token`, token_type: 'bearer', expires_in: 3600, refresh_token: `mock-${role}-refresh`, user: user() });
  await page.route(`${project}/**`, async route => {
    const req = route.request(); const url = new URL(req.url()); const path = url.pathname; const method = req.method();
    const json = (data, status = 200, headers = {}) => route.fulfill({ status, contentType: 'application/json', headers, body: JSON.stringify(data) });
    if (path.endsWith('/auth/v1/token') && url.searchParams.get('grant_type') === 'password') {
      const body = req.postDataJSON(); role = String(body.email).startsWith('employer') ? 'employer' : String(body.email).startsWith('admin') ? 'admin' : 'seeker'; return json(session());
    }
    if (path.endsWith('/auth/v1/signup')) {
      const body = req.postDataJSON(); signups.push(body); role = body.data?.account_type === 'employer' ? 'employer' : 'seeker';
      return json({ user: { ...user(), user_metadata: body.data }, session: null }, 200);
    }
    if (path.endsWith('/auth/v1/recover')) return json({});
    if (path.endsWith('/auth/v1/logout')) return route.fulfill({ status: 204, body: '' });
    if (path.endsWith('/auth/v1/user')) return json(user());
    if (path.includes('/rest/v1/profiles')) {
      if (method === 'GET') {
        const profile = { id: ids[role], full_name: users[role].user_metadata.full_name, account_type: role, headline: role === 'seeker' ? 'Product-minded engineer' : 'Recruiting team', location: 'Asaba, Delta', avatar_url: null };
        return json(req.headers()['accept']?.includes('vnd.pgrst.object') ? profile : [profile]);
      }
      return json([]);
    }
    if (path.includes('/rest/v1/jobs')) {
      if (method === 'GET') {
        const isOwnerView = url.searchParams.get('employer_id')?.includes(ids.employer);
        return json(isOwnerView ? createdJobs : role === 'admin' ? [pendingJob, liveJob] : [liveJob, ...createdJobs.filter(j => j.status === 'approved')]);
      }
      if (method === 'POST') {
        const data = req.postDataJSON(); const batch = Array.isArray(data) ? data : [data];
        batch.forEach(x => createdJobs.unshift({ ...x, id: `job-${createdJobs.length + 1}`, status: x.status || 'pending', created_at: new Date().toISOString() }));
        return json([], 201);
      }
      if (method === 'PATCH') { const id=url.searchParams.get('id')?.slice(3);const patch=req.postDataJSON();const target=createdJobs.find(j=>j.id===id);if(target)Object.assign(target,patch);if(id===pendingJob.id)Object.assign(pendingJob,patch);return json([],204); }
      if (method === 'DELETE') { const id=url.searchParams.get('id')?.slice(3);const at=createdJobs.findIndex(j=>j.id===id);if(at>=0)createdJobs.splice(at,1);return json([],204); }
      return json([]);
    }
    if (path.includes('/rest/v1/applications')) {
      if (method === 'GET') return json(applications.map(a => ({ ...a, jobs: liveJob })));
      if (method === 'POST') {
        const data = req.postDataJSON(); const batch = Array.isArray(data) ? data : [data];
        batch.forEach(a => { applications.push({ ...a, id: `application-${applications.length + 1}`, status: 'submitted', created_at: new Date().toISOString() }); notifications.push({ id: `notice-${notifications.length + 1}`, title: 'A new application is in', body: 'Someone applied for Frontend Engineer.', created_at: new Date().toISOString() }); });
        return json([], 201);
      }
      if (method === 'PATCH') return json([], 204);
      return json([]);
    }
    if (path.includes('/rest/v1/saved_jobs')) {
      if (method === 'GET') return json(saved);
      if (method === 'POST') { const d=req.postDataJSON(); (Array.isArray(d)?d:[d]).forEach(x=>saved.push({job_id:x.job_id})); return json([],201); }
      if (method === 'DELETE') return json([],204);
      return json([]);
    }
    if (path.includes('/rest/v1/notifications')) return json(notifications);
    if (path.includes('/rest/v1/job_reports')) { if(method==='POST'){reports.push(req.postDataJSON());return json([],201)} return json(reports); }
    if (path.includes('/rest/v1/companies')) return json([]);
    if (path.includes('/storage/v1/object/list/career-resumes')) return json([]);
    if (path.includes('/storage/v1/object/list/career-avatars')) return json([]);
    if (path.includes('/functions/v1/admin-user-action')) return json({ok:true,is_suspended:false});
    if (path.includes('/functions/v1/resume-download')) return json({signed_url:'https://example.test/private-resume',expires_in:60});
    return json([]);
  });
  return { createdJobs, applications, saved, notifications, reports, signups };
}

async function signIn(page, email='seeker@example.test') {
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByLabel('Email address').fill(email);
  await page.getByLabel('Password').fill('A-strong-test-password-123');
  await page.getByRole('button', { name: 'Log in', exact: true }).last().click();
}

test('landing, links, and layout fit desktop, tablet, and phone', async ({ page }) => {
  for (const size of [{width:1365,height:900},{width:768,height:1024},{width:390,height:844}]) {
    await page.setViewportSize(size); await page.goto('/');
    if (size.width <= 850) await page.getByRole('button', { name: 'Toggle navigation' }).click();
    await expect(page.getByRole('heading', { name: /Connect with opportunities/i })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Find Jobs', exact: true })).toBeVisible();
    const widths = await page.evaluate(() => ({scroll:document.documentElement.scrollWidth, client:document.documentElement.clientWidth}));
    expect(widths.scroll).toBeLessThanOrEqual(widths.client + 1);
  }
});

test('signup form validates and calls Supabase email registration', async ({ page }) => {
  await mockBackend(page); await page.goto('/'); await page.getByRole('button', { name: 'Get started', exact: true }).click();
  await page.getByLabel('Your name').fill('Taylor Test'); await page.getByLabel('Email address').fill('employer@example.test');
  await page.getByLabel('Password').fill('A-strong-test-password-123'); await page.locator('select[name="account_type"]').selectOption('employer');
  await page.getByRole('checkbox').check(); await page.getByRole('button', { name: 'Create free account' }).click();
  await expect(page.getByText(/check your email to verify your address/i)).toBeVisible();
});

test('signup rejects passwords under 12 characters in the client form', async ({ page }) => {
  const data = await mockBackend(page); await page.goto('/'); await page.getByRole('button', { name: 'Get started', exact: true }).click();
  await page.getByLabel('Your name').fill('Test Seeker'); await page.getByLabel('Email address').fill('short-password@example.test');
  const password = page.getByLabel('Password'); await password.fill('TooShort8!');
  await expect(password).toHaveAttribute('minlength', '12');
  await page.getByRole('checkbox').check(); await page.getByRole('button', { name: 'Create free account' }).click();
  expect(await password.evaluate(el => el.validity.tooShort)).toBe(true); await expect.poll(() => data.signups.length).toBe(0);
});

test('seeker signs in, searches, applies, and sees application tracking', async ({ page }) => {
  const data = await mockBackend(page); await page.goto('/'); await signIn(page);
  await expect(page.getByRole('heading', { name: /Good to see you, Ada/i })).toBeVisible();
  await page.getByRole('button', { name: 'Find Jobs', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Work that works for you.' })).toBeVisible();
  await page.getByPlaceholder('Role, company, or keyword').fill('Frontend');
  await expect(page.getByRole('button', { name: 'Frontend Engineer' })).toBeVisible();
  await page.getByLabel('Employment type').selectOption('Contract');
  await expect(page.getByText('No roles found just yet.')).toBeVisible();
  await page.getByLabel('Employment type').selectOption('All');
  await page.getByLabel('Job category').selectOption('Technology');
  await expect(page.getByRole('button', { name: 'Frontend Engineer' })).toBeVisible();
  await page.getByRole('button', { name: 'Save job' }).click();
  await expect(page.getByRole('button', { name: 'Unsave job' })).toBeVisible();
  await expect.poll(() => data.saved.length).toBe(1);
  await page.getByRole('button', { name: 'Frontend Engineer' }).click();
  await page.getByRole('button', { name: 'Apply for this role' }).click();
  await page.getByPlaceholder(/Tell them what caught your eye/i).fill('I would love to contribute to this team.');
  await page.getByRole('button', { name: 'Submit application' }).click();
  await expect.poll(() => data.applications.length).toBe(1);
  await page.getByRole('button', { name: 'Job Manager' }).click();
  await expect(page.getByText('Submitted', { exact: true })).toBeVisible();
});

test('employer signs in and posts a job for moderation', async ({ page }) => {
  const data = await mockBackend(page); await page.goto('/'); await signIn(page, 'employer@example.test');
  await expect(page.getByRole('heading', { name: /Build a team that moves you forward/i })).toBeVisible();
  await page.getByRole('button', { name: 'Post a Job' }).click();
  await page.getByLabel('Job title').fill('QA Test Analyst'); await page.getByLabel('Company name').fill('Izu Labs');
  await page.getByLabel('Location').fill('Asaba, Delta'); await page.getByLabel('Role overview').fill('Help us build and test reliable software.');
  await page.getByRole('button', { name: 'Submit role for review' }).click();
  await expect.poll(() => data.createdJobs.length).toBe(1);
  expect(data.createdJobs[0].status).toBe('pending');
  await expect(page.getByText('Job submitted for review. It will appear publicly after approval.')).toBeVisible();
  await page.getByRole('button', { name: 'Job Manager', exact: true }).click();
  await page.getByRole('button', { name: /My job posts/ }).click();
  await page.getByRole('button', { name: 'Edit listing' }).click();
  await page.getByLabel('Job title').fill('QA Test Analyst II');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect.poll(() => data.createdJobs[0].title).toBe('QA Test Analyst II');
});

test('admin sees the moderation queue and can approve a reviewed job', async ({ page }) => {
  await mockBackend(page); await page.goto('/'); await signIn(page, 'admin@example.test');
  await expect(page.getByRole('heading', { name: /Care for the community/i })).toBeVisible();
  await page.getByRole('button', { name: /Job review/ }).click();
  await expect(page.getByText('Pending Review Role')).toBeVisible();
  await page.getByRole('button', { name: 'Approve listing' }).click();
  await expect(page.locator('.soft-badge.job-approved').first()).toBeVisible();
});

test('job report form submits a moderation report', async ({ page }) => {
  const data = await mockBackend(page); await page.goto('/'); await signIn(page);
  await page.getByRole('button', { name: 'Find Jobs', exact: true }).click(); await page.getByRole('button', { name: 'Frontend Engineer' }).click();
  await page.getByRole('button', { name: 'Report' }).click();
  await page.locator('select[name="reason"]').selectOption('Suspicious or fraudulent');
  await page.locator('textarea[name="details"]').fill('QA test report'); await page.getByRole('button', { name: 'Send report' }).click();
  await expect.poll(() => data.reports.length).toBe(1);
  await expect(page.getByText('Thank you. Our team will review this report.')).toBeVisible();
});

test('login and password-recovery forms reach Supabase Auth', async ({ page }) => {
  await mockBackend(page); await page.goto('/'); await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('button', { name: 'Forgot password?' }).click();
  await page.getByLabel('Email address').fill('seeker@example.test');
  await page.getByRole('button', { name: 'Send reset link' }).click();
  await expect(page.getByText('Password reset link sent. Check your inbox.')).toBeVisible();
});
