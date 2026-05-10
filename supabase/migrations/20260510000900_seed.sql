-- =====================================================================
-- Conectamente · 009 seed (12 episodes)
-- Idempotent: re-running updates row contents but doesn't duplicate.
-- =====================================================================

insert into public.episodes (slug, number, kicker, title, subtitle, description, duration_min, theme_color, position) values
  ('bem-vindo',                    1, 'Boas-vindas',                'Bem-vindo a Conectamente',                'Como vamos trabalhar juntos nas próximas semanas',                                  'Uma introdução honesta ao programa, ao método e ao teu papel.',                                                          12, 'from-accent/30 to-accent2/20', 1),
  ('uso-excessivo-pensamentos',    2, 'Uso excessivo · parte I',    'Os pensamentos que nos levam ao ecrã',    'Crenças automáticas e o ciclo cognitivo',                                          'Identificar os pensamentos que aparecem antes do gesto.',                                                                 18, 'from-accent/30 to-accent2/10', 2),
  ('uso-excessivo-comportamentos', 3, 'Uso excessivo · parte II',   'Comportamentos e técnicas de controlo',   'Romper o automatismo com pequenas fricções',                                       'Ferramentas práticas: regras ambientais, urge surfing, substituição comportamental.',                                     20, 'from-accent/30 to-accent2/15', 3),
  ('sono',                         4, 'Sono',                       'Higiene do sono e o impacto da internet', 'Por que o teu telemóvel é o ladrão silencioso de horas',                            'Como a luz azul e a estimulação cognitiva minam o sono.',                                                                 16, 'from-accent/40 to-accent2/10', 4),
  ('tcc-conversa',                 5, 'TCC',                        'Como funciona uma conversa terapêutica',   'Psicoeducação: pensamento, emoção, comportamento',                                  'O modelo cognitivo de Beck aplicado a hábitos digitais.',                                                                 22, 'from-accent/25 to-accent2/20', 5),
  ('dependencia-cerebro',          6, 'Dependência · parte I',      'O cérebro e o circuito da recompensa',     'Dopamina, novidade e por que tudo isto é tão difícil',                              'Neurociência acessível sobre como apps activam o circuito de recompensa.',                                                18, 'from-accent/35 to-accent2/15', 6),
  ('dependencia-tecnicas',         7, 'Dependência · parte II',     'Técnicas práticas de redução',             'Janelas digitais, jejum dopaminérgico realista, regras de uso',                     'Estratégias estruturadas que funcionam para a maioria dos adultos.',                                                       20, 'from-accent/30 to-accent2/20', 7),
  ('isolamento',                   8, 'Isolamento',                 'Reaprender a estar com pessoas',           'A diferença entre conexão online e contacto humano',                                'O paradoxo da hiperconexão e como começar pequeno.',                                                                       17, 'from-accent/25 to-accent2/25', 8),
  ('ansiedade',                    9, 'Ansiedade',                  'Quando a ansiedade pede ecrã',             'Meditação guiada e estratégias de regulação',                                       'A ansiedade pede distracção; o telemóvel oferece-a. Treinar uma resposta diferente.',                                     22, 'from-accent2/25 to-accent/30', 9),
  ('depressao',                   10, 'Depressão',                  'Quando o ecrã é refúgio do nada',          'Psicoeducação, ativação comportamental e quando procurar ajuda',                    'A relação bidireccional entre uso excessivo e sintomas depressivos.',                                                     19, 'from-accent/20 to-accent2/30', 10),
  ('conclusao',                   11, 'Conclusão',                  'O que levamos daqui',                      'Definir intenções para os próximos 90 dias',                                        'Consolidação. Ferramentas favoritas, cenários difíceis previsíveis, plano pessoal.',                                      15, 'from-accent/30 to-accent2/30', 11),
  ('trabalho-para-casa',          12, 'Trabalho para casa',         'Fichas, exercícios e plano pessoal',       'O teu kit para os próximos 90 dias',                                                'Compilação de fichas descarregáveis, exercícios para repetir e revisão semanal.',                                          10, 'from-accent2/30 to-accent/30', 12)
on conflict (slug) do update set
  number       = excluded.number,
  kicker       = excluded.kicker,
  title        = excluded.title,
  subtitle     = excluded.subtitle,
  description  = excluded.description,
  duration_min = excluded.duration_min,
  theme_color  = excluded.theme_color,
  position     = excluded.position,
  updated_at   = now();
