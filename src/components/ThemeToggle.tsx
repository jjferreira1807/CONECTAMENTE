"use client";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Theme toggle with a smooth cross-fade between light and dark.
 *
 * Before calling `setTheme()`, we add `.theme-switching` to <html>; a CSS
 * rule in globals.css turns on a 500ms transition for every element's
 * color-driven properties (background, border, color, fill, stroke, shadow).
 * 600ms later we remove the class so hover effects regain their normal speed.
 * `requestAnimationFrame` ensures the class commits to the DOM before the
 * next-themes class swap, so the first frame already includes the rule.
 */
const SWITCH_MS = 600;

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = (mounted ? resolvedTheme : theme) === "dark";

  function toggle() {
    const root = document.documentElement;
    root.classList.add("theme-switching");
    // Commit the class to the DOM before the theme swap so the transition
    // is in effect from frame 0 of the variable change.
    requestAnimationFrame(() => {
      setTheme(isDark ? "light" : "dark");
      window.setTimeout(() => {
        root.classList.remove("theme-switching");
      }, SWITCH_MS);
    });
  }

  return (
    <button
      type="button"
      aria-label={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
      onClick={toggle}
      className={cn(
        "inline-flex h-11 w-11 items-center justify-center rounded-full hairline bg-surface/80 text-ink transition-colors hover:bg-ink/5",
        className
      )}
    >
      {mounted && isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
