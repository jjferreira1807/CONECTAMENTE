"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";

/**
 * Meditação guiada por etapas (sem áudio): apresenta passos respiratórios e
 * de atenção, com avanço temporizado — útil enquanto não há áudio profissional.
 */
const passos = [
  { t: 30, txt: "Senta-te numa posição confortável. Repara no peso do teu corpo na cadeira." },
  { t: 30, txt: "Fecha os olhos ou foca um ponto fixo. Sem pressas." },
  { t: 60, txt: "Repara no ar a entrar pelo nariz. Não tens de o controlar — só observar." },
  { t: 60, txt: "Inspira em 4 tempos · sustém em 2 · expira em 6. Repete suavemente." },
  { t: 60, txt: "Se vier um pensamento, não o combatas. Nota-o, e volta à respiração." },
  { t: 60, txt: "Repara nos sons à tua volta sem os categorizar. Apenas presença." },
  { t: 30, txt: "Lentamente, traz a consciência ao teu corpo, aos pés, e abre os olhos." },
];

export function MeditationGuide() {
  const [idx, setIdx] = useState(0);
  const [running, setRunning] = useState(false);
  const [t, setT] = useState(passos[0].t);

  useEffect(() => {
    if (!running) return;
    if (t <= 0) {
      if (idx < passos.length - 1) { setIdx(idx + 1); setT(passos[idx + 1].t); }
      else setRunning(false);
      return;
    }
    const id = setTimeout(() => setT((x) => x - 1), 1000);
    return () => clearTimeout(id);
  }, [t, running, idx]);

  return (
    <Card>
      <p className="text-sm text-muted">Meditação guiada</p>
      <h3 className="font-serif text-2xl mt-1">5 minutos de presença</h3>
      <div className="mt-5 hairline rounded-2xl p-6 bg-bg/40 min-h-[160px]">
        <p className="text-lg leading-relaxed">{passos[idx].txt}</p>
        <p className="mt-3 text-sm text-muted tabular-nums">
          Passo {idx + 1} de {passos.length} · {t}s
        </p>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setRunning((r) => !r)}
          className="rounded-full bg-ink text-bg px-5 h-10 text-sm font-medium"
        >
          {running ? "Pausar" : idx === 0 && t === passos[0].t ? "Começar" : "Continuar"}
        </button>
        <button
          onClick={() => { setIdx(0); setT(passos[0].t); setRunning(false); }}
          className="rounded-full hairline px-5 h-10 text-sm hover:bg-ink/5"
        >
          Reiniciar
        </button>
      </div>
    </Card>
  );
}
