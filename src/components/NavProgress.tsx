"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * Hairline navigation progress bar — YouTube/GitHub style.
 *
 * The browser sits on the OLD page until the new RSC payload + bundle land.
 * In dev mode the first visit to a route triggers a 1-4s JIT compile; in
 * production Link prefetches make this near-instant. Either way, this bar
 * gives the user IMMEDIATE feedback so the click feels acknowledged.
 *
 *   1. Listens for left-clicks on internal anchors (`a[href^="/"]`) and ramps
 *      a 2px gradient bar from 0 → ~75% with an easing curve, over ~800ms.
 *   2. Holds at ~75% until usePathname() returns the new value.
 *   3. Snaps to 100% then fades out over 250ms.
 *
 * Pure CSS for the bar (transform/opacity only), no per-frame React state on
 * the held phase. Respects prefers-reduced-motion via the global `*` rule
 * in globals.css.
 */
export function NavProgress() {
  const pathname = usePathname();
  const [pct, setPct] = useState(0);
  const [visible, setVisible] = useState(false);
  const prevPath = useRef(pathname);
  const rampRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fadeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopRamp = () => {
    if (rampRef.current) {
      clearInterval(rampRef.current);
      rampRef.current = null;
    }
  };

  // Start the bar when the user clicks an internal Link.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      // Skip modified clicks, right/middle clicks, prevented clicks.
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }
      const anchor = (e.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;
      // External targets and downloads bypass the SPA router.
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      // Resolve to a URL so we can compare pathnames cleanly.
      let url: URL;
      try {
        url = new URL(href, window.location.origin);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return; // hash/search-only nav

      // Kick off the bar instantly.
      if (fadeRef.current) clearTimeout(fadeRef.current);
      stopRamp();
      setVisible(true);
      setPct(8);
      rampRef.current = setInterval(() => {
        setPct((p) => {
          if (p >= 75) return p;
          // Ease toward 75% — fast at first, slow as it approaches.
          return p + (78 - p) * 0.08;
        });
      }, 80);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Complete the bar when the route lands.
  useEffect(() => {
    if (pathname === prevPath.current) return;
    prevPath.current = pathname;
    stopRamp();
    setPct(100);
    if (fadeRef.current) clearTimeout(fadeRef.current);
    fadeRef.current = setTimeout(() => {
      setVisible(false);
      // Reset after the fade so the next nav starts from 0.
      setTimeout(() => setPct(0), 250);
    }, 180);
  }, [pathname]);

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      stopRamp();
      if (fadeRef.current) clearTimeout(fadeRef.current);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[120] h-[2px] pointer-events-none"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 250ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <div
        className="h-full origin-left"
        style={{
          transform: `scaleX(${pct / 100})`,
          background:
            "linear-gradient(90deg, rgb(var(--accent) / 0.85) 0%, rgb(var(--accent-2) / 0.95) 100%)",
          boxShadow: "0 0 12px rgb(var(--accent) / 0.55)",
          transition: "transform 220ms cubic-bezier(0.22, 1, 0.36, 1)",
          willChange: "transform",
        }}
      />
    </div>
  );
}
