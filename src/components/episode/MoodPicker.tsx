"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress, type Mood } from "@/lib/store";
import { remote } from "@/lib/sync/pushers";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Daily emotional check-in.
 *
 * The selected mood drives an ambient halo behind the card that shifts in
 * colour from cool (low) to warm (high) — a calm, non-judgemental visual.
 */
const moods: { v: Mood; label: string; emoji: string; tint: string }[] = [
  { v: 1, label: "Muito mal",  emoji: "😣", tint: "rgba(160, 130, 200, 0.35)" }, // cool violet
  { v: 2, label: "Mal",         emoji: "😕", tint: "rgba(120, 160, 200, 0.32)" }, // cool blue
  { v: 3, label: "Neutro",      emoji: "😐", tint: "rgba(160, 180, 180, 0.28)" }, // grey-teal
  { v: 4, label: "Bem",         emoji: "🙂", tint: "rgba(110, 200, 175, 0.32)" }, // accent green
  { v: 5, label: "Muito bem",   emoji: "😊", tint: "rgba(226, 184, 122, 0.36)" }, // amber gold
];

export function MoodPicker() {
  const today = new Date().toISOString().slice(0, 10);
  const existing = useProgress((s) => s.checkIns.find((c) => c.date === today));
  const addCheckIn = useProgress((s) => s.addCheckIn);
  const [mood, setMood] = useState<Mood | null>((existing?.mood as Mood) ?? null);
  const [energy, setEnergy] = useState<Mood | null>((existing?.energy as Mood) ?? null);
  const [note, setNote] = useState(existing?.note ?? "");
  const [saved, setSaved] = useState(false);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
  }, []);

  const submit = () => {
    if (mood == null || energy == null) return;
    addCheckIn({ date: today, mood, energy, note: note || undefined });
    remote.mood({ mood, energy, note: note || undefined, day: today });
    remote.analytics({ kind: "mood_save", attrs: { mood, energy } });
    setSaved(true);
    if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    savedTimerRef.current = setTimeout(() => setSaved(false), 2400);
  };

  const halo = mood ? moods[mood - 1].tint : "rgba(110, 200, 175, 0.18)";

  return (
    <div className="relative">
      {/* Ambient halo driven by current mood selection */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-3 rounded-[2rem]"
        style={{
          background: `radial-gradient(60% 70% at 30% 20%, ${halo}, transparent 70%)`,
          filter: "blur(28px)",
        }}
        animate={{ opacity: mood ? 0.9 : 0.35 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      />

      <Card className="relative">
        <p className="text-xs uppercase tracking-[0.25em] text-accent">Check-in de hoje</p>
        <h3 className="font-serif text-2xl mt-2">Como te sentes?</h3>

        <Row label="Estado emocional">
          <MoodRow value={mood} onChange={setMood} />
        </Row>
        <Row label="Energia">
          <MoodRow value={energy} onChange={setEnergy} />
        </Row>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder="Uma palavra ou frase que descreva o dia (opcional)"
          className="mt-5 w-full bg-bg/40 hairline rounded-xl p-3 text-sm resize-none outline-none focus:border-accent transition-colors"
        />

        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="text-xs text-muted">
            {existing ? "Pode atualizar quantas vezes quiseres." : "Os teus dados ficam neste dispositivo."}
          </p>
          <div aria-live="polite" className="inline-flex items-center gap-2">
            <AnimatePresence>
              {saved && (
                <motion.span
                  key="saved"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="inline-flex items-center gap-1 text-xs text-success"
                >
                  <Check className="h-3.5 w-3.5" /> guardado
                </motion.span>
              )}
            </AnimatePresence>
            <Button
              onClick={submit}
              disabled={mood == null || energy == null}
              size="sm"
              variant={mood != null && energy != null ? "premium" : "subtle"}
            >
              {existing ? "Atualizar" : "Guardar"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <p className="text-xs uppercase tracking-[0.2em] text-muted mb-2.5">{label}</p>
      {children}
    </div>
  );
}

function MoodRow({ value, onChange }: { value: Mood | null; onChange: (m: Mood) => void }) {
  return (
    <div className="flex justify-between gap-2">
      {moods.map((m) => {
        const active = value === m.v;
        return (
          <motion.button
            key={m.v}
            type="button"
            onClick={() => onChange(m.v)}
            aria-label={m.label}
            aria-pressed={active}
            whileTap={{ scale: 0.94 }}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "relative flex-1 h-14 rounded-2xl flex items-center justify-center text-xl",
              "transition-colors duration-300",
              active
                ? "ring-1 ring-accent shadow-[0_0_24px_-6px_rgb(var(--glow)/0.6)]"
                : "hairline hover:bg-ink/5"
            )}
            style={active ? { background: m.tint } : undefined}
          >
            <span aria-hidden>{m.emoji}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
