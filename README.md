# Conectamente

Plataforma digital de bem-estar psicológico baseada em Terapia Cognitivo-Comportamental, focada em uso excessivo da internet, ansiedade, sono e isolamento. PT-PT.

> **Tudo funciona sem servidor.** A app corre em modo local-only quando não há
> Supabase configurado — o progresso fica em `localStorage`. Quando configuras
> Supabase, ganhas auth, sincronização entre dispositivos, analytics privados
> e exportação GDPR.

## Stack

- **Frontend**: Next.js 14 (App Router) · TypeScript · Tailwind · Framer Motion · next-themes · Zustand · Recharts · lucide-react
- **Backend**: Supabase (Postgres + Auth + Storage) com RLS em todas as tabelas
- **Validação**: Zod schemas em todas as rotas write
- **Deploy**: Vercel (Edge middleware + Static + ISR)

## Como correr

```bash
cd ~/conectamente
cp .env.example .env.local       # opcional — em modo local-only ignora
npm install
npm run dev
```

Abre <http://localhost:3000>.

### Modo local-only

Sem `.env.local`:

- Sem auth, sem cross-device sync
- Tudo em `localStorage` (privado, nada sai do dispositivo)
- Dashboard, episódios, fichas, exercícios — tudo funciona

### Modo full-stack

Com Supabase configurado:

1. Cria projeto em <https://supabase.com>
2. Aplica migrations (`supabase db push` ou cola via SQL editor — ver `docs/DEPLOYMENT.md`)
3. Preenche `.env.local`
4. `npm run dev`
5. Cria conta em `/entrar` — o teu progresso passa a sincronizar

## Estrutura

```
src/
  app/
    page.tsx                 Landing
    programa/[slug]/         12 episódios
    fichas/[slug]/           5 fichas TCC
    dashboard/               Painel
    estatisticas/            Gráficos
    intro/                   Onboarding
    entrar/, sos/, sobre/, privacidade/, termos/
    auth/
      callback/route.ts      OAuth & magic-link callback
      reset-password/        Form de nova password
    api/
      auth/                  signout, recover, reset-password
      episodes/              GET (lista) + GET por slug
      progress/              GET, POST, GET/DELETE por slug
      reflections/           GET, POST
      exercises/             GET, POST
      mood/                  GET, POST
      intentions/            GET, POST, PATCH
      notifications/         GET, POST, PATCH
      analytics/             POST (batch)
      downloads/             POST
      me/                    GET, PATCH
      me/export/             GDPR export
      me/delete/             GDPR right-to-erasure
  components/
    marketing/, episode/, dashboard/, stats/,
    intro/, worksheets/, auth/, ui/
  content/
    episodes.ts              Currículo (12 sessões PT-PT, TCC)
    worksheets.ts            5 fichas
  lib/
    store.ts                 Zustand + persist (localStorage)
    cn.ts, motion.ts
    supabase/
      client.ts              browser client (typed)
      server.ts              server client (cookies)
      admin.ts               service-role client
      middleware.ts          per-request session refresh
      types.ts               Database types
    api/
      response.ts            ok/fail helpers
      validate.ts            zod helpers
      rateLimit.ts           token bucket
      session.ts             requireUser / maybeUser
      schemas.ts             zod schemas (shared)
      logger.ts              JSON-line logger
      client.ts              typed fetch wrapper
    sync/
      useRemoteSync.ts       initial pull
      pushers.ts             fire-and-forget writes
  middleware.ts              Edge middleware (auth + headers)

supabase/
  migrations/                9 SQL files, numbered, idempotent
  README.md

docs/
  API.md                     Reference completa
  SECURITY.md                Threat model + defesas
  DEPLOYMENT.md              Vercel + Supabase
```

## API

Ver `docs/API.md`. Todas as respostas seguem `{ ok: boolean, data | error }`.

Cliente tipado em `src/lib/api/client.ts`:

```ts
import { api } from "@/lib/api/client";
const progress = await api.get<Progress[]>("/api/progress");
await api.post("/api/mood", { mood: 4, energy: 3 });
```

## Segurança

Ver `docs/SECURITY.md`. Resumo:

- RLS em todas as tabelas com dados de utilizador
- Zod em todas as rotas write
- Token bucket rate limiter
- Security headers + CSP em `next.config.mjs`
- CSRF mitigado por cookies SameSite + same-origin
- Sem IPs nem user agents em analytics
- GDPR export & delete out-of-the-box

## O que falta adicionar (assets)

- `public/audio/01..12-*.mp3` — narrações em PT-PT
- `public/videos/onboarding.mp4` — vídeo onboarding
- `public/og.jpg` — Open Graph image (1200×630)

A plataforma já corre sem estes — fallbacks visuais em vigor.

## Scripts

```bash
npm run dev          # dev server
npm run build        # production build
npm run start        # serve production build
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
```

## Licença

A definir. Conteúdo psicoeducativo com referências em `Science.tsx` e `episodes.ts`.
