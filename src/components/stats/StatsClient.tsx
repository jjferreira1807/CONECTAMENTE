"use client";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { useProgress } from "@/lib/store";
import { episodes } from "@/content/episodes";
import { Card } from "@/components/ui/Card";
import { ProgressRing } from "@/components/episode/ProgressRing";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine,
} from "recharts";
import { CalendarHeart, Sparkles, TrendingUp } from "lucide-react";

/**
 * Stats / progress page client.
 *
 * Replaces the previous flat line chart with a gradient area chart inspired
 * by Apple Health / Calm's "history" surfaces. KPI strip across the top,
 * intentions log alongside.
 */
export function StatsClient() {
  const checkIns = useProgress((s) => s.checkIns);
  const eps = useProgress((s) => s.episodes);
  const intentions = useProgress((s) => s.intentions);
  const streak = useProgress((s) => s.streak());
  const hydrated = useProgress((s) => s.hydrated);

  const data = useMemo(
    () =>
      checkIns.map((c) => ({
        date: c.date.slice(5),
        humor: c.mood,
        energia: c.energy,
      })),
    [checkIns]
  );

  const completed = Object.values(eps).filter((e) => e.completedAt).length;
  const total = episodes.length;
  const intentionsDone = intentions.filter((i) => i.done).length;
  const avgMood = checkIns.length
    ? (checkIns.reduce((a, c) => a + c.mood, 0) / checkIns.length).toFixed(1)
    : "—";

  if (!hydrated) return <Skeleton />;

  if (checkIns.length === 0 && completed === 0) {
    return (
      <Card>
        <p className="prose-soft">
          Ainda não há dados para mostrar. Faz o primeiro check-in no{" "}
          <a href="/dashboard" className="underline">dashboard</a>, ou começa o{" "}
          <a href="/programa/bem-vindo" className="underline">episódio 1</a>.
        </p>
      </Card>
    );
  }

  return (
    <>
      {/* KPI strip */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border/50 rounded-3xl overflow-hidden hairline backdrop-blur-md"
      >
        <Kpi label="Programa" value={`${completed}/${total}`} sub="episódios" />
        <Kpi label="Sequência" value={`${streak}d`} sub="check-ins seguidos" />
        <Kpi label="Humor médio" value={String(avgMood)} sub="todos os check-ins" />
        <Kpi label="Intenções cumpridas" value={String(intentionsDone)} sub={`em ${intentions.length} dias`} />
      </motion.div>

      {/* Chart + ring */}
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2 overflow-hidden relative">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-accent inline-flex items-center gap-1.5">
                <TrendingUp className="h-3 w-3" /> Humor e energia
              </p>
              <h3 className="font-serif text-2xl mt-2">Os últimos check-ins</h3>
            </div>
            <Legend />
          </div>

          <div className="mt-6 h-72 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="humorFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(var(--accent))" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="rgb(var(--accent))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="energiaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(var(--accent-2))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="rgb(var(--accent-2))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgb(var(--border) / 0.5)" strokeDasharray="2 4" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="rgb(var(--muted))"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={[1, 5]}
                  stroke="rgb(var(--muted))"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  width={22}
                />
                <ReferenceLine y={3} stroke="rgb(var(--border))" strokeDasharray="2 4" />
                <Tooltip
                  contentStyle={{
                    background: "rgb(var(--elevated))",
                    border: "1px solid rgb(var(--border))",
                    borderRadius: 12,
                    fontSize: 12,
                    boxShadow: "0 12px 32px -12px rgb(0 0 0 / 0.4)",
                  }}
                  cursor={{ stroke: "rgb(var(--border))", strokeWidth: 1 }}
                />
                <Area
                  type="monotone"
                  dataKey="humor"
                  stroke="rgb(var(--accent))"
                  strokeWidth={2.5}
                  fill="url(#humorFill)"
                  activeDot={{ r: 4, fill: "rgb(var(--accent))", stroke: "rgb(var(--bg))", strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="energia"
                  stroke="rgb(var(--accent-2))"
                  strokeWidth={2.5}
                  fill="url(#energiaFill)"
                  activeDot={{ r: 4, fill: "rgb(var(--accent-2))", stroke: "rgb(var(--bg))", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-accent">Programa</p>
              <p className="font-serif text-3xl mt-2 tabular-nums">{completed}/{total}</p>
              <p className="text-xs text-muted mt-1">episódios concluídos</p>
            </div>
            <ProgressRing value={total ? completed / total : 0} size={96} stroke={7} />
          </div>
          <p className="prose-soft text-sm mt-6">
            Repetir um episódio que ressoou é encorajado — as ideias só se assentam com prática.
          </p>
        </Card>
      </div>

      {/* Intentions log */}
      <Card className="mt-5">
        <p className="text-xs uppercase tracking-[0.25em] text-accent inline-flex items-center gap-1.5">
          <CalendarHeart className="h-3 w-3" /> Intenções recentes
        </p>
        <h3 className="font-serif text-2xl mt-2">O que te tem guiado</h3>
        <ul className="mt-5 space-y-2">
          {intentions.slice(-10).reverse().map((i) => (
            <li
              key={i.date}
              className="flex items-center justify-between gap-4 text-sm hairline rounded-xl px-4 py-3 hover:bg-ink/5 transition-colors"
            >
              <span className={i.done ? "line-through text-muted" : ""}>{i.text}</span>
              <span className="text-xs text-muted tabular-nums shrink-0 inline-flex items-center gap-2">
                {i.done && <Sparkles className="h-3 w-3 text-accent2" />}
                {i.date}
              </span>
            </li>
          ))}
          {intentions.length === 0 && (
            <p className="prose-soft text-sm">Ainda sem intenções registadas.</p>
          )}
        </ul>
      </Card>
    </>
  );
}

/* ------------------------------------------------------------------------ */

function Kpi({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="bg-bg/70 p-5 md:p-6"
    >
      <p className="text-xs uppercase tracking-[0.2em] text-muted">{label}</p>
      <p className="font-serif text-3xl md:text-4xl mt-2 tabular-nums">{value}</p>
      {sub && <p className="text-xs text-muted mt-1">{sub}</p>}
    </motion.div>
  );
}

function Legend() {
  return (
    <div className="flex items-center gap-4 text-xs text-muted">
      <span className="inline-flex items-center gap-2">
        <span className="inline-block h-2 w-2 rounded-full bg-accent" /> Humor
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="inline-block h-2 w-2 rounded-full bg-accent2" /> Energia
      </span>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border/50 rounded-3xl overflow-hidden hairline backdrop-blur-md">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="bg-surface/60 h-28 animate-pulse" />
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 h-80 rounded-3xl bg-surface/60 backdrop-blur-md animate-pulse" />
        <div className="h-60 rounded-3xl bg-surface/60 backdrop-blur-md animate-pulse" />
      </div>
    </div>
  );
}
