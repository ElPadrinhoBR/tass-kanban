const fs = require('fs');
const path = require('path');

const files = {
  'src/simulation/events/EventEngine.ts': `
import { TrelloDomAdapter } from '../../content/adapters/TrelloDomAdapter';

export class EventEngine {
  private adapter = new TrelloDomAdapter();

  async generateBug(agentName: string) {
    console.log(\`[EventEngine] Injetando bug do agente \${agentName} no Trello...\`);
    
    // Procura por listas comuns de backlog
    const listNames = ["BACKLOG", "TO DO", "TODO", "A FAZER"];
    let listElement = null;
    let listNameFound = "";
    
    for (const name of listNames) {
      listElement = this.adapter.findList(name);
      if (listElement) {
        listNameFound = name;
        break;
      }
    }

    if (!listElement) {
      console.warn('⚠️ [EventEngine] Nenhuma lista de Backlog ou Todo encontrada para injetar o Bug.');
      return;
    }

    const addBtn = this.adapter.findAddCardButton(listNameFound) || listElement.querySelector('[data-testid="list-add-card-button"]');
    
    if (addBtn) {
      (addBtn as HTMLElement).click();
      
      // Delay for Trello UI to render the textarea
      setTimeout(() => {
        const textArea = document.querySelector('textarea[data-testid="list-card-composer-textarea"]') as HTMLTextAreaElement;
        if (textArea) {
          const bugId = Math.floor(Math.random() * 900) + 100;
          // React synthetic events bypass normal value setting, so we simulate proper input
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
          nativeInputValueSetter?.call(textArea, \`[TASS] BUG-\${bugId}: Falha crítica injetada por \${agentName}\`);
          textArea.dispatchEvent(new Event('input', { bubbles: true }));
          
          setTimeout(() => {
            const saveBtn = document.querySelector('[data-testid="list-card-composer-add-card-button"]') as HTMLElement;
            if (saveBtn) saveBtn.click();
            console.log(\`✅ [EventEngine] Bug BUG-\${bugId} criado fisicamente no Trello!\`);
          }, 300);
        }
      }, 500);
    }
  }
}
`,

  'src/simulation/engine/AgentEngine.ts': `
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
`,

  'src/dashboard/Dashboard.tsx': `
import { useEffect, useState } from 'react';
import { db, type PlayerProgress, type Agent } from '../storage/db';
import { BarChart2, ShieldAlert, Zap, TrendingUp, Users } from 'lucide-react';

export function Dashboard() {
  const [progress, setProgress] = useState<PlayerProgress | undefined>();
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    db.progress.get(1).then(setProgress);
    db.agents.toArray().then(setAgents);
  }, []);
  
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-3xl font-black flex items-center gap-3">
              <BarChart2 className="text-blue-500" size={32} />
              Dashboard TASS
            </h1>
            <p className="text-slate-400 mt-1">Visão Geral da Simulação e Gestão da Equipe</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-400">Nível Atual</div>
            <div className="text-3xl font-black text-blue-400">Nível {progress?.level || 0}</div>
            <div className="text-sm font-bold text-blue-300 mt-1">{progress?.xp || 0} XP acumulados</div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 flex flex-col gap-2 shadow-lg">
            <div className="flex justify-between text-slate-400">
              <span className="font-bold">Velocity (Última Sprint)</span>
              <TrendingUp size={20} className="text-green-400" />
            </div>
            <div className="text-4xl font-black">24 <span className="text-xl font-normal text-slate-500">pts</span></div>
          </div>
          
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 flex flex-col gap-2 shadow-lg">
            <div className="flex justify-between text-slate-400">
              <span className="font-bold">Bugs / Incidentes</span>
              <ShieldAlert size={20} className="text-red-400" />
            </div>
            <div className="text-4xl font-black">2 <span className="text-xl font-normal text-slate-500">abertos</span></div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 flex flex-col gap-2 shadow-lg">
            <div className="flex justify-between text-slate-400">
              <span className="font-bold">Eficiência do Time</span>
              <Zap size={20} className="text-yellow-400" />
            </div>
            <div className="text-4xl font-black">82<span className="text-xl font-normal text-slate-500">%</span></div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Users className="text-blue-400" size={24} />
            Equipe Virtual (Agentes de IA)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {agents.map(agent => (
              <div key={agent.id} className="bg-slate-900 p-5 rounded-lg border border-slate-700 shadow-inner">
                <div className="font-black text-lg">{agent.name}</div>
                <div className="text-sm font-bold text-blue-400 mb-4">{agent.role}</div>
                <div className="text-sm flex justify-between items-center border-t border-slate-800 pt-3">
                  <span className="text-slate-400">Estado</span>
                  <span className="font-bold text-slate-900 bg-green-400 px-3 py-1 rounded-full text-xs uppercase tracking-wider">{agent.state}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
`,
  'src/options/index.tsx': `
import { createRoot } from 'react-dom/client';
import '../styles/globals.css';
import { Dashboard } from '../dashboard/Dashboard';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Dashboard />);
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
console.log('Phase 6 (Events) and Phase 7 (Dashboard) expanded.');
