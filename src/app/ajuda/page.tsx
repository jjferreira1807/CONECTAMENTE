import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import {
  Compass, ShieldCheck, HeartHandshake, Phone, BookOpen,
  ArrowRight, Building2, GraduationCap, AlertCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Como pedir ajuda",
  description:
    "Sinais de alerta, quando procurar apoio, como pedir encaminhamento pelo SNS e recursos de apoio psicológico em Portugal.",
};

/**
 * Página de pedido de ajuda — pensada para fora-de-crise (não emergência).
 * Para emergência imediata, há um link prominente para /sos no topo. Tom:
 * acolhedor, prático, sem julgamento; foco em sinais, recursos concretos e
 * caminhos no SNS. Sem alarmismo, sem termos clínicos pesados.
 */
export default function AjudaPage() {
  return (
    <Container className="py-12 md:py-20 max-w-3xl">
      {/* Não-emergência → atalho discreto para SOS em cima */}
      <p className="text-sm text-muted">Apoio</p>
      <h1 className="heading-display text-4xl md:text-6xl mt-3">
        Como pedir ajuda
      </h1>
      <p className="prose-soft mt-5 text-lg max-w-xl">
        Pedir ajuda é um gesto de cuidado contigo. Esta página explica quando
        faz sentido falar com alguém, como pedir apoio através do SNS e onde
        encontrar serviços especializados em Portugal.
      </p>

      <Card className="mt-8 bg-warn/8 border-warn/30 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-warn shrink-0 mt-0.5" />
        <p className="prose-soft text-sm">
          Se estás em <strong>crise</strong> ou tens pensamentos de te magoar,
          vai à página de apoio em crise:{" "}
          <Link href="/sos" className="underline hover:text-ink">
            Linhas de apoio imediato
          </Link>
          . Em emergência, liga <strong>112</strong>.
        </p>
      </Card>

      {/* SINAIS DE ALERTA */}
      <Section icon={<Compass className="h-3 w-3" />} kicker="Sinais de alerta">
        <h2 className="heading-display text-2xl md:text-3xl">
          Quando o digital começa a pesar
        </h2>
        <p className="prose-soft mt-4">
          Não há um número mágico de horas. O que importa é o impacto. Vale a
          pena olhar com mais atenção se reparas em vários destes sinais ao
          mesmo tempo, durante semanas:
        </p>
        <ul className="prose-soft mt-4 space-y-2 list-disc pl-5">
          <li>O sono encolheu — adormeces tarde com ecrãs, acordas cansado(a).</li>
          <li>A atenção fragmentou-se — custa-te ler, ouvir alguém ou fazer uma só coisa.</li>
          <li>Pegas no telemóvel sem decidir, dezenas de vezes ao dia.</li>
          <li>Sentes inquietação quando ele está fora do alcance.</li>
          <li>Trocas tempo com pessoas reais por tempo de ecrã.</li>
          <li>O desconforto emocional é frequentemente acalmado com scroll.</li>
          <li>Há trabalho, estudos ou relações a serem afectados.</li>
          <li>Tentaste mudar e não conseguiste manter por mais de alguns dias.</li>
        </ul>
        <p className="prose-soft mt-5 text-sm">
          Reconheceres-te em vários destes pontos não é um diagnóstico — é
          informação útil. O passo seguinte costuma ser falar com alguém.
        </p>
      </Section>

      {/* QUANDO PROCURAR APOIO */}
      <Section icon={<HeartHandshake className="h-3 w-3" />} kicker="Quando faz sentido">
        <h2 className="heading-display text-2xl md:text-3xl">
          Quando procurar apoio profissional
        </h2>
        <p className="prose-soft mt-4">
          O acompanhamento profissional é especialmente útil quando:
        </p>
        <ul className="prose-soft mt-4 space-y-2 list-disc pl-5">
          <li>Tentaste mudar por conta própria e o padrão volta sempre.</li>
          <li>Há sofrimento intenso, ansiedade ou tristeza persistente.</li>
          <li>O uso digital está a interferir com o sono, trabalho ou relações.</li>
          <li>Sentes que precisas de mais estrutura do que aquilo que tens.</li>
          <li>Há outras dificuldades a coexistirem — luto, mudanças, isolamento.</li>
        </ul>
        <p className="prose-soft mt-5">
          Procurar ajuda não significa que algo está “muito mal”. Significa que
          mereces tempo e espaço para pensar com alguém treinado para isso.
        </p>
      </Section>

      {/* ENCAMINHAMENTO SNS */}
      <Section icon={<ShieldCheck className="h-3 w-3" />} kicker="Serviço Nacional de Saúde">
        <h2 className="heading-display text-2xl md:text-3xl">
          Como pedir encaminhamento ao médico de família
        </h2>
        <p className="prose-soft mt-4">
          O SNS oferece apoio psicológico através dos centros de saúde. O
          processo costuma ser este:
        </p>

        <ol className="mt-5 space-y-4">
          {[
            {
              t: "Marcar consulta no teu centro de saúde",
              b: "Pelo SNS24, pela app MySNS ou directamente no balcão. Pede consulta com o(a) médico(a) de família.",
            },
            {
              t: "Descrever o que tens sentido",
              b: "Não precisas de termos técnicos. Conta há quanto tempo, como afecta o sono, atenção, humor e relações. Dizer “já tentei mudar e não consigo” é informação útil.",
            },
            {
              t: "Pedir encaminhamento para psicologia / saúde mental",
              b: "O(a) médico(a) pode referenciar-te para o(a) psicólogo(a) clínico(a) do agrupamento de centros de saúde (ACES) ou para uma equipa de saúde mental comunitária.",
            },
            {
              t: "Receber resposta e marcar consulta",
              b: "Tempos de espera variam por região. Se o caso for urgente, refere isso explicitamente. Em paralelo podes continuar com este programa.",
            },
          ].map((s, i) => (
            <li key={i} className="flex gap-4">
              <span className="shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent/15 text-accent text-sm font-medium tabular-nums">
                {i + 1}
              </span>
              <div>
                <p className="font-medium text-ink">{s.t}</p>
                <p className="prose-soft text-sm mt-1">{s.b}</p>
              </div>
            </li>
          ))}
        </ol>

        <Card className="mt-8 flex items-start gap-3">
          <Phone className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">SNS 24 — 808 24 24 24</p>
            <p className="prose-soft text-sm mt-1">
              Aconselhamento de saúde 24 horas. Ajudam-te a perceber o que fazer
              e podem encaminhar-te. Também disponível em{" "}
              <a
                href="https://www.sns24.gov.pt/pt/inicio"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-ink"
              >
                sns24.gov.pt
              </a>
              .
            </p>
          </div>
        </Card>
      </Section>

      {/* CUIDAR-TE */}
      <Section icon={<GraduationCap className="h-3 w-3" />} kicker="Centro especializado">
        <h2 className="heading-display text-2xl md:text-3xl">
          Cuidar-te — Centro de Intervenção Psicológica
        </h2>
        <p className="prose-soft mt-4">
          O Cuidar-te é o centro de intervenção psicológica da Faculdade de
          Filosofia e Ciências Sociais da Universidade Católica Portuguesa (Braga).
          Oferece consultas com psicólogos(as) e psicólogos(as) em estágio,
          supervisionados por profissionais experientes.
        </p>
        <ul className="prose-soft mt-4 space-y-2 list-disc pl-5">
          <li>Apoio individual a crianças, adolescentes, adultos e famílias.</li>
          <li>Avaliação e intervenção em ansiedade, humor, sono, hábitos digitais e outros.</li>
          <li>Valores acessíveis, com escala social.</li>
          <li>Útil em particular para estudantes e jovens adultos.</li>
        </ul>
        <a
          href="https://ffcs.braga.ucp.pt/pt-pt/catolica/servicos/cuidarte-centro-de-intervencao-psicologica"
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-6 inline-flex items-center gap-2 rounded-full bg-ink text-bg px-5 h-11 text-sm font-medium hover:bg-ink/90 transition-colors"
        >
          Conhecer o Cuidar-te
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </a>
      </Section>

      {/* OUTROS RECURSOS */}
      <Section icon={<Building2 className="h-3 w-3" />} kicker="Outras vias">
        <h2 className="heading-display text-2xl md:text-3xl">
          Outras vias de apoio em Portugal
        </h2>
        <ul className="prose-soft mt-4 space-y-3 list-disc pl-5">
          <li>
            <strong>Ordem dos Psicólogos Portugueses</strong> — directório
            público de profissionais por região e especialidade:{" "}
            <a
              href="https://www.ordemdospsicologos.pt"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-ink"
            >
              ordemdospsicologos.pt
            </a>
            .
          </li>
          <li>
            <strong>Linha de apoio psicológico do SNS24</strong> — pelo número{" "}
            <strong>808 24 24 24</strong>, opção “Saúde Mental”. Gratuita, 24/7.
          </li>
          <li>
            <strong>Serviços académicos</strong> — quase todas as universidades
            portuguesas têm gabinetes de apoio psicológico para estudantes. Vale
            sempre a pena pedir.
          </li>
          <li>
            <strong>Seguros de saúde / ADSE / IASFA</strong> — comparticipam
            consultas de psicologia. Vale verificar antes de pagar particular.
          </li>
        </ul>
      </Section>

      {/* DISCLAIMER FINAL */}
      <Section icon={<BookOpen className="h-3 w-3" />} kicker="O que esta plataforma é">
        <h2 className="heading-display text-2xl md:text-3xl">
          Conectamente é psicoeducação
        </h2>
        <p className="prose-soft mt-4">
          O Conectamente é uma ferramenta digital de bem-estar, com conteúdos
          psicoeducativos e estratégias de autorregulação inspiradas em TCC,
          DBT e ACT. <strong>Não é, nem substitui, acompanhamento médico ou
          psicológico</strong>. Quando há sofrimento real, o caminho é
          procurar alguém treinado.
        </p>
        <p className="prose-soft mt-3 text-sm">
          Esta plataforma pode complementar esse acompanhamento — não o
          substituir.
        </p>
      </Section>
    </Container>
  );
}

/* ------------------------------------------------------------------ */

function Section({
  icon, kicker, children,
}: {
  icon: React.ReactNode;
  kicker: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal as="section" className="mt-14">
      <p className="text-xs uppercase tracking-[0.25em] text-accent inline-flex items-center gap-1.5">
        {icon}
        {kicker}
      </p>
      <div className="mt-3">{children}</div>
    </Reveal>
  );
}
