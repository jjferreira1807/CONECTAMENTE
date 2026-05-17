/**
 * Auto-reflexão · "Como está atualmente a tua relação com o digital?"
 *
 * 8 perguntas Likert (0 — quase nunca · 4 — quase sempre).
 * Pontuação total 0–32, mapeada para uma de quatro bandas — não
 * diagnósticas, apenas convites a reflexão. A linguagem segue o
 * posicionamento psicoeducativo: nunca patologizar, nunca rotular.
 */

export interface AssessmentQuestion {
  id: string;
  prompt: string;
  hint?: string;
}

export const LIKERT_OPTIONS = [
  { value: 0, label: "Quase nunca",    short: "Nunca" },
  { value: 1, label: "Raramente",      short: "Raro" },
  { value: 2, label: "Às vezes",       short: "Às vezes" },
  { value: 3, label: "Frequentemente", short: "Frequente" },
  { value: 4, label: "Quase sempre",   short: "Sempre" },
] as const;

// Os 8 itens são uma selecção adaptada de instrumentos validados de uso
// problemático da internet (IAT/PIUQ). A numeração original do instrumento
// fonte é preservada nos comentários para rastreabilidade; o `id` aqui é
// sequencial (q1–q8) para estabilidade posicional com snapshots já
// guardados (o array `answers` é indexado por posição).
export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    // Item 1 do instrumento fonte
    id: "q1",
    prompt:
      "Prefiro relacionar-me com outras pessoas através da internet do que comunicar cara a cara.",
  },
  {
    // Item 2
    id: "q2",
    prompt:
      "Já usei a internet para falar com outras pessoas quando me senti só.",
  },
  {
    // Item 4
    id: "q3",
    prompt:
      "Tenho dificuldade em controlar a quantidade de tempo que estou ligado(a) à internet.",
  },
  {
    // Item 7
    id: "q4",
    prompt:
      "Já usei a internet para me sentir melhor quando estava triste.",
  },
  {
    // Item 8
    id: "q5",
    prompt:
      "Sentir-me-ia perdido(a) se não pudesse ligar-me à internet.",
  },
  {
    // Item 9
    id: "q6",
    prompt:
      "Para mim, é difícil controlar o meu uso da internet.",
  },
  {
    // Item 10
    id: "q7",
    prompt:
      "Já deixei compromissos ou actividades sociais para estar na internet.",
  },
  {
    // Item 14
    id: "q8",
    prompt:
      "Quando não estou na internet, é difícil resistir ao impulso de me ligar.",
  },
];

export type BandId = "equilibrio" | "fadiga" | "excessivo" | "sobrecarga";

export interface AssessmentBand {
  id: BandId;
  range: [number, number]; // inclusive
  label: string;
  kicker: string;          // short tag, e.g. "Equilíbrio digital"
  summary: string;         // one-line headline for the result page
  interpretation: string[]; // 2-3 paragraphs of soft, psychoeducational framing
  suggestion: string;      // call-to-action sentence
}

/**
 * Scoring model — "áreas em alerta".
 *
 * Each question contributes 0 or 1 to the total, depending on whether the
 * answer is "frequentemente" (3) or "quase sempre" (4) on the Likert. The
 * Likert nuance is preserved in the raw answers array (and used for the
 * detail screens), but the score the user SEES is the count of areas where
 * a behaviour happens often — directly comparable to the number of
 * questions. Total runs from 0 to ASSESSMENT_MAX_SCORE (= question count).
 */
const ALERT_THRESHOLD = 3; // 3 = "Frequentemente", 4 = "Quase sempre"

export function computeScore(answers: number[]): number {
  return answers.reduce((acc, a) => acc + (a >= ALERT_THRESHOLD ? 1 : 0), 0);
}

export const ASSESSMENT_MAX_SCORE = ASSESSMENT_QUESTIONS.length; // 8

export const ASSESSMENT_BANDS: AssessmentBand[] = [
  {
    id: "equilibrio",
    range: [0, 1],
    label: "Equilíbrio digital",
    kicker: "Bem-estar digital",
    summary: "A tua relação com o digital parece estar num bom equilíbrio.",
    interpretation: [
      "Pelas tuas respostas, o digital não parece estar a dominar o teu dia. Mantens consciência das tuas escolhas e o telemóvel ocupa o seu lugar — sem invadir o sono, a atenção ou as pessoas.",
      "Isto não é coincidência: hábitos saudáveis precisam de ser mantidos, e pequenas calibrações ajudam a que continuem assim.",
    ],
    suggestion: "Se quiseres aprofundar, o programa pode reforçar o que já funciona para ti.",
  },
  {
    id: "fadiga",
    range: [2, 3],
    label: "Sinais de fadiga digital",
    kicker: "Cansaço acumulado",
    summary: "Há sinais de fadiga digital — pequena, mas notória.",
    interpretation: [
      "Algumas áreas indicam que o digital começa a pesar: atenção mais fragmentada, sono que se atrasa, momentos em que pegas no telemóvel sem decidir. Não é alarmante. É informação útil.",
      "É exactamente o tipo de padrão que beneficia de pequenas mudanças — janelas digitais, primeiros 60 minutos da manhã sem ecrãs, telemóvel fora do quarto à noite.",
    ],
    suggestion: "O programa guia-te por estas estratégias, episódio a episódio.",
  },
  {
    id: "excessivo",
    range: [4, 5],
    label: "Uso excessivo notório",
    kicker: "Pede atenção",
    summary: "O digital parece estar a ocupar mais espaço do que querias.",
    interpretation: [
      "As tuas respostas sugerem um padrão de uso que está a pesar em várias dimensões: sono, atenção, conexões reais, regulação emocional. É comum — e é reversível — mas precisa de prática deliberada, não só de força de vontade.",
      "Este programa foi pensado exactamente para esta zona: estratégias práticas, sem extremos, com espaço para reflexão a cada passo. A maioria das pessoas começa a sentir diferença nas primeiras duas semanas.",
    ],
    suggestion: "Recomendamos começar pelo episódio 1 — bases — e seguir a ordem nas duas primeiras semanas.",
  },
  {
    id: "sobrecarga",
    range: [6, 8],
    label: "Sobrecarga digital",
    kicker: "Vale a pena cuidar",
    summary: "O digital está a ocupar espaço de quase tudo.",
    interpretation: [
      "Pelas tuas respostas, o telemóvel e os ecrãs estão a competir com o sono, a atenção, a conexão com pessoas e a regulação emocional. Isto pode estar a deixar-te exausto(a) sem perceber porquê.",
      "O programa pode ajudar — começa pelos primeiros episódios e dá-te tempo. E se sentires sofrimento emocional intenso, isolamento profundo, ou pensamentos de te magoar, não esperes: o telefone do SNS24 (808 24 24 24) e a página de apoio existem para isso.",
    ],
    suggestion: "Começa devagar. Um episódio por dia, sem pressa, é o suficiente.",
  },
];

export function scoreToBand(score: number): AssessmentBand {
  const found = ASSESSMENT_BANDS.find((b) => score >= b.range[0] && score <= b.range[1]);
  // The ranges cover 0..ASSESSMENT_MAX_SCORE contiguously, so found is always defined.
  return found ?? ASSESSMENT_BANDS[ASSESSMENT_BANDS.length - 1];
}
