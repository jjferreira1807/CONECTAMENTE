import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre o método",
  description:
    "Em que se baseia o Conectamente: base científica, instrumento de auto-reflexão, detecção precoce e a fronteira clara com acompanhamento profissional.",
};

/**
 * Sobre — enquadramento científico e ético do produto.
 *
 * Estrutura, do mais geral ao mais específico:
 *   1. Resumo do propósito (manter o existente — tom já calibrado)
 *   2. Base científica (TCC/DBT/ACT, autores de referência)
 *   3. Detecção precoce e prevenção (porquê é útil ANTES de haver crise)
 *   4. O instrumento de auto-reflexão (pré/pós, limites, interpretação)
 *   5. O que somos / o que não somos (já existia — mantido)
 *   6. Em crise (atalho para /sos)
 */
export default function SobrePage() {
  return (
    <Container className="py-12 md:py-20 max-w-3xl">
      <p className="text-sm text-muted">Sobre</p>
      <h1 className="heading-display text-4xl md:text-6xl mt-3">
        Um programa, não uma promessa.
      </h1>

      <div className="prose-soft mt-8 space-y-5 text-base">
        <p>
          Conectamente nasce de uma observação simples: existem ferramentas
          excelentes para o que muitos de nós sentimos hoje — distracção crónica,
          sono prejudicado, ansiedade difusa, isolamento — mas costumam estar
          presas em livros académicos ou em consultas.
        </p>
        <p>
          O nosso objectivo é traduzir essas ferramentas para um formato que
          adultos ocupados consigam usar entre o trabalho e o jantar, sem rituais,
          sem subscrições predatórias, sem culpa.
        </p>

        <h2 className="heading-display text-2xl text-ink mt-12">Base científica</h2>
        <p>
          O conteúdo é construído a partir de três tradições de psicoterapia
          contemporânea, todas com forte evidência empírica:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Terapia Cognitivo-Comportamental (TCC)</strong> — Beck, Greenberger
            e Padesky. Origem das técnicas de identificação de pensamentos
            automáticos, reestruturação cognitiva e activação comportamental.
          </li>
          <li>
            <strong>Dialectical Behavior Therapy (DBT)</strong> — Linehan. Base do
            “surfar a vontade” (urge surfing) e da tolerância ao desconforto.
          </li>
          <li>
            <strong>Acceptance &amp; Commitment Therapy (ACT)</strong> — Hayes.
            Base do trabalho com valores e defusão cognitiva.
          </li>
          <li>
            <strong>Neurociência aplicada</strong> — Lembke (<em>Dopamine Nation</em>),
            Robinson &amp; Berridge — para enquadrar o circuito de recompensa
            e a economia da atenção.
          </li>
          <li>
            <strong>Higiene do sono</strong> — Walker (<em>Why We Sleep</em>),
            Espie — base da componente de sono.
          </li>
        </ul>

        <h2 className="heading-display text-2xl text-ink mt-12">
          Detecção precoce e prevenção
        </h2>
        <p>
          A maioria dos padrões de uso excessivo do digital instala-se
          silenciosamente, ao longo de meses. Quando o impacto se torna óbvio
          — sono partido, atenção fragmentada, isolamento — já há, em geral,
          hábitos profundamente automatizados.
        </p>
        <p>
          A psicoeducação e a auto-monitorização precoces têm um papel
          importante: <strong>nomear</strong> o que se está a passar reduz
          ambiguidade e desculpabilização, e <strong>medir</strong> ajuda a
          ver mudanças que de outra forma escapariam à memória da semana. Esta
          é a razão pela qual o programa começa com um questionário breve e
          encoraja repeti-lo mais à frente.
        </p>

        <h2 className="heading-display text-2xl text-ink mt-12">
          O instrumento de auto-reflexão
        </h2>
        <p>
          O questionário inicial — em <Link href="/auto-reflexao" className="underline hover:text-ink">/auto-reflexao</Link> —
          contém 8 itens inspirados em instrumentos validados de uso
          problemático da internet (e.g. Internet Addiction Test, Problematic
          Internet Use Questionnaire). Cada item é respondido numa escala
          Likert de 5 pontos.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Pontuação</strong> — número de áreas em que o utilizador
            reporta sentir um padrão frequente (resposta “frequentemente” ou
            “quase sempre”). Total entre 0 e 8.
          </li>
          <li>
            <strong>Bandas</strong> — Equilíbrio (0–1), Sinais de Fadiga (2–3),
            Uso Excessivo (4–5), Sobrecarga (6–8). São zonas de reflexão, não
            categorias diagnósticas.
          </li>
          <li>
            <strong>Pré e pós</strong> — a primeira toma fica como linha de base.
            Refazer o questionário depois de algumas semanas no programa permite
            uma comparação pré/pós com narrativa adaptada à magnitude da
            mudança. A comparação aparece em{" "}
            <Link href="/estatisticas" className="underline hover:text-ink">/estatisticas</Link>.
          </li>
          <li>
            <strong>Limites</strong> — é uma ferramenta de auto-reflexão, não
            um instrumento clínico nem um teste de diagnóstico. Pontuações
            elevadas não confirmam patologia; pontuações baixas não excluem
            sofrimento. Em ambos os casos, falar com um(a) profissional pode
            ajudar.
          </li>
        </ul>

        <h2 className="heading-display text-2xl text-ink mt-12">O que somos</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Um programa <strong>psicoeducativo</strong> de bem-estar digital, com estratégias inspiradas em TCC, DBT e ACT.</li>
          <li>Uma <strong>ferramenta de reflexão e autorregulação</strong> — não um sistema de avaliação ou tratamento.</li>
          <li>Conteúdo em <strong>português de Portugal</strong>, conciso e acessível.</li>
          <li>Uma plataforma com privacidade no centro — o teu progresso é teu, ficando no teu dispositivo (ou, se preferires, sincronizado com a tua conta).</li>
        </ul>

        <h2 className="heading-display text-2xl text-ink mt-12">O que não somos</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Não somos acompanhamento profissional.</strong> Se há
            sofrimento intenso, persistente, ou pensamentos de te magoar,
            procura um(a) profissional. A página{" "}
            <Link href="/ajuda" className="underline hover:text-ink">
              Como pedir ajuda
            </Link>{" "}
            explica como.
          </li>
          <li>Não fazemos avaliações clínicas nem prometemos curas.</li>
          <li>Não vendemos os teus dados — não temos cookies de tracking nem anúncios.</li>
        </ul>

        <h2 className="heading-display text-2xl text-ink mt-12">Em crise</h2>
        <p>
          Liga 112 (emergência), SNS24 (808 24 24 24), ou{" "}
          <a className="underline" href="https://www.sosvozamiga.org" target="_blank" rel="noopener noreferrer">
            SOS Voz Amiga
          </a>{" "}
          (213 544 545 / 912 802 669, todos os dias 16h–24h). Para apoio
          fora-de-crise, vê a página{" "}
          <Link href="/ajuda" className="underline hover:text-ink">
            Como pedir ajuda
          </Link>
          .
        </p>
      </div>
    </Container>
  );
}
