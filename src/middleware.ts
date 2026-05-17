import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Edge middleware:
 *   1. Refreshes Supabase session cookies on every request.
 *   2. Adds security headers (X-Frame-Options, X-Content-Type-Options, etc.).
 *   3. Soft-protects /dashboard, /estatisticas, /api/me, /api/progress, etc.
 *      Soft because we want anonymous users to still use localStorage —
 *      we only redirect to /entrar if the route requires a real account
 *      AND Supabase is configured. If Supabase is not configured at all,
 *      the app runs in "local-only" mode and middleware is a no-op.
 */

const PROTECTED_PAGE_PREFIXES: string[] = [
  // Pages that only make sense with an account. We still allow the local
  // experience by NOT redirecting unless Supabase is configured.
  // Add page paths here when needed (e.g. "/conta").
];

const PROTECTED_API_PREFIXES = [
  "/api/me",
  "/api/progress",
  "/api/reflections",
  "/api/exercises",
  "/api/mood",
  "/api/intentions",
  "/api/notifications",
];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Skip Supabase auth update no callback OAuth — o getUser() server-side
  // mexe nos cookies sb-* (em particular o `*-code-verifier` do PKCE), o
  // que faz com que o exchangeCodeForSession() do client-side falhe com
  // `pkce_code_verifier_not_found`. A callback page gere o seu próprio
  // auth client-side, não precisa do refresh aqui.
  if (path.startsWith("/auth/")) {
    const res = NextResponse.next();
    applySecurityHeaders(res);
    return res;
  }

  const { res, user } = await updateSession(req);

  applySecurityHeaders(res);

  const supabaseConfigured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Hard-protect API routes that require a session (only when configured).
  if (supabaseConfigured && !user && PROTECTED_API_PREFIXES.some((p) => path.startsWith(p))) {
    return NextResponse.json(
      { ok: false, error: { code: "unauthorised", message: "Não autenticado." } },
      { status: 401 }
    );
  }

  // Soft-protect pages: redirect to /entrar with `next` only when configured.
  if (supabaseConfigured && !user && PROTECTED_PAGE_PREFIXES.some((p) => path.startsWith(p))) {
    const url = req.nextUrl.clone();
    url.pathname = "/entrar";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  return res;
}

function applySecurityHeaders(res: NextResponse) {
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  );
}

export const config = {
  // Run on everything except static assets and Next internals.
  matcher: ["/((?!_next/static|_next/image|favicon.svg|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp3|mp4|wav|ogg)).*)"],
};
