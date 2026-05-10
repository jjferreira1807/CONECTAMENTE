"use client";
import { useProgress } from "@/lib/store";
import { remote } from "@/lib/sync/pushers";
import { Button } from "@/components/ui/Button";
import { Sparkles, Check } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function CompleteEpisodeButton({ slug }: { slug: string }) {
  const completedAt = useProgress((s) => s.episodes[slug]?.completedAt);
  const complete = useProgress((s) => s.completeEpisode);

  if (completedAt) {
    return (
      <Card className="bg-success/10 border-success/20">
        <div className="flex items-start gap-4">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-success/20 text-success">
            <Check className="h-5 w-5" />
          </span>
          <div>
            <p className="font-serif text-xl">Episódio concluído</p>
            <p className="prose-soft text-sm mt-1">
              Bem feito. Voltar a este episódio mais tarde é encorajado — as ideias só se
              consolidam com repetição.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="flex justify-center">
      <Button
        onClick={() => {
          complete(slug);
          const completedAt = new Date().toISOString();
          remote.progress({ episodeSlug: slug, completedAt });
          remote.analytics({ kind: "episode_complete", episodeSlug: slug });
        }}
        size="lg"
      >
        <Sparkles className="h-4 w-4" /> Marcar episódio como concluído
      </Button>
    </div>
  );
}
