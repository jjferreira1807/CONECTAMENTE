import { Container } from "@/components/ui/Container";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Definir nova palavra-passe" };

export default function ResetPasswordPage() {
  return (
    <Container className="py-16 md:py-24">
      <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div>
          <p className="text-sm text-muted">Recuperação</p>
          <h1 className="heading-display text-4xl md:text-5xl mt-2">Define uma nova palavra-passe.</h1>
          <p className="prose-soft mt-4 max-w-md">
            Estás autenticado(a) temporariamente. Escolhe uma nova palavra-passe
            (mínimo 8 caracteres) e continuas para o dashboard.
          </p>
        </div>
        <ResetPasswordForm />
      </div>
    </Container>
  );
}
