"use client";
import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { cn } from "@/lib/cn";

interface Props {
  defaultSeconds?: number;
  presets?: number[]; // seconds
  label?: string;
  onComplete?: () => void;
}

/**
 * Calm circular timer for mindfulness exercises. Breathing ring pulses while
 * running; reduced-motion users get a static ring.
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
  const r = 92;
  const C = 2 * Math.PI * r;

  return (
    <div className="card p-6 md:p-8 flex flex-col items-center text-center">
      <div className="relative">
        <svg viewBox="0 0 220 220" className="w-56 h-56" aria-hidden>
          <circle cx="110" cy="110" r={r} fill="none" className="stroke-border" strokeWidth="6" />
          <circle
            cx="110" cy="110" r={r} fill="none"
            className="stroke-accent transition-[stroke-dashoffset] duration-1000 ease-linear"
            strokeWidth="6" strokeLinecap="round"
            style={{
              strokeDasharray: C,
              strokeDashoffset: C * (1 - pct),
              transform: "rotate(-90deg)",
              transformOrigin: "center",
            }}
          />
        </svg>
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center pointer-events-none",
            running && "animate-breathe"
          )}
        >
          <div className="rounded-full bg-accent/15 w-24 h-24 ring-1 ring-accent/30" />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">{label}</p>
          <p className="font-serif text-4xl tabular-nums mt-1">{fmt(remaining)}</p>
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        {presets.map((p) => (
          <button
            key={p}
            onClick={() => choose(p)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm transition",
              duration === p ? "bg-ink text-bg" : "bg-ink/5 text-ink hover:bg-ink/10"
            )}
          >
            {Math.round(p / 60)}m
          </button>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setRunning((r) => !r)}
          className="inline-flex items-center gap-2 rounded-full bg-ink text-bg px-5 h-11 text-sm font-medium"
        >
          {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {running ? "Pausar" : "Começar"}
        </button>
        <button
          onClick={reset}
          aria-label="Reiniciar"
          className="inline-flex items-center justify-center rounded-full hairline w-11 h-11 hover:bg-ink/5"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function fmt(s: number) {
  const m = Math.floor(s / 60); const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}
