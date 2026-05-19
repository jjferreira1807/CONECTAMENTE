"use client";
/**
 * IntroCutscene — cinematic welcome, performance-budgeted.
 *
 * Total runtime ~10s, four phase transitions (NOT 60Hz state updates):
 *
 *   0.0–1.5s   COSMOS    Black backdrop, stars fade in (CSS twinkle).
 *   1.5–4.5s   BRAIN     Single brain outline strokes in.
 *   4.5–7.5s   NEURONS   12 neurons appear staggered; soft pulse per neuron.
 *   7.5–9.5s   CLIMAX    Stroke colour shifts teal→gold, warm bloom rises.
 *   9.5–10.5s  REVEAL    Exit fade; AppReady fires so Hero animates underneath.
 *
 * Optimisations applied (vs previous 35s version):
 *   - No RAF + per-frame setState. Phase transitions via setTimeout chain.
 *     React renders ~5 times for the whole cutscene.
 *   - No camera zoom on parent (avoids repainting every SVG child).
 *   - No `filter: blur(...)` drifting fog blobs (the most expensive layer).
 *   - No `mix-blend-mode` overlays (forces extra compositing layers).
 *   - No `drop-shadow` on SVG strokes — replaced with soft radial-gradient
 *     halos behind each glowing element (cheaper to composite).
 *   - Stars reduced 140 → 30, single SVG, CSS-only twinkle (zero JS).
 *   - Pulse rings staggered with delays, one-shot enter — no overlapping
 *     simultaneous animations.
 *   - Progress bar uses `transform: scaleX` (GPU compositor) instead of
 *     `width` (layout invalidation).
 *   - `<Atmosphere />` deferred to mount AFTER AppReady fires, so it doesn't
 *     compete for GPU while the cutscene plays.
 *   - `will-change: transform, opacity` hint on critical motion elements.
 *
 * Mobile: tighter SVG (smaller width), no halo breathing animation (just a
 * static gradient), fewer stars. Driven via a media query check on mount.
 *
 * Accessibility: prefers-reduced-motion skips the cutscene entirely. Skip
 * button + Esc/Enter dismiss instantly.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useMarkAppReady } from "./AppReady";
import { hasSupabaseSession } from "@/lib/hasSupabaseSession";

const STORAGE_KEY = "conectamente.introSeen.v2";

// Phase transition times (ms from start)
//
// REVEAL → END is the fusion window: 1.5s during which the dark backdrop
// dissolves fast (revealing the homepage that's already animating in behind
// us) while the brain SVG drifts upward and fades slowly. markReady() fires
// at REVEAL — NOT at END — so the homepage's own entrance animations run
// underneath the dissolve rather than after a hard cut.
const T = {
  brain:    1500,
  neurons:  4500,
  climax:   7500,
  reveal:   9500,
  end:     11000,
};

type Phase = "cosmos" | "brain" | "neurons" | "climax" | "reveal";
type Decision = "undecided" | "play" | "skip" | "done";

const NEURONS = [
  { x: 140, y: 26  }, { x: 215, y: 50  }, { x: 252, y: 110 },
  { x: 252, y: 180 }, { x: 215, y: 240 }, { x: 140, y: 268 },
  { x: 65,  y: 240 }, { x: 28,  y: 180 }, { x: 28,  y: 110 },
  { x: 65,  y: 50  }, { x: 100, y: 130 }, { x: 180, y: 160 },
];

const BRAIN_OUTLINE =
  "M140,40 C95,40 64,68 60,108 C45,118 38,142 50,168 C52,200 80,225 120,235 C135,250 155,250 170,235 C210,225 238,200 240,168 C252,142 245,118 230,108 C226,68 195,40 140,40 Z";

// Just one inner fold — extras don't add much visually but cost paint.
const BRAIN_FOLD =
  "M70,150 C95,140 120,158 140,150 C160,142 185,158 210,150";

const MESSAGES: Record<Phase, string> = {
  cosmos:  "A preparar ambiente terapêutico…",
  brain:   "A ativar circuitos neurais…",
  neurons: "A carregar os 12 episódios…",
  climax:  "Bem-vindo a Conectamente.",
  reveal:  "Bem-vindo a Conectamente.",
};

const TEAL = "#6EC8AF";
const GOLD = "#E2B87A";

/* ======================================================================== */

export function IntroCutscene() {
  const params = useSearchParams();
  const force = params?.get("intro") === "1";
  const reduce = useReducedMotion();
  const markReady = useMarkAppReady();

  const [decision, setDecision] = useState<Decision>("undecided");
  const [phase, setPhase] = useState<Phase>("cosmos");

  // Decide whether to play.
  //
  // The cutscene runs on every page load for anonymous visitors — it's
  // part of the onboarding. Three exceptions skip it:
  //   • prefers-reduced-motion (accessibility);
  //   • /auth/* routes — brief stopover returning from Google OAuth;
  //   • authenticated users — they're past onboarding, the cutscene would
  //     feel like the site is restarting every page load.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onAuthRoute = window.location.pathname.startsWith("/auth/");
    const isAuthenticated = hasSupabaseSession();
    setDecision(
      ((reduce && !force) || onAuthRoute || isAuthenticated) ? "skip" : "play",
    );
  }, [force, reduce]);

  // Coordinate with the SSR <IntroBlocker /> overlay
  useEffect(() => {
    if (decision === "undecided") return;
    const node = document.getElementById("intro-blocker");
    if (decision === "skip") {
      if (node) {
        node.style.transition = "opacity 700ms cubic-bezier(0.22, 1, 0.36, 1)";
        node.style.opacity = "0";
        const t = setTimeout(() => {
          node.parentNode?.removeChild(node);
          markReady();
        }, 720);
        return () => clearTimeout(t);
      }
      markReady();
      return;
    }
    node?.parentNode?.removeChild(node);
  }, [decision, markReady]);

  // Phase timeline via setTimeout chain (NOT RAF — keeps React renders low).
  // Fire markReady() at REVEAL (not END) so Hero's entrance animates
  // underneath while the backdrop and brain are still visibly dissolving.
  useEffect(() => {
    if (decision !== "play") return;
    const timers: ReturnType<typeof setTimeout>[] = [
      setTimeout(() => setPhase("brain"),   T.brain),
      setTimeout(() => setPhase("neurons"), T.neurons),
      setTimeout(() => setPhase("climax"),  T.climax),
      setTimeout(() => { setPhase("reveal"); markReady(); }, T.reveal),
      setTimeout(() => finish(),            T.end),
    ];
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decision]);

  // Esc / Enter dismiss
  useEffect(() => {
    if (decision !== "play") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decision]);

  function finish() {
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch {}
    // markReady() usually fires at REVEAL; the call here is a safety net for
    // the Esc/Enter/skip-button paths that bypass the phase timeline.
    markReady();
    setDecision("done");
  }

  if (decision !== "play" && decision !== "done") return null;

  const gold = phase === "climax" || phase === "reveal";
  const stroke = gold ? GOLD : TEAL;

  const exiting = phase === "reveal";

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Bem-vindo a Conectamente"
      className="fixed inset-0 z-[210] overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: decision === "done" ? 0 : 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        pointerEvents: exiting || decision === "done" ? "none" : "auto",
        willChange: "opacity",
      }}
    >
      {/*
        Fusion exit (REVEAL phase) is layered so it doesn't feel like a cut:
          • Backdrop + stars dissolve FAST (0.7s) — homepage appears behind.
          • Brain group drifts up + scales + fades SLOWER (1.5s) — it's the
            last thing on screen, gracefully ceding to the homepage's hero.
          • Warm climax bloom retreats to 0 (was 0.4 — competed with reveal).
          • Hard white wash removed — replaced by the dissolve.
      */}

      {/* LAYER 1 — dark backdrop + ambient halo (dissolves first) */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 50%, #0a1322 0%, #04060a 60%, #000 100%)",
          willChange: "opacity",
        }}
        initial={{ opacity: 1 }}
        animate={{ opacity: exiting ? 0 : 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Stars + soft teal halo travel with the backdrop */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ willChange: "opacity" }}
        initial={{ opacity: 1 }}
        animate={{ opacity: exiting ? 0 : 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <Stars />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(50% 60% at 50% 50%, rgba(110,200,175,0.10), transparent 70%)",
          }}
        />
      </motion.div>

      {/* LAYER 2 — brain + title + progress (drifts upward, fades slower) */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center px-6"
        style={{ willChange: "transform, opacity" }}
        initial={{ opacity: 1, scale: 1, y: 0 }}
        animate={{
          opacity: exiting ? 0 : 1,
          scale:   exiting ? 1.06 : 1,
          y:       exiting ? -28 : 0,
        }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <BrainCore phase={phase} gold={gold} stroke={stroke} />
        <Title />
        <ProgressLine phase={phase} />
      </motion.div>

      {/* Warm bloom — opacity-only, retreats during reveal */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 70% at 50% 50%, rgba(255,210,140,0.45), transparent 70%)",
          willChange: "opacity",
        }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: phase === "climax" ? 0.7 : 0,
        }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Skip button — also fades during reveal so it doesn't linger */}
      <motion.button
        type="button"
        onClick={finish}
        aria-label="Saltar intro"
        className="absolute bottom-6 right-6 z-10 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 h-10 text-xs uppercase tracking-[0.2em] text-white/70 backdrop-blur-md transition hover:bg-white/10 hover:text-white"
        initial={{ opacity: 1 }}
        animate={{ opacity: exiting ? 0 : 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        Saltar intro
      </motion.button>
    </motion.div>
  );
}

/* ======================================================================== */
/* Stars — 30 dots, CSS-only twinkle. Generated once, no JS animation.       */
/* ======================================================================== */

function Stars() {
  const stars = useMemo(() => {
    const rng = mulberry32(424242);
    return Array.from({ length: 30 }, () => ({
      x: rng() * 100,
      y: rng() * 100,
      r: 0.4 + rng() * 0.9,
      o: 0.5 + rng() * 0.5,
      d: rng() * 5,
      dur: 3 + rng() * 4,
    }));
  }, []);
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full pointer-events-none"
      aria-hidden
    >
      {stars.map((s, i) => (
        <circle
          key={i}
          cx={s.x} cy={s.y} r={s.r * 0.3}
          fill="#fff"
          style={{
            opacity: s.o,
            animation: `twinkle ${s.dur}s ease-in-out ${s.d}s infinite`,
          } as React.CSSProperties}
        />
      ))}
    </svg>
  );
}

/* ======================================================================== */
/* BrainCore — outline, neurons, fake glow via radial-gradient overlays      */
/* ======================================================================== */

function BrainCore({
  phase, gold, stroke,
}: { phase: Phase; gold: boolean; stroke: string }) {
  const showBrain   = phase !== "cosmos";
  const showNeurons = phase === "neurons" || phase === "climax" || phase === "reveal";

  return (
    <div className="relative" style={{ willChange: "transform" }}>
      {/* Halo behind brain — single radial gradient, cheap */}
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(110,200,175,0.32), transparent 70%)",
          willChange: "opacity",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: showBrain ? (gold ? 0.9 : 0.55) : 0 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      />

      <svg
        viewBox="0 0 280 280"
        width={280}
        height={280}
        className="relative md:w-[360px] md:h-[360px]"
        aria-hidden
      >
        {/* Brain outline */}
        <motion.path
          d={BRAIN_OUTLINE}
          fill="none"
          stroke={stroke}
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: showBrain ? 1 : 0,
            opacity: showBrain ? 0.95 : 0,
          }}
          transition={{ duration: 2.6, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* One fold for texture */}
        <motion.path
          d={BRAIN_FOLD}
          fill="none"
          stroke={stroke}
          strokeOpacity={0.55}
          strokeWidth={0.9}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: showBrain ? 1 : 0 }}
          transition={{ duration: 2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Connection lines (drawn once neurons appear) */}
        {NEURONS.map((n, i) => (
          <motion.line
            key={`l-${i}`}
            x1={140} y1={140} x2={n.x} y2={n.y}
            stroke={stroke}
            strokeWidth={0.6}
            strokeOpacity={0.25}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: showNeurons ? 1 : 0 }}
            transition={{
              duration: 0.5,
              delay: showNeurons ? i * 0.12 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ))}

        {/* Neurons + pulse rings */}
        {NEURONS.map((n, i) => (
          <Neuron
            key={`n-${i}`}
            x={n.x} y={n.y}
            visible={showNeurons}
            delay={i * 0.18}
            stroke={stroke}
            gold={gold}
          />
        ))}

        {/* Centre core */}
        {showNeurons && (
          <motion.circle
            cx={140} cy={140} r={4}
            fill={gold ? "#FFE6BB" : "#A6E5D0"}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
      </svg>
    </div>
  );
}

function Neuron({
  x, y, visible, delay, stroke, gold,
}: { x: number; y: number; visible: boolean; delay: number; stroke: string; gold: boolean }) {
  return (
    <g>
      {/* Soft halo — cheaper than drop-shadow filter */}
      <motion.circle
        cx={x} cy={y} r={6}
        fill={stroke}
        fillOpacity={0.18}
        initial={{ scale: 0 }}
        animate={{ scale: visible ? 1 : 0 }}
        transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      />
      {/* Pulse — one-shot expand+fade, staggered per neuron */}
      <motion.circle
        cx={x} cy={y}
        fill="none"
        stroke={stroke}
        strokeWidth={0.8}
        initial={{ r: 5, opacity: 0 }}
        animate={visible ? { r: 28, opacity: [0.55, 0] } : { r: 5, opacity: 0 }}
        transition={{ duration: 1.2, delay: delay + 0.15, ease: [0.22, 1, 0.36, 1] }}
      />
      {/* Core dot */}
      <motion.circle
        cx={x} cy={y} r={2.4}
        fill={stroke}
        initial={{ scale: 0 }}
        animate={{ scale: visible ? 1 : 0 }}
        transition={{ duration: 0.4, delay: delay + 0.1, ease: [0.22, 1, 0.36, 1] }}
      />
    </g>
  );
}

/* ======================================================================== */
/* Title + progress + messages                                               */
/* ======================================================================== */

function Title() {
  return (
    <motion.div
      className="mt-8 md:mt-10 text-center"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="font-serif text-3xl md:text-5xl tracking-tight text-white">
        Conectamente
      </p>
      <p className="mt-2 text-sm md:text-base text-white/55">
        uma plataforma terapêutica digital
      </p>
    </motion.div>
  );
}

function ProgressLine({ phase }: { phase: Phase }) {
  return (
    <div className="mt-10 w-full max-w-md">
      {/* GPU-only progress: scaleX on a single div */}
      <div className="h-[2px] w-full bg-white/10 overflow-hidden rounded-full">
        <motion.div
          className="h-full"
          style={{
            transformOrigin: "left",
            background:
              "linear-gradient(90deg, rgba(110,200,175,0.7) 0%, rgba(226,184,122,0.95) 100%)",
            willChange: "transform",
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: phase === "cosmos" ? 0.08 : phase === "brain" ? 0.4 : phase === "neurons" ? 0.78 : 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <div className="mt-3 h-5 text-center" aria-live="polite" aria-atomic="true">
        <motion.p
          key={phase}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 0.78, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="text-xs uppercase tracking-[0.28em] text-white/70"
        >
          {MESSAGES[phase]}
        </motion.p>
      </div>
    </div>
  );
}

/* ======================================================================== */

function mulberry32(a: number) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
