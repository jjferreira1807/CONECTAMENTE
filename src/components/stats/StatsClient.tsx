"use client";
import { useMemo } from "react";
import { useProgress } from "@/lib/store";
import { episodes } from "@/content/episodes";
import { Card } from "@/components/ui/Card";
import { ProgressRing } from "@/components/episode/ProgressRing";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

export function StatsClient() {
  const checkIns = useProgress((s) => s.checkIns);
  const eps = useProgress((s) => s.episodes);
  const intentions = useProgress((s) => s.intentions);
  const streak = useProgress((s) => s.streak());
  const hydrated = useProgress((s) => s.hydrated);

  const completed = Object.values(eps).filter((e) => e.completedAt).length;
  const total = episodes.length;

  const data = useMemo(
    () =>
      checkIns.map((c) => ({
        date: c.date.slice(5),
        humor: c.mood,
        energia: c.energy,
      })),
    [checkIns]
  );

  if (!hydrated) return <div className="h-[60vh]" aria-hidden />;

  if (checkIns.length === 0 && completed === 0) {
    return (
      <Card>
        <p className="prose-soft">
          Ainda não há dados para mostrar. Faz o primeiro check-in no <a href="/dashboard" className="underline">dashboard</a>,
          ou começa o <a href="/programa/bem-vindo" className="underline">episódio 1</a>.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <p className="text-sm text-muted">Humor e energia</p>
        <h3 className="font-serif text-2xl mt-1">Os últimos check-ins</h3>
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="rgb(var(--border))" strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="rgb(var(--muted))" fontSize={12} tickLine={false} />
              <YAxis domain={[1, 5]} stroke="rgb(var(--muted))" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "rgb(var(--surface))",
                  border: "1px solid rgb(var(--border))",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Line type="monotone" dataKey="humor" stroke="rgb(var(--accent))" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="energia" stroke="rgb(var(--accent-2))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted">Programa</p>
            <p className="font-serif text-2xl mt-1">{completed}/{total}</p>
          </div>
          <ProgressRing value={total ? completed / total : 0} size={84} stroke={6} />
        </div>
        <p className="prose-soft text-sm mt-5">
          Episódios concluídos. Releres é encorajado — as ideias só se assentam com repetição.
        </p>
      </Card>

      <Card>
        <p className="text-sm text-muted">Sequência</p>
        <p className="font-serif text-4xl mt-2 tabular-nums">{streak}</p>
        <p className="text-sm text-muted">{streak === 1 ? "dia" : "dias"} de check-in seguidos</p>
      </Card>

      <Card className="lg:col-span-2">
        <p className="text-sm text-muted">Intenções recentes</p>
        <h3 className="font-serif text-2xl mt-1">O que te tem guiado</h3>
        <ul className="mt-5 space-y-2">
          {intentions.slice(-7).reverse().map((i) => (
            <li
              key={i.date}
              className="flex items-center justify-between text-sm hairline rounded-xl px-4 py-3"
            >
              <span className={i.done ? "line-through text-muted" : ""}>{i.text}</span>
              <span className="text-xs text-muted tabular-nums">{i.date}</span>
            </li>
          ))}
          {intentions.length === 0 && <p className="prose-soft text-sm">Ainda sem intenções registadas.</p>}
        </ul>
      </Card>
    </div>
  );
}
