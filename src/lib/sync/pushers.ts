"use client";
/**
 * Fire-and-forget pushers — call from components when local state changes
 * to mirror it to the backend. Each pusher is a no-op when Supabase is
 * unconfigured or the user is signed out (server returns 401 → swallowed).
 *
 * These intentionally do NOT wait for the response in the UI thread —
 * the optimistic update already happened in the Zustand store.
 */
import { api, ApiError } from "@/lib/api/client";
import { supabaseConfigured } from "@/lib/supabase/client";

const swallow = (p: Promise<unknown>) =>
  p.catch((e) => {
    if (e instanceof ApiError && (e.status === 401 || e.status === 503)) return;
    // eslint-disable-next-line no-console
    console.warn("[sync] push failed", e);
  });

export const remote = {
  progress(payload: {
    episodeSlug: string;
    sectionsDone?: string[];
    minutesEngaged?: number;
    completedAt?: string | null;
    lastSection?: string;
  }) {
    if (!supabaseConfigured) return;
    swallow(api.post("/api/progress", payload));
  },

  reflection(payload: { episodeSlug: string; promptId: string; answer: string }) {
    if (!supabaseConfigured) return;
    swallow(api.post("/api/reflections", payload));
  },

  exercise(payload: { episodeSlug: string; exerciseId: string; payload: unknown }) {
    if (!supabaseConfigured) return;
    swallow(api.post("/api/exercises", payload));
  },

  mood(payload: { mood: number; energy: number; note?: string; day?: string }) {
    if (!supabaseConfigured) return;
    swallow(api.post("/api/mood", payload));
  },

  intention(payload: { text: string; done?: boolean; day?: string }) {
    if (!supabaseConfigured) return;
    swallow(api.post("/api/intentions", payload));
  },

  intentionToggle(payload: { day: string; done: boolean }) {
    if (!supabaseConfigured) return;
    swallow(api.patch("/api/intentions", payload));
  },

  analytics(events: {
    kind: string; episodeSlug?: string; sectionId?: string;
    durationMs?: number; attrs?: Record<string, unknown>;
  } | { events: unknown[] }) {
    if (!supabaseConfigured) return;
    swallow(api.post("/api/analytics", events));
  },

  download(payload: { resource: string; format?: "pdf" | "html" | "print" }) {
    if (!supabaseConfigured) return;
    swallow(api.post("/api/downloads", payload));
  },
};
