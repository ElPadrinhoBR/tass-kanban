import { EventEngine } from '../events/EventEngine';

export interface Agent {
  id: string;
  name: string;
  role: string;
  emoji: string;
  state: string;
  color: string;
}

export const DEFAULT_AGENTS: Agent[] = [
  { id: '1', name: 'Ana',     role: 'Product Owner', emoji: '👩', state: 'Planning',  color: '#a78bfa' },
  { id: '2', name: 'Carlos',  role: 'Developer',     emoji: '👨‍💻', state: 'Idle',    color: '#4ade80' },
  { id: '3', name: 'Júlia',   role: 'QA',            emoji: '👩‍🔬', state: 'Idle',    color: '#facc15' },
  { id: '4', name: 'Marcos',  role: 'Tech Lead',     emoji: '👨‍🏫', state: 'Idle',    color: '#60a5fa' },
];

export interface PendingQuestion {
  agentName: string;
  title: string;
  options: string[];
}

export type SimulationEventCallback = (event: {
  type: 'log' | 'question' | 'tick';
  log?: string;
  question?: PendingQuestion;
  tick?: number;
}) => void;

export class SimulationEngine {
  private eventEngine = new EventEngine();
  private isRunning = false;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private tick = 0;
  private userLastDecision?: string;
  private pendingQuestion: PendingQuestion | null = null;
  private agents = [...DEFAULT_AGENTS];
  private onEvent?: SimulationEventCallback;

  setEventCallback(cb: SimulationEventCallback) {
    this.onEvent = cb;
  }

  setUserDecision(decision: string) {
    this.userLastDecision = decision;
    this.pendingQuestion = null;
    // Resume se estava pausado por pergunta
    if (!this.isRunning) this.resume();
  }

  getAgents() { return this.agents; }

  async start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.onEvent?.({ type: 'log', log: '▶ Simulação iniciada com IA Gemini.' });
    this.scheduleNextTick();
  }

  pause() {
    this.isRunning = false;
    if (this.intervalId) { clearInterval(this.intervalId); this.intervalId = null; }
    this.onEvent?.({ type: 'log', log: '⏸ Simulação pausada.' });
  }

  resume() {
    this.isRunning = true;
    this.scheduleNextTick();
    this.onEvent?.({ type: 'log', log: '▶ Simulação retomada.' });
  }

  stop() {
    this.pause();
    this.tick = 0;
    this.userLastDecision = undefined;
    this.pendingQuestion = null;
  }

  private scheduleNextTick() {
    if (this.intervalId) clearInterval(this.intervalId);
    // Tick a cada 8 segundos para dar tempo do Trello processar
    this.intervalId = setInterval(() => this.runTick(), 8000);
  }

  private async runTick() {
    if (!this.isRunning) return;
    if (this.pendingQuestion) return; // pausa até usuário responder

    this.tick++;
    this.onEvent?.({ type: 'tick', tick: this.tick });

    // Rotaciona agentes (um por tick para não sobrecarregar o DOM)
    const agentIndex = (this.tick - 1) % this.agents.length;
    const agent = this.agents[agentIndex];

    // Atualiza estado visual
    this.agents = this.agents.map((a, i) => ({
      ...a,
      state: i === agentIndex ? 'Working...' : a.state
    }));
    this.onEvent?.({ type: 'log', log: `⏱ Tick ${this.tick} — ${agent.name} agindo...` });

    try {
      const result = await this.eventEngine.processAgentTick(
        agent.name,
        agent.role,
        this.tick,
        this.userLastDecision
      );

      this.onEvent?.({ type: 'log', log: result.log });

      // Atualiza estado do agente
      this.agents = this.agents.map(a =>
        a.id === agent.id
          ? { ...a, state: result.moved ? 'Done ✅' : 'Waiting' }
          : a
      );

      // Se a IA gerou uma pergunta, pausa e notifica
      if (result.question) {
        this.pendingQuestion = { agentName: agent.name, ...result.question };
        this.onEvent?.({ type: 'question', question: this.pendingQuestion });
      }

    } catch (err) {
      this.onEvent?.({ type: 'log', log: `⚠️ Erro no tick: ${(err as Error).message}` });
    }
  }
}