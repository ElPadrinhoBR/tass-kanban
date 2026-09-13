export interface GeminiDecision {
  action: 'MOVE_CARD' | 'CREATE_BUG' | 'BLOCK' | 'COMPLETE' | 'WAIT';
  cardTitle?: string;
  fromList?: string;
  toList?: string;
  reason: string;
  userQuestion?: {
    title: string;
    options: string[];
  };
}

const KANBAN_FLOW = ['BACKLOG', 'TODO', 'EM DESENVOLVIMENTO', 'CODE REVIEW', 'QA', 'DONE'];

export class GeminiAgent {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  constructor(apiKey?: string) {
    this.apiKey = apiKey ?? import.meta.env.VITE_GEMINI_API_KEY ?? '';
  }

  isAvailable(): boolean {
    return this.apiKey.length > 0;
  }

  async decideNextAction(context: {
    agentName: string;
    agentRole: string;
    currentCards: string[];
    listNames: string[];
    tick: number;
    userLastDecision?: string;
  }): Promise<GeminiDecision> {
    if (!this.isAvailable()) {
      return this.ruleBasedDecision(context);
    }

    const prompt = `
Você é um agente de software virtual chamado "${context.agentName}" com papel de ${context.agentRole}.

Estado atual do quadro Kanban:
- Listas disponíveis: ${context.listNames.join(', ')}
- Cards [TASS] visíveis: ${context.currentCards.join(', ') || 'nenhum'}
- Tick da simulação: ${context.tick}
${context.userLastDecision ? `- Última decisão do gestor: ${context.userLastDecision}` : ''}

Fluxo Kanban esperado: ${KANBAN_FLOW.join(' → ')}

Escolha UMA ação para executar agora. Responda APENAS com JSON válido (sem markdown, sem explicações extras):
{
  "action": "MOVE_CARD" | "CREATE_BUG" | "WAIT",
  "cardTitle": "título exato do card se action=MOVE_CARD",
  "fromList": "lista atual do card",
  "toList": "lista de destino",
  "reason": "motivo em português (máx 80 chars)",
  "userQuestion": null | {
    "title": "pergunta para o gestor",
    "options": ["Opção A", "Opção B", "Opção C"]
  }
}

Regras:
- Só mova cards prefixados com [TASS]
- ${context.agentRole === 'Developer' ? 'Prefira mover de TODO → EM DESENVOLVIMENTO ou EM DESENVOLVIMENTO → CODE REVIEW' : ''}
- ${context.agentRole === 'QA' ? 'Prefira mover de CODE REVIEW → QA ou QA → DONE. Gere bugs ocasionalmente.' : ''}
- ${context.agentRole === 'Tech Lead' ? 'Faça code review. Mova de EM DESENVOLVIMENTO → CODE REVIEW.' : ''}
- Se não houver cards para mover, use action: "WAIT"
- A cada 5 ticks, gere um userQuestion para envolver o gestor
`.trim();

    try {
      const res = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 300 }
        })
      });

      if (!res.ok) {
        console.warn(`[GeminiAgent] API error ${res.status}: ${await res.text()}`);
        return this.ruleBasedDecision(context);
      }

      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
      
      // Extrai JSON da resposta (ignora markdown se houver)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return this.ruleBasedDecision(context);

      const parsed: GeminiDecision = JSON.parse(jsonMatch[0]);
      console.log(`[GeminiAgent:${context.agentName}] Decisão AI:`, parsed);
      return parsed;

    } catch (err) {
      console.warn('[GeminiAgent] Falhou, usando regras:', err);
      return this.ruleBasedDecision(context);
    }
  }

  private ruleBasedDecision(context: {
    agentRole: string;
    currentCards: string[];
    listNames: string[];
    tick: number;
  }): GeminiDecision {
    const { agentRole, currentCards, listNames, tick } = context;

    if (currentCards.length === 0) return { action: 'WAIT', reason: 'Nenhum card disponível.' };

    const card = currentCards[0];
    const roleMap: Record<string, { from: string; to: string }[]> = {
      'Developer':  [{ from: 'TODO', to: 'EM DESENVOLVIMENTO' }, { from: 'EM DESENVOLVIMENTO', to: 'CODE REVIEW' }],
      'Tech Lead':  [{ from: 'BACKLOG', to: 'TODO' }, { from: 'EM DESENVOLVIMENTO', to: 'CODE REVIEW' }],
      'QA':         [{ from: 'CODE REVIEW', to: 'QA' }, { from: 'QA', to: 'DONE' }],
      'Product Owner': [{ from: 'BACKLOG', to: 'TODO' }],
    };

    const moves = roleMap[agentRole] ?? [{ from: 'BACKLOG', to: 'TODO' }];
    const move = moves.find(m => listNames.includes(m.from) && listNames.includes(m.to));

    if (!move) return { action: 'WAIT', reason: 'Aguardando listas ficarem disponíveis.' };

    const shouldBug = agentRole === 'QA' && tick % 7 === 0;
    if (shouldBug) {
      return {
        action: 'CREATE_BUG',
        fromList: move.from,
        toList: move.from,
        reason: 'Bug encontrado durante QA!',
        cardTitle: card,
      };
    }

    return {
      action: 'MOVE_CARD',
      cardTitle: card,
      fromList: move.from,
      toList: move.to,
      reason: `${agentRole} avançando card no fluxo.`,
      userQuestion: tick % 5 === 0 ? {
        title: `${agentRole} está sobrecarregado. O que fazer?`,
        options: ['Redistribuir tarefas', 'Fazer hora extra', 'Reduzir escopo da Sprint']
      } : undefined
    };
  }

  async generateEventNarrative(event: string): Promise<string> {
    if (!this.isAvailable()) return event;
    try {
      const res = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Em português informal e direto (máx 60 chars), descreva: "${event}"` }] }],
          generationConfig: { temperature: 0.8, maxOutputTokens: 60 }
        })
      });
      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? event;
    } catch {
      return event;
    }
  }
}
