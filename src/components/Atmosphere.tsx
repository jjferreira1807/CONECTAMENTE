"use client";
import { useEffect, useState } from "react";
import { useAppReady } from "./AppReady";

/**
 * Global ambient background.
 *
 * Three layers, behind everything:
 *   1. Drifting aurora gradients (CSS-only — renders on SSR)
 *   2. Twinkling starfield (deterministic, mount-gated to keep SSR pure)
 *   3. Floating soft particles (slow, large, low opacity)
 *
 * Gradient layers are rendered server-side so the page never flashes from
 * "no atmosphere" to "atmosphere". Stars and particles are gated on `mounted`
 * to avoid serialising 100+ deterministic-but-noisy coordinates in the SSR
 * HTML. Theme switches don't reshuffle anything: stars use `currentColor`-
 * style theming via CSS variables.
 *
 * Performance:
 *   - All movement is via CSS `transform` / `opacity` — GPU compositing only.
 *   - `contain: strict` prevents the children's invalidation from bleeding.
 *   - Star count and particle blur reduce on small screens.
 *   - Respects `prefers-reduced-motion`: animations are paused (handled in
 *     globals.css via universal `*` rule).
 */
export function Atmosphere() {
  const [mounted, setMounted] = useState(false);
  const appReady = useAppReady();
  useEffect(() => setMounted(true), []);

  // Wrapper is always rendered (so its gradient layers paint at SSR time),
  // but opacity is gated on `mounted && appReady` so it fades in smoothly
  // after the cutscene rather than popping in.
  const visible = mounted && appReady;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 1.4s cubic-bezier(0.22, 1, 0.36, 1)",
        contain: "strict",
        willChange: "opacity",
      }}
    >
      {/* Aurora gradients — SSR-friendly, pure CSS animations.
          `will-change: transform` promove cada gradiente para uma camada
          GPU própria, evitando que o motor tenha de re-blur o bitmap a cada
          frame da animação drift. Crucial em mobile onde o blur é caro. */}
      <div className="absolute inset-0">
        <div
          className="absolute -top-[20%] -left-[10%] h-[70vmax] w-[70vmax] rounded-full opacity-70"
          style={{
            background:
              "radial-gradient(closest-side, rgb(var(--accent) / 0.35), transparent 70%)",
            filter: "blur(80px)",
            animation: "drift 28s ease-in-out infinite",
            willChange: "transform",
          }}
        />
        <div
          className="absolute -bottom-[20%] -right-[10%] h-[60vmax] w-[60vmax] rounded-full opacity-60"
          style={{
            background:
              "radial-gradient(closest-side, rgb(var(--accent-2) / 0.28), transparent 70%)",
            filter: "blur(80px)",
            animation: "drift-reverse 36s ease-in-out infinite",
            willChange: "transform",
          }}
        />
        <div
          className="absolute top-[40%] left-[55%] h-[45vmax] w-[45vmax] rounded-full opacity-40 hidden md:block"
          style={{
            background:
              "radial-gradient(closest-side, rgb(var(--glow) / 0.18), transparent 70%)",
            filter: "blur(70px)",
            animation: "drift 44s ease-in-out infinite reverse",
            willChange: "transform",
          }}
        />
      </div>

      {/* Stars and particles only mount after appReady — keeps their CSS
          animations from competing with the cutscene for compositor time. */}
      {visible && <Starfield />}
      {visible && <Particles />}

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, transparent 30%, rgb(var(--bg) / 0.5) 100%)",
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------------ */

function Starfield() {
  // Stars are visually "white in dark, dark in light" via `rgb(var(--star))`;
  // their opacity is also driven by `--star-alpha` so they fade in light mode.
  return (
    <svg
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
    >
      {STARS.map((s, i) => (
        <circle
          key={i}
          cx={s.x} cy={s.y} r={s.r}
          fill="rgb(var(--star))"
          style={{
            opacity: `calc(${s.o} * var(--star-alpha))`,
            animation: `twinkle ${s.t}s ease-in-out ${s.d}s infinite`,
          } as React.CSSProperties}
        />
      ))}
    </svg>
  );
}

const STARS = (() => {
  const rng = mulberry32(20260510);
  return Array.from({ length: 70 }, () => ({
    x: rng() * 1000,
    y: rng() * 1000,
    r: 0.5 + rng() * 1.4,
    o: 0.5 + rng() * 0.6,
    t: 3 + rng() * 6,
    d: rng() * 5,
  }));
})();

function mulberry32(a: number) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------------------------------------------------ */

function Particles() {
  return (
    <div className="absolute inset-0">
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `radial-gradient(closest-side, rgb(var(--accent) / ${p.alpha}), transparent 70%)`,
            filter: "blur(20px)",
            animation: `floaty ${p.dur}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

const PARTICLES = [
  { x: 12, y: 22, size: "120px", alpha: 0.35, dur: 14, delay: 0 },
  { x: 78, y: 64, size: "180px", alpha: 0.25, dur: 18, delay: 2 },
  { x: 38, y: 80, size: "140px", alpha: 0.3,  dur: 16, delay: 1 },
  { x: 88, y: 18, size: "100px", alpha: 0.4,  dur: 12, delay: 3 },
];
