-- =====================================================================
-- Conectamente · 001 init
-- Extensions, enums, helper functions used by every other migration.
-- =====================================================================

-- pgcrypto provides gen_random_uuid(); pre-installed on Supabase but
-- declaring it explicitly makes migrations portable.
create extension if not exists "pgcrypto";

-- citext for case-insensitive text columns (emails, slugs)
create extension if not exists "citext";

-- ---------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------

do $$ begin
  create type public.section_kind as enum (
    'text', 'audio', 'reflection', 'meditation', 'timer',
    'exercise:thoughtRecord', 'exercise:urgeSurfing', 'exercise:screenAudit',
    'exercise:valuesLadder', 'exercise:sleepHygiene', 'exercise:socialChallenge',
    'exercise:futureLetter'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.notification_kind as enum (
    'reminder', 'intention', 'streak', 'system', 'episode'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.event_kind as enum (
    'page_view', 'episode_open', 'episode_complete', 'section_complete',
    'audio_play', 'audio_pause', 'audio_progress', 'exercise_save',
    'reflection_save', 'mood_save', 'intention_save', 'download',
    'auth_login', 'auth_signup', 'auth_signout', 'error_client'
  );
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------
-- Generic updated_at trigger
-- ---------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- Helper: assert that the current request is authenticated
-- ---------------------------------------------------------------------

create or replace function public.require_auth()
returns uuid
language plpgsql
stable
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'auth required' using errcode = '42501';
  end if;
  return uid;
end;
$$;

comment on function public.require_auth() is
  'Returns auth.uid() and raises 42501 (insufficient_privilege) when anonymous.';
