import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Phone, MessageSquare, Heart } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apoio em crise",
  description: "Recursos de apoio imediato em Portugal.",
};

const linhas = [
  { name: "Emergência médica", phone: "112", note: "24 horas, em todo o país." },
  { name: "SNS24", phone: "808 24 24 24", note: "Aconselhamento clínico, 24h." },
  { name: "SOS Voz Amiga", phone: "213 544 545", note: "Apoio emocional, 16h–24h." },
  { name: "SOS Voz Amiga (telemóvel)", phone: "912 802 669", note: "16h–24h." },
  { name: "Telefone da Amizade", phone: "228 323 535", note: "16h–23h." },
  { name: "Linha SOS Estudante", phone: "239 484 020", note: "20h–01h em período lectivo." },
];

export default function SosPage() {
  return (
    <Container className="py-12 md:py-20 max-w-3xl">
      <Card className="bg-warn/8 border-warn/30">
        <p className="text-sm text-warn font-medium">Importante</p>
        <p className="prose-soft mt-2">
          Se estás a pensar em magoar-te ou em magoar alguém, pousa este ecrã
          e liga já <strong>112</strong> ou <strong>SNS24 (808 24 24 24)</strong>. Não tens de explicar tudo —
          basta dizer “estou em crise”.
        </p>
      </Card>

      <h1 className="heading-display text-4xl md:text-5xl mt-12">Apoio em crise — Portugal</h1>
      <p className="prose-soft mt-3">
        Linhas de apoio gratuitas, anónimas, com pessoas treinadas. Não estás sozinho(a).
      </p>

      <ul className="mt-10 grid gap-3 md:grid-cols-2">
        {linhas.map((l) => (
          <li key={l.name} className="card">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/12 text-accent">
                <Phone className="h-5 w-5" />
              </span>
              <div>
                <p className="font-medium">{l.name}</p>
                <a href={`tel:${l.phone.replace(/\s/g, "")}`} className="font-serif text-2xl mt-1 block hover:text-accent">
                  {l.phone}
                </a>
                <p className="text-sm text-muted mt-1">{l.note}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Card className="mt-10">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/12 text-accent">
            <Heart className="h-5 w-5" />
          </span>
          <div>
            <p className="font-medium">Procurar acompanhamento contínuo</p>
            <p className="prose-soft text-sm mt-1.5">
              A Ordem dos Psicólogos Portugueses tem um directório público de profissionais.
              Muitos centros de saúde do SNS oferecem consultas gratuitas (pede ao teu médico de família).
            </p>
          </div>
        </div>
      </Card>
    </Container>
  );
}
