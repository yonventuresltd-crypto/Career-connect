# CAREER CONNECT — production-readiness tracker

**Status: DO NOT LAUNCH / DO NOT COLLECT REAL CVs.** Environment is treated as production/shared until the owner confirms otherwise. The connected Supabase integration currently exposes one project only (`jhxsogcueczmbbnyrapf`); no separate staging project is identified. No live configuration, data, or deployment was changed in this stage.

Last reviewed: 13 November 2026.

## Render preparation completed (deployment not performed)

- `render.yaml` defines only the standalone `career-connect-school-demo` for safe school submission, with no Supabase keys. `render-connected.yaml` separately defines staging and production sites with distinct Supabase placeholders and default-off application/CV flags; it is not the Blueprint to use for the school demo.
- Both Render sites set real application submissions and CV uploads OFF by default. `src/main.jsx` enforces those UI gates; the default-off UI tests pass. Signup/recovery browser forms now request 12 characters.
- `supabase/migrations/20261113_launch_feature_gates.sql` adds database/storage flags defaulting applications and resume uploads OFF, plus a bucket MIME/size allow-list. It is **not applied** to any remote project. Do not connect the ambiguous existing project or launch until separate projects are provisioned and the migration reviewed/applied/verified.
- Signup confirmation and password recovery use the current browser origin, so an eventual `.com` host should need Supabase redirect allow-list updates, not a Vite rebuild.
- No Render deployment/URL exists yet: this workspace has no Git remote and Render deployment access is not connected. The Render-provided URLs remain untested.

## Environment facts checked

- Connected project: `classic-research` (`jhxsogcueczmbbnyrapf`), region `eu-west-1`, healthy services.
- Supabase Auth `site_url` is the temporary Arena preview URL; allow-list contains preview and localhost URLs. The permanent hostname has not yet been provided.
- Email signup is enabled; email confirmation is required (`mailer_autoconfirm=false`). SMTP host/user/port are unset.
- Auth settings report password minimum **6**, CAPTCHA disabled, breached-password checks disabled. Auth API limits are provider settings currently reported as 30 anonymous requests, 2 email sends, 30 verifies and 30 OTP requests per configured window; confirm exact Supabase units/plan and tune against requirements. This is not an abuse-control test.
- TOTP MFA support is enabled, but actual administrator factor enrollment/enforcement was not verified.
- `resume-download` and `admin-user-action` Edge Functions are ACTIVE with JWT verification enabled.
- The workspace `.env` exposes only Vite Supabase URL and browser publishable/anon key variable names; no service-role variable was found there. No key values are included in this report. A final deployed-bundle and hosting-secret audit remains required.
- Project backup plan/retention and a restore drill have not been verified.

## Gate checklist

### A. Environment, domain and deployment

- [ ] Confirm whether `jhxsogcueczmbbnyrapf` is an isolated staging project or contains any live users/data. Until then, treat as production and do not run writes, test uploads, or destructive checks.
- [ ] Create/identify a separate staging Supabase project with synthetic data and separate auth, storage, email, and secret configuration.
- [ ] Select and own the permanent domain; decide canonical host (`domain` or `www.domain`) and DNS/hosting provider.
- [ ] Configure DNS + HTTPS, production site URL and exact Supabase redirect allow-list entries. Remove preview/localhost entries from production only after checking operational dependencies.
- [ ] Confirm production deploy pipeline and rollback plan; no deployment has been made in this readiness pass.

### B. Authentication, email and security

- [ ] In Supabase Auth settings, set server-side password minimum to at least 12; client signup and recovery forms now request 12 but this alone does not enforce the backend policy.
- [ ] Configure supported CAPTCHA/bot protection with verified site/secret keys; test registration, recovery and abuse rejection.
- [ ] Enable breached-password checks if available for the plan; confirm behavior via test accounts.
- [ ] Configure verified SMTP sender domain and provider credentials in Supabase secrets/settings (never send passwords/API keys through chat or put them in Vite/browser variables).
- [ ] Verify real confirmation, recovery, application, employer, interview/status and security emails in controlled mailboxes; inspect delivered links on the staging domain and verify token expiry/replay behavior.
- [ ] Implement/test application email delivery. Current database notifications are in-app; real outbound application/status email delivery was not verified and SMTP alone does not automatically send those events.
- [ ] Enroll each administrator in TOTP MFA; verify enforced privileged access, recovery codes stored safely, and loss/recovery procedures.
- [ ] Verify rate limits and anti-abuse behavior with a bounded staging test; set alerts and abuse monitoring.
- [ ] Inspect source maps, build output, deployment environment, Git history and browser network for service-role/SMTP/secret leakage; rotate any accidentally exposed secrets.

### C. CV/storage security

- [ ] Use only synthetic, non-sensitive files in staging. Create two test seekers and one employer using dedicated test mailboxes.
- [ ] Prove owner upload/read/delete succeeds, cross-seeker access is denied, unrelated-employer access is denied, and the relevant employer can access only after the intended application authorization.
- [ ] Prove the endpoint returns a link lasting 60 seconds and the URL fails after expiry; test anonymous, forged application ID, unrelated employer, withdrawn/deleted application and replay cases.
- [ ] Test size cap (10 MiB) and allow-list (PDF/DOC/DOCX) including misleading extension/MIME and oversized content. Enforce validation server-side, not only in the browser.
- [ ] Verify object deletion on user request/account deletion, and backup/deletion propagation.
- [ ] Do not run these checks against the currently ambiguous project until explicitly confirmed as staging.

### D. Real backend business flows (staging only)

- [ ] Email signup + verification delivery/link completion; block unverified sign-in as intended.
- [ ] Password recovery delivery, link redirect and successful password change; old password/session behavior verified.
- [ ] Create a real application and confirm correct applicant/job linkage, duplicate protection and notifications.
- [ ] Applicant withdrawal: allowed only for valid own submitted application; test status/content tampering denial.
- [ ] Employer status changes (under review, shortlisted, interview, rejected, accepted); verify own-vacancy restriction and notification/email to seeker.
- [ ] Job closure, deletion, rejection, edit and resubmission/re-review; verify public visibility and audit/moderation state.
- [ ] Check notification rows, read state, recipients, idempotency and email delivery for seeker/employer/interview events.
- [ ] Re-run RLS tests using distinct authenticated identities and unauthenticated calls. Current SQL policy review and anonymous probes are positive spot checks only.

### E. Backups, recovery and monitoring

- [ ] Confirm plan supports required automated backups/PITR; document retention, restore point objectives (RPO), recovery time objective (RTO), access roles and cost.
- [ ] Configure uptime, database/storage/auth error, email bounce and security alerts; test notification routing.
- [ ] Restore a recent backup to an isolated test project, verify schema/representative synthetic records/storage references and app operation, then document timing, gaps and cleanup. Do not restore over production during a drill.
- [ ] Document incident-response, credential rotation, administrator recovery and post-restore steps.

### F. Privacy/legal

- [ ] Counsel/DPO completes the draft in `LEGAL-REVIEW-DRAFTS.md`: controller identity, lawful bases, purposes, rights/process, vendors, international transfers, retention, cookies, account deletion, incident response, terms and employer duties.
- [ ] Confirm NDPA/NDPC applicability and formal obligations, data protection impact assessment need, DPO/registration requirements, cross-border transfer safeguards and complaint route.
- [ ] Implement the approved retention/deletion process (including CV objects, derived copies, notifications, backups and legal holds) before making retention promises.
- [ ] Publish complete approved Privacy Notice, Terms, Cookie Policy, contact details and effective dates; ensure links resolve to distinct documents.

### G. Release approval and production smoke

- [ ] All prior gates signed off by product owner, security reviewer and Nigerian counsel/DPO.
- [ ] Final staging suite covers real DB/Auth/email/storage, full status transitions, deletion, responsive/a11y and no secret exposure.
- [ ] Production smoke only after owner approval/deployment: health, email verification, recovery, least-privilege roles, one synthetic listing/application if allowed, monitoring and rollback check. Do not upload a real candidate CV for a smoke test.
- [ ] Record evidence, timestamps, responsible reviewer and any residual risks. Public launch remains blocked until every mandatory gate is closed.

## Details needed to proceed safely

1. **Domain:** the internet address people will type to visit Career Connect, e.g. `careerconnect.ng` or `www.careerconnect.ng`. Tell us the exact domain you own or are planning to buy; if undecided, say so. Do not share registrar passwords.
2. **Environment:** explicitly identify a disposable staging project/ref, or confirm the current connected project is staging and contains no live personal data. If it is production/shared, do not use it for test writes/files.
3. **Email:** choose a provider (for example a transactional email service) and verify a sender domain. Put credentials only in the provider/Supabase dashboard’s protected secrets/settings—not in chat or the frontend.
4. **Test identities:** create dedicated staging-only seeker A, seeker B and employer accounts; use synthetic records/files and controlled inboxes. Do not share passwords or recovery codes.
