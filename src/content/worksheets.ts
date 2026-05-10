/**
 * Fichas descarregáveis — geradas em HTML print-friendly. O utilizador imprime
 * para PDF directamente do browser (Cmd+P → guardar como PDF).
 */
export interface WorksheetField {
  id: string;
  label: string;
  hint?: string;
  rows?: number;
}

export interface Worksheet {
  slug: string;
  title: string;
  description: string;
  category: string;
  intro: string;
  fields: WorksheetField[];
  closing?: string;
}

export const worksheets: Worksheet[] = [
  {
    slug: "registo-pensamentos",
    title: "Registo de pensamentos (TCC)",
    category: "Pensamentos",
    description:
      "O exercício clássico de Beck adaptado a hábitos digitais. Imprime várias cópias.",
    intro:
      "Quando notares um impulso forte para pegar no telemóvel, ou um pensamento difícil, preenche este registo. Tenta o quanto antes — a memória do momento decai depressa.",
    fields: [
      { id: "data",        label: "Data e hora" },
      { id: "situacao",    label: "Situação", hint: "Onde, com quem, a fazer o quê?", rows: 2 },
      { id: "pensamento",  label: "Pensamento automático", rows: 2 },
      { id: "emocao",      label: "Emoção (e intensidade 0–100)" },
      { id: "evidencias_a",label: "Evidências a favor", rows: 2 },
      { id: "evidencias_c",label: "Evidências contra", rows: 2 },
      { id: "alternativa", label: "Pensamento alternativo equilibrado", rows: 3 },
      { id: "emocao_dep",  label: "Emoção depois (0–100)" },
    ],
  },
  {
    slug: "janelas-digitais",
    title: "Plano de janelas digitais",
    category: "Comportamento",
    description: "Define quando, onde e durante quanto tempo a internet recreativa entra no teu dia.",
    intro:
      "Sustentável vence ambicioso. Escolhe janelas curtas que conseguirias defender mesmo num dia mau.",
    fields: [
      { id: "manha",  label: "Manhã selvagem (sem ecrãs)", hint: "Das __ às __" },
      { id: "almoco", label: "Janela do meio-dia",          hint: "Início __, duração __" },
      { id: "noite",  label: "Janela da noite",             hint: "Início __, duração __" },
      { id: "cortina",label: "Cortina das 22h",             hint: "O telemóvel passa para…" },
      { id: "regras", label: "Regras durante janelas fechadas", rows: 3 },
      { id: "ajustes",label: "Ajustes ambientais que vou fazer hoje", rows: 3 },
    ],
  },
  {
    slug: "contrato-sono",
    title: "Contrato de sono",
    category: "Sono",
    description: "Compromisso pessoal por 7 dias seguidos.",
    intro:
      "Assina contigo próprio(a). Não com o(a) ideal — com o(a) real. Repete por 7 dias e depois revê.",
    fields: [
      { id: "deitar",   label: "Hora de deitar (±30 min)" },
      { id: "acordar",  label: "Hora de acordar consistente" },
      { id: "ecras",    label: "Cortar ecrãs a partir de…", hint: "ex.: 60 min antes de deitar" },
      { id: "quarto",   label: "O telemóvel à noite fica em…" },
      { id: "ritual",   label: "Ritual de transição (3 minutos)", rows: 2 },
      { id: "obstaculos", label: "Que obstáculos prevejo, e como respondo a cada um?", rows: 3 },
      { id: "data",     label: "Data de início e revisão" },
    ],
  },
  {
    slug: "mapa-valores",
    title: "Mapa dos meus valores",
    category: "Sentido",
    description: "Inspirado em ACT (Hayes) — alinhar acções digitais com o que importa.",
    intro:
      "Não há valores certos ou errados. Há os teus, agora, nesta fase da vida.",
    fields: [
      { id: "valor1", label: "Valor 1" },
      { id: "exemplo1", label: "Como esse valor se vive numa semana boa?", rows: 2 },
      { id: "valor2", label: "Valor 2" },
      { id: "exemplo2", label: "Como esse valor se vive numa semana boa?", rows: 2 },
      { id: "valor3", label: "Valor 3" },
      { id: "exemplo3", label: "Como esse valor se vive numa semana boa?", rows: 2 },
      { id: "conflito", label: "Onde é que o uso digital atual entra em conflito com estes valores?", rows: 3 },
      { id: "compromisso", label: "Um compromisso pequeno e concreto para esta semana", rows: 2 },
    ],
  },
  {
    slug: "revisao-semanal",
    title: "Revisão semanal · 10 minutos",
    category: "Manutenção",
    description: "Pratica todas as semanas. É o que sustenta a mudança.",
    intro:
      "Mesmo dia, mesma hora — domingo à noite costuma funcionar. Se faltares uma semana, voltas no domingo seguinte. Sem culpa.",
    fields: [
      { id: "semana",   label: "Semana de" },
      { id: "alinhado", label: "Que momento desta semana foi alinhado com o(s) meu(s) valor(es)?", rows: 3 },
      { id: "automatico",label: "Onde caí no piloto automático? (sem julgamento — só observação)", rows: 3 },
      { id: "trigger",  label: "Qual foi o gatilho mais frequente?" },
      { id: "ajuste",   label: "Que micro-ajuste vou tentar na próxima semana?", rows: 2 },
      { id: "reconhecimento", label: "Algo por que reconhecer-me?", rows: 2 },
    ],
    closing:
      "“Não preciso de ser perfeito(a). Só preciso de voltar — uma e outra vez.”",
  },
];

export const getWorksheet = (slug: string) => worksheets.find((w) => w.slug === slug);
