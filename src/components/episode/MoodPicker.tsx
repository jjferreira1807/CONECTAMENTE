"use client";
import { useEffect, useRef, useState } from "react";
import { useProgress, type Mood } from "@/lib/store";
import { remote } from "@/lib/sync/pushers";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const moods: { v: Mood; label: string; emoji: string }[] = [
  { v: 1, label: "Muito mal", emoji: "😣" },
  { v: 2, label: "Mal", emoji: "😕" },
  { v: 3, label: "Neutro", emoji: "😐" },
  { v: 4, label: "Bem", emoji: "🙂" },
  { v: 5, label: "Muito bem", emoji: "😊" },
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

  // Clear pending "saved → false" timer on unmount to avoid setState after unmount.
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

  return (
    <Card>
      <p className="text-sm text-muted">Check-in de hoje</p>
      <h3 className="font-serif text-2xl mt-1">Como te sentes?</h3>

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
        className="mt-4 w-full bg-bg/40 hairline rounded-xl p-3 text-sm resize-none outline-none focus:border-accent"
      />

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-muted">
          {existing ? "Pode atualizar quantas vezes quiseres." : "Os teus dados ficam neste dispositivo."}
        </p>
        <Button onClick={submit} disabled={mood == null || energy == null} size="sm">
          {saved ? "Guardado ✓" : existing ? "Atualizar" : "Guardar"}
        </Button>
      </div>
    </Card>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <p className="text-xs uppercase tracking-wider text-muted mb-2">{label}</p>
      {children}
    </div>
  );
}

function MoodRow({ value, onChange }: { value: Mood | null; onChange: (m: Mood) => void }) {
  return (
    <div className="flex justify-between gap-2">
      {moods.map((m) => (
        <button
          key={m.v}
          onClick={() => onChange(m.v)}
          aria-label={m.label}
          className={cn(
            "flex-1 h-14 rounded-2xl hairline flex flex-col items-center justify-center transition text-xl",
            value === m.v ? "bg-accent/15 ring-1 ring-accent" : "hover:bg-ink/5"
          )}
        >
          <span aria-hidden>{m.emoji}</span>
        </button>
      ))}
    </div>
  );
}
