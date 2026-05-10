"use client";
import { useEffect, useRef, useState } from "react";
import { Play, Pause, Rewind, FastForward, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/cn";

interface Props {
  src?: string;        // path to MP3/MP4; optional — falls back to "ambient" silent demo
  title: string;
  subtitle?: string;
  /** Called every 5s of playback (rounded up). Used to track minutes engaged. */
  onTick?: (secondsElapsed: number) => void;
}

/**
 * Minimal-but-premium audio player. If no `src`, renders a non-functional
 * cosmetic player so designers can preview before audio assets exist.
 */
export function AudioPlayer({ src, title, subtitle, onTick }: Props) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const tickRef = useRef(0);

  // Keep the latest `onTick` in a ref so the effect doesn't re-attach
  // listeners on every parent render.
  const onTickRef = useRef(onTick);
  useEffect(() => { onTickRef.current = onTick; }, [onTick]);

  useEffect(() => {
    const a = ref.current;
    if (!a) return;
    const onTimeUpdate = () => {
      setTime(a.currentTime);
      const sec = Math.floor(a.currentTime);
      const delta = sec - tickRef.current;
      // Only count forward deltas: seeking backward shouldn't credit minutes.
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
    a.currentTime = Math.max(0, Math.min((a.duration || 0), a.currentTime + delta));
  };
  const onScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const a = ref.current; if (!a) return;
    const v = Number(e.target.value);
    a.currentTime = (v / 100) * (a.duration || 0);
  };

  const pct = duration > 0 ? (time / duration) * 100 : 0;

  return (
    <div className="card p-5 md:p-6 shadow-soft">
      <div className="flex items-center gap-4">
        <Visualiser playing={playing} />
        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted">{subtitle ?? "Episódio"}</p>
          <p className="font-medium truncate">{title}</p>
        </div>
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pausar" : "Reproduzir"}
          disabled={!src}
          className={cn(
            "inline-flex h-12 w-12 items-center justify-center rounded-full bg-ink text-bg shadow-soft transition active:scale-95",
            !src && "opacity-50"
          )}
        >
          {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 translate-x-[1px]" />}
        </button>
      </div>

      <div className="mt-5">
        <input
          type="range" min={0} max={100} value={pct} onChange={onScrub}
          aria-label="Progresso"
          className="w-full accent-accent"
        />
        <div className="flex items-center justify-between text-xs text-muted">
          <span>{fmt(time)}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => seek(-15)} aria-label="Recuar 15s" className="p-2.5 rounded-full hover:bg-ink/5">
              <Rewind className="h-4 w-4" />
            </button>
            <button onClick={() => seek(15)} aria-label="Avançar 15s" className="p-2.5 rounded-full hover:bg-ink/5">
              <FastForward className="h-4 w-4" />
            </button>
            <button
              onClick={() => { const a = ref.current; if (!a) return; a.muted = !a.muted; setMuted(a.muted); }}
              aria-label={muted ? "Ativar som" : "Silenciar"}
              className="p-2.5 rounded-full hover:bg-ink/5"
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          </div>
          <span>{fmt(duration)}</span>
        </div>
      </div>

      {src ? (
        <audio ref={ref} src={src} preload="metadata" />
      ) : (
        <p className="mt-3 text-xs text-muted italic">
          (Áudio será adicionado em <code>/public/audio/</code>; o player está pronto.)
        </p>
      )}
    </div>
  );
}

function Visualiser({ playing }: { playing: boolean }) {
  return (
    <div className="hidden sm:flex items-end gap-0.5 h-10 w-12">
      {[0.3, 0.7, 1, 0.6, 0.4].map((h, i) => (
        <span
          key={i}
          className={cn(
            "w-1.5 rounded-full bg-accent/70",
            playing ? "animate-breathe" : ""
          )}
          style={{ height: `${h * 100}%`, animationDelay: `${i * 120}ms` }}
        />
      ))}
    </div>
  );
}

function fmt(s: number) {
  if (!isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60); const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, "0")}`;
}
