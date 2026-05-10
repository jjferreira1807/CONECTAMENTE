import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { log } from "@/lib/api/logger";

/**
 * OAuth & email-confirmation callback.
 *
 * Supabase redirects here with `?code=...` after:
 *   - email confirmation
 *   - magic link
 *   - password recovery
 *   - OAuth (Google, etc.)
 *
 * We exchange the code for a session and bounce the user to `next` (or /dashboard).
 */
export async function GET(req: NextRequest) {
  const { searchParams, origin } = req.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const type = searchParams.get("type"); // e.g. "recovery"

  if (!code) {
    return NextResponse.redirect(`${origin}/entrar?error=missing_code`);
  }

  const supabase = getSupabaseServer();
  if (!supabase) {
    return NextResponse.redirect(`${origin}/entrar?error=misconfigured`);
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    log.warn("auth_callback_failed", { code: error.code, message: error.message });
    return NextResponse.redirect(`${origin}/entrar?error=${encodeURIComponent(error.code ?? "unknown")}`);
  }

  // Recovery flow: send to a dedicated form (the user is now signed in but
  // must set a new password before continuing).
  if (type === "recovery") {
    return NextResponse.redirect(`${origin}/auth/reset-password`);
  }

  return NextResponse.redirect(`${origin}${safeNext(next)}`);
}

function safeNext(next: string) {
  // Only allow internal paths.
  if (!next.startsWith("/") || next.startsWith("//")) return "/dashboard";
  return next;
}
