import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ok, errServer } from "@/lib/api/response";
import { requireUser } from "@/lib/api/session";
import { RATE_LIMITS } from "@/lib/api/rateLimit";
import { readJson } from "@/lib/api/validate";
import { reflectionUpsertSchema } from "@/lib/api/schemas";

export const dynamic = "force-dynamic";

/** GET /api/reflections — all reflections for this user. */
export async function GET(req: NextRequest) {
  const ctx = await requireUser(req, RATE_LIMITS.read);
  if (ctx instanceof NextResponse) return ctx;

  const { data, error } = await ctx.supabase
    .from("reflections")
    .select("episode_slug, prompt_id, answer, updated_at")
    .order("updated_at", { ascending: false });

  if (error) return errServer(error.message);
  return ok(data ?? []);
}

/** POST /api/reflections — upsert one reflection (debounced autosave). */
export async function POST(req: NextRequest) {
  const ctx = await requireUser(req, RATE_LIMITS.write);
  if (ctx instanceof NextResponse) return ctx;

  const body = await readJson(req, reflectionUpsertSchema);
  if (body instanceof NextResponse) return body;

  const { data, error } = await ctx.supabase
    .from("reflections")
    .upsert(
      {
        user_id: ctx.user.id,
        episode_slug: body.episodeSlug,
        prompt_id: body.promptId,
        answer: body.answer,
      },
      { onConflict: "user_id,episode_slug,prompt_id" }
    )
    .select()
    .single();

  if (error) return errServer(error.message);
  return ok(data);
}
