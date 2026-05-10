import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { worksheets } from "@/content/worksheets";
import { Badge } from "@/components/ui/Badge";
import { FileText, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fichas",
  description: "Fichas descarregáveis baseadas em TCC.",
};

export default function FichasPage() {
  return (
    <Container className="py-12 md:py-20">
      <div className="max-w-2xl">
        <Badge>Fichas · imprime ou guarda em PDF</Badge>
        <h1 className="heading-display text-4xl md:text-6xl mt-4">
          O teu kit, em <span className="text-accent">papel</span>.
        </h1>
        <p className="prose-soft mt-4">
          Cada ficha é preenchível no browser e optimizada para impressão. Cmd/Ctrl+P
          guarda em PDF. Encorajamos imprimir — escrever à mão consolida diferente.
        </p>
      </div>

      <ul className="mt-12 grid gap-4 md:grid-cols-2">
        {worksheets.map((w) => (
          <li key={w.slug}>
            <Link
              href={`/fichas/${w.slug}`}
              className="group block card hover:shadow-glow"
            >
              <div className="flex items-start gap-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/12 text-accent">
                  <FileText className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-wider text-muted">{w.category}</p>
                  <p className="font-serif text-xl mt-0.5">{w.title}</p>
                  <p className="prose-soft text-sm mt-2">{w.description}</p>
                  <p className="text-xs mt-4 inline-flex items-center gap-1 text-accent group-hover:translate-x-0.5 transition-transform">
                    Abrir ficha <ArrowRight className="h-3.5 w-3.5" />
                  </p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
