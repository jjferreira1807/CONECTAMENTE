import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { episodes } from "@/content/episodes";
import { JourneyList } from "@/components/programa/JourneyList";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Programa de 12 sessões",
  description: "Mapa completo do programa Conectamente: 12 episódios baseados em TCC.",
};

export default function ProgramaPage() {
  return (
    <>
      <header className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(closest-side, rgb(var(--accent) / 0.18), transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <Container className="relative pt-16 md:pt-24 pb-12">
          <div className="max-w-2xl">
            <Badge>12 sessões · ~3h30 no total</Badge>
            <h1 className="heading-display text-4xl md:text-6xl lg:text-7xl mt-5">
              O caminho completo,<br />
              <span className="text-muted">à tua medida.</span>
            </h1>
            <p className="prose-soft mt-6 text-lg max-w-xl">
              Cada sessão combina um áudio curto, um exercício prático e um momento de
              reflexão. Não há ordem obrigatória, mas sugerimos seguir a sequência:
              cada uma constrói sobre a anterior.
            </p>
          </div>
        </Container>
      </header>

      <Container className="pb-24 md:pb-32">
        <JourneyList episodes={episodes} />
      </Container>
    </>
  );
}
