-- =====================================================================
-- Conectamente · drop profiles (privacy by design)
--
-- Why:
--   The previous 002_profiles migration kept a per-user `profiles` table
--   AND a trigger (`handle_new_user`) that auto-populated `display_name`
--   from Google's `raw_user_meta_data->>'name'` at sign-up. This means a
--   Google login was silently replicating the user's display name into
--   our schema — even though the product never needed it.
--
--   We now keep zero personal data beyond what `auth.users` itself stores
--   (email, OAuth `sub`, last_sign_in_at — all managed by Supabase). The
--   app addresses the user solely by their auth UUID. Email never leaves
--   `auth.users` for any of our tables.
--
-- What this migration does:
--   1. Drop the auth-user → profiles trigger (no more name replication).
--   2. Drop the trigger function entirely (security definer surface gone).
--   3. Drop the per-row `updated_at` trigger and helper index.
--   4. Drop all `profiles` RLS policies.
--   5. Drop the `profiles` table.
--
-- Idempotent: every drop is `if exists`, so re-running is safe. Run this
-- AFTER all consumers (api/me, schemas.ts) have been updated to not query
-- profiles — already done in this commit.
-- =====================================================================

-- 1. Stop auto-creating profiles from Google's name/avatar/etc.
drop trigger if exists on_auth_user_created on auth.users;

-- 2. Drop the function that read `raw_user_meta_data` at sign-up.
drop function if exists public.handle_new_user();

-- 3. Drop the per-row updated_at trigger + helper index.
drop trigger if exists trg_profiles_updated_at on public.profiles;
drop index  if exists public.profiles_updated_at_idx;

-- 4. Drop RLS policies (must come before table drop).
drop policy if exists "profiles_self_select" on public.profiles;
drop policy if exists "profiles_self_update" on public.profiles;

-- 5. Drop the table itself. No cascade needed — nothing else references it.
drop table if exists public.profiles;

comment on schema public is
  'Conectamente — progress-only schema. No profiles table by design: the user is identified solely by auth.uid().';
