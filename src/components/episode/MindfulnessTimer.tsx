"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";
import { cn } from "@/lib/cn";

interface Props {
  defaultSeconds?: number;
  presets?: number[]; // seconds
  label?: string;
  onComplete?: () => void;
}

/**
 * Calm circular timer for mindfulness exercises.
 *
 * Visual layers (bottom → top):
 *   1. Ambient halo behind the card (intensifies while running)
 *   2. Outer track (border colour)
 *   3. Progress arc (accent), animated stroke-dashoffset
 *   4. Inner breathing orb (4-2-6 cadence — slower than CSS breathe)
 *   5. Centre label + countdown
 *
 * Performance: the arc uses CSS transition on `stroke-dashoffset`, not RAF.
 * The interval ticks once per second; reset clears it.
 */
export function MindfulnessTimer({
  defaultSeconds = 180,
  presets = [60, 180, 300, 600],
  label = "Respira",
  onComplete,
}: Props) {
  const [duration, setDuration] = useState(defaultSeconds);
  const [remaining, setRemaining] = useState(defaultSeconds);
  const [running, setRunning] = useState(false);
  const intRef = useRef<number | null>(null);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  useEffect(() => {
    if (!running) return;
    intRef.current = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setRunning(false);
          completeRef.current?.();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => {
      if (intRef.current !== null) window.clearInterval(intRef.current);
    };
  }, [running]);

  const reset = () => { setRunning(false); setRemaining(duration); };
  const choose = (s: number) => { setDuration(s); setRemaining(s); setRunning(false); };
  const pct = duration > 0 ? remaining / duration : 0;
  const r = 96;
  const C = 2 * Math.PI * r;

  return (
    <div className="relative">
      {/* Ambient halo (intensifies while running) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-6 rounded-[2.5rem]"
        style={{
          background:
            "radial-gradient(60% 70% at 50% 50%, rgb(var(--accent) / 0.22), transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{ opacity: running ? 0.9 : 0.5, scale: running ? 1.05 : 1 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="relative card p-7 md:p-9 flex flex-col items-center text-center shadow-cinematic">
        <div className="relative">
          <svg viewBox="0 0 224 224" className="w-60 h-60" aria-hidden>
            <defs>
              <linearGradient id="mt-arc" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgb(var(--accent))" stopOpacity={1} />
                <stop offset="100%" stopColor="rgb(var(--accent-2))" stopOpacity={0.9} />
              </linearGradient>
            </defs>
            <circle
              cx="112" cy="112" r={r}
              fill="none"
              className="stroke-border"
              strokeWidth="5"
            />
            <circle
              cx="112" cy="112" r={r}
              fill="none"
              stroke="url(#mt-arc)"
              strokeWidth="6"
              strokeLinecap="round"
              style={{
                strokeDasharray: C,
                strokeDashoffset: C * (1 - pct),
                transform: "rotate(-90deg)",
                transformOrigin: "center",
                transition: "stroke-dashoffset 1s linear",
                filter: running ? "drop-shadow(0 0 6px rgb(var(--glow) / 0.5))" : undefined,
              }}
            />
          </svg>

          {/* Breathing orb */}
          <motion.div
            aria-hidden
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            animate={running ? { scale: [1, 1.12, 1] } : { scale: 1 }}
            transition={
              running
                // 4-2-6 inhale–hold–exhale rhythm
                ? { duration: 12, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0.6, ease: "easeOut" }
            }
          >
            <div
              className="rounded-full w-28 h-28 ring-1 ring-accent/30"
              style={{
                background:
                  "radial-gradient(closest-side, rgb(var(--accent) / 0.18), rgb(var(--accent) / 0.04) 70%, transparent)",
              }}
            />
          </motion.div>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-xs uppercase tracking-[0.25em] text-muted [text-indent:0.25em]">{label}</p>
            <p className="font-serif text-4xl md:text-5xl tabular-nums mt-1">{fmt(remaining)}</p>
          </div>
        </div>

        <div className="mt-7 flex gap-1.5">
          {presets.map((p) => (
            <button
              key={p}
              onClick={() => choose(p)}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-sm transition duration-300",
                duration === p
                  ? "bg-ink text-bg shadow-soft"
                  : "bg-ink/5 text-ink hover:bg-ink/10"
              )}
            >
              {Math.round(p / 60)}m
            </button>
          ))}
        </div>

        <div className="mt-5 flex gap-2.5">
          <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.03 }}
            onClick={() => setRunning((r) => !r)}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-accent to-accent2 text-bg px-6 h-12 text-sm font-medium shadow-ambient"
          >
            {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-[1px]" />}
            {running ? "Pausar" : "Começar"}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={reset}
            aria-label="Reiniciar"
            className="inline-flex items-center justify-center rounded-full hairline w-12 h-12 hover:bg-ink/5 transition"
          >
            <RotateCcw className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function fmt(s: number) {
  const m = Math.floor(s / 60); const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}
