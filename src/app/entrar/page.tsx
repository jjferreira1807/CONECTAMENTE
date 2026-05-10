import { Container } from "@/components/ui/Container";
import { AuthForm } from "@/components/auth/AuthForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Entrar" };

export default function EntrarPage() {
  return (
    <Container className="py-16 md:py-24">
      <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div>
          <p className="text-sm text-muted">Bem-vindo de volta</p>
          <h1 className="heading-display text-4xl md:text-5xl mt-2">
            O teu progresso, sempre contigo.
          </h1>
          <p className="prose-soft mt-4 max-w-md">
            Faz login para sincronizar episódios, fichas e check-ins entre dispositivos.
            Não tens conta? Cria uma — leva menos de um minuto e podes usar a aplicação
            sem login se preferires.
          </p>
        </div>
        <AuthForm />
      </div>
    </Container>
  );
}
