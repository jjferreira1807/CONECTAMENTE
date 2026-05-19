"use client";
import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppReady } from "./AppReady";
import { hasSupabaseSession } from "@/lib/hasSupabaseSession";

/**
 * Auto-reflexão · gate de entrada.
 *
 * Once per cutscene play, the user is funnelled to `/auto-reflexao` after
 * `AppReady` fires — **but only once**. A ref guards against trapping the
 * user: after the first redirect (or after we observe they're already on a
 * skip-prefix path), the gate stays inert until the next full page reload
 * mounts the layout fresh. This way:
 *
 *   • Load /programa → cutscene → redirect to /auto-reflexao (once)
 *   • Click "Abrir programa" from the quiz → /programa, no redirect back
 *   • Reload → new cutscene → redirect again (cycle restarts)
 *
 * The skip prefixes cover paths where redirecting would break the UX:
 *   - `/auto-reflexao` itself
 *   - `/auth/*` for OAuth callback exchange
 *   - `/api/*` defensive — API routes shouldn't reach the layout anyway
 */
const SKIP_PREFIXES = [
  "/auto-reflexao",
  "/auth/",
  "/api/",
] as const;

export function QuizGate() {
  const ready = useAppReady();
  const pathname = usePathname();
  const router = useRouter();
  const armedRef = useRef(true);

  useEffect(() => {
    if (!armedRef.current) return;
    if (!pathname) return;
    // Authenticated visitors are past onboarding: they shouldn't be
    // force-redirected to /auto-reflexao on every page load.
    if (hasSupabaseSession()) {
      armedRef.current = false;
      return;
    }
    // Skip-prefix check FIRST, antes do `!ready`. Senão, quando aterramos em
    // /auth/callback (ready=false ainda) saímos cedo sem desarmar, depois o
    // router.replace("/dashboard") muda o pathname, e quando o ready finalmente
    // dispara (após o fade do intro-blocker) o gate vê /dashboard, não é
    // skip-prefix, e empurra o utilizador para /auto-reflexao — anulando o
    // redirect do callback OAuth.
    if (SKIP_PREFIXES.some((p) => pathname.startsWith(p))) {
      armedRef.current = false;
      return;
    }
    if (!ready) return;
    armedRef.current = false;
    router.replace("/auto-reflexao");
  }, [ready, pathname, router]);

  return null;
}
