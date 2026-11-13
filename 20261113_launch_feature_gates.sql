-- Career Connect launch gates. Apply separately to the isolated staging and
-- production Supabase projects after review. This migration defaults both
-- public applications and resume uploads to OFF. It intentionally does not
-- enable either feature, and it must not be applied blindly to the ambiguous
-- existing project.

create table if not exists public.platform_feature_flags (
  feature_key text primary key check (feature_key in ('public_applications', 'resume_uploads')),
  enabled boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.platform_feature_flags enable row level security;
revoke all on table public.platform_feature_flags from anon, authenticated;
grant all on table public.platform_feature_flags to service_role;

insert into public.platform_feature_flags (feature_key, enabled)
values ('public_applications', false), ('resume_uploads', false)
on conflict (feature_key) do nothing;

-- Enforce bucket-level size/MIME allow-list in addition to UI checks. MIME is
-- client-supplied metadata; verify file signatures server-side before opening
-- uploads in a public environment.
update storage.buckets
set file_size_limit = 10485760,
    allowed_mime_types = array[
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
where id = 'career-resumes';

create or replace function public.platform_feature_is_enabled(p_feature_key text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select f.enabled from public.platform_feature_flags f where f.feature_key = p_feature_key),
    false
  );
$$;

revoke all on function public.platform_feature_is_enabled(text) from public;
grant execute on function public.platform_feature_is_enabled(text) to anon, authenticated, service_role;

-- Keep the existing seeker-role and approved-job checks, but add a backend
-- switch so a browser flag alone cannot enable public applications.
drop policy if exists "Seekers apply to approved jobs" on public.applications;
create policy "Seekers apply to approved jobs when enabled"
on public.applications
for insert
to authenticated
with check (
  public.platform_feature_is_enabled('public_applications')
  and seeker_id = auth.uid()
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.account_type = 'seeker'
  )
  and exists (
    select 1 from public.jobs j
    where j.id = applications.job_id and j.status = 'approved'
  )
);

-- Resume upload and replacement are disabled server-side. Existing owners may
-- still read or delete their own objects, and the authorized download Edge
-- Function remains the only employer path. Re-enabling requires an explicit
-- service-role configuration change in the matching isolated environment.
drop policy if exists "Users upload own resumes" on storage.objects;
create policy "Users upload own resumes when enabled"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'career-resumes'
  and (storage.foldername(name))[1] = auth.uid()::text
  and public.platform_feature_is_enabled('resume_uploads')
);

drop policy if exists "Users update own resumes" on storage.objects;
create policy "Users update own resumes when enabled"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'career-resumes'
  and (storage.foldername(name))[1] = auth.uid()::text
  and public.platform_feature_is_enabled('resume_uploads')
)
with check (
  bucket_id = 'career-resumes'
  and (storage.foldername(name))[1] = auth.uid()::text
  and public.platform_feature_is_enabled('resume_uploads')
);
