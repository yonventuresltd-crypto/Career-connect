# CAREER CONNECT — QA & launch readiness report

**Assessment date:** 13 November 2026  
**Scope:** End-to-end smoke/regression testing, automated accessibility checks, Supabase security/configuration spot checks, and launch blockers.  
**Overall:** Core mocked user journeys pass and the app builds cleanly. A 12-character minimum is now enforced by the signup and password-reset forms in the client, but Supabase still enforces 6 server-side. **Not yet production-launch ready**: tests do not exercise real inbox/email callbacks or authenticated private-file access against live user accounts; the Supabase Auth project is still configured with the temporary preview origin, default six-character password minimum, no SMTP host, and no CAPTCHA. Permanent domain, backups/restore, and legal review remain outstanding.

## Verification results

| Area | Result | Evidence / limitation |
|---|---|---|
| Production build | **PASS** | `npm run build` — Vite completed successfully; generated client bundle about 462 kB before gzip (127 kB gzip). |
| Playwright suite | **PASS — 10/10** | `npx playwright test` — signup form (mocked Auth), client-side under-12 password rejection, seeker sign-in/search/filter/save/apply/tracking, employer posting/edit, admin approval, job reporting, recovery-link request (mocked), responsive widths, and automated accessibility scans. |
| Pre-launch gates | **PASS — 2/2 UI checks** | `npx playwright test --config=playwright.gates.config.js` — default-off client configuration blocks application modal and disables CV upload control for a signed-in mocked seeker. This does not replace database/RLS enforcement. |
| Render Blueprints | **PASS — syntax/shape only** | `render.yaml` parses as the school-demo-only Static Site with no Supabase values. `render-connected.yaml` separately defines staging and production connected sites, with distinct Supabase placeholders and default-off application/CV flags. |
| Render-style static preview | **PASS — 2/2** | `npx playwright test --config=playwright.render-preview.config.js` — production-mode Vite build served statically with application/CV gates OFF. This is a local simulation, not a Render-provided URL test; no Render deployment/URL exists yet. |
| School demonstration mode | **PASS — 1/1** | `npm run test:demo` — production-mode standalone demo build exercised seeker, employer and administrator sample workflows; generated seven screenshots. No live backend or real user data was used. |
| Accessibility | **PASS for tested screens** | axe-core WCAG 2.1 A/AA checks: homepage at desktop and 390px mobile, job search, and signup dialog. No violations in those scans. This is not a full manual or whole-site accessibility audit. |
| Mobile/tablet layout | **PASS for tested landing viewports** | Chromium widths 1365, 768, and 390 px; no horizontal overflow; main heading and Find Jobs action visible. |
| Dependency audit | **PASS** | `npm audit --omit=dev` — zero production dependency vulnerabilities. Development dependencies are excluded from this command. |
| Supabase services | **PASS at time checked** | Auth, DB, REST, Storage all returned `ACTIVE_HEALTHY`. |
| Database RLS | **Positive spot checks; not a full audit** | RLS enabled on profiles, companies, jobs, applications, saved_jobs, notifications and job_reports; policies reviewed for ownership/role scoping. Anonymous job insert was rejected (401/RLS violation), anonymous profile read returned no rows. Trigger functions additionally restrict account-role changes, self-approval/status manipulation and application edits/withdrawals. |
| Storage rules | **Positive configuration review; live access test pending** | `career-resumes` is private (10 MiB); owner-scoped upload/read/update/delete policies. `career-avatars` is public (2 MiB); writes are owner-scoped. `resume-download` is deployed ACTIVE with JWT verification enabled and issues short-lived links after authorization. Cross-account allow/deny behavior was not exercised with real accounts/files. |

## Coverage notes

The Playwright suite intercepts Supabase endpoints and exercises the app’s UI and client request flows with test data. It does **not** create real accounts, send or receive verification/recovery emails, or prove that live database writes and file permissions succeed for distinct production users. The recovery test verifies only that the reset-link request reaches the mocked Auth endpoint; email delivery and the set-new-password callback remain unverified. Resume upload/download and cross-user denial need a controlled authenticated staging test with two seeker/employer accounts and non-sensitive sample documents.

## Launch blockers and recommended sequence

1. **Domain and Auth redirects:** Set the final HTTPS domain as the Supabase Auth site URL and allow only the production domain’s exact redirect URLs (plus any explicitly retained development URLs). The project currently allows its temporary Arena preview origin and localhost; do not launch with the preview as the canonical redirect.
2. **Email delivery:** Configure verified production SMTP, sender identity, templates, delivery monitoring, and rate limits. Auth currently has email verification enabled (`mailer_autoconfirm=false`) but `smtp_host` is unset; successful real email delivery is therefore not verified.
3. **Password/security policy:** Supabase currently reports a six-character minimum, CAPTCHA disabled, and password breach checks disabled. Raise the minimum (recommend at least 12), enable suitable abuse controls/CAPTCHA and breached-password checks where available, and verify throttling before public signup. Configure MFA for administrator accounts.
4. **Private CV staging test:** With dedicated staging accounts and synthetic files, verify owner upload/open, authorized employer access only after an application, 60-second link expiry, and denial for another seeker, unrelated employer, anonymous session, and missing/withdrawn application as intended. Check deletion and file type/size rejection too.
5. **Business-flow regression:** Add live/staging checks for application-status changes, withdrawal, job closure/deletion, rejected-job edit/re-review, notifications, email verification and password-recovery completion. Current mocked coverage does not verify all status transitions or real notification delivery.
6. **Backups/restore:** Confirm the Supabase plan’s backup/PITR configuration, retention and monitoring, and perform a documented restore drill. Not verified in this assessment.
7. **Legal/privacy:** Have qualified Nigeria data-protection counsel review and finalize the Terms, Privacy Notice, retention/deletion, data-subject request, employer CV-access, incident response, and NDPA obligations before collecting real candidate data.
8. **Release operations:** Keep service-role credentials server-side only; verify environment separation, error/uptime monitoring, admin recovery procedures, and a production smoke test after deployment.

## Commands

```sh
npm run build
npm run test:e2e
npm audit --omit=dev
```
