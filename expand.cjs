const fs = require('fs');
const path = require('path');

const files = {
  'src/storage/db.ts': `
import Dexie, { type Table } from 'dexie';

export interface Agent { id: string; name: string; role: string; state: string; }
export interface PlayerProgress { id: number; xp: number; level: number; }
export interface Achievement { id: string; title: string; unlockedAt: number; }
export interface Metric { id: string; velocity: number; bugs: number; }

export class TassDatabase extends Dexie {
  agents!: Table<Agent>;
  metrics!: Table<Metric>;
  progress!: Table<PlayerProgress>;
  achievements!: Table<Achievement>;

  constructor() {
    super('TassDB');
    this.version(2).stores({
      agents: 'id, name, role',
      metrics: 'id',
      progress: 'id',
      achievements: 'id'
    });
  }
}

export const db = new TassDatabase();
`,

  'src/gamification/GamificationEngine.ts': `
import { db } from '../storage/db';

const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 4000];
const LEVEL_TITLES = [
  'Aprendiz de Kanban',
  'Agile Practitioner',
  'Scrum Practitioner',
  'Tech Lead',
  'Project Manager',
  'IT Manager',
  'Technology Leader'
];

export class GamificationEngine {
  async addXp(amount: number) {
    let progress = await db.progress.get(1);
    if (!progress) {
      progress = { id: 1, xp: 0, level: 0 };
    }
    
    progress.xp += amount;
    
    let newLevel = progress.level;
    for (let i = progress.level + 1; i < LEVEL_THRESHOLDS.length; i++) {
      if (progress.xp >= LEVEL_THRESHOLDS[i]) {
        newLevel = i;
      } else {
        break;
      }
    }
    
    progress.level = newLevel;
    await db.progress.put(progress);
    
    return { 
      xp: progress.xp, 
      level: progress.level, 
      title: LEVEL_TITLES[progress.level] || 'Leader'
    };
  }

  async unlockAchievement(id: string, title: string) {
    const existing = await db.achievements.get(id);
    if (!existing) {
      await db.achievements.add({ id, title, unlockedAt: Date.now() });
      console.log(\`🏆 Conquista Desbloqueada: \${title}\`);
    }
  }
}
`,

  'src/simulation/engine/AgentEngine.ts': `
import { db } from '../../storage/db';

export class AgentEngine {
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
    // Basic AI decision logic based on agent role
    const agents = await db.agents.toArray();
    for (const agent of agents) {
      // Stub for agent state machine (e.g. 5% chance to create a bug if Working)
      if (agent.role === 'Developer' && Math.random() < 0.05) {
        console.log(\`🚨 \${agent.name} gerou um BUG!\`);
      }
    }
  }
}
`,

  'src/simulation/engine/SimulationEngine.ts': `
import { AgentEngine } from './AgentEngine';
import { GamificationEngine } from '../../gamification/GamificationEngine';

export class SimulationEngine {
  private agentEngine = new AgentEngine();
  private gamification = new GamificationEngine();
  private isRunning = false;
  private intervalId: any = null;

  async start() {
    console.log('▶ Simulador Iniciado');
    this.isRunning = true;
    await this.agentEngine.initializeDefaultTeam();
    
    this.intervalId = setInterval(() => this.tick(), 2000); // 1 tick = 2 seconds
  }

  pause() {
    console.log('⏸ Simulador Pausado');
    this.isRunning = false;
    if (this.intervalId) clearInterval(this.intervalId);
  }

  async tick() {
    if (!this.isRunning) return;
    console.log('⏱ Tick do Simulador...');
    await this.agentEngine.processAgentsTick();
    
    // Simulate passive XP gain
    if (Math.random() < 0.2) {
      await this.gamification.addXp(10);
    }
  }
}
`,

  'src/content/overlay/SimulationOverlay.tsx': `
import { Play, Pause, AlertTriangle, Users } from 'lucide-react';

export function SimulationOverlay({ isRunning, onToggle }: { isRunning: boolean, onToggle: () => void }) {
  return (
    <div className="fixed top-20 right-8 bg-slate-900 text-slate-100 p-4 rounded-xl shadow-2xl border border-slate-700 w-72 z-[9999]">
      <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
        <h2 className="font-bold flex items-center gap-2">
          <Users size={18} className="text-blue-400"/>
          Equipe TASS
        </h2>
        <div className="text-xs bg-slate-800 px-2 py-1 rounded">Sprint 01 - Dia 4</div>
      </div>
      
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex justify-between items-center text-sm">
          <span className="flex items-center gap-2">👨‍💻 Carlos <span className="text-xs text-slate-400">Dev</span></span>
          <span className="flex items-center gap-1 text-green-400"><div className="w-2 h-2 rounded-full bg-green-400"></div> Working</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="flex items-center gap-2">👩‍🔬 Júlia <span className="text-xs text-slate-400">QA</span></span>
          <span className="flex items-center gap-1 text-yellow-400"><div className="w-2 h-2 rounded-full bg-yellow-400"></div> Testing</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="flex items-center gap-2">👨‍🏫 Marcos <span className="text-xs text-slate-400">Lead</span></span>
          <span className="flex items-center gap-1 text-blue-400"><div className="w-2 h-2 rounded-full bg-blue-400"></div> Reviewing</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-slate-800 p-2 rounded text-center">
          <div className="text-xs text-slate-400 mb-1">Risk</div>
          <div className="text-sm font-bold text-yellow-400 flex justify-center items-center gap-1"><AlertTriangle size={14}/> MEDIUM</div>
        </div>
        <div className="bg-slate-800 p-2 rounded text-center">
          <div className="text-xs text-slate-400 mb-1">Morale</div>
          <div className="text-sm font-bold text-green-400">82%</div>
        </div>
      </div>

      <button 
        onClick={onToggle}
        className={\`w-full py-2 rounded flex justify-center items-center gap-2 font-bold transition \${isRunning ? 'bg-red-900/50 text-red-400 hover:bg-red-800/50 border border-red-700/50' : 'bg-blue-600 text-white hover:bg-blue-700'}\`}
      >
        {isRunning ? <><Pause size={18}/> Pausar Simulação</> : <><Play size={18}/> Iniciar Simulação</>}
      </button>
    </div>
  );
}
`
};

for (const [filepath, content] of Object.entries(files)) {
  const dir = path.dirname(filepath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filepath, content.trim());
}
console.log('Modules expanded.');
