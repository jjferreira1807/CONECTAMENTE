-- =====================================================================
-- Conectamente · 005 emotional layer
-- mood_tracking and intentions. One row per user per day for both.
-- =====================================================================

create table if not exists public.mood_tracking (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  day         date not null default (now() at time zone 'Europe/Lisbon')::date,
  mood        smallint not null check (mood between 1 and 5),
  energy      smallint not null check (energy between 1 and 5),
  note        text check (length(note) <= 500),
  -- optional context: which episode/section was active when this was recorded
  context     jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id, day)
);

create index if not exists mood_tracking_user_day_idx on public.mood_tracking (user_id, day desc);

drop trigger if exists trg_mood_tracking_updated_at on public.mood_tracking;
create trigger trg_mood_tracking_updated_at
  before update on public.mood_tracking
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- Intentions (one per day, may be edited until end of day)
-- ---------------------------------------------------------------------

create table if not exists public.intentions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  day         date not null default (now() at time zone 'Europe/Lisbon')::date,
  text        text not null check (length(text) between 1 and 280),
  done        boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id, day)
);

create index if not exists intentions_user_day_idx on public.intentions (user_id, day desc);

drop trigger if exists trg_intentions_updated_at on public.intentions;
create trigger trg_intentions_updated_at
  before update on public.intentions
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- Pre/post mood for episodes (optional second snapshot)
-- ---------------------------------------------------------------------

create table if not exists public.episode_mood (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  episode_slug  citext not null,
  phase         text not null check (phase in ('before', 'after')),
  mood          smallint not null check (mood between 1 and 5),
  energy        smallint not null check (energy between 1 and 5),
  created_at    timestamptz not null default now(),
  unique (user_id, episode_slug, phase)
);

create index if not exists episode_mood_user_idx on public.episode_mood (user_id, created_at desc);

-- ---------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------

alter table public.mood_tracking enable row level security;
alter table public.intentions enable row level security;
alter table public.episode_mood enable row level security;

drop policy if exists "mood_tracking_owner" on public.mood_tracking;
create policy "mood_tracking_owner"
  on public.mood_tracking for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "intentions_owner" on public.intentions;
create policy "intentions_owner"
  on public.intentions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "episode_mood_owner" on public.episode_mood;
create policy "episode_mood_owner"
  on public.episode_mood for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

comment on table public.mood_tracking is 'Daily mood + energy + optional note. One row per user per day.';
comment on table public.intentions is 'Daily intention. One row per user per day.';
comment on table public.episode_mood is 'Optional pre/post-episode mood snapshot.';
