const fs = require('fs');
const path = require('path');

const files = {
  'src/content/adapters/TrelloDomAdapter.ts': `
export class TrelloDomAdapter {
  findBoardTitle(): HTMLElement | null {
    return document.querySelector('[data-testid="board-name-display"]') || 
           document.querySelector('h1[data-testid="board-name-container"]');
  }

  findAddListButton(): HTMLElement | null {
    return document.querySelector('[data-testid="list-composer-button"]');
  }

  findAddCardButton(listName: string): HTMLElement | null {
    const lists = Array.from(document.querySelectorAll('[data-testid="list"]'));
    const list = lists.find(l => l.textContent?.includes(listName));
    if (list) {
      return list.querySelector('[data-testid="list-add-card-button"]');
    }
    return null;
  }

  findList(listName: string): HTMLElement | null {
    const lists = Array.from(document.querySelectorAll('[data-testid="list"]'));
    return lists.find(l => l.textContent?.includes(listName)) as HTMLElement || null;
  }

  findCard(cardTitle: string): HTMLElement | null {
    const cards = Array.from(document.querySelectorAll('[data-testid="card-name"]'));
    return cards.find(c => c.textContent?.includes(cardTitle)) as HTMLElement || null;
  }
}
`,
  'src/content/overlay/SpotlightOverlay.tsx': `
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

interface SpotlightProps {
  targetElement: HTMLElement | null;
  message: string;
  step: string;
  onNext?: () => void;
}

export function SpotlightOverlay({ targetElement, message, step, onNext }: SpotlightProps) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!targetElement) return;
    const updateRect = () => setRect(targetElement.getBoundingClientRect());
    updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);
    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [targetElement]);

  if (!rect) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      <div className="absolute inset-0 bg-black/60 transition-opacity" />
      <div 
        className="absolute border-4 border-blue-500 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] pointer-events-auto transition-all duration-300"
        style={{
          top: rect.top - 4,
          left: rect.left - 4,
          width: rect.width + 8,
          height: rect.height + 8
        }}
      >
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-slate-800 text-white p-4 rounded-lg shadow-xl w-64 border border-slate-700 pointer-events-auto">
          <div className="text-xs text-blue-400 font-bold mb-1">{step}</div>
          <p className="text-sm mb-4">{message}</p>
          {onNext && (
            <button onClick={onNext} className="bg-blue-600 hover:bg-blue-700 w-full py-2 rounded text-sm font-bold">
              Continuar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
`,
  'src/content/tutorial/TutorialEngine.ts': `
import { TrelloDomAdapter } from '../adapters/TrelloDomAdapter';

export class TutorialEngine {
  private adapter = new TrelloDomAdapter();

  getCurrentStep() {
    // Logic for tutorial state machine
    return 1;
  }
}
`,
  'src/simulation/engine/SimulationEngine.ts': `
export class SimulationEngine {
  start() { console.log('Simulation started'); }
  pause() { console.log('Simulation paused'); }
  stop() { console.log('Simulation stopped'); }
  tick() {
    // processAgents, processTasks, processEvents
  }
}
`,
  'src/store/useSimulatorStore.ts': `
import { create } from 'zustand';

interface SimState {
  isActive: boolean;
  tutorialStep: number;
  setTutorialStep: (step: number) => void;
  startSimulation: () => void;
}

export const useSimulatorStore = create<SimState>((set) => ({
  isActive: false,
  tutorialStep: 0,
  setTutorialStep: (step) => set({ tutorialStep: step }),
  startSimulation: () => set({ isActive: true })
}));
`,
  'src/trello/api/TrelloClient.ts': `
export class TrelloClient {
  private apiKey: string;
  private token: string;
  
  constructor(apiKey: string, token: string) {
    this.apiKey = apiKey;
    this.token = token;
  }
  
  async getBoard(boardId: string) {
    // Fetch board from Trello API
  }
}
`,
  'src/storage/db.ts': `
import Dexie, { Table } from 'dexie';

export interface Agent { id: string; name: string; role: string; }
export interface Metric { id: string; velocity: number; bugs: number; }

export class TassDatabase extends Dexie {
  agents!: Table<Agent>;
  metrics!: Table<Metric>;

  constructor() {
    super('TassDB');
    this.version(1).stores({
      agents: 'id, name, role',
      metrics: 'id'
    });
  }
}

export const db = new TassDatabase();
`,
  'src/dashboard/Dashboard.tsx': `
import React from 'react';
import { useSimulatorStore } from '../store/useSimulatorStore';

export function Dashboard() {
  const { isActive } = useSimulatorStore();
  
  return (
    <div className="p-8 bg-slate-900 text-slate-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Painel do TASS</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-slate-800 p-4 rounded shadow border border-slate-700">
          <h3 className="text-slate-400 text-sm">Status</h3>
          <p className="text-2xl font-bold">{isActive ? 'Rodando' : 'Pausado'}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded shadow border border-slate-700">
          <h3 className="text-slate-400 text-sm">Velocity</h3>
          <p className="text-2xl font-bold">24 pts</p>
        </div>
        <div className="bg-slate-800 p-4 rounded shadow border border-slate-700">
          <h3 className="text-slate-400 text-sm">Bugs Abertos</h3>
          <p className="text-2xl font-bold text-red-400">2</p>
        </div>
      </div>
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
console.log('Scaffolding complete.');
