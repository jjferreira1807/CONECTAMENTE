import { Container } from "@/components/ui/Container";
import { StatsClient } from "@/components/stats/StatsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Progresso",
  description: "O teu mapa emocional e estatísticas pessoais.",
};

export default function StatsPage() {
  return (
    <Container className="py-12 md:py-20">
      <div className="max-w-2xl">
        <p className="text-sm text-muted">Progresso</p>
        <h1 className="heading-display text-4xl md:text-6xl mt-3">
          O teu padrão, ao longo do tempo.
        </h1>
        <p className="prose-soft mt-4">
          Não para julgares — para reparares. Os dados ajudam a ver o que
          escapou à memória da semana.
        </p>
      </div>
      <div className="mt-12">
        <StatsClient />
      </div>
    </Container>
  );
}
