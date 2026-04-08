# Life Dashboard (Controle de Vida)

Aplicacao web moderna para gestao pessoal com foco em produtividade, financas, bem-estar e aprendizado continuo.

## Visao Geral

O projeto centraliza em um unico dashboard:

- Habitos com logica de ofensiva (streak)
- Metas em quadro Kanban
- Financas com suporte a credito parcelado
- Investimentos em formato de caixinhas
- Mood Tracker (registro diario de humor)
- Vault de links/read-it-later
- Relatorios semanais e mensais com correlacao entre modulos

Toda a aplicacao roda sem backend neste momento, usando persistencia local no navegador.

## Stack Tecnica

- `Next.js 16+` (App Router)
- `React + TypeScript`
- `Tailwind CSS`
- `Zustand` + `persist` middleware
- `Framer Motion`
- `Recharts`
- `Lucide React`
- `Sonner` (toasts)

## Principios de Arquitetura

### DRY (Don't Repeat Yourself)

Componentes reutilizaveis de UI foram centralizados em `src/components/ui`:

- `button`
- `input`
- `select`
- `card`
- `modal`
- `empty-state`

### ETC (Easy To Change)

A logica de dados e mutacoes fica nos stores e servicos, nao nos componentes de tela:

- Stores por feature em `src/features/*/store.ts`
- Calculos e analises em `src/services/analytics.ts`
- Componentes focados em renderizacao e interacao

## Estrutura de Pastas

```txt
src/
  app/
    layout.tsx
    page.tsx
    login/page.tsx
    register/page.tsx
    providers.tsx

  components/
    layout/
      app-shell.tsx
    ui/
      button.tsx
      card.tsx
      empty-state.tsx
      input.tsx
      modal.tsx
      select.tsx

  features/
    auth/
    dashboard/
    finance/
      components/
        filter-bar.tsx
        transaction-modal.tsx
    goals/
    habits/
    investments/
    mood/
    reports/
    vault/

  lib/
    utils.ts

  services/
    analytics.ts
```

## Modulos da Aplicacao

### 1) Dashboard

Resumo visual dos principais indicadores com graficos (Recharts).

### 2) Habitos

- CRUD de habitos
- Marcacao diaria
- Calculo de ofensiva (streak) via funcao utilitaria pura

### 3) Metas (Kanban)

- Colunas: `A Fazer`, `Em Andamento`, `Concluido`
- Cards com progresso e categoria
- Mudanca de status por acao rapida

### 4) Financas Inteligentes

- CRUD de transacoes
- Tipo: entrada/saida
- Pagamento: debito/credito
- Parcelamento em credito com geracao virtual de parcelas mensais
- Filtros por mes, ano e data especifica
- Saldo e impacto mensal calculados dinamicamente

### 5) Investimentos (Caixinhas)

- CRUD de caixinhas
- Valor atual e valor objetivo opcional
- Acoes rapidas por card: aportar e resgatar

### 6) Mood Tracker

- Check-in diario de humor (emoji + score + nota opcional)
- Persistencia por data com atualizacao do registro do dia

### 7) Vault (Read-it-later)

- Cadastro de links (livro, curso, artigo, video, outros)
- Status pendente/concluido
- Abertura direta do recurso por URL

### 8) Relatorios e Arquivo

- Resumo semanal e mensal
- Analise cruzada entre humor, habitos, financas e metas
- Insight de correlacao (ex.: humor em dias com habitos concluidos)
- Arquivamento de semanas e meses
- Historico persistido

## Estado Global e Persistencia

Cada modulo possui store dedicado usando Zustand + persist:

- `useAuth` (sessao)
- `useHabitsStore`
- `useGoalsStore`
- `useFinanceStore`
- `useInvestmentsStore`
- `useMoodStore`
- `useVaultStore`
- `useReportsStore`

Persistencia:

- Sessao: `sessionStorage` (token e usuario autenticado)
- Dados de negocio: `localStorage`

## Analytics (Cross-Store Logic)

O servico `src/services/analytics.ts` concentra a inteligencia de negocio:

- construcao de resumo semanal/mensal
- correlacao entre humor e conclusao de habitos
- consolidacao de gastos com parcelas de credito
- series para graficos comparativos (humor x gastos)

Isso permite evoluir os insights sem acoplamento com a UI.

## Autenticacao (Simulada)

- Registro e login com dados locais
- Token mockado em sessao
- Logout limpa dados de sessao
- Rotas de login/registro separadas no App Router

## Como Rodar o Projeto

### Requisitos

- Node.js 20+
- npm 10+

### Instalacao

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

### Qualidade e Build

```bash
npm run lint
npm run build
```

## Design System e UX

- Tema dark por padrao
- Layout responsivo (mobile-first)
- Modais para fluxos de criacao/edicao
- Toasts para feedback de sucesso/erro
- Empty states amigaveis
- Microinteracoes com Framer Motion

## Roadmap Sugerido

- Drag-and-drop no Kanban
- Automacao de virada semanal/mensal
- Exportacao de relatorios (PDF/CSV)
- Integração futura com backend/API

## Licenca

Projeto para fins de estudo/prototipo. Ajuste a licenca conforme necessidade do produto final.
