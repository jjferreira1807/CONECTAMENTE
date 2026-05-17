import { Container } from "@/components/ui/Container";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Termos de utilização" };

export default function TermosPage() {
  return (
    <Container className="py-12 md:py-20 max-w-3xl">
      <p className="text-sm text-muted">Termos</p>
      <h1 className="heading-display text-4xl md:text-5xl mt-3">Termos de utilização</h1>
      <div className="prose-soft mt-8 space-y-5">
        <p>
          Conectamente é uma plataforma psicoeducativa de bem-estar digital. O conteúdo
          aqui presente tem fins informativos e de autorregulação — não constitui
          aconselhamento profissional, avaliação clínica nem tratamento médico ou
          psicológico, e não substitui acompanhamento por um(a) profissional qualificado(a).
        </p>
        <p>
          Em caso de sofrimento psicológico significativo, procura um profissional
          qualificado. Em emergência, liga 112.
        </p>
        <p>
          O serviço é fornecido “tal como está”, sem garantias de resultado.
          Reservamo-nos o direito de actualizar conteúdo e funcionalidades.
        </p>
        <p>
          O uso da plataforma implica concordância com estes termos e com a
          <a className="underline ml-1" href="/privacidade">política de privacidade</a>.
        </p>
      </div>
    </Container>
  );
}
