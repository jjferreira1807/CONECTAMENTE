import { Container } from "@/components/ui/Container";
import { StatsClient } from "@/components/stats/StatsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Progresso",
  description: "O teu mapa emocional e estatísticas pessoais.",
};

export default function StatsPage() {
  return (
    <>
      <header className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute -top-32 left-1/3 w-[700px] h-[700px] rounded-full pointer-events-none dark:hidden"
          style={{
            background:
              "radial-gradient(closest-side, rgb(var(--accent-2) / 0.18), transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <Container className="relative pt-16 md:pt-24 pb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-accent">Progresso</p>
          <h1 className="heading-display text-4xl md:text-6xl lg:text-7xl mt-5">
            O teu padrão,<br /><span className="text-muted">ao longo do tempo.</span>
          </h1>
          <p className="prose-soft mt-6 text-lg max-w-xl">
            Não para julgares — para reparares. Os dados ajudam a ver o que escapou
            à memória da semana.
          </p>
        </Container>
      </header>
      <Container className="pb-24 md:pb-32">
        <StatsClient />
      </Container>
    </>
  );
}
