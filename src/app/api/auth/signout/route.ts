import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { ok } from "@/lib/api/response";

export async function POST(_req: NextRequest) {
  const supabase = getSupabaseServer();
  if (supabase) await supabase.auth.signOut();
  return ok({ signedOut: true });
}
