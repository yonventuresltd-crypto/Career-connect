# Career Connect database

The Career Connect schema and security policies are installed in the connected Supabase project. Migrations are named `career_connect_core`, `career_connect_secure_profile`, and `career_connect_hiring_rls`.

## Tables and storage

- `profiles`, `companies`, `jobs`, `applications`, `saved_jobs`, `notifications`, `job_reports`
- Private `career-resumes` bucket for user-uploaded PDFs/DOC/DOCX (10 MB limit)
- Public `career-avatars` bucket for small profile photos (2 MB limit)
- `resume-download` Edge Function: verifies the signed-in user is the applicant or the employer for that application before issuing a 60-second private download URL.

Row-level security is enabled for every platform table. A job seeker can only read their own applications and saved jobs. Employers can access applications/profiles connected to their own vacancies. Employers cannot approve their own job listings, and account roles cannot be changed by a regular user.

## Supabase client setup

The local `.env` file points to the connected project and contains only its browser-safe publishable key. Keep the service-role key out of this repository, browser bundle, and `.env` file.

## Granting administrator access

Administrator privileges are **not** available through public registration. A project owner should identify a verified account and promote it in the Supabase SQL editor, for example:

```sql
update public.profiles
set account_type = 'admin'
where id = (select id from auth.users where email = 'admin@example.com');
```

The admin dashboard and moderation policies then become available to that account. Protect the administrator account with a strong password and MFA.

## Before a public launch

Configure the Supabase Auth site URL and allowed redirect URLs for the production domain, enable email verification, configure SMTP, set up backup/monitoring and rate limits, and review the privacy notice/terms with qualified Nigeria data-protection counsel. Never post preview/sample listings as if they were real vacancies.
