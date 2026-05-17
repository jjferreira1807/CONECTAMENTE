"use client";
import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Tiny crossfade between routes — opacity only, 160ms, NO mode="wait".
 *
 * The previous version used AnimatePresence with mode="wait" + 450ms exit +
 * 450ms enter + y-translate. That meant every navigation had ~900ms of
 * mandatory animation on top of the bundle/RSC wait, so /programa, /progresso
 * etc. felt very slow even on instant networks. New behaviour:
 *   • Opacity-only (no y) — y-motion competes with the user's reading frame.
 *   • 160ms duration — fast enough to feel instant, slow enough to look smooth.
 *   • No AnimatePresence wait — the new page mounts immediately and just
 *     fades in over its predecessor; nothing is held back.
 *   • Keyed on pathname so each route gets its own enter animation.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: reduce ? 0 : 0.16,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
