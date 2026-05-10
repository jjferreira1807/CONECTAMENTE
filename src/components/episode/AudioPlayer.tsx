"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Rewind, FastForward, Volume2, VolumeX, Gauge } from "lucide-react";
import { cn } from "@/lib/cn";

interface Props {
  src?: string;        // Path to MP3/MP4. When undefined, the player is cosmetic.
  title: string;
  subtitle?: string;
  /** Called every 5s of forward playback. Used for time-engaged metrics. */
  onTick?: (secondsElapsed: number) => void;
}

const SPEEDS = [1, 1.25, 1.5, 0.85] as const;

/**
 * Premium audio player. Calm/Apple Podcasts inspired: glass card, animated
 * waveform, ambient teal/amber glow that breathes with playback, speed
 * control, mute, and a real progress scrubber.
 *
 * Without `src`, renders a non-functional cosmetic player so designs and
 * tests can preview before audio assets exist.
 */
export function AudioPlayer({ src, title, subtitle, onTick }: Props) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(0);
  const tickRef = useRef(0);
  const onTickRef = useRef(onTick);
  useEffect(() => { onTickRef.current = onTick; }, [onTick]);

  useEffect(() => {
    const a = ref.current;
    if (!a) return;
    const onTimeUpdate = () => {
      setTime(a.currentTime);
      const sec = Math.floor(a.currentTime);
      const delta = sec - tickRef.current;
      if (delta >= 5) {
        onTickRef.current?.(delta);
        tickRef.current = sec;
      } else if (delta < 0) {
        tickRef.current = sec;
      }
    };
    const onMeta = () => setDuration(a.duration || 0);
    const onEnd = () => setPlaying(false);
    a.addEventListener("timeupdate", onTimeUpdate);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("ended", onEnd);
    return () => {
      a.removeEventListener("timeupdate", onTimeUpdate);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("ended", onEnd);
    };
  }, []);

  const toggle = () => {
    const a = ref.current;
    if (!a || !src) return;
    if (a.paused) { a.play(); setPlaying(true); }
    else { a.pause(); setPlaying(false); }
  };
  const seek = (delta: number) => {
    const a = ref.current; if (!a) return;
    a.currentTime = Math.max(0, Math.min(a.duration || 0, a.currentTime + delta));
  };
  const onScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const a = ref.current; if (!a) return;
    a.currentTime = (Number(e.target.value) / 100) * (a.duration || 0);
  };
  const cycleSpeed = () => {
    const next = (speedIdx + 1) % SPEEDS.length;
    setSpeedIdx(next);
    if (ref.current) ref.current.playbackRate = SPEEDS[next];
  };

  const pct = duration > 0 ? (time / duration) * 100 : 0;
  const speed = SPEEDS[speedIdx];

  return (
    <div className="relative">
      {/* Ambient halo (visible during playback) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-6 rounded-[2rem]"
        style={{
          background:
            "radial-gradient(60% 70% at 30% 20%, rgb(var(--accent) / 0.22), transparent 70%), radial-gradient(50% 60% at 80% 80%, rgb(var(--accent-2) / 0.18), transparent 70%)",
          filter: "blur(28px)",
        }}
        animate={{ opacity: playing ? 0.9 : 0.4 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="relative card p-5 md:p-7 shadow-cinematic bg-elevated/85">
        {/* Header */}
        <div className="flex items-center gap-4 md:gap-5">
          <Waveform playing={playing} />
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">
              {subtitle ?? "Episódio"}
            </p>
            <p className="font-medium truncate mt-1">{title}</p>
          </div>
          <PlayButton playing={playing} disabled={!src} onClick={toggle} />
        </div>

        {/* Scrubber */}
        <div className="mt-6">
          <div className="relative h-1 rounded-full bg-border overflow-hidden">
            <motion.div
              className="h-full"
              style={{
                background:
                  "linear-gradient(90deg, rgb(var(--accent)) 0%, rgb(var(--accent-2)) 100%)",
                boxShadow: "0 0 12px rgb(var(--glow) / 0.5)",
              }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.2, ease: "linear" }}
            />
            <input
              type="range" min={0} max={100} value={pct} onChange={onScrub}
              aria-label="Progresso"
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
              style={{ height: "100%" }}
            />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-muted tabular-nums w-10">{fmt(time)}</span>

            <div className="flex items-center gap-1.5">
              <IconButton onClick={() => seek(-15)} label="Recuar 15s">
                <Rewind className="h-4 w-4" />
              </IconButton>
              <IconButton onClick={() => seek(15)} label="Avançar 15s">
                <FastForward className="h-4 w-4" />
              </IconButton>
              <IconButton
                onClick={() => {
                  const a = ref.current; if (!a) return;
                  a.muted = !a.muted; setMuted(a.muted);
                }}
                label={muted ? "Ativar som" : "Silenciar"}
              >
                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </IconButton>
              <button
                type="button"
                onClick={cycleSpeed}
                aria-label={`Velocidade ${speed}x`}
                className="inline-flex items-center gap-1.5 rounded-full bg-ink/5 hover:bg-ink/10 transition px-3 h-9 text-xs font-medium tabular-nums"
              >
                <Gauge className="h-3.5 w-3.5" /> {speed}x
              </button>
            </div>

            <span className="text-xs text-muted tabular-nums w-10 text-right">
              {fmt(duration)}
            </span>
          </div>
        </div>

        {src ? (
          <audio ref={ref} src={src} preload="metadata" />
        ) : (
          <p className="mt-4 text-xs text-muted italic">
            Áudio será adicionado em <code>/public/audio/</code>; o player está pronto.
          </p>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */

function PlayButton({
  playing, disabled, onClick,
}: { playing: boolean; disabled: boolean; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={playing ? "Pausar" : "Reproduzir"}
      disabled={disabled}
      whileTap={{ scale: 0.94 }}
      whileHover={{ scale: 1.04 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "relative inline-flex h-14 w-14 items-center justify-center rounded-full",
        "bg-gradient-to-br from-accent to-accent2 text-bg",
        "shadow-ambient",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 translate-x-[1.5px]" />}
      {playing && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-full ring-2 ring-accent/40 animate-breathe"
        />
      )}
    </motion.button>
  );
}

function IconButton({
  onClick, label, children,
}: { onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label}
      whileTap={{ scale: 0.92 }}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-ink/5 transition"
    >
      {children}
    </motion.button>
  );
}

/* ------------------------------------------------------------------------ */

function Waveform({ playing }: { playing: boolean }) {
  return (
    <div
      aria-hidden
      className="hidden sm:flex items-center gap-[3px] h-12 w-24 origin-center"
    >
      {WAVE_HEIGHTS.map((h, i) => (
        <span
          key={i}
          className={cn(
            "block w-[3px] rounded-full",
            "bg-gradient-to-t from-accent to-accent2",
            playing ? "animate-wave-bar" : ""
          )}
          style={{
            height: `${h * 100}%`,
            animationDelay: `${(i % 8) * 90}ms`,
            opacity: playing ? 0.95 : 0.55,
            transition: "opacity 600ms cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      ))}
    </div>
  );
}

const WAVE_HEIGHTS = [
  0.35, 0.55, 0.78, 0.42, 0.68, 0.92, 0.5, 0.72,
  0.88, 0.6, 0.45, 0.82, 0.95, 0.5, 0.7, 0.4,
  0.62, 0.85, 0.55, 0.4, 0.78, 0.6, 0.45, 0.32,
];

function fmt(s: number) {
  if (!isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, "0")}`;
}
