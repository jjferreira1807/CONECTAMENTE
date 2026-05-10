"use client";
/**
 * Conectamente progress store.
 *
 * Persists locally by default. When Supabase env is configured and a user is
 * signed in, `useSyncProgress` mirrors changes to the `progress` table.
 */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Mood = 1 | 2 | 3 | 4 | 5; // 1=muito mal, 5=muito bem
export type CheckIn = {
  date: string; // ISO yyyy-mm-dd
  mood: Mood;
  energy: Mood;
  note?: string;
};

export type EpisodeProgress = {
  slug: string;
  startedAt?: string;
  completedAt?: string;
  sectionsDone: string[]; // section ids
  reflections: Record<string, string>; // promptId -> answer
  exercises: Record<string, unknown>; // exerciseId -> result
  minutesEngaged: number;
};

export type Intention = {
  date: string;
  text: string;
  done?: boolean;
};

interface ProgressState {
  hydrated: boolean;
  setHydrated: (v: boolean) => void;

  episodes: Record<string, EpisodeProgress>;
  ensureEpisode: (slug: string) => void;
  markSection: (slug: string, sectionId: string) => void;
  saveReflection: (slug: string, promptId: string, value: string) => void;
  saveExercise: (slug: string, exerciseId: string, value: unknown) => void;
  addMinutes: (slug: string, minutes: number) => void;
  completeEpisode: (slug: string) => void;

  checkIns: CheckIn[];
  addCheckIn: (c: CheckIn) => void;

  intentions: Intention[];
  setIntentionForToday: (text: string) => void;
  toggleIntention: (date: string) => void;

  streak: () => number;
}

const today = () => new Date().toISOString().slice(0, 10);

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),

      episodes: {},
      ensureEpisode: (slug) => {
        if (get().episodes[slug]) return;
        set((s) => ({
          episodes: {
            ...s.episodes,
            [slug]: {
              slug,
              startedAt: new Date().toISOString(),
              sectionsDone: [],
              reflections: {},
              exercises: {},
              minutesEngaged: 0,
            },
          },
        }));
      },
      markSection: (slug, sectionId) => {
        get().ensureEpisode(slug);
        set((s) => {
          const ep = s.episodes[slug];
          if (ep.sectionsDone.includes(sectionId)) return s;
          return {
            episodes: {
              ...s.episodes,
              [slug]: { ...ep, sectionsDone: [...ep.sectionsDone, sectionId] },
            },
          };
        });
      },
      saveReflection: (slug, promptId, value) => {
        get().ensureEpisode(slug);
        set((s) => ({
          episodes: {
            ...s.episodes,
            [slug]: {
              ...s.episodes[slug],
              reflections: { ...s.episodes[slug].reflections, [promptId]: value },
            },
          },
        }));
      },
      saveExercise: (slug, exerciseId, value) => {
        get().ensureEpisode(slug);
        set((s) => ({
          episodes: {
            ...s.episodes,
            [slug]: {
              ...s.episodes[slug],
              exercises: { ...s.episodes[slug].exercises, [exerciseId]: value },
            },
          },
        }));
      },
      addMinutes: (slug, minutes) => {
        get().ensureEpisode(slug);
        set((s) => ({
          episodes: {
            ...s.episodes,
            [slug]: {
              ...s.episodes[slug],
              minutesEngaged: s.episodes[slug].minutesEngaged + minutes,
            },
          },
        }));
      },
      completeEpisode: (slug) => {
        get().ensureEpisode(slug);
        set((s) => ({
          episodes: {
            ...s.episodes,
            [slug]: { ...s.episodes[slug], completedAt: new Date().toISOString() },
          },
        }));
      },

      checkIns: [],
      addCheckIn: (c) =>
        set((s) => ({
          checkIns: [...s.checkIns.filter((x) => x.date !== c.date), c].sort((a, b) =>
            a.date.localeCompare(b.date)
          ),
        })),

      intentions: [],
      setIntentionForToday: (text) =>
        set((s) => {
          const d = today();
          const others = s.intentions.filter((i) => i.date !== d);
          return { intentions: [...others, { date: d, text, done: false }] };
        }),
      toggleIntention: (date) =>
        set((s) => ({
          intentions: s.intentions.map((i) =>
            i.date === date ? { ...i, done: !i.done } : i
          ),
        })),

      streak: () => {
        const { checkIns } = get();
        if (!checkIns.length) return 0;
        const days = new Set(checkIns.map((c) => c.date));
        let streak = 0;
        const d = new Date();
        // count back from today; if today missing but yesterday present, still continue
        for (let i = 0; i < 365; i++) {
          const iso = new Date(d.getTime() - i * 86400000).toISOString().slice(0, 10);
          if (days.has(iso)) streak++;
          else if (i > 0) break; // first miss after start ends streak
        }
        return streak;
      },
    }),
    {
      name: "conectamente.progress.v1",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
    }
  )
);
