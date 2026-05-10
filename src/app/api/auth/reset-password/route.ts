import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getSupabaseServer } from "@/lib/supabase/server";
import { ok, errMisconfigured, errUnauthorised, errServer } from "@/lib/api/response";
import { readJson } from "@/lib/api/validate";

const schema = z.object({
  password: z.string().min(8).max(72),
});

/**
 * Sets a new password. Requires the user to already be signed in via the
 * recovery callback (Supabase signs them in automatically when they click
 * the recovery link).
 */
export async function POST(req: NextRequest) {
  const body = await readJson(req, schema);
  if (body instanceof NextResponse) return body;

  const supabase = getSupabaseServer();
  if (!supabase) return errMisconfigured();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return errUnauthorised();

  const { error } = await supabase.auth.updateUser({ password: body.password });
  if (error) return errServer(error.message);

  return ok({ updated: true });
}
