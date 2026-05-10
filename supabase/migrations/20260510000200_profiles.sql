-- =====================================================================
-- Conectamente · 002 profiles
-- One row per auth user. Created automatically on signup.
-- =====================================================================

create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url   text,
  locale       text not null default 'pt-PT',
  timezone     text not null default 'Europe/Lisbon',

  -- Soft preferences
  reminder_hour smallint check (reminder_hour between 0 and 23),
  reminder_enabled boolean not null default false,
  reduced_motion boolean not null default false,

  -- Onboarding state machine: pending | started | completed
  onboarding_state text not null default 'pending'
    check (onboarding_state in ('pending', 'started', 'completed')),

  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists profiles_updated_at_idx on public.profiles (updated_at desc);

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- Auto-create a profile when a new auth user is created
-- ---------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- Hard-delete cascade when an auth user is removed (GDPR)
-- ---------------------------------------------------------------------

-- The on delete cascade on profiles.id handles the profile.
-- Other tables also reference auth.users(id) directly with on delete cascade.

-- ---------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------

alter table public.profiles enable row level security;

drop policy if exists "profiles_self_select" on public.profiles;
create policy "profiles_self_select"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_self_update" on public.profiles;
create policy "profiles_self_update"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- No insert/delete policies: insert is done by the trigger as security
-- definer; delete is performed via cascade from auth.users.

comment on table public.profiles is
  'Per-user preferences and metadata. Mirrors auth.users 1:1.';
