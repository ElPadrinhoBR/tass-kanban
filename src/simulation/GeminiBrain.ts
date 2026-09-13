import { KanbanCard, AgentMember, DailyReport, ManagerQuestion } from '../types/kanban';
import { SimulationMemory } from './SimulationMemory';

export interface AIDecision {
  action: 'MOVE_CARD' | 'CREATE_BUG' | 'IDLE';
  cardId?: string;
  cardTitle?: string;
  fromColumn?: string;
  toColumn?: string;
  reason: string;
  agentThought: string;
}

export class GeminiBrain {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('tass_gemini_key') || '';
  }

  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('tass_gemini_key', key);
  }

  getApiKey(): string {
    return this.apiKey;
  }

  isAvailable(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 10);
  }

  async decideAgentStep(
    agent: AgentMember,
    cards: KanbanCard[],
    memory: SimulationMemory,
    sprint: number,
    tick: number
  ): Promise<AIDecision> {
    if (!this.isAvailable()) {
      return this.ruleBasedDecision(agent, cards, sprint, tick);
    }

    const memoryContext = memory.generateContextForAI(cards, sprint);

    const prompt = `
${memoryContext}

Você agora está agindo como o membro da equipe:
- Nome: ${agent.name}
- Papel: ${agent.role}
- Status atual: ${agent.status}

Sua missão neste Tick (${tick}) é decidir a próxima ação lógica deste agente no fluxo ágil (TODO -> EM DESENVOLVIMENTO -> CODE REVIEW -> QA -> DONE).

Regras de negócio:
- Desenvolvedores (Carlos): movem tarefas de "TODO" para "EM DESENVOLVIMENTO", ou de "EM DESENVOLVIMENTO" para "CODE REVIEW".
- Tech Leads (Marcos): revisam códigos em "CODE REVIEW" e movem para "QA", ou puxam do "BACKLOG" para "TODO".
- QA (Júlia): testa tarefas em "QA" e move para "DONE" (se passou), OU pode criar um BUG crítico se falhou no teste.
- Product Owner (Ana): organiza o backlog e move para "TODO".

Responda ESTRITAMENTE em formato JSON (sem markdown, sem \`\`\`json):
{
  "action": "MOVE_CARD" | "CREATE_BUG" | "IDLE",
  "cardId": "id do card selecionado se MOVE_CARD",
  "cardTitle": "título exato do card",
  "fromColumn": "coluna atual",
  "toColumn": "coluna destino",
  "reason": "motivo em português (máx 60 caracteres)",
  "agentThought": "pensamento interno do profissional (máx 80 caracteres)"
}
`.trim();

    try {
      const res = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 300 }
        })
      });

      if (!res.ok) {
        console.warn('[GeminiBrain] Erro na API do Gemini, usando motor de regras:', res.status);
        return this.ruleBasedDecision(agent, cards, sprint, tick);
      }

      const data = await res.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        return this.ruleBasedDecision(agent, cards, sprint, tick);
      }

      const parsed: AIDecision = JSON.parse(jsonMatch[0]);
      return parsed;

    } catch (err) {
      console.warn('[GeminiBrain] Exceção na chamada do Gemini:', err);
      return this.ruleBasedDecision(agent, cards, sprint, tick);
    }
  }

  // Motor determinístico inteligente quando a API estiver offline
  private ruleBasedDecision(
    agent: AgentMember,
    cards: KanbanCard[],
    _sprint: number,
    tick: number
  ): AIDecision {
    const roleLower = agent.role.toLowerCase();
    const nameLower = agent.name.toLowerCase();

    // 1. Tech Lead (Marcos)
    if (roleLower.includes('tech') || nameLower.includes('marcos')) {
      // Prioridade A: Revisar card em CODE REVIEW -> mover para QA
      const reviewCard = cards.find((c) => c.status === 'CODE REVIEW');
      if (reviewCard) {
        return {
          action: 'MOVE_CARD',
          cardId: reviewCard.id,
          cardTitle: reviewCard.title,
          fromColumn: 'CODE REVIEW',
          toColumn: 'QA',
          reason: 'Code Review aprovado e build enviado para homologação em QA',
          agentThought: 'Arquitetura validada, testes unitários com 85% de cobertura.',
        };
      }

      // Prioridade B: Refinar card do BACKLOG para TODO
      const backlogCard = cards.find((c) => c.status === 'BACKLOG');
      if (backlogCard) {
        return {
          action: 'MOVE_CARD',
          cardId: backlogCard.id,
          cardTitle: backlogCard.title,
          fromColumn: 'BACKLOG',
          toColumn: 'TODO',
          reason: 'História refinada e priorizada para o Sprint Backlog',
          agentThought: 'Critérios de aceitação e estimativa acordados com a equipe.',
        };
      }

      // Prioridade C: Ajudar em Dev se houver cards em TODO
      const todoCard = cards.find((c) => c.status === 'TODO');
      const inDevCount = cards.filter((c) => c.status === 'EM DESENVOLVIMENTO').length;
      if (todoCard && inDevCount < 3) {
        return {
          action: 'MOVE_CARD',
          cardId: todoCard.id,
          cardTitle: todoCard.title,
          fromColumn: 'TODO',
          toColumn: 'EM DESENVOLVIMENTO',
          reason: 'Apoiando o desenvolvimento da feature crítica',
          agentThought: 'Trabalhando em pair programming para acelerar a entrega.',
        };
      }
    }

    // 2. Desenvolvedor (Carlos)
    if (roleLower.includes('dev') || nameLower.includes('carlos')) {
      // Prioridade A: Finalizar o que está em desenvolvimento -> Code Review
      const devCard = cards.find((c) => c.status === 'EM DESENVOLVIMENTO');
      if (devCard) {
        return {
          action: 'MOVE_CARD',
          cardId: devCard.id,
          cardTitle: devCard.title,
          fromColumn: 'EM DESENVOLVIMENTO',
          toColumn: 'CODE REVIEW',
          reason: 'Código finalizado e Pull Request aberto no GitHub',
          agentThought: 'Branch integrada, linter validado e testes locais passando.',
        };
      }

      // Prioridade B: Puxar do TODO para Desenvolvimento
      const todoCard = cards.find((c) => c.status === 'TODO');
      if (todoCard) {
        return {
          action: 'MOVE_CARD',
          cardId: todoCard.id,
          cardTitle: todoCard.title,
          fromColumn: 'TODO',
          toColumn: 'EM DESENVOLVIMENTO',
          reason: 'Iniciando implementação da funcionalidade',
          agentThought: 'Criando branch feature, implementando regras de negócio e testes.',
        };
      }

      // Prioridade C: Se não tiver TODO nem Dev, mas tiver QA atrasado, ajuda a testar
      const qaCard = cards.find((c) => c.status === 'QA');
      if (qaCard) {
        return {
          action: 'MOVE_CARD',
          cardId: qaCard.id,
          cardTitle: qaCard.title,
          fromColumn: 'QA',
          toColumn: 'DONE',
          reason: 'Apoiando QA nos testes de integração e homologação',
          agentThought: 'Swarming técnico para garantir que nada fique travado no funil.',
        };
      }
    }

    // 3. QA Specialist (Júlia)
    if (roleLower.includes('qa') || nameLower.includes('júlia') || nameLower.includes('julia')) {
      const qaCard = cards.find((c) => c.status === 'QA');
      if (qaCard) {
        // Gera bug raramente (a cada 8 ticks)
        if (tick > 0 && tick % 8 === 0) {
          return {
            action: 'CREATE_BUG',
            cardTitle: `Falha na validação de ${qaCard.title.slice(0, 24)}`,
            fromColumn: 'QA',
            toColumn: 'TODO',
            reason: 'Bug impeditivo encontrado durante teste de regressão',
            agentThought: 'Cenário de borda quebrou. Abrindo issue prioritária.',
          };
        }

        return {
          action: 'MOVE_CARD',
          cardId: qaCard.id,
          cardTitle: qaCard.title,
          fromColumn: 'QA',
          toColumn: 'DONE',
          reason: 'Testes de aceitação concluídos com 100% de sucesso',
          agentThought: 'Critérios cumpridos e homologado no ambiente de staging!',
        };
      }

      // Se não há cards em QA, mas há em Code Review, Júlia adianta o checklist
      const reviewCard = cards.find((c) => c.status === 'CODE REVIEW');
      if (reviewCard) {
        return {
          action: 'MOVE_CARD',
          cardId: reviewCard.id,
          cardTitle: reviewCard.title,
          fromColumn: 'CODE REVIEW',
          toColumn: 'QA',
          reason: 'Adiantando validação prévia de testes exploratórios',
          agentThought: 'Preparando cenários de teste automatizados e massa de dados.',
        };
      }
    }

    // 4. Product Owner (Ana)
    if (roleLower.includes('product') || roleLower.includes('po') || nameLower.includes('ana')) {
      // Prioridade A: Mover do BACKLOG para TODO
      const backlogCard = cards.find((c) => c.status === 'BACKLOG');
      if (backlogCard) {
        return {
          action: 'MOVE_CARD',
          cardId: backlogCard.id,
          cardTitle: backlogCard.title,
          fromColumn: 'BACKLOG',
          toColumn: 'TODO',
          reason: 'Priorizando história de usuário para o time implementar',
          agentThought: 'Alinhando valor de negócio com a meta da Sprint.',
        };
      }

      // Prioridade B: Aceite final do PO em QA -> DONE
      const qaCard = cards.find((c) => c.status === 'QA');
      if (qaCard) {
        return {
          action: 'MOVE_CARD',
          cardId: qaCard.id,
          cardTitle: qaCard.title,
          fromColumn: 'QA',
          toColumn: 'DONE',
          reason: 'Homologado pelo Product Owner como pronto para entrega',
          agentThought: 'Critérios de aceite do usuário cumpridos com excelência.',
        };
      }
    }

    // Regra de segurança para qualquer membro manter o fluxo caso o responsável esteja ocupado
    const anyDevCard = cards.find((c) => c.status === 'EM DESENVOLVIMENTO');
    if (anyDevCard) {
      return {
        action: 'MOVE_CARD',
        cardId: anyDevCard.id,
        cardTitle: anyDevCard.title,
        fromColumn: 'EM DESENVOLVIMENTO',
        toColumn: 'CODE REVIEW',
        reason: `${agent.name} finalizou a task e abriu PR`,
        agentThought: 'Colaboração de equipe para manter o fluxo contínuo.',
      };
    }

    const anyTodoCard = cards.find((c) => c.status === 'TODO');
    if (anyTodoCard) {
      return {
        action: 'MOVE_CARD',
        cardId: anyTodoCard.id,
        cardTitle: anyTodoCard.title,
        fromColumn: 'TODO',
        toColumn: 'EM DESENVOLVIMENTO',
        reason: `${agent.name} puxou a tarefa para desenvolvimento`,
        agentThought: 'Iniciando implementação do fluxo.',
      };
    }

    return {
      action: 'IDLE',
      reason: 'Aguardando tarefas no fluxo do Kanban',
      agentThought: 'Monitorando o board e auxiliando colegas de equipe.',
    };
  }

  // Gera a ata da Daily Scrum às 18:00
  async generateDailyReports(agents: AgentMember[], cards: KanbanCard[]): Promise<DailyReport[]> {
    const doneCards = cards.filter(c => c.status === 'DONE').map(c => c.title);
    const inProgress = cards.filter(c => c.status === 'EM DESENVOLVIMENTO').map(c => c.title);

    return agents.map(agent => {
      if (agent.role.includes('Developer')) {
        return {
          agentName: agent.name,
          avatar: agent.avatar,
          role: agent.role,
          doneYesterday: doneCards[0] || 'Estruturação dos componentes base',
          doingToday: inProgress[0] || 'Finalizando endpoints de autenticação',
          blockers: 'Aguardando aprovação de credenciais de homologação'
        };
      }
      if (agent.role.includes('QA')) {
        return {
          agentName: agent.name,
          avatar: agent.avatar,
          role: agent.role,
          doneYesterday: 'Execução de testes de regressão na sprint',
          doingToday: 'Validação de critérios de aceitação e fluxos de exceção',
          blockers: 'Nenhum impedimento, ambiente de teste estável'
        };
      }
      if (agent.role.includes('Tech Lead')) {
        return {
          agentName: agent.name,
          avatar: agent.avatar,
          role: agent.role,
          doneYesterday: 'Revisão de 3 Pull Requests e análise de arquitetura',
          doingToday: 'Otimização de queries do banco e apoio ao time',
          blockers: 'Necessidade de alinhar escopo da sprint com o PO'
        };
      }
      return {
        agentName: agent.name,
        avatar: agent.avatar,
        role: agent.role,
        doneYesterday: 'Refinamento do backlog com stakeholders',
        doingToday: 'Priorização dos cartões da próxima release',
        blockers: 'Definição de métricas de entrega pendente'
      };
    });
  }

  // Gera um dilema pedagógico para o Scrum Master decidir (do básico ao avançado)
  generateManagerDilemma(tick: number): ManagerQuestion {
    const dilemmas: ManagerQuestion[] = [
      {
        id: 'dilemma_1',
        agentName: 'Júlia',
        avatar: '👩‍🔬',
        title: 'Nível Básico: Bug Crítico no Módulo de Checkout!',
        context: 'A homologação de QA encontrou uma falha de concorrência que pode duplicar cobranças no gateway de pagamento.',
        options: [
          {
            text: 'Enxame (*Swarming*): Paralisar tarefas não-críticas e colocar Dev e Tech Lead para resolver o bug junto com o QA.',
            impact: 'Risco -25%, Moral +10%, Velocidade -5%',
            moraleDelta: 10,
            riskDelta: -25,
            velocityDelta: -5,
            approachType: 'SERVANT_LEADERSHIP',
            scrumGuidePrinciple: 'O Scrum Guide enfatiza a meta da Sprint e o conceito de "Qualidade Integrada" (Built-in Quality). Quando surge um bloqueio crítico, a equipe inteira se mobiliza (Swarming) para destravá-lo em vez de empurrar o problema para frente.',
            realWorldExplanation: 'Em engenharia moderna, bugs críticos não esperam a próxima sprint. A técnica de swarming reforça a responsabilidade coletiva sobre o produto e une o time.',
            teamImpactDetails: 'Júlia se sentiu apoiada e respeitada, Carlos e Marcos resolveram a causa raiz rapidamente e o risco operacional caiu drasticamente.',
            xpReward: 60
          },
          {
            text: 'Empurrar com a barriga: Lançar como Débito Técnico e corrigir na Sprint seguinte para não atrasar a meta.',
            impact: 'Risco +30%, Velocidade +10%, Moral -10%',
            moraleDelta: -10,
            riskDelta: 30,
            velocityDelta: 10,
            approachType: 'COMMAND_CONTROL',
            scrumGuidePrinciple: 'Lançar código em produção sabendo que possui bugs críticos viola o princípio de "Definição de Pronto" (DoD) e corrompe a confiança dos usuários.',
            realWorldExplanation: 'O débito técnico acumulado de forma inconsequente custa até 10x mais para ser corrigido após entrar em produção.',
            teamImpactDetails: 'Júlia ficou frustrada por ter seu trabalho ignorado e a equipe ficou apreensiva com o risco de incidentes no ar.',
            xpReward: 15
          },
          {
            text: 'Impor Horas Extras: Exigir que Carlos trabalhe até tarde hoje para corrigir o bug sem mexer no prazo.',
            impact: 'Velocidade 0%, Risco -10%, Moral -25%',
            moraleDelta: -25,
            riskDelta: -10,
            velocityDelta: 0,
            approachType: 'COMMAND_CONTROL',
            scrumGuidePrinciple: 'O 8º princípio do Manifesto Ágil afirma: "Os processos ágeis promovem desenvolvimento sustentável. Os patrocinadores, desenvolvedores e usuários devem ser capazes de manter um ritmo constante indefinidamente".',
            realWorldExplanation: 'Horas extras como rotina destroem a segurança psicológica e levam ao burnout do time de engenharia.',
            teamImpactDetails: 'Carlos ficou exausto e insatisfeito. O moral despencou, aumentando o risco de turnover.',
            xpReward: 10
          }
        ]
      },
      {
        id: 'dilemma_2',
        agentName: 'Marcos',
        avatar: '👨‍🏫',
        title: 'Nível Intermediário: Gargalo no Code Review e Débito Técnico',
        context: 'Vários cartões estão acumulados na coluna de Code Review. Marcos não está dando conta de revisar tudo sozinho.',
        options: [
          {
            text: 'Adotar Pair Programming e Revisões Cruzadas entre Carlos e Marcos.',
            impact: 'Moral +15%, Risco -15%, Velocidade +10%',
            moraleDelta: 15,
            riskDelta: -15,
            velocityDelta: 10,
            approachType: 'SERVANT_LEADERSHIP',
            scrumGuidePrinciple: 'Scrum prega que a equipe é multidisciplinar e auto-organizável. Não deve haver "heróis solitários" ou silos onde apenas uma pessoa é dona de uma etapa.',
            realWorldExplanation: 'Pair programming dissemina o conhecimento da base de código e elimina o Tech Lead como ponto único de falha (*Single Point of Failure*).',
            teamImpactDetails: 'Marcos respirou aliviado com a divisão de responsabilidades e Carlos aprendeu boas práticas de arquitetura.',
            xpReward: 50
          },
          {
            text: 'Ignorar o Code Review e aprovar os PRs diretamente para QA.',
            impact: 'Velocidade +25%, Risco +35%, Moral -10%',
            moraleDelta: -10,
            riskDelta: 35,
            velocityDelta: 25,
            approachType: 'PRAGMATIC_TRADE_OFF',
            scrumGuidePrinciple: 'Pular inspeção técnica para inflar artificialmente a velocidade gera ilusão de produtividade, pois os erros explodirão em QA ou em produção.',
            realWorldExplanation: 'O custo de encontrar um defeito em QA é muito mais alto do que pegá-lo em uma revisão de código de 15 minutos.',
            teamImpactDetails: 'Júlia foi sobrecarregada com códigos instáveis e Marcos se sentiu desvalorizado.',
            xpReward: 20
          }
        ]
      },
      {
        id: 'dilemma_3',
        agentName: 'Ana',
        avatar: '👩',
        title: 'Nível Avançado: Mudança Repentina de Escopo no Meio da Sprint',
        context: 'A diretoria solicitou à PO Ana a inclusão urgente de um módulo de cupons promocionais no meio do ciclo.',
        options: [
          {
            text: 'Negociação Ágil: Aceitar o novo cartão apenas mediante a remoção de um item de mesmo peso do Backlog da Sprint.',
            impact: 'Moral +10%, Risco -5%, Velocidade +5%',
            moraleDelta: 10,
            riskDelta: -5,
            velocityDelta: 5,
            approachType: 'SERVANT_LEADERSHIP',
            scrumGuidePrinciple: 'O escopo da Sprint pode ser renegociado com o Product Owner conforme mais é aprendido, desde que a Meta da Sprint (Sprint Goal) não seja colocada em perigo e a capacidade do time seja respeitada.',
            realWorldExplanation: 'Capacidade não se cria do nada. Se algo novo e prioritário entra, algo de menor prioridade precisa sair para manter o ritmo sustentável.',
            teamImpactDetails: 'Ana conseguiu atender a diretoria e a equipe não sofreu sobrecarga de trabalho.',
            xpReward: 70
          },
          {
            text: 'Aceitar tudo sem tirar nada e cobrar o time para fazer mágica.',
            impact: 'Moral -20%, Risco +30%, Velocidade -10%',
            moraleDelta: -20,
            riskDelta: 30,
            velocityDelta: -10,
            approachType: 'COMMAND_CONTROL',
            scrumGuidePrinciple: 'Aceitar escopo desenfreado sem critério quebra a previsibilidade e viola o compromisso da Sprint.',
            realWorldExplanation: 'Times pressionados a entregar mais do que a capacidade começam a cortar cantos e esconder bugs.',
            teamImpactDetails: 'O time se sentiu desrespeitado e a confiança no Scrum Master foi abalada.',
            xpReward: 10
          }
        ]
      }
    ];

    const idx = (Math.floor(tick / 4)) % dilemmas.length;
    return dilemmas[idx];
  }
}
