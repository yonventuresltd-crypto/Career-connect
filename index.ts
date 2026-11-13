import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { ...cors, 'Content-Type': 'application/json' } });
  try {
    const header = req.headers.get('Authorization') || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : header;
    const url = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const userClient = createClient(url, anonKey, { global: { headers: { Authorization: `Bearer ${token}` } }, auth: { persistSession: false } });
    const { data: userResult, error: userError } = await userClient.auth.getUser(token);
    if (userError || !userResult.user) return new Response(JSON.stringify({ error: 'Sign in required' }), { status: 401, headers: { ...cors, 'Content-Type': 'application/json' } });
    const { application_id } = await req.json();
    if (!application_id || typeof application_id !== 'string') return new Response(JSON.stringify({ error: 'Application ID required' }), { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } });
    const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
    const { data: app, error } = await admin.from('applications').select('id,seeker_id,resume_path,job_id').eq('id', application_id).maybeSingle();
    if (error || !app) return new Response(JSON.stringify({ error: 'Application not found' }), { status: 404, headers: { ...cors, 'Content-Type': 'application/json' } });
    const isApplicant = app.seeker_id === userResult.user.id;
    const { data: job } = await admin.from('jobs').select('employer_id').eq('id', app.job_id).maybeSingle();
    const isHiringTeam = job?.employer_id === userResult.user.id;
    if (!isApplicant && !isHiringTeam) return new Response(JSON.stringify({ error: 'You are not authorized to access this CV' }), { status: 403, headers: { ...cors, 'Content-Type': 'application/json' } });
    if (!app.resume_path) return new Response(JSON.stringify({ error: 'No CV was attached to this application' }), { status: 404, headers: { ...cors, 'Content-Type': 'application/json' } });
    const { data: signed, error: signError } = await admin.storage.from('career-resumes').createSignedUrl(app.resume_path, 60, { download: true });
    if (signError || !signed?.signedUrl) return new Response(JSON.stringify({ error: 'Could not create a secure download link' }), { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } });
    return new Response(JSON.stringify({ signed_url: signed.signedUrl, expires_in: 60 }), { status: 200, headers: { ...cors, 'Content-Type': 'application/json' } });
  } catch (_error) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } });
  }
});
