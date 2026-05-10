import { Container } from "@/components/ui/Container";
import { OnboardingPlayer } from "@/components/intro/OnboardingPlayer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Introdução · 90 segundos",
  description: "Como funciona Conectamente — uma visita guiada de 90 segundos.",
};

export default function IntroPage() {
  return (
    <Container className="py-12 md:py-20">
      <div className="max-w-2xl">
        <p className="text-sm text-muted">90 segundos</p>
        <h1 className="heading-display text-4xl md:text-6xl mt-3">
          Como funciona, em pouco tempo.
        </h1>
        <p className="prose-soft mt-4 max-w-xl">
          Uma introdução visual à plataforma. Podes saltar capítulos ou voltar
          atrás a qualquer momento.
        </p>
      </div>
      <div className="mt-10">
        <OnboardingPlayer />
      </div>
    </Container>
  );
}
