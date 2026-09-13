import { SimulationLogEntry, KanbanCard } from '../types/kanban';

const STORAGE_KEY = 'tass_simulation_memory_v2';

export class SimulationMemory {
  private entries: SimulationLogEntry[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        this.entries = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('[SimulationMemory] Falha ao ler logs salvos:', e);
      this.entries = [];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.entries));
    } catch (e) {
      console.warn('[SimulationMemory] Falha ao persistir logs:', e);
    }
  }

  addEntry(entry: Omit<SimulationLogEntry, 'id' | 'timestamp'>): SimulationLogEntry {
    const fullEntry: SimulationLogEntry = {
      ...entry,
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
    };

    this.entries.push(fullEntry);
    this.saveToStorage();
    return fullEntry;
  }

  getEntries(): SimulationLogEntry[] {
    return [...this.entries];
  }

  getRecentEntries(count = 8): SimulationLogEntry[] {
    return this.entries.slice(-count);
  }

  getLastTick(): number {
    if (this.entries.length === 0) return 0;
    return this.entries[this.entries.length - 1].tick;
  }

  getLastSprint(): number {
    if (this.entries.length === 0) return 1;
    return this.entries[this.entries.length - 1].sprint;
  }

  // Gera o resumo de contexto anti-alucinação para alimentar a IA
  generateContextForAI(cards: KanbanCard[], currentSprint: number): string {
    const recent = this.getRecentEntries(6);
    const completedCards = cards.filter(c => c.status === 'DONE').map(c => c.title);
    const inProgressCards = cards.filter(c => c.status === 'EM DESENVOLVIMENTO').map(c => `${c.title} (${c.assignedTo || 'sem dono'})`);
    const testingCards = cards.filter(c => c.status === 'QA').map(c => c.title);
    const reviewCards = cards.filter(c => c.status === 'CODE REVIEW').map(c => c.title);
    const todoCards = cards.filter(c => c.status === 'TODO').map(c => c.title);

    const historySummary = recent.length > 0
      ? recent.map(r => `[${r.timestamp.substring(11, 19)}] [Tick ${r.tick}] ${r.agentName} executou: ${r.action} -> ${r.reason} (${r.cardTitle || 'Nenhum'})`).join('\n')
      : 'Nenhuma ação registrada nesta sessão ainda.';

    return `
=== MEMÓRIA PERSISTENTE DA SIMULAÇÃO (ANTI-ALUCINAÇÃO) ===
Sprint Atual: ${currentSprint}
Último Tick Registrado: ${this.getLastTick()}

HISTÓRICO RECENTE DAS ÚLTIMAS AÇÕES (LEIA COM ATENÇÃO PARA NÃO REPETIR):
${historySummary}

ESTADO ATUAL DOS CARDS NO QUADRO:
- A FAZER (TODO): ${todoCards.join(', ') || 'Nenhum'}
- EM DESENVOLVIMENTO: ${inProgressCards.join(', ') || 'Nenhum'}
- EM CODE REVIEW: ${reviewCards.join(', ') || 'Nenhum'}
- EM TESTES (QA): ${testingCards.join(', ') || 'Nenhum'}
- CONCLUÍDOS (DONE): ${completedCards.join(', ') || 'Nenhum'}

DIRETRIZ DE NÃO-ALUCINAÇÃO:
Você deve continuar a partir da situação atual acima.
NUNCA mova um card que já está em DONE.
NUNCA invente nomes de cartões que não existam nas listas.
Se não houver cartões para mover, declare IDLE e aguarde.
===========================================================
`.trim();
  }

  // Baixa o arquivo de log completo em JSON para o computador do usuário
  downloadLogFile() {
    const dataStr = JSON.stringify(this.entries, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tass_simulation_log_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  clearMemory() {
    this.entries = [];
    localStorage.removeItem(STORAGE_KEY);
  }
}
