/**
 * Conectamente — currículo completo (12 episódios).
 *
 * Conteúdo psicoeducativo em PT-PT com base em:
 *  - Terapia Cognitivo-Comportamental (Beck, Greenberger & Padesky)
 *  - DBT (Linehan) — surfar a vontade, tolerância ao desconforto
 *  - ACT (Hayes) — valores, defusão cognitiva
 *  - Higiene de sono (Walker, Espie)
 *  - Neurociência da recompensa (Volkow, Lembke "Dopamine Nation")
 *
 * IMPORTANTE: este conteúdo é psicoeducativo e não substitui acompanhamento
 * profissional. É um programa de autorregulação e bem-estar digital, não um
 * sistema de avaliação ou tratamento. Cada episódio é independente da
 * implementação visual — o renderer mapeia `kind` para o componente certo.
 */

export type SectionKind =
  | "text"
  | "audio"
  | "reflection"
  | "exercise:thoughtRecord"
  | "exercise:urgeSurfing"
  | "exercise:screenAudit"
  | "exercise:valuesLadder"
  | "exercise:sleepHygiene"
  | "exercise:socialChallenge"
  | "exercise:futureLetter"
  | "meditation"
  | "timer";

export interface Section {
  id: string;
  kind: SectionKind;
  title?: string;
  body?: string[];      // markdown-lite paragraphs
  prompt?: string;      // for reflection
  promptHint?: string;
  exerciseId?: string;
  audio?: { src?: string; title: string; subtitle?: string };
  timer?: { seconds: number; label?: string };
  checkpoint?: string;  // label for done button
}

export interface Episode {
  slug: string;
  number: number;
  title: string;
  kicker: string;        // e.g. "Boas-vindas"
  subtitle: string;
  description: string;
  durationMin: number;
  themeColor: string;    // tailwind class snippet, used for accent
  sections: Section[];
}

export const episodes: Episode[] = [
  /* ───────────────────────── 01 ───────────────────────── */
  {
    slug: "bem-vindo",
    number: 1,
    kicker: "Boas-vindas",
    title: "Bem-vindo a Conectamente",
    subtitle: "Como vamos trabalhar juntos nas próximas semanas",
    description:
      "Uma introdução honesta ao programa, ao método e ao teu papel — sem promessas mágicas, com um caminho claro.",
    durationMin: 12,
    themeColor: "from-accent/30 to-accent2/20",
    sections: [
      {
        id: "intro",
        kind: "text",
        title: "Antes de começarmos",
        body: [
          "Se chegaste aqui é provável que sintas que a tua relação com o telemóvel ou a internet deixou de te servir. Talvez o sono esteja pior. Talvez te sintas mais ansioso(a), mais distraído(a), mais sozinho(a) — apesar de estares “sempre conectado”.",
          "Não estás a falhar. Estás a viver num ambiente desenhado para captar atenção. O objectivo deste programa não é demonizar a tecnologia nem prometer-te uma desintoxicação rápida. É devolver-te <strong>poder de decisão</strong> sobre como, quando e porquê usas o que usas.",
          "Vamos trabalhar em 12 sessões curtas. Cada uma combina psicoeducação, um exercício prático e um momento de reflexão. Não tens de fazer tudo seguido — o ritmo é teu.",
        ],
      },
      {
        id: "como-usar",
        kind: "text",
        title: "Como usar a plataforma",
        body: [
          "Cada episódio tem um <strong>áudio</strong> que podes ouvir nos transportes ou a caminhar. Tens <strong>exercícios interactivos</strong> que se guardam automaticamente — não precisas de criar conta, mas se criares, levas o teu progresso para outro dispositivo.",
          "No painel principal vais ver a tua <strong>intenção do dia</strong>, um <strong>check-in emocional</strong> rápido, e o teu mapa de progresso. É deliberadamente simples: queremos um sítio onde voltes, não que te cause mais ansiedade.",
        ],
      },
      {
        id: "audio-bem-vindo",
        kind: "audio",
        audio: {
          title: "Bem-vindo a Conectamente",
          subtitle: "Episódio 1 · 8 min",
          // src: "/audio/01-bem-vindo.mp3"
        },
      },
      {
        id: "exercicio-mapa",
        kind: "exercise:screenAudit",
        exerciseId: "screen-audit-baseline",
      },
      {
        id: "reflexao",
        kind: "reflection",
        prompt: "Numa frase: o que te trouxe aqui hoje?",
        promptHint: "Não tem de ser uma resposta certa. Só precisa de ser tua.",
      },
      {
        id: "checkpoint",
        kind: "text",
        checkpoint: "Marcar episódio como ouvido",
      },
    ],
  },

  /* ───────────────────────── 02 ───────────────────────── */
  {
    slug: "uso-excessivo-pensamentos",
    number: 2,
    kicker: "Uso excessivo · parte I",
    title: "Os pensamentos que nos levam ao ecrã",
    subtitle: "Crenças automáticas e o ciclo cognitivo",
    description:
      "Identificar os pensamentos que aparecem antes do gesto. Aplicar o registo de pensamentos da TCC ao uso digital.",
    durationMin: 18,
    themeColor: "from-accent/30 to-accent2/10",
    sections: [
      {
        id: "intro",
        kind: "text",
        title: "Antes do gesto, há um pensamento",
        body: [
          "Pegas no telemóvel sem pensar? Quase nunca. Acontece <strong>tão depressa</strong> que parece automático, mas há sempre um micropensamento entre o gatilho e a acção — “só um segundo”, “tenho de ver”, “preciso de me distrair”.",
          "Aaron Beck, fundador da TCC, mostrou que estas crenças automáticas moldam emoção e comportamento. Não são certas nem erradas em si — são <strong>habituais</strong>. E o que é habitual pode ser examinado.",
          "Crenças comuns no uso excessivo:",
          "<ul class='list-disc pl-5 space-y-1 mt-2'><li><em>Catastrofização</em>: “Se não responder agora, vão pensar mal de mim.”</li><li><em>FOMO (medo de ficar de fora)</em>: “Vou perder algo importante.”</li><li><em>Pensamento dicotómico</em>: “Ou apago tudo, ou continuo igual.”</li><li><em>Permissão</em>: “Mereço esta distracção.”</li></ul>",
        ],
      },
      {
        id: "audio",
        kind: "audio",
        audio: { title: "O ciclo cognitivo do scroll", subtitle: "Episódio 2 · 12 min" },
      },
      {
        id: "exercicio",
        kind: "exercise:thoughtRecord",
        exerciseId: "thought-record-1",
      },
      {
        id: "reflexao",
        kind: "reflection",
        prompt: "Qual é o pensamento automático mais frequente que aparece quando pegas no telemóvel sem necessidade?",
        promptHint: "Tenta apanhá-lo em flagrante. Não o julgues. Apenas regista.",
      },
      { id: "checkpoint", kind: "text", checkpoint: "Concluir episódio" },
    ],
  },

  /* ───────────────────────── 03 ───────────────────────── */
  {
    slug: "uso-excessivo-comportamentos",
    number: 3,
    kicker: "Uso excessivo · parte II",
    title: "Comportamentos e técnicas de controlo",
    subtitle: "Romper o automatismo com pequenas fricções",
    description:
      "Ferramentas práticas: regras ambientais, técnica dos 90 segundos, urge surfing, substituição comportamental.",
    durationMin: 20,
    themeColor: "from-accent/30 to-accent2/15",
    sections: [
      {
        id: "intro",
        kind: "text",
        title: "Vontade não é compromisso",
        body: [
          "A força de vontade pura é o pior plano. É um músculo que cansa e cede ao fim do dia, exactamente quando o uso compulsivo aumenta. Em vez disso, vamos desenhar <strong>fricções</strong> no ambiente.",
          "Princípio simples: <em>o que está mais longe, é menos provável de acontecer</em>. Tirar redes sociais do ecrã inicial, deixar o telemóvel noutra divisão, usar tons de cinzento, definir limites de aplicação — cada fricção, pequena, soma-se.",
          "Quando a vontade aparecer e o ambiente já não te impede automaticamente, usamos uma técnica simples: <strong>surfar a vontade</strong>. Cada urgência tem um pico — e desce em cerca de 90 segundos se não a alimentares.",
        ],
      },
      {
        id: "audio",
        kind: "audio",
        audio: { title: "Pequenas fricções, grandes efeitos", subtitle: "Episódio 3 · 14 min" },
      },
      {
        id: "exercicio",
        kind: "exercise:urgeSurfing",
        exerciseId: "urge-surf-1",
      },
      {
        id: "reflexao",
        kind: "reflection",
        prompt: "Que duas fricções concretas vais introduzir esta semana?",
        promptHint: "Sê absurdamente específico. “Telemóvel na cozinha das 22h às 7h” > “usar menos”.",
      },
      { id: "checkpoint", kind: "text", checkpoint: "Concluir episódio" },
    ],
  },

  /* ───────────────────────── 04 ───────────────────────── */
  {
    slug: "sono",
    number: 4,
    kicker: "Sono",
    title: "Higiene do sono e o impacto da internet",
    subtitle: "Por que o teu telemóvel é o ladrão silencioso de horas",
    description:
      "Como a luz azul, a estimulação cognitiva e o cortisol nocturno minam o sono — e o que fazer.",
    durationMin: 16,
    themeColor: "from-accent/40 to-accent2/10",
    sections: [
      {
        id: "intro",
        kind: "text",
        title: "Não é só a luz",
        body: [
          "Falamos muito da luz azul, mas o problema do telemóvel à noite vai além disso. O cérebro <strong>activa-se cognitivamente</strong> com cada vídeo, cada mensagem, cada cabeçalho alarmante. O cortisol — hormona do alerta — sobe quando devia descer.",
          "Resultado: demoras mais a adormecer, o sono fica mais fragmentado, a fase REM (a mais reparadora emocionalmente) reduz-se. Acordas, mas “mal dormiste”. E é assim que dias seguidos se transformam em meses.",
          "A boa notícia: o sono é altamente <em>treinável</em>. Pequenos compromissos consistentes mudam-no em 2–3 semanas.",
        ],
      },
      {
        id: "audio",
        kind: "audio",
        audio: { title: "O telemóvel e o teu cérebro às 23h", subtitle: "Episódio 4 · 11 min" },
      },
      {
        id: "exercicio",
        kind: "exercise:sleepHygiene",
        exerciseId: "sleep-hygiene-week",
      },
      {
        id: "respiracao",
        kind: "timer",
        title: "3 minutos para descer o sistema",
        timer: { seconds: 180, label: "Antes de dormir" },
      },
      {
        id: "reflexao",
        kind: "reflection",
        prompt: "Como queres que sejam os teus últimos 30 minutos antes de dormir?",
        promptHint: "Descreve uma cena, não uma lista de regras.",
      },
      { id: "checkpoint", kind: "text", checkpoint: "Concluir episódio" },
    ],
  },

  /* ───────────────────────── 05 ───────────────────────── */
  {
    slug: "tcc-conversa",
    number: 5,
    kicker: "TCC",
    title: "Como funciona uma conversa terapêutica",
    subtitle: "Psicoeducação: pensamento, emoção, comportamento",
    description:
      "O modelo cognitivo de Beck e como o aplicamos a hábitos digitais — sem mistificações.",
    durationMin: 22,
    themeColor: "from-accent/25 to-accent2/20",
    sections: [
      {
        id: "intro",
        kind: "text",
        title: "Não é o que te acontece, é o que pensas sobre",
        body: [
          "O modelo central da TCC é simples e poderoso: entre o <strong>acontecimento</strong> (notificação) e a <strong>reacção</strong> (pegar no telemóvel) há uma <strong>interpretação</strong>. É lá que mora a margem de manobra.",
          "Numa conversa de TCC, o terapeuta não te diz “pensa positivo”. Faz contigo perguntas socráticas: <em>que evidências tens? que outra leitura é possível? se um amigo te dissesse isto, o que lhe responderias?</em>",
          "Vamos praticar isto agora — não como performance, mas como hábito mental.",
        ],
      },
      {
        id: "audio",
        kind: "audio",
        audio: { title: "TCC, sem mistério", subtitle: "Episódio 5 · 16 min" },
      },
      {
        id: "exercicio",
        kind: "exercise:thoughtRecord",
        exerciseId: "thought-record-2",
      },
      {
        id: "reflexao",
        kind: "reflection",
        prompt: "Que pensamento gostarias de aprender a desafiar com mais frequência?",
        promptHint: "Pode ser ligado ao telemóvel, ao trabalho, à família. Escolhe um.",
      },
      { id: "checkpoint", kind: "text", checkpoint: "Concluir episódio" },
    ],
  },

  /* ───────────────────────── 06 ───────────────────────── */
  {
    slug: "recompensa-cerebro",
    number: 6,
    kicker: "Recompensa · parte I",
    title: "O cérebro e o circuito da recompensa",
    subtitle: "Dopamina, novidade e por que tudo isto é tão difícil",
    description:
      "Neurociência acessível: como apps e redes activam o circuito da recompensa — e por que isso não é uma sentença.",
    durationMin: 18,
    themeColor: "from-accent/35 to-accent2/15",
    sections: [
      {
        id: "intro",
        kind: "text",
        title: "Dopamina não é “prazer”. É “querer mais”.",
        body: [
          "Confunde-se muitas vezes dopamina com prazer. Os trabalhos de Robinson e Berridge mostram que ela está antes do prazer — sinaliza <em>antecipação</em> e <em>busca</em>. É o que nos faz puxar a alavanca outra vez, mesmo quando o prémio já não é grande.",
          "As redes sociais e o conteúdo curto exploram isto magistralmente: cada deslize é um “talvez”. Recompensa <strong>variável</strong>, exactamente como uma slot machine. O cérebro adora — e cansa-se.",
          "Anna Lembke (em <em>Dopamine Nation</em>) descreve o padrão: a alta dopaminérgica repetida força um reequilíbrio — depois sentimos menos prazer em coisas normais (livro, conversa, caminhada). É reversível, mas requer um período de “reinício”.",
        ],
      },
      {
        id: "audio",
        kind: "audio",
        audio: { title: "O teu cérebro num feed", subtitle: "Episódio 6 · 13 min" },
      },
      {
        id: "reflexao-1",
        kind: "reflection",
        prompt: "Que prazeres simples deixaram de te dar prazer ultimamente?",
        promptHint: "Lê um livro, ver pôr-do-sol, ouvir um disco inteiro… Não é nostalgia — é informação.",
      },
      {
        id: "reflexao-2",
        kind: "reflection",
        prompt: "Em que momento do dia sentes maior atracção pelo telemóvel?",
      },
      { id: "checkpoint", kind: "text", checkpoint: "Concluir episódio" },
    ],
  },

  /* ───────────────────────── 07 ───────────────────────── */
  {
    slug: "recompensa-tecnicas",
    number: 7,
    kicker: "Recompensa · parte II",
    title: "Técnicas práticas de equilíbrio",
    subtitle: "Janelas digitais, pausas realistas e regras de uso",
    description:
      "Estratégias estruturadas para encontrar equilíbrio digital, sem proibições absurdas.",
    durationMin: 20,
    themeColor: "from-accent/30 to-accent2/20",
    sections: [
      {
        id: "intro",
        kind: "text",
        title: "Dieta, não jejum",
        body: [
          "Esquece a “limpeza total”. Para a maioria das pessoas é insustentável — e o uso costuma voltar com mais força depois. Pensa antes em <strong>janelas</strong>: períodos definidos onde a internet recreativa entra, e períodos onde não.",
          "Modelo simples e testado:",
          "<ul class='list-disc pl-5 space-y-1 mt-2'><li><strong>Manhã selvagem</strong> — primeiros 60 min sem ecrãs.</li><li><strong>Janela do meio-dia</strong> — 20 min para redes/recreativo, à hora de almoço.</li><li><strong>Janela da noite</strong> — 30 min antes do jantar.</li><li><strong>Cortina das 22h</strong> — telemóvel fora do quarto.</li></ul>",
          "A regra interna: enquanto não estiveres em janela, o telemóvel só serve funções <em>instrumentais</em> (mapas, mensagens essenciais, fotografar). Sem feeds, sem stories, sem buracos de YouTube.",
        ],
      },
      {
        id: "audio",
        kind: "audio",
        audio: { title: "Janelas em vez de jejums", subtitle: "Episódio 7 · 15 min" },
      },
      {
        id: "exercicio",
        kind: "exercise:valuesLadder",
        exerciseId: "values-1",
      },
      {
        id: "reflexao",
        kind: "reflection",
        prompt: "Que janelas vais experimentar nos próximos 7 dias?",
      },
      { id: "checkpoint", kind: "text", checkpoint: "Concluir episódio" },
    ],
  },

  /* ───────────────────────── 08 ───────────────────────── */
  {
    slug: "isolamento",
    number: 8,
    kicker: "Isolamento",
    title: "Reaprender a estar com pessoas",
    subtitle: "A diferença entre conexão online e contacto humano",
    description:
      "O paradoxo da hiperconexão: estar sempre online e sentir-se só. O que se sabe sobre conexão real — e como começar pequeno.",
    durationMin: 17,
    themeColor: "from-accent/25 to-accent2/25",
    sections: [
      {
        id: "intro",
        kind: "text",
        title: "Conexão ≠ contacto",
        body: [
          "Sherry Turkle (<em>Alone Together</em>) descreve uma geração que fala muito e está pouco. Trocamos centenas de mensagens, mas o cérebro social precisa de algo mais — voz, olhar, presença, silêncio partilhado. Esses sinais activam circuitos diferentes (oxitocina, sistema vagal).",
          "Isto não é nostalgia. Estudos longitudinais (Holt-Lunstad, 2015) mostram que o isolamento social é equivalente, em risco de mortalidade, a fumar 15 cigarros por dia. Nenhuma rede social compensa.",
          "A boa notícia: começar é absurdamente pequeno. Uma chamada de 5 minutos. Um café. Uma frase honesta a quem está em casa.",
        ],
      },
      {
        id: "audio",
        kind: "audio",
        audio: { title: "Contacto: o nutriente em falta", subtitle: "Episódio 8 · 12 min" },
      },
      {
        id: "exercicio",
        kind: "exercise:socialChallenge",
        exerciseId: "social-1",
      },
      {
        id: "reflexao",
        kind: "reflection",
        prompt: "De quem sentes falta — e há quanto tempo não dás notícias?",
      },
      { id: "checkpoint", kind: "text", checkpoint: "Concluir episódio" },
    ],
  },

  /* ───────────────────────── 09 ───────────────────────── */
  {
    slug: "ansiedade",
    number: 9,
    kicker: "Ansiedade",
    title: "Quando a ansiedade pede ecrã",
    subtitle: "Meditação guiada e estratégias de regulação",
    description:
      "A ansiedade pede distracção; o telemóvel oferece-a. Esta sessão treina uma resposta diferente, com base em mindfulness e regulação respiratória.",
    durationMin: 22,
    themeColor: "from-accent2/25 to-accent/30",
    sections: [
      {
        id: "intro",
        kind: "text",
        title: "A distracção como sedativo de baixa qualidade",
        body: [
          "Quando o corpo entra em activação ansiosa — coração mais rápido, pensamentos em loop, peito apertado — pegar no telemóvel adormece a sensação por uns minutos. Mas como qualquer sedativo barato, deixa-nos pior depois: mais cansados, mais fragmentados, mais ansiosos.",
          "A alternativa não é “aguentar”. É <strong>regular pelo corpo</strong>. A respiração lenta com expiração mais longa que a inspiração activa o sistema parassimpático e baixa, em segundos a minutos, a activação fisiológica. É treinável e gratuito.",
          "Vamos praticar agora.",
        ],
      },
      {
        id: "meditacao",
        kind: "meditation",
      },
      {
        id: "respiracao",
        kind: "timer",
        title: "Respiração 4-2-6 · 5 minutos",
        timer: { seconds: 300, label: "Inspira 4 · sustém 2 · expira 6" },
      },
      {
        id: "audio",
        kind: "audio",
        audio: { title: "Ansiedade e ecrãs", subtitle: "Episódio 9 · 12 min" },
      },
      {
        id: "reflexao",
        kind: "reflection",
        prompt: "Onde, no teu corpo, costuma aparecer a ansiedade?",
        promptHint: "Peito, garganta, estômago, ombros… nomear é o primeiro passo.",
      },
      { id: "checkpoint", kind: "text", checkpoint: "Concluir episódio" },
    ],
  },

  /* ───────────────────────── 10 ───────────────────────── */
  {
    slug: "depressao",
    number: 10,
    kicker: "Depressão",
    title: "Quando o ecrã é refúgio do nada",
    subtitle: "Psicoeducação, ativação comportamental e quando procurar ajuda",
    description:
      "A relação bidireccional entre uso excessivo e sintomas depressivos. Quando os exercícios chegam — e quando não.",
    durationMin: 19,
    themeColor: "from-accent/20 to-accent2/30",
    sections: [
      {
        id: "intro",
        kind: "text",
        title: "Não é preguiça",
        body: [
          "Um sintoma central da depressão é a <em>anhedonia</em> — a incapacidade de sentir prazer. Quando tudo parece igual, o ecrã torna-se o caminho de menor resistência: estimula o suficiente para preencher o silêncio, sem exigir energia.",
          "O problema é que isto cria um ciclo: menos acção real → menos reforço positivo natural → mais retraimento → mais ecrã → mais culpa.",
          "Em TCC, a saída chama-se <strong>ativação comportamental</strong>: agir <em>antes</em> de sentir vontade, em pequenas doses, escolhendo coisas que costumavam dar significado. Não esperar o ânimo. Ele vem depois.",
        ],
      },
      {
        id: "audio",
        kind: "audio",
        audio: { title: "Depressão e o telemóvel-refúgio", subtitle: "Episódio 10 · 14 min" },
      },
      {
        id: "reflexao-1",
        kind: "reflection",
        prompt: "Que actividade já te deu prazer e ficaste meses sem fazer?",
      },
      {
        id: "reflexao-2",
        kind: "reflection",
        prompt: "Qual seria a versão mais pequena dessa actividade que poderias fazer ainda esta semana?",
        promptHint: "Se era “correr 10km”, a versão pequena é “calçar os ténis e dar uma volta ao quarteirão”.",
      },
      {
        id: "aviso",
        kind: "text",
        title: "Quando este programa não chega",
        body: [
          "Se sentes tristeza profunda há mais de 2 semanas, perda de interesse generalizada, alterações marcadas de sono/apetite, ou pensamentos de te magoar — por favor, fala com um profissional. Este programa é um complemento, não um substituto.",
          "Em Portugal: SNS24 (808 24 24 24), SOS Voz Amiga (213 544 545 / 912 802 669), ou um(a) psicólogo(a) clínico(a).",
        ],
      },
      { id: "checkpoint", kind: "text", checkpoint: "Concluir episódio" },
    ],
  },

  /* ───────────────────────── 11 ───────────────────────── */
  {
    slug: "conclusao",
    number: 11,
    kicker: "Conclusão",
    title: "O que levamos daqui",
    subtitle: "Definir intenções para os próximos 90 dias",
    description:
      "Consolidação. Ferramentas favoritas, cenários difíceis previsíveis, plano pessoal.",
    durationMin: 15,
    themeColor: "from-accent/30 to-accent2/30",
    sections: [
      {
        id: "intro",
        kind: "text",
        title: "Não terminámos. Começámos.",
        body: [
          "Este último encontro não é um fim — é uma transição. Daqui em diante, o programa passa a ser <strong>teu</strong>: as fichas, os exercícios, os áudios continuam aqui sempre que precisares.",
          "Vamos consolidar três coisas: o que aprendeste, o que vais manter, e que cenário difícil já consegues prever.",
        ],
      },
      {
        id: "audio",
        kind: "audio",
        audio: { title: "Continuar sozinho(a) — bem acompanhado(a)", subtitle: "Episódio 11 · 10 min" },
      },
      {
        id: "carta",
        kind: "exercise:futureLetter",
        exerciseId: "future-letter",
      },
      {
        id: "reflexao-1",
        kind: "reflection",
        prompt: "Qual foi a maior surpresa para ti, ao longo destes episódios?",
      },
      {
        id: "reflexao-2",
        kind: "reflection",
        prompt: "Qual a regra ou ferramenta que vais manter, mesmo que tudo o resto falhe?",
      },
      { id: "checkpoint", kind: "text", checkpoint: "Concluir programa" },
    ],
  },

  /* ───────────────────────── 12 ───────────────────────── */
  {
    slug: "trabalho-para-casa",
    number: 12,
    kicker: "Trabalho para casa",
    title: "Fichas, exercícios e plano pessoal",
    subtitle: "O teu kit para os próximos 90 dias",
    description:
      "Compilação de fichas descarregáveis, exercícios para repetir e um plano de revisão semanal.",
    durationMin: 10,
    themeColor: "from-accent2/30 to-accent/30",
    sections: [
      {
        id: "intro",
        kind: "text",
        title: "Como manter isto vivo",
        body: [
          "Um programa muda hábitos durante semanas — não para sempre. O que sustenta a mudança é uma <strong>revisão semanal</strong> de 10 minutos, à mesma hora, no mesmo dia.",
          "Sugestão: domingo à noite, antes de dormir. Três perguntas:",
          "<ol class='list-decimal pl-5 space-y-1 mt-2'><li>Que momento desta semana foi alinhado com o(s) meu(s) valor(es)?</li><li>Onde caí no piloto automático?</li><li>Que micro-ajuste vou tentar na próxima semana?</li></ol>",
        ],
      },
      {
        id: "fichas",
        kind: "text",
        title: "Fichas disponíveis",
        body: [
          "Vai a <a href='/fichas' class='underline'>Fichas</a> para imprimir ou guardar em PDF: registo de pensamentos, plano de janelas digitais, contrato de sono, mapa de valores e revisão semanal.",
        ],
      },
      {
        id: "reflexao",
        kind: "reflection",
        prompt: "Quando vais fazer a tua revisão semanal? (dia + hora)",
        promptHint: "Específico vence ambicioso. “Domingo, 21h, na cama com chá.”",
      },
      { id: "checkpoint", kind: "text", checkpoint: "Concluir programa" },
    ],
  },
];

export const getEpisode = (slug: string) => episodes.find((e) => e.slug === slug);
