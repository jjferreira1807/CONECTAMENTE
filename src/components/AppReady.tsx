"use client";
/**
 * App reveal coordinator.
 *
 * The site has two boot paths:
 *   1. First visit / explicit ?intro=1 → IntroCutscene plays then dismisses.
 *   2. Returning visitor / reduced-motion / non-first → no cutscene.
 *
 * Components like Hero shouldn't trigger their entrance animations until the
 * cutscene is gone, otherwise the user misses them. AppReady provides a
 * shared boolean.
 *
 *   const ready = useAppReady();
 *   <motion.div initial={false} animate={ready ? "show" : "hidden"}>
 *
 * Safety nets (all important):
 *   - If the cutscene will NOT show, we mark ready immediately on mount.
 *   - **Failsafe timeout**: even if the cutscene errors or never calls
 *     `markReady()`, we force ready after `READY_FAILSAFE_MS` so the app is
 *     never stuck invisible.
 */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

// Slightly longer than the cutscene's own duration so a working cutscene
// drives the transition; only a broken one hits this fallback.
const READY_FAILSAFE_MS = 12_000;

interface AppReadyApi {
  ready: boolean;
  markReady: () => void;
}

const Ctx = createContext<AppReadyApi>({ ready: false, markReady: () => {} });

/** Returns true once the cutscene has finished (or never played). */
export function useAppReady() {
  return useContext(Ctx).ready;
}

/** Imperative signal — only IntroCutscene calls this. */
export function useMarkAppReady() {
  return useContext(Ctx).markReady;
}

export function AppReadyProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // The cutscene now plays on every load (no more `introSeen` gating —
    // it's part of the product). Only prefers-reduced-motion shortcuts past
    // it, since vestibular sensitivity is a real accessibility concern.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setReady(true);
      return;
    }

    // Failsafe so a broken cutscene can't leave the app stuck invisible.
    const t = setTimeout(() => setReady(true), READY_FAILSAFE_MS);
    return () => clearTimeout(t);
  }, []);

  const api = useMemo<AppReadyApi>(() => ({
    ready,
    markReady: () => setReady(true),
  }), [ready]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
