import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getSupabaseServer } from "@/lib/supabase/server";
import { ok, errMisconfigured, errInvalid, errRateLimited } from "@/lib/api/response";
import { readJson } from "@/lib/api/validate";
import { rateLimit, rlKey, RATE_LIMITS } from "@/lib/api/rateLimit";
import { clientIp } from "@/lib/api/session";

const schema = z.object({
  email: z.string().email().max(200),
});

/**
 * Triggers a password recovery email. Rate-limited tightly per IP+email
 * to prevent spam/enumeration.
 */
export async function POST(req: NextRequest) {
  const body = await readJson(req, schema);
  if (body instanceof NextResponse) return body;

  const ip = clientIp(req);
  const rl = rateLimit(rlKey("recover", ip, body.email), RATE_LIMITS.authBurst);
  if (!rl.allowed) return errRateLimited();

  const supabase = getSupabaseServer();
  if (!supabase) return errMisconfigured();

  const origin = req.nextUrl.origin;
  const { error } = await supabase.auth.resetPasswordForEmail(body.email, {
    redirectTo: `${origin}/auth/callback?type=recovery&next=/auth/reset-password`,
  });

  if (error) {
    // Do NOT reveal whether the email exists (anti-enumeration).
    return ok({ sent: true });
  }
  return ok({ sent: true });
}
