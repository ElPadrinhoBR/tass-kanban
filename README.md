# 🚀 TASS Kanban — Simulador Educativo de Agilidade e Engenharia de Software

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61dafb.svg?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6.svg?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-6.x-646cff.svg?logo=vite)
![Status](https://img.shields.io/badge/build-passing-brightgreen.svg)

> **TASS Kanban** é um ambiente de simulação gamificado, interativo e educacional para formação prática de **Scrum Masters**, agilistas e líderes técnicos. O jogador assume a liderança servidora de um time autônomo com Inteligência Artificial, tomando decisões em tempo real com impactos diretos no fluxo do quadro Kanban, na qualidade do código e na motivação da equipe.

---

## 📌 Sumário
- [Sobre o Projeto](#-sobre-o-projeto)
- [Principais Funcionalidades](#-principais-funcionalidades)
- [Arquitetura e Tecnologias](#-arquitetura-e-tecnologias)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Como Executar Localmente](#-como-executar-localmente)
- [Deploy no GitHub Pages](#-deploy-no-github-pages)
- [Regras de Jogo e Dinâmica Ágil](#-regras-de-jogo-e-dinâmica-ágil)
- [Licença](#-licença)

---

## 🎯 Sobre o Projeto

Liderar um time de desenvolvimento ágil exige muito mais do que mover cartões: exige negociação de escopo com o Product Owner, resolução de gargalos de QA, moderação em revisões de código (Code Review), controle de Débito Técnico e preservação da segurança psicológica da equipe.

O **TASS Kanban** foi concebido para transformar a teoria do **Scrum Guide** e do método **Kanban** em uma experiência prática e dinâmica.

### A Equipe Autônoma com IA
O simulador conta com 4 membros autônomos com personalidades e papéis definidos:
- **Ana Oliveira (Product Owner)**: Gerencia o Backlog, defende o valor de negócio e prioriza entregas críticas como o pagamento via PIX.
- **Carlos Silva (Full-Stack Developer)**: Puxa histórias, desenvolve funcionalidades e reporta impedimentos técnicos na API ou no banco de dados.
- **Marcos Tech Lead (Tech Lead)**: Zela pela arquitetura, integridade do código e rigor nos testes durante o Code Review.
- **Júlia Santos (QA Engineer)**: Valida critérios de aceite em Staging e impede que bugs críticos cheguem em produção.

---

## ✨ Principais Funcionalidades

### 1. 📋 Quadro Kanban Interativo em Tempo Real
- 6 Colunas de fluxo: `Backlog`, `A Fazer (Sprint)`, `Em Desenvolvimento`, `Code Review`, `Homologação (QA)` e `Done`.
- Movimentação automática de cartões pelos agentes virtuais orientados por IA e heurísticas determinísticas.
- Suporte a arrastar e soltar (Drag and Drop) manual de cartões a qualquer momento.

### 2. 💬 Chat Corporativo da Equipe (Teams / Slack)
- 4 Canais integrados: `#geral`, `#dev-team`, `#duvidas-scrum-master` e `#alertas-e-bugs`.
- Mensagens contextualizadas em tempo real emitidas pelos agentes a cada mudança de estado no quadro.
- **Pausa Crítica**: Quando surge uma dúvida de negócio ou impedimento, o time para e aguarda a decisão do Scrum Master no canal de dúvidas.

### 3. ⚖️ Decisões com Impacto Direto no Quadro
- Cada escolha do agilista reflete imediatamente no Kanban:
  - Criação de cartões de **Spike** ou **Débito Técnico**;
  - Fatiamento de histórias de usuário grandes;
  - **Regressão de Cards**: Reprovação de PR no Code Review ou detecção de bugs em QA voltam os cartões para *Em Desenvolvimento* com tags de alerta;
  - Trade-offs de escopo negociados diretamente com a PO.

### 4. 📚 Vocabulário Técnico Clicável com React Portal
- Termos técnicos e siglas ágeis (**PR, DoD, DoR, WIP, Spike, JWT, Redis, Staging, Deploy, LGPD, etc.**) são sublinhados na interface.
- Ao clicar em qualquer termo, um popover explicativo renderizado via **React Portal** surge na tela com definição didática e exemplos práticos, livre de cortes ou problemas de overflow.

### 5. 🎨 5 Templates de Temas Corporativos Selecionáveis
- Alterne instantaneamente entre paletas refinadas:
  - **Atlassian Blue (Estilo Trello Clássico)**;
  - **Jira Software Clean (Enterprise)**;
  - **Linear Dark Minimalist**;
  - **Nordic Slate & Ice**;
  - **Midnight Pro (Original)**;
- Todos os elementos (quadro, sub-barra, chat, modais de feedback e perfil) adaptam suas cores de forma coordenada.

### 6. 🏆 Gamificação da Carreira de Scrum Master
- Sistema progressivo de experiência (**XP**):
  - *Nível 1: Aprendiz Ágil*;
  - *Nível 2: Facilitador Júnior*;
  - *Nível 3: Pleno Scrum Master*;
  - *Nível 4: Senior Agile Coach*;
  - *Nível 5: Principal Agilist*;
  - *Nível 6: Enterprise Agile Leader*.
- Medalhas e conquistas desbloqueáveis (ex: *Mestre do Limite de WIP*, *Zerador de Impedimentos*, *Guardião da Qualidade*).

### 7. 🛡️ Motor com Log Persistente Anti-Alucinação
- Cada ação executada na simulação é registrada com timestamp, tick, sprint e justificativa técnica.
- Histórico completo consultável e exportável como relatório `.json` para auditoria de processos.

---

## 🛠️ Arquitetura e Tecnologias

- **Core**: [React 19](https://react.dev/) + [TypeScript 5](https://www.typescriptlang.org/)
- **Bundler & Build Tool**: [Vite 6](https://vite.dev/)
- **Estilização**: [Tailwind CSS 3.4](https://tailwindcss.com/) com paleta adaptativa e animações CSS
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Armazenamento Local**: LocalStorage e IndexedDB (Dexie) para persistência de estado e configurações
- **Motor de IA / Heurística**: Integração nativa com a API Google Gemini com fallback heurístico desacoplado

---

## 📁 Estrutura de Pastas

```text
tass-kanban/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Pipeline de deploy automático no GitHub Pages
├── public/
│   └── favicon.svg             # Ícone oficial da aplicação
├── src/
│   ├── components/             # Componentes React modulares
│   │   ├── AgileHandbookModal.tsx     # Guia Ágil do Scrum Master
│   │   ├── AuditLogModal.tsx          # Modal de auditoria e exportação de logs
│   │   ├── DailyScrumModal.tsx        # Cerimônia de Daily Scrum
│   │   ├── DecisionFeedbackModal.tsx  # Análise didática com base no Scrum Guide
│   │   ├── GlossaryTerm.tsx           # Popover de vocabulário via React Portal
│   │   ├── KanbanCardItem.tsx         # Renderizador do cartão com temas
│   │   ├── KanbanColumnItem.tsx       # Renderizador das colunas do Kanban
│   │   ├── ScrumMasterProfileModal.tsx# Perfil de carreira e medalhas
│   │   ├── SettingsModal.tsx          # Configurações de API e seletor de temas
│   │   ├── SprintCompleteModal.tsx    # Celebração de Sprint com métricas e confetes
│   │   ├── TeamChatSidebar.tsx        # Chat estilo Teams / Slack tematizado
│   │   └── WelcomeIntroModal.tsx      # Tela de abertura e apresentação do jogo
│   ├── data/                   # Presets e bases de conhecimento
│   │   ├── glossary.ts         # Dicionário de termos técnicos e ágeis
│   │   ├── initialData.ts      # Colunas, agentes e cartões iniciais
│   │   ├── teamChatPresets.ts  # Dilemas pedagógicos e mensagens da equipe
│   │   └── themePresets.ts     # Paletas e configurações dos 5 temas visuais
│   ├── gamification/           # Lógica de progressão e conquistas
│   │   └── ScrumMasterProgression.ts
│   ├── simulation/             # Motor de simulação da equipe
│   │   ├── GeminiBrain.ts      # Raciocínio de tomada de decisão da IA
│   │   ├── SimulationMemory.ts # Log cronológico auditável anti-alucinação
│   │   └── realtimeClock.ts    # Temporizador do Modo 2 (tempo real)
│   ├── types/                  # Tipagem estrita TypeScript
│   │   ├── chat.ts             # Tipos de mensagens, canais e dilemas
│   │   └── kanban.ts           # Tipos de cartões, colunas e relatórios
│   ├── utils/
│   │   └── parseWithGlossary.tsx # Parser de termos técnicos com fronteiras estritas
│   ├── App.tsx                 # Orquestrador central de estado da aplicação
│   ├── index.css               # Diretivas do Tailwind CSS e animações
│   └── main.tsx                # Ponto de entrada da aplicação React
├── package.json
├── tsconfig.json
├── vite.config.ts              # Configuração Vite com base URL para GitHub Pages
└── LICENSE                     # Licença MIT
```

---

## 💻 Como Executar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) versão 18 ou superior
- Gerenciador de pacotes `npm` (ou `pnpm` / `yarn`)

### Passo a passo
1. Clone o repositório:
```bash
git clone https://github.com/ElPadrinhoBR/tass-kanban.git
cd tass-kanban
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Acesse no navegador:
```text
http://localhost:5173
```

---

## 🌐 Deploy no GitHub Pages

O projeto já inclui o workflow de CI/CD automatizado em `.github/workflows/deploy.yml`.

### Como publicar:
1. No seu repositório no GitHub, acesse **Settings** > **Pages**.
2. Na seção **Build and deployment**, selecione **Source: GitHub Actions**.
3. A cada push na branch `main`, o GitHub Actions publica automaticamente na URL:
```text
https://elpadrinhobr.github.io/tass-kanban/
```

---

## 📖 Regras de Jogo e Dinâmica Ágil

| Evento | O que acontece no jogo | Ação esperada do Scrum Master |
|---|---|---|
| **Dúvida no Chat** | O time para imediatamente e o status fica `Blocked` | Acessar o chat `#duvidas-scrum-master` e escolher uma abordagem |
| **Bug em QA** | A QA Júlia encontra vulnerabilidade crítica | Optar por regredir o card para *Em Dev* ou orientar a equipe |
| **PR Reprovado** | Tech Lead Marcos rejeita PR sem testes | Promover *Mob Programming* ou rejeitar com feedback construtivo |
| **Pressão por Prazo** | PO solicita inserção de escopo urgente | Negociar trade-off ou proteger a meta da Sprint atual |
| **Sprint Concluída** | Todos os cartões chegam em *Done* | Analisar métricas no modal de celebração e disparar uma Nova Sprint |

---

## 📄 Licença

Distribuído sob a licença **MIT**. Consulte o arquivo [`LICENSE`](./LICENSE) para obter mais informações.

---

<p align="center">
  Desenvolvido com foco em excelência em Engenharia de Software e Práticas Ágeis 🚀
</p>
