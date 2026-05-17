import type { Metadata } from "next";
import { AssessmentQuiz } from "@/components/assessment/AssessmentQuiz";

export const metadata: Metadata = {
  title: "Auto-reflexão",
  description:
    "Oito perguntas curtas para olhar com mais clareza a tua relação com o digital. Sem julgamento, sem diagnóstico — apenas um ponto de partida.",
};

export default function AutoReflexaoPage() {
  return <AssessmentQuiz />;
}
