import { z } from "zod";

/** Common shapes used by multiple API routes. */

export const slugSchema = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9-]+$/, "Slug deve ser kebab-case.");

export const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve ser yyyy-mm-dd");

export const moodSchema = z.number().int().min(1).max(5);

export const progressUpsertSchema = z.object({
  episodeSlug: slugSchema,
  startedAt: z.string().datetime().optional(),
  completedAt: z.string().datetime().nullable().optional(),
  sectionsDone: z.array(z.string().min(1).max(120)).max(64).optional(),
  minutesEngaged: z.number().min(0).max(10_000).optional(),
  lastSection: z.string().min(1).max(120).optional(),
});

export const reflectionUpsertSchema = z.object({
  episodeSlug: slugSchema,
  promptId: z.string().min(1).max(120),
  answer: z.string().min(1).max(8000),
});

export const exerciseUpsertSchema = z.object({
  episodeSlug: slugSchema,
  exerciseId: z.string().min(1).max(120),
  payload: z.unknown(), // arbitrary JSON; size capped at request layer
});

export const moodUpsertSchema = z.object({
  day: isoDateSchema.optional(),
  mood: moodSchema,
  energy: moodSchema,
  note: z.string().max(500).optional(),
  context: z.record(z.string(), z.unknown()).optional(),
});

export const intentionUpsertSchema = z.object({
  day: isoDateSchema.optional(),
  text: z.string().min(1).max(280),
  done: z.boolean().optional(),
});

export const intentionToggleSchema = z.object({
  day: isoDateSchema,
  done: z.boolean(),
});

export const analyticsEventSchema = z.object({
  kind: z.enum([
    "page_view", "episode_open", "episode_complete", "section_complete",
    "audio_play", "audio_pause", "audio_progress",
    "exercise_save", "reflection_save", "mood_save", "intention_save",
    "download", "auth_login", "auth_signup", "auth_signout", "error_client",
  ]),
  episodeSlug: slugSchema.optional(),
  sectionId: z.string().min(1).max(120).optional(),
  durationMs: z.number().int().min(0).max(86_400_000).optional(),
  attrs: z.record(z.string(), z.unknown()).optional(),
  anonId: z.string().uuid().optional(),
});

export const downloadSchema = z.object({
  resource: z.string().min(1).max(160),
  format: z.enum(["pdf", "html", "print"]).default("pdf"),
});

export const profileUpdateSchema = z.object({
  display_name: z.string().min(1).max(80).nullable().optional(),
  avatar_url: z.string().url().max(500).nullable().optional(),
  locale: z.string().min(2).max(10).optional(),
  timezone: z.string().min(1).max(64).optional(),
  reminder_hour: z.number().int().min(0).max(23).nullable().optional(),
  reminder_enabled: z.boolean().optional(),
  reduced_motion: z.boolean().optional(),
  onboarding_state: z.enum(["pending", "started", "completed"]).optional(),
});

export const notificationCreateSchema = z.object({
  kind: z.enum(["reminder", "intention", "streak", "system", "episode"]).default("system"),
  title: z.string().min(1).max(160),
  body: z.string().max(800).optional(),
  href: z.string().max(500).optional(),
});
