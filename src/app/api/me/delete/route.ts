import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ok, errServer, errMisconfigured } from "@/lib/api/response";
import { requireUser } from "@/lib/api/session";
import { RATE_LIMITS } from "@/lib/api/rateLimit";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { log } from "@/lib/api/logger";

export const dynamic = "force-dynamic";

/**
 * POST /api/me/delete — GDPR right to erasure.
 *
 * Steps:
 *   1. Delete user-owned rows (RLS-safe via the user's session client).
 *   2. Delete the auth user via the service role (cascades to profile).
 *
 * If service role is not configured, we still wipe data rows; the auth user
 * itself must then be deleted from the Supabase dashboard.
 */
export async function POST(req: NextRequest) {
  const ctx = await requireUser(req, RATE_LIMITS.authBurst);
  if (ctx instanceof NextResponse) return ctx;

  // Step 1 — clear all user-owned data. RLS ensures we only delete our own.
  const tables = [
    "user_progress", "reflections", "exercise_answers",
    "mood_tracking", "intentions", "episode_mood",
    "downloads", "notifications",
  ] as const;

  for (const t of tables) {
    const { error } = await ctx.supabase.from(t).delete().eq("user_id", ctx.user.id);
    if (error) {
      log.error("gdpr_delete_table_failed", { table: t, error: error.message });
      return errServer(`Falha ao limpar ${t}.`);
    }
  }

  // Step 2 — delete the auth user (requires service role).
  const admin = getSupabaseAdmin();
  if (!admin) {
    log.warn("gdpr_partial_delete_no_service_role", { user: ctx.user.id });
    return ok({
      deletedRows: true,
      deletedAccount: false,
      note: "Os dados foram apagados. A conta auth tem de ser apagada manualmente (admin).",
    });
  }

  const { error } = await admin.auth.admin.deleteUser(ctx.user.id);
  if (error) {
    log.error("gdpr_delete_auth_user_failed", { error: error.message });
    return errServer(error.message);
  }
  return ok({ deletedRows: true, deletedAccount: true });
}
