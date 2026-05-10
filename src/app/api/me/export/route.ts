import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { errServer } from "@/lib/api/response";
import { requireUser } from "@/lib/api/session";
import { RATE_LIMITS } from "@/lib/api/rateLimit";

export const dynamic = "force-dynamic";

/**
 * GET /api/me/export — GDPR data export. Returns a single JSON document with
 * everything we hold for this user. Rate-limited tightly to deter abuse.
 */
export async function GET(req: NextRequest) {
  const ctx = await requireUser(req, RATE_LIMITS.authBurst);
  if (ctx instanceof NextResponse) return ctx;

  const [profile, progress, reflections, exercises, mood, intentions, downloads, notifications] =
    await Promise.all([
      ctx.supabase.from("profiles").select("*").eq("id", ctx.user.id).maybeSingle(),
      ctx.supabase.from("user_progress").select("*"),
      ctx.supabase.from("reflections").select("*"),
      ctx.supabase.from("exercise_answers").select("*"),
      ctx.supabase.from("mood_tracking").select("*"),
      ctx.supabase.from("intentions").select("*"),
      ctx.supabase.from("downloads").select("*"),
      ctx.supabase.from("notifications").select("*"),
    ]);

  const errors = [profile, progress, reflections, exercises, mood, intentions, downloads, notifications]
    .map((r) => r.error)
    .filter(Boolean);
  if (errors.length) return errServer(errors[0]!.message);

  const document = {
    schema: "conectamente.export.v1",
    exportedAt: new Date().toISOString(),
    user: { id: ctx.user.id, email: ctx.user.email },
    profile: profile.data,
    user_progress: progress.data,
    reflections: reflections.data,
    exercise_answers: exercises.data,
    mood_tracking: mood.data,
    intentions: intentions.data,
    downloads: downloads.data,
    notifications: notifications.data,
  };

  return new NextResponse(JSON.stringify(document, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="conectamente-${ctx.user.id}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
