"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Lightweight count-up hook for KPIs and scores.
 *
 * Tweens from the current displayed value to `target` over `duration` ms
 * using requestAnimationFrame and the project's cinematic ease curve
 * (cubic ease-out approximation of `[0.22, 1, 0.36, 1]`). Respects
 * prefers-reduced-motion: snaps directly to target.
 *
 * Returns the current value (rounded to `decimals`). On `target` change,
 * the tween restarts from the value last shown — so successive updates
 * never look choppy.
 *
 * No external deps, no library — just `useState` + `useRef` + RAF.
 */
export function useAnimatedNumber(
  target: number,
  opts: { duration?: number; decimals?: number; enabled?: boolean } = {},
): number {
  const { duration = 800, decimals = 0, enabled = true } = opts;
  const [value, setValue] = useState(target);
  const fromRef = useRef<number>(target);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      setValue(target);
      return;
    }
    // Honour reduced motion preference.
    if (typeof window !== "undefined") {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mq.matches) {
        setValue(target);
        return;
      }
    }

    const start = performance.now();
    const from = fromRef.current;
    const delta = target - from;
    if (Math.abs(delta) < 0.0001) {
      setValue(target);
      return;
    }

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // cubic ease-out — fast at first, slow as it lands
      const eased = 1 - Math.pow(1 - t, 3);
      const v = from + delta * eased;
      setValue(v);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = target;
        rafRef.current = null;
      }
    };

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      // Snapshot whatever we showed last so the next tween picks up there.
      fromRef.current = value;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration, enabled]);

  return decimals === 0 ? Math.round(value) : Number(value.toFixed(decimals));
}
