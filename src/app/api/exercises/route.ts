import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ok, errInvalid, errServer } from "@/lib/api/response";
import { requireUser } from "@/lib/api/session";
import { RATE_LIMITS } from "@/lib/api/rateLimit";
import { readJson } from "@/lib/api/validate";
import { exerciseUpsertSchema } from "@/lib/api/schemas";
import type { Json } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

const MAX_PAYLOAD_KB = 64; // hard cap to protect the DB and prevent abuse

/** GET /api/exercises */
export async function GET(req: NextRequest) {
  const ctx = await requireUser(req, RATE_LIMITS.read);
  if (ctx instanceof NextResponse) return ctx;

  const { data, error } = await ctx.supabase
    .from("exercise_answers")
    .select("episode_slug, exercise_id, payload, updated_at")
    .order("updated_at", { ascending: false });

  if (error) return errServer(error.message);
  return ok(data ?? []);
}

/** POST /api/exercises — upsert one exercise answer. */
export async function POST(req: NextRequest) {
  const ctx = await requireUser(req, RATE_LIMITS.write);
  if (ctx instanceof NextResponse) return ctx;

  const body = await readJson(req, exerciseUpsertSchema);
  if (body instanceof NextResponse) return body;

  // Defensive size check on the JSON payload — Zod doesn't measure bytes.
  const size = Buffer.byteLength(JSON.stringify(body.payload ?? null), "utf8");
  if (size > MAX_PAYLOAD_KB * 1024) {
    return errInvalid(`Payload demasiado grande (>${MAX_PAYLOAD_KB} KB).`);
  }

  const { data, error } = await ctx.supabase
    .from("exercise_answers")
    .upsert(
      {
        user_id: ctx.user.id,
        episode_slug: body.episodeSlug,
        exercise_id: body.exerciseId,
        payload: (body.payload ?? {}) as Json,
      },
      { onConflict: "user_id,episode_slug,exercise_id" }
    )
    .select()
    .single();

  if (error) return errServer(error.message);
  return ok(data);
}
