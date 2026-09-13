# 📘 Documentação de Arquitetura & Especificação Técnica — TASS Kanban

## 1. Visão Geral do Sistema

O **TASS Kanban** é uma Single Page Application (SPA) construída em **React 19** e **TypeScript**, projetada para a simulação determinística e heurística de um ciclo de desenvolvimento ágil orientado aos papéis do **Scrum Guide** e aos princípios de fluxo do **Kanban**.

---

## 2. Diagrama de Fluxo e Componentes

```text
┌────────────────────────────────────────────────────────────────────────┐
│                                App.tsx                                 │
│                   (Orquestrador Central de Estado)                     │
└─────┬──────────────────┬───────────────────┬─────────────────────┬─────┘
      │                  │                   │                     │
┌─────▼──────────┐ ┌─────▼───────────┐ ┌─────▼─────────────┐ ┌─────▼─────────────┐
│  Kanban Board  │ │ Teams/Slack Chat│ │ Gamification SM   │ │ Heuristic Engine  │
│  6 Colunas     │ │ 4 Canais        │ │ Progressão de XP  │ │ Gemini Brain      │
│  Drag and Drop │ │ Bloqueio Real   │ │ 6 Níveis / Badges │ │ Memória Auditável │
└────────────────┘ └─────────────────┘ └───────────────────┘ └───────────────────┘
```

---

## 3. Módulos Principais

### 3.1. Motor de Simulação (`src/simulation/`)
- **`GeminiBrain.ts`**:
  - Implementa lógica heurística determinística para decisões autônomas dos 4 papéis (`PO`, `Dev`, `Tech Lead`, `QA`);
  - Suporta integração direta com a API Google Gemini através de chaves configuráveis;
  - Gera relatórios diários de Daily Scrum e dilemas contextuais para o Scrum Master.
- **`SimulationMemory.ts`**:
  - Garante integridade temporal e auditabilidade;
  - Registra cada transição de status, criação de bugs e resolução de dilemas;
  - Permite exportar a trilha de auditoria completa em formato `.json`.
- **`realtimeClock.ts`**:
  - Controla o ciclo de simulação tanto no **Modo 1 (Acelerado)** quanto no **Modo 2 (Tempo Real)** com disparo da Daily às 18:00.

### 3.2. Mecânica de Decisão e Regressão (`src/types/chat.ts` & `src/data/teamChatPresets.ts`)
- O sistema conta com uma trava de execução (`hasPendingDecision`): quando surge um dilema, os agentes entram no estado `Blocked` e a simulação pausa;
- O Scrum Master escolhe entre 3 abordagens pedagógicas:
  1. **Liderança Servidora** (+35 a +50 XP);
  2. **Trade-off Pragmático** (+15 a +25 XP);
  3. **Anti-Padrão** (-15 a -30 XP).
- **Regressões de Fluxo**:
  - Em **Code Review**: Se um PR for reprovado por falta de testes, o card regride para *Em Desenvolvimento* com tag `🔄 [PR REPROVADO]`.
  - Em **QA**: Se um bug crítico de segurança for encontrado, o card regride para *Em Desenvolvimento* com tag `🔴 [RETORNO QA - BUG SEGURANÇA]`.

### 3.3. Sistema de Vocabulário & React Portal (`src/utils/parseWithGlossary.tsx`)
- O glossário analisa strings de texto dinamicamente;
- Utiliza lookbehind e lookahead com expressões regulares Unicode (`(?<![\p{L}\p{N}])` e `(?![\p{L}\p{N}])`) para garantir fronteiras estritas de palavras;
- Siglas de até 3 letras (como **PR**, **QA**, **PO**, **JWT**, **API**, **DoD**) só são destacadas quando escritas em maiúsculas, evitando falsos positivos com palavras normais em português;
- O popover flutuante é renderizado via `createPortal(..., document.body)` com coordenadas calculadas via `getBoundingClientRect()`, evitando cortes por contêineres pai com `overflow: hidden`.

### 3.4. Sistema de Temas (`src/data/themePresets.ts`)
- 5 Paletas de cores corporativas completas:
  1. **Atlassian Blue (Trello)**
  2. **Jira Software Clean**
  3. **Linear Dark Minimalist**
  4. **Nordic Slate & Ice**
  5. **Midnight Pro**
- A tematização se propaga em tempo de execução para todos os componentes: Navbar, Sub-barra de métricas, Colunas, Cartões, Chat Teams/Slack e todos os Modais.

---

## 4. Guia de Contribuição e Boas Práticas

1. **Tipagem Estrita**: Não utilize tipos `any` implícitos. Todas as interfaces devem residir em `src/types/`.
2. **Padrão de Nomenclatura**:
   - Componentes React em PascalCase (`WelcomeIntroModal.tsx`);
   - Arquivos utilitários e de dados em camelCase (`themePresets.ts`, `parseWithGlossary.tsx`).
3. **Persistência**: Qualquer estado persistível no navegador deve ser manipulado com bloco `try/catch` para suportar ambientes restritos e navegação anônima.
