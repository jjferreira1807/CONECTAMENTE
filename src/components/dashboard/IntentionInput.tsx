"use client";
import { useState, useEffect } from "react";
import { useProgress } from "@/lib/store";
import { remote } from "@/lib/sync/pushers";
import { Check, Sparkles } from "lucide-react";

const sugestoes = [
  "Hoje, deixo o telemóvel fora do quarto à noite.",
  "Hoje, faço uma pausa de ecrã ao almoço.",
  "Hoje, ligo a uma pessoa de quem sinto falta.",
  "Hoje, dou-me 15 min sem fazer nada.",
  "Hoje, abro o livro antes do feed.",
];

export function IntentionInput() {
  const todayKey = new Date().toISOString().slice(0, 10);
  const intention = useProgress((s) => s.intentions.find((i) => i.date === todayKey));
  const setIntention = useProgress((s) => s.setIntentionForToday);
  const toggle = useProgress((s) => s.toggleIntention);

  const [value, setValue] = useState(intention?.text ?? "");
  useEffect(() => setValue(intention?.text ?? ""), [intention?.text]);

  const save = () => {
    const t = value.trim(); if (!t) return;
    setIntention(t);
    remote.intention({ text: t, day: todayKey });
    remote.analytics({ kind: "intention_save" });
  };
  const pick = (s: string) => {
    setValue(s); setIntention(s);
    remote.intention({ text: s, day: todayKey });
    remote.analytics({ kind: "intention_save" });
  };

  return (
    <div className="mt-3">
      <div className="flex items-center gap-3">
        <Sparkles className="h-5 w-5 text-accent" aria-hidden />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => e.key === "Enter" && save()}
          placeholder="Hoje, escolho…"
          className="flex-1 bg-transparent outline-none text-lg md:text-xl placeholder:text-muted"
        />
        {intention && (
          <button
            onClick={() => {
              toggle(todayKey);
              remote.intentionToggle({ day: todayKey, done: !intention.done });
            }}
            className={
              "inline-flex items-center gap-1.5 rounded-full px-3.5 h-9 text-sm transition " +
              (intention.done
                ? "bg-success/15 text-success"
                : "bg-ink/5 hover:bg-ink/10")
            }
          >
            <Check className="h-3.5 w-3.5" />
            {intention.done ? "Cumprida" : "Marcar feita"}
          </button>
        )}
      </div>

      {!intention && (
        <div className="mt-4 flex flex-wrap gap-2">
          {sugestoes.map((s) => (
            <button
              key={s}
              onClick={() => pick(s)}
              className="text-xs rounded-full hairline px-3 py-1.5 text-muted hover:text-ink hover:bg-ink/5"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
