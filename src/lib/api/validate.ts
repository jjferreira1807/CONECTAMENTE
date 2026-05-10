import type { ZodTypeAny, ZodError, z } from "zod";
import { errInvalid } from "./response";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Parse + validate a request body with a Zod schema. Returns either the
 * validated data (using the schema's output type, so `.default()` defaults
 * propagate) or a NextResponse with 422.
 *
 * Usage:
 *   const parsed = await readJson(req, schema);
 *   if (parsed instanceof NextResponse) return parsed;
 *   const body = parsed; // typed as z.infer<typeof schema>
 */
export async function readJson<S extends ZodTypeAny>(
  req: NextRequest,
  schema: S
): Promise<z.infer<S> | NextResponse> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return errInvalid("JSON inválido.");
  }
  const r = schema.safeParse(raw);
  if (!r.success) return errInvalid(formatZod(r.error));
  return r.data as z.infer<S>;
}

export function readSearchParams<S extends ZodTypeAny>(
  req: NextRequest,
  schema: S
): z.infer<S> | NextResponse {
  const obj: Record<string, string> = {};
  req.nextUrl.searchParams.forEach((v, k) => { obj[k] = v; });
  const r = schema.safeParse(obj);
  if (!r.success) return errInvalid(formatZod(r.error));
  return r.data as z.infer<S>;
}

function formatZod(err: ZodError) {
  return err.issues.map((i) => ({
    path: i.path.join("."),
    message: i.message,
    code: i.code,
  }));
}
