"use client";
import { ReflectionInput } from "./ReflectionInput";
import { Card } from "@/components/ui/Card";
import { Mail } from "lucide-react";

/**
 * Carta a ti próprio — exercício de continuidade narrativa, ajuda a consolidar
 * mudanças após o programa.
 */
export function ExerciseFutureLetter({ episodeSlug, exerciseId }: { episodeSlug: string; exerciseId: string }) {
  return (
    <Card>
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent">
          <Mail className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm text-muted">Exercício</p>
          <h3 className="font-serif text-2xl">Carta ao teu eu daqui a 3 meses</h3>
        </div>
      </div>
      <p className="prose-soft mt-3 text-sm">
        Escreve para a pessoa que vais ser. Diz-lhe o que aprendeste aqui, o que ela
        deve recordar quando quiser desistir, e que vida queres que esteja a viver.
        Será este o teu farol nas semanas difíceis.
      </p>
      <div className="mt-5">
        <ReflectionInput
          episodeSlug={episodeSlug} promptId={exerciseId}
          prompt="Querido(a) eu (daqui a 3 meses)…"
          placeholder="Querido(a) eu, espero que ainda te lembres de…"
          rows={10}
        />
      </div>
    </Card>
  );
}
