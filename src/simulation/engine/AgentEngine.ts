import { db } from '../../storage/db';
import { EventEngine } from '../events/EventEngine';

export class AgentEngine {
  private eventEngine = new EventEngine();

  async initializeDefaultTeam() {
    const count = await db.agents.count();
    if (count === 0) {
      await db.agents.bulkAdd([
        { id: '1', name: 'Ana', role: 'Product Owner', state: 'Planning' },
        { id: '2', name: 'Carlos', role: 'Developer', state: 'Working' },
        { id: '3', name: 'Júlia', role: 'QA', state: 'Testing' },
        { id: '4', name: 'Marcos', role: 'Tech Lead', state: 'Reviewing' }
      ]);
    }
  }

  async processAgentsTick() {
    const agents = await db.agents.toArray();
    for (const agent of agents) {
      // Regra de Negócio: Developers trabalhando têm 5% de chance de gerar um Bug real no DOM
      if (agent.role === 'Developer' && Math.random() < 0.05) {
        await this.eventEngine.generateBug(agent.name);
      }
    }
  }
}