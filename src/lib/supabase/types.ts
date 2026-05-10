/**
 * Database types — hand-authored to mirror /supabase/migrations.
 *
 * Each Table entry must include `Relationships: []` to satisfy the
 * `GenericTable` constraint in @supabase/postgrest-js. Without it, the entire
 * schema collapses to `never`.
 *
 * For larger projects, generate with:
 *   supabase gen types typescript --linked > types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type SectionKind =
  | "text" | "audio" | "reflection" | "meditation" | "timer"
  | "exercise:thoughtRecord" | "exercise:urgeSurfing" | "exercise:screenAudit"
  | "exercise:valuesLadder" | "exercise:sleepHygiene" | "exercise:socialChallenge"
  | "exercise:futureLetter";

export type NotificationKind = "reminder" | "intention" | "streak" | "system" | "episode";

export type EventKind =
  | "page_view" | "episode_open" | "episode_complete" | "section_complete"
  | "audio_play" | "audio_pause" | "audio_progress"
  | "exercise_save" | "reflection_save" | "mood_save" | "intention_save"
  | "download" | "auth_login" | "auth_signup" | "auth_signout" | "error_client";

export type OnboardingState = "pending" | "started" | "completed";

// ---- Row shapes ------------------------------------------------------------

export interface ProfileRow {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  locale: string;
  timezone: string;
  reminder_hour: number | null;
  reminder_enabled: boolean;
  reduced_motion: boolean;
  onboarding_state: OnboardingState;
  created_at: string;
  updated_at: string;
}

export interface EpisodeRow {
  id: string;
  slug: string;
  number: number;
  kicker: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  duration_min: number;
  theme_color: string | null;
  audio_path: string | null;
  cover_path: string | null;
  published: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface SectionRow {
  id: string;
  episode_id: string;
  external_id: string;
  position: number;
  kind: SectionKind;
  title: string | null;
  payload: Json;
  created_at: string;
  updated_at: string;
}

export interface UserProgressRow {
  id: string;
  user_id: string;
  episode_slug: string;
  started_at: string | null;
  completed_at: string | null;
  sections_done: string[];
  minutes_engaged: number;
  last_section: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReflectionRow {
  id: string;
  user_id: string;
  episode_slug: string;
  prompt_id: string;
  answer: string;
  created_at: string;
  updated_at: string;
}

export interface ExerciseAnswerRow {
  id: string;
  user_id: string;
  episode_slug: string;
  exercise_id: string;
  payload: Json;
  created_at: string;
  updated_at: string;
}

export interface MoodTrackingRow {
  id: string;
  user_id: string;
  day: string;
  mood: number;
  energy: number;
  note: string | null;
  context: Json;
  created_at: string;
  updated_at: string;
}

export interface IntentionRow {
  id: string;
  user_id: string;
  day: string;
  text: string;
  done: boolean;
  created_at: string;
  updated_at: string;
}

export interface EpisodeMoodRow {
  id: string;
  user_id: string;
  episode_slug: string;
  phase: "before" | "after";
  mood: number;
  energy: number;
  created_at: string;
}

export interface DownloadRow {
  id: string;
  user_id: string;
  resource: string;
  format: "pdf" | "html" | "print";
  user_agent: string | null;
  created_at: string;
}

export interface NotificationRow {
  id: string;
  user_id: string;
  kind: NotificationKind;
  title: string;
  body: string | null;
  href: string | null;
  read_at: string | null;
  delivered_at: string | null;
  created_at: string;
}

export interface AnalyticsEventRow {
  id: number;
  user_id: string | null;
  anon_id: string | null;
  kind: EventKind;
  episode_slug: string | null;
  section_id: string | null;
  duration_ms: number | null;
  attrs: Json;
  occurred_at: string;
}

export interface WeeklyEngagementRow {
  user_id: string;
  week_start: string;
  audio_ticks: number;
  episodes_completed: number;
  mood_saves: number;
  intention_saves: number;
  approx_minutes: number;
}

// ---- Database --------------------------------------------------------------

type Table<R, RequiredInsert = Record<string, never>> = {
  Row: R;
  Insert: Partial<R> & RequiredInsert;
  Update: Partial<R>;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      profiles:         Table<ProfileRow,         { id: string }>;
      episodes:         Table<EpisodeRow,         { slug: string; number: number; kicker: string; title: string }>;
      sections:         Table<SectionRow,         { episode_id: string; external_id: string; kind: SectionKind }>;
      user_progress:    Table<UserProgressRow,    { user_id: string; episode_slug: string }>;
      reflections:      Table<ReflectionRow,      { user_id: string; episode_slug: string; prompt_id: string; answer: string }>;
      exercise_answers: Table<ExerciseAnswerRow,  { user_id: string; episode_slug: string; exercise_id: string }>;
      mood_tracking:    Table<MoodTrackingRow,    { user_id: string; mood: number; energy: number }>;
      intentions:       Table<IntentionRow,       { user_id: string; text: string }>;
      episode_mood:     Table<EpisodeMoodRow,     { user_id: string; episode_slug: string; phase: "before" | "after"; mood: number; energy: number }>;
      downloads:        Table<DownloadRow,        { user_id: string; resource: string }>;
      notifications:    Table<NotificationRow,    { user_id: string; title: string }>;
      analytics_events: Table<AnalyticsEventRow,  { kind: EventKind }>;
    };
    Views: {
      v_weekly_engagement: { Row: WeeklyEngagementRow; Relationships: [] };
    };
    Functions: Record<string, never>;
    Enums: {
      section_kind: SectionKind;
      notification_kind: NotificationKind;
      event_kind: EventKind;
    };
  };
}
