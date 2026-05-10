import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ok, errServer } from "@/lib/api/response";
import { requireUser } from "@/lib/api/session";
import { RATE_LIMITS } from "@/lib/api/rateLimit";
import { readJson } from "@/lib/api/validate";
import { progressUpsertSchema } from "@/lib/api/schemas";

export const dynamic = "force-dynamic";

/** GET /api/progress — list this user's progress across all episodes. */
export async function GET(req: NextRequest) {
  const ctx = await requireUser(req, RATE_LIMITS.read);
  if (ctx instanceof NextResponse) return ctx;

  const { data, error } = await ctx.supabase
    .from("user_progress")
    .select("episode_slug, started_at, completed_at, sections_done, minutes_engaged, last_section, updated_at")
    .order("updated_at", { ascending: false });
  if (error) return errServer(error.message);
  return ok(data ?? []);
}

/**
 * POST /api/progress — upsert progress for one episode.
 * The body shape supports incremental updates (partial fields).
 */
export async function POST(req: NextRequest) {
  const ctx = await requireUser(req, RATE_LIMITS.write);
  if (ctx instanceof NextResponse) return ctx;

  const body = await readJson(req, progressUpsertSchema);
  if (body instanceof NextResponse) return body;

  // Read existing to merge sections_done idempotently.
  const { data: existing } = await ctx.supabase
    .from("user_progress")
    .select("sections_done, minutes_engaged")
    .eq("user_id", ctx.user.id)
    .eq("episode_slug", body.episodeSlug)
    .maybeSingle();

  const mergedSections = uniq([
    ...(existing?.sections_done ?? []),
    ...(body.sectionsDone ?? []),
  ]);

  const minutes = (existing?.minutes_engaged ?? 0) +
    (typeof body.minutesEngaged === "number" ? body.minutesEngaged : 0);

  // Build the upsert payload incrementally:
  //   - sections_done and minutes_engaged are always merged (additive).
  //   - completed_at and last_section only overwrite when explicitly provided
  //     (otherwise a "mark section" call would clear the user's completion).
  //   - started_at is only set when there is no existing row.
  const payload: Record<string, unknown> = {
    user_id: ctx.user.id,
    episode_slug: body.episodeSlug,
    sections_done: mergedSections,
    minutes_engaged: minutes,
  };
  if (!existing) {
    payload.started_at = body.startedAt ?? new Date().toISOString();
  }
  if (body.completedAt !== undefined) payload.completed_at = body.completedAt;
  if (body.lastSection !== undefined) payload.last_section = body.lastSection;

  const { data, error } = await ctx.supabase
    .from("user_progress")
    .upsert(payload, { onConflict: "user_id,episode_slug" })
    .select()
    .single();

  if (error) return errServer(error.message);
  return ok(data);
}

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}
