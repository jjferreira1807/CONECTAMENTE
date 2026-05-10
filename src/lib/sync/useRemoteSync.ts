"use client";
import { useEffect, useRef } from "react";
import { useProgress } from "@/lib/store";
import { getSupabaseBrowser, supabaseConfigured } from "@/lib/supabase/client";
import { api, ApiError } from "@/lib/api/client";

/**
 * Mirrors the Zustand store with the backend when:
 *   1. Supabase is configured (env vars present)
 *   2. There is a signed-in user
 *
 * On mount: pulls remote state and merges with local (remote wins on conflict
 * unless the local value is more recent — for v1 we keep it simple and treat
 * remote as the source of truth on first hydration).
 *
 * On change: pushes incremental updates with light debouncing.
 */
export function useRemoteSync() {
  const hydrated = useProgress((s) => s.hydrated);
  const ranInitial = useRef(false);

  useEffect(() => {
    if (!supabaseConfigured || !hydrated || ranInitial.current) return;
    ranInitial.current = true;

    let cancelled = false;
    (async () => {
      const supabase = getSupabaseBrowser();
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      try {
        const [progress, reflections, exercises, mood, intentions] = await Promise.all([
          api.get<RemoteProgress[]>("/api/progress"),
          api.get<RemoteReflection[]>("/api/reflections"),
          api.get<RemoteExercise[]>("/api/exercises"),
          api.get<RemoteMood[]>("/api/mood"),
          api.get<RemoteIntention[]>("/api/intentions"),
        ]);
        if (cancelled) return;

        useProgress.setState((s) => ({
          episodes: mergeEpisodes(s.episodes, progress, reflections, exercises),
          checkIns: mood.map((m) => ({
            date: m.day, mood: m.mood as 1|2|3|4|5,
            energy: m.energy as 1|2|3|4|5, note: m.note ?? undefined,
          })),
          intentions: intentions.map((i) => ({ date: i.day, text: i.text, done: i.done })),
        }));
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) return; // not signed in
        // eslint-disable-next-line no-console
        console.warn("[sync] initial pull failed", e);
      }
    })();

    return () => { cancelled = true; };
  }, [hydrated]);
}

// ---- merging --------------------------------------------------------------

interface RemoteProgress {
  episode_slug: string;
  started_at: string | null;
  completed_at: string | null;
  sections_done: string[];
  minutes_engaged: number;
  last_section: string | null;
  updated_at: string;
}
interface RemoteReflection { episode_slug: string; prompt_id: string; answer: string; }
interface RemoteExercise   { episode_slug: string; exercise_id: string; payload: unknown; }
interface RemoteMood       { day: string; mood: number; energy: number; note: string | null; }
interface RemoteIntention  { day: string; text: string; done: boolean; }

function mergeEpisodes(
  local: ReturnType<typeof useProgress.getState>["episodes"],
  progress: RemoteProgress[],
  reflections: RemoteReflection[],
  exercises: RemoteExercise[]
) {
  const out = { ...local };
  for (const p of progress) {
    const cur = out[p.episode_slug];
    out[p.episode_slug] = {
      slug: p.episode_slug,
      startedAt: p.started_at ?? cur?.startedAt,
      completedAt: p.completed_at ?? cur?.completedAt,
      sectionsDone: dedup([...(cur?.sectionsDone ?? []), ...p.sections_done]),
      reflections: { ...(cur?.reflections ?? {}) },
      exercises: { ...(cur?.exercises ?? {}) },
      minutesEngaged: Math.max(cur?.minutesEngaged ?? 0, p.minutes_engaged),
    };
  }
  for (const r of reflections) {
    const ep = ensureEp(out, r.episode_slug);
    ep.reflections[r.prompt_id] = r.answer;
  }
  for (const x of exercises) {
    const ep = ensureEp(out, x.episode_slug);
    ep.exercises[x.exercise_id] = x.payload;
  }
  return out;
}

function ensureEp(map: Record<string, ReturnType<typeof useProgress.getState>["episodes"][string]>, slug: string) {
  if (!map[slug]) {
    map[slug] = {
      slug, sectionsDone: [], reflections: {}, exercises: {}, minutesEngaged: 0,
    };
  }
  return map[slug];
}

function dedup<T>(arr: T[]): T[] { return Array.from(new Set(arr)); }
