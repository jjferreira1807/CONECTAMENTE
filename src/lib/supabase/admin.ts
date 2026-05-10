import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client for trusted server-side jobs (cron, maintenance, GDPR
 * exports). Bypasses RLS. NEVER expose this to the browser. The key must be
 * set as a non-public env var (SUPABASE_SERVICE_ROLE_KEY).
 */
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
