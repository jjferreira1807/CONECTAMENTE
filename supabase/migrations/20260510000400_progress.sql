-- =====================================================================
-- Conectamente · 004 progress
-- user_progress (per-episode), reflections, exercise_answers.
-- Each row has user_id; RLS restricts to owner.
-- =====================================================================

create table if not exists public.user_progress (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  episode_slug     citext not null,
  started_at       timestamptz default now(),
  completed_at     timestamptz,
  sections_done    text[] not null default '{}',
  minutes_engaged  numeric(8,2) not null default 0 check (minutes_engaged >= 0),
  last_section     text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (user_id, episode_slug)
);

create index if not exists user_progress_user_idx on public.user_progress (user_id, updated_at desc);
create index if not exists user_progress_completed_idx on public.user_progress (user_id) where completed_at is not null;

drop trigger if exists trg_user_progress_updated_at on public.user_progress;
create trigger trg_user_progress_updated_at
  before update on public.user_progress
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- Reflections (free-text answers per prompt)
-- ---------------------------------------------------------------------

create table if not exists public.reflections (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  episode_slug  citext not null,
  prompt_id     text not null,
  answer        text not null check (length(answer) <= 8000),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (user_id, episode_slug, prompt_id)
);

create index if not exists reflections_user_idx on public.reflections (user_id, updated_at desc);

drop trigger if exists trg_reflections_updated_at on public.reflections;
create trigger trg_reflections_updated_at
  before update on public.reflections
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- Exercise answers (structured payloads)
-- ---------------------------------------------------------------------

create table if not exists public.exercise_answers (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  episode_slug  citext not null,
  exercise_id   text not null,
  -- payload: arbitrary JSON for the exercise's structure (urge surfing, screen audit, etc.)
  payload       jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (user_id, episode_slug, exercise_id)
);

create index if not exists exercise_answers_user_idx on public.exercise_answers (user_id, updated_at desc);

drop trigger if exists trg_exercise_answers_updated_at on public.exercise_answers;
create trigger trg_exercise_answers_updated_at
  before update on public.exercise_answers
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------

alter table public.user_progress enable row level security;
alter table public.reflections enable row level security;
alter table public.exercise_answers enable row level security;

-- user_progress
drop policy if exists "user_progress_owner" on public.user_progress;
create policy "user_progress_owner"
  on public.user_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- reflections
drop policy if exists "reflections_owner" on public.reflections;
create policy "reflections_owner"
  on public.reflections for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- exercise_answers
drop policy if exists "exercise_answers_owner" on public.exercise_answers;
create policy "exercise_answers_owner"
  on public.exercise_answers for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

comment on table public.user_progress is 'Per-user, per-episode progress (one row per user/episode).';
comment on table public.reflections is 'Free-text reflections, one row per user/episode/prompt.';
comment on table public.exercise_answers is 'Structured exercise outputs as JSON.';
