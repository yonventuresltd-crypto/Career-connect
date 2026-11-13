# CAREER CONNECT — Render deployment guide

## Immediate school submission: safe demo only

The default `render.yaml` intentionally creates **one public static site only**:

- Service: `career-connect-school-demo`
- Deployment mode: fictional local-only data, no Supabase URL or key, no account backend, no CV input, no application submission.
- Render assigns the service a unique free `onrender.com` hostname after you connect the repository and create the Blueprint.

The separate `render-connected.yaml` is reserved for future **staging** and **production** static sites. It contains `sync: false` placeholders for separate Supabase URL/publishable keys. Do **not** select that Blueprint for the school demo. This workspace has no Git remote and no Render integration, so no deployment or live URL has been created here yet.

## Steps to get the teacher-ready URL

1. Download `Career-Connect-Render-Source.zip` (or use the source files in this workspace) and extract them.
2. Create a private GitHub/GitLab repository and upload the project files at its root. Do not upload `.env`; `.gitignore` excludes it. Keep `render.yaml` at the repository root.
3. In the Render Dashboard, choose **New → Blueprint**, connect that repository and the branch, then review the one `career-connect-school-demo` Static Site in the default `render.yaml` and apply it. Render Blueprints support static-site rewrites for SPA paths and the configured `sync: false` values are not present in this demo Blueprint [Blueprint reference](https://docs.render.com/blueprint-spec).
4. Wait for Render’s first build/deploy to finish. Open the service page in Render and copy its assigned `onrender.com` URL for your teacher. Each Render static site receives a unique `onrender.com` URL [Render first-deploy guide](https://render.com/docs/your-first-deploy).
5. Check the page opens, try all three demo roles, and submit the URL. There are no secrets or Supabase values to enter for this demo site.

The `career-connect-school-demo` service may be a new public URL, but its actions are demonstration-only. Sample job saves, posting/edit/close, status changes and moderation decisions exist only in browser memory; they do not create persistent records.

## Safe demonstration behavior

- **Try demo account** cards let the viewer enter Ada Okafor (seeker), Tunde Eze (employer), or Career Connect Admin (administrator); no passwords are used.
- Job browsing, filtering, save/unsave, candidate status, sample job changes and moderation queue interactions are simulated with fictional data.
- Application submit is disabled, no file picker/CV upload exists in the demo app, and the banner states that everything is fictional/local.
- The demo Render build sets `VITE_DEMO_MODE=true`, `VITE_APP_ENV=demo`, and both `VITE_ENABLE_REAL_APPLICATIONS` / `VITE_ENABLE_CV_UPLOADS` false. It does not receive Supabase env values.
- `npm run test:demo` builds the production demo and exercises all three personas; it writes screenshots under `screenshots/`.

## Staging and production later (not needed for school submission)

`render-connected.yaml` defines separate `career-connect-staging` and `career-connect-production` static sites. Do not create these services until the owner has two distinct Supabase projects and has completed the relevant security, email, backup and legal checks.

If/when ready:

1. Create/confirm isolated staging and production Supabase projects; do not use the current ambiguous project for both.
2. Review and apply `supabase/migrations/20261113_launch_feature_gates.sql` independently to each project; verify server-side application and resume-upload flags are both OFF. The migration has not been applied remotely.
3. Create a separate Render Blueprint using `render-connected.yaml`; fill the staging service only with its staging URL/publishable key and production service only with production URL/publishable key. Never put a service-role key or SMTP secret in `VITE_*`.
4. Keep real application/CV switches OFF until the security/email/privacy sign-offs are complete. Browser feature flags are not a substitute for database/storage policy enforcement.

## Custom domain later

The current browser host is not baked into frontend code. Signup confirmation and password-reset links use `window.location.origin`. Later, attach a custom domain in Render, wait for HTTPS, then set that exact HTTPS origin in the correct Supabase Auth Site URL and redirect allow-list. Re-test signup/recovery links on the new host. This should not require a frontend rebuild, but Supabase redirect configuration must be updated.

## Tests completed and what is not verified

- Core UI suite: 10/10 mocked-flow tests.
- Default-off application/CV gate suite: 2/2 UI tests.
- Production-mode static preview: 2/2 checks.
- School demo production build: 1/1 walkthrough across all three roles; seven screenshots generated.
- `render.yaml` is syntax checked. These are local tests—not a Render URL smoke test.
- No Render service has been created because the project has no Git remote and this workspace has no Render account connection. After the owner connects the repository, the actual assigned URL still needs a browser smoke check.
