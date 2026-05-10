"use client";
import { useEffect } from "react";
import { useProgress } from "@/lib/store";
import { useRemoteSync } from "@/lib/sync/useRemoteSync";

/**
 * Triggers Zustand hydration on the client and (when configured + signed in)
 * pulls remote state. Renders nothing.
 */
export function ProgressHydrator() {
  const setHydrated = useProgress((s) => s.setHydrated);
  useEffect(() => { setHydrated(true); }, [setHydrated]);
  useRemoteSync();
  return null;
}
