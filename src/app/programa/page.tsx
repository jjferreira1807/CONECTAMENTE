import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { episodes } from "@/content/episodes";
import { Badge } from "@/components/ui/Badge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Programa de 12 sessões",
  description: "Mapa completo do programa Conectamente: 12 episódios baseados em TCC.",
};

export default function ProgramaPage() {
  return (
    <Container className="py-12 md:py-20">
      <div className="max-w-2xl">
        <Badge>12 sessões · ~3h30 no total</Badge>
        <h1 className="heading-display text-4xl md:text-6xl mt-4">
          O caminho completo,<br />
          <span className="text-muted">à tua medida.</span>
        </h1>
        <p className="prose-soft mt-5 max-w-xl">
          Cada sessão combina um áudio curto, um exercício prático e um momento de
          reflexão. Não há ordem obrigatória, mas sugerimos seguir a sequência: cada
          uma constrói sobre a anterior.
        </p>
      </div>

      <ol className="mt-14 grid gap-4 md:grid-cols-2">
        {episodes.map((ep) => (
          <li key={ep.slug}>
            <Link
              href={`/programa/${ep.slug}`}
              className="block group card hover:shadow-glow transition-all duration-300"
            >
              <div className="flex items-start gap-5">
                <div
                  className={
                    "h-14 w-14 rounded-2xl bg-gradient-to-br " + ep.themeColor +
                    " ring-1 ring-border/60 flex items-center justify-center shrink-0"
                  }
                  aria-hidden
                >
                  <span className="font-serif text-xl tabular-nums">
                    {String(ep.number).padStart(2, "0")}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wider text-muted">{ep.kicker}</p>
                  <p className="font-serif text-xl mt-0.5 leading-snug">{ep.title}</p>
                  <p className="text-sm text-muted mt-1">{ep.subtitle}</p>
                  <p className="text-xs text-muted mt-3">{ep.durationMin} min</p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </Container>
  );
}
