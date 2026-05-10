"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Play, Pause, ChevronRight, ChevronLeft, Subtitles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Onboarding "video" — funciona como uma sequência animada de capítulos com
 * legendas, botões interactivos e narração textual. Quando um MP4 real estiver
 * em /public/videos/onboarding.mp4, basta apontar `videoSrc` que o player passa
 * a usar o ficheiro real (mesma UI).
 */
const videoSrc: string | null = null;

const chapters = [
  {
    id: "01",
    title: "Bem-vindo a Conectamente",
    caption:
      "Um programa em 12 sessões para reaprenderes a tua relação com a internet — sem extremos, com ciência.",
    seconds: 12,
    accent: "from-accent/40 to-accent2/20",
  },
  {
    id: "02",
    title: "Cada sessão, três passos",
    caption:
      "Compreender · praticar · integrar. Cada episódio combina áudio, exercício e reflexão.",
    seconds: 12,
    accent: "from-accent2/30 to-accent/30",
  },
  {
    id: "03",
    title: "Tudo se guarda automaticamente",
    caption:
      "As tuas respostas, intenções e check-ins ficam guardados — só tu lhes acedes.",
    seconds: 12,
    accent: "from-accent/30 to-accent2/30",
  },
  {
    id: "04",
    title: "Vais ter um dashboard só teu",
    caption:
      "Intenção do dia, estado emocional, progresso. Simples, calmo, à mão.",
    seconds: 12,
    accent: "from-accent2/40 to-accent/20",
  },
  {
    id: "05",
    title: "E sempre que precisares, fichas e exercícios",
    caption:
      "Para imprimir, voltar, repetir. Não é um curso — é um manual pessoal.",
    seconds: 12,
    accent: "from-accent/40 to-accent2/40",
  },
  {
    id: "06",
    title: "Pronto para começar?",
    caption:
      "O episódio 1 dura 12 minutos. Sem pressão. Sem cartão.",
    seconds: 18,
    accent: "from-accent/50 to-accent2/30",
    final: true,
  },
];

export function OnboardingPlayer() {
  const [idx, setIdx] = useState(0);
  const [t, setT] = useState(chapters[0].seconds);
  const [running, setRunning] = useState(false);
  const [captions, setCaptions] = useState(true);
  const total = chapters.reduce((a, c) => a + c.seconds, 0);
  const elapsed = chapters.slice(0, idx).reduce((a, c) => a + c.seconds, 0) + (chapters[idx].seconds - t);

  useEffect(() => {
    if (!running) return;
    if (t <= 0) {
      if (idx < chapters.length - 1) { setIdx(idx + 1); setT(chapters[idx + 1].seconds); }
      else setRunning(false);
      return;
    }
    const id = setTimeout(() => setT((x) => x - 1), 1000);
    return () => clearTimeout(id);
  }, [t, running, idx]);

  const go = (delta: number) => {
    const ni = Math.max(0, Math.min(chapters.length - 1, idx + delta));
    setIdx(ni); setT(chapters[ni].seconds);
  };

  if (videoSrc) {
    return (
      <div className="card overflow-hidden p-0">
        <video src={videoSrc} controls className="w-full aspect-video" />
      </div>
    );
  }

  const ch = chapters[idx];
  return (
    <div className="card p-0 overflow-hidden">
      <div className={"relative aspect-video bg-gradient-to-br " + ch.accent}>
        <AnimatePresence mode="wait">
          <motion.div
            key={ch.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center p-8"
          >
            <span className="font-serif text-7xl md:text-9xl text-ink/15 tabular-nums">{ch.id}</span>
            <p className="heading-display text-2xl md:text-4xl max-w-xl mt-2">{ch.title}</p>
          </motion.div>
        </AnimatePresence>

        {/* breathing orb */}
        <span
          className="absolute bottom-6 right-6 h-12 w-12 rounded-full bg-bg/40 backdrop-blur-md ring-1 ring-bg/20 animate-breathe"
          aria-hidden
        />
      </div>

      {captions && (
        <div className="bg-ink text-bg px-6 py-4 text-center min-h-[64px] flex items-center justify-center">
          <p className="text-sm md:text-base max-w-2xl">{ch.caption}</p>
        </div>
      )}

      <div className="p-5 flex items-center gap-3">
        <button
          onClick={() => setRunning((r) => !r)}
          aria-label={running ? "Pausar" : "Reproduzir"}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-ink text-bg"
        >
          {running ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 translate-x-[1px]" />}
        </button>
        <button onClick={() => go(-1)} aria-label="Capítulo anterior" className="rounded-full hairline h-10 w-10 flex items-center justify-center hover:bg-ink/5">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button onClick={() => go(1)} aria-label="Capítulo seguinte" className="rounded-full hairline h-10 w-10 flex items-center justify-center hover:bg-ink/5">
          <ChevronRight className="h-4 w-4" />
        </button>

        <div className="flex-1 flex items-center gap-2">
          <span className="text-xs text-muted tabular-nums w-10 text-right">{fmt(elapsed)}</span>
          <div className="h-1 flex-1 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-[width] duration-1000 ease-linear"
              style={{ width: `${(elapsed / total) * 100}%` }}
            />
          </div>
          <span className="text-xs text-muted tabular-nums w-10">{fmt(total)}</span>
        </div>

        <button
          onClick={() => setCaptions((v) => !v)}
          aria-label="Alternar legendas"
          className={cn(
            "rounded-full h-10 w-10 flex items-center justify-center transition",
            captions ? "bg-ink text-bg" : "hairline hover:bg-ink/5"
          )}
        >
          <Subtitles className="h-4 w-4" />
        </button>
      </div>

      {/* chapter chips */}
      <div className="px-5 pb-5 flex gap-1.5 overflow-x-auto">
        {chapters.map((c, i) => (
          <button
            key={c.id}
            onClick={() => { setIdx(i); setT(c.seconds); }}
            className={cn(
              "shrink-0 px-3 py-1.5 rounded-full text-xs transition",
              i === idx ? "bg-ink text-bg" : "bg-ink/5 hover:bg-ink/10 text-muted"
            )}
          >
            {c.id} · {c.title.split(" ").slice(0, 3).join(" ")}…
          </button>
        ))}
      </div>

      {idx === chapters.length - 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border-t border-border p-6 flex flex-wrap gap-3 items-center justify-between"
        >
          <p className="text-sm text-muted">Pronto. Vamos começar?</p>
          <Link href="/programa/bem-vindo">
            <Button>
              Começar episódio 1 <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}

function fmt(s: number) {
  const m = Math.floor(s / 60); const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}
