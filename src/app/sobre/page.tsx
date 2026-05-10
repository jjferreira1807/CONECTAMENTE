import { Container } from "@/components/ui/Container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre o método",
  description: "Como Conectamente foi pensado, em que se baseia, o que não é.",
};

export default function SobrePage() {
  return (
    <Container className="py-12 md:py-20 max-w-3xl">
      <p className="text-sm text-muted">Sobre</p>
      <h1 className="heading-display text-4xl md:text-6xl mt-3">
        Um programa, não uma promessa.
      </h1>
      <div className="prose-soft mt-8 space-y-5 text-base">
        <p>
          Conectamente nasce de uma observação simples: a literatura de Terapia
          Cognitivo-Comportamental tem ferramentas excelentes para o que muitos
          de nós sentimos hoje — distracção crónica, sono prejudicado, ansiedade
          difusa, isolamento — mas essas ferramentas estão presas em livros
          académicos ou em consultórios.
        </p>
        <p>
          O nosso objectivo é traduzi-las para um formato que adultos ocupados
          consigam usar entre o trabalho e o jantar, sem rituais, sem subscrições
          predatórias, sem culpa.
        </p>
        <h2 className="heading-display text-2xl text-ink mt-10">O que somos</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Um programa <strong>psicoeducativo</strong> baseado em TCC, DBT, ACT.</li>
          <li>Conteúdo em <strong>português de Portugal</strong>, conciso e acessível.</li>
          <li>Uma plataforma com privacidade no centro — o teu progresso é teu.</li>
        </ul>
        <h2 className="heading-display text-2xl text-ink mt-10">O que não somos</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Não somos terapia clínica.</strong> Se há sofrimento intenso, persistente, ou pensamentos de te magoar, procura um(a) profissional.</li>
          <li>Não fazemos diagnósticos nem prometemos curas.</li>
          <li>Não vendemos os teus dados — não temos cookies de tracking nem anúncios.</li>
        </ul>
        <h2 className="heading-display text-2xl text-ink mt-10">Em crise</h2>
        <p>
          Liga 112 (emergência), SNS24 (808 24 24 24), ou{" "}
          <a className="underline" href="https://www.sosvozamiga.org" target="_blank" rel="noopener noreferrer">
            SOS Voz Amiga
          </a>{" "}
          (213 544 545 / 912 802 669, todos os dias 16h–24h).
        </p>
      </div>
    </Container>
  );
}
