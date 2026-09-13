const fs = require('fs');
const path = require('path');

const files = {
  'src/content/overlay/SimulationOverlay.tsx': `
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, AlertTriangle, Users, GripHorizontal, Box } from 'lucide-react';
import { EventEngine } from '../../simulation/events/EventEngine';

const eventEngine = new EventEngine();

export function SimulationOverlay({ isRunning, onToggle }: { isRunning: boolean, onToggle: () => void }) {
  const [position, setPosition] = useState({ x: window.innerWidth - 320, y: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [isSettingUp, setIsSettingUp] = useState(false);
  
  const dragRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setPosition({
        x: dragRef.current.initialX + dx,
        y: dragRef.current.initialY + dy
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleSetupScenario = async () => {
    setIsSettingUp(true);
    await eventEngine.setupScenario();
    setIsSettingUp(false);
  };

  return (
    <div 
      style={{ left: position.x, top: position.y }}
      className="fixed bg-slate-900 text-slate-100 rounded-xl shadow-2xl border border-slate-700 w-72 z-[9999] flex flex-col overflow-hidden"
    >
      <div 
        onMouseDown={handleMouseDown}
        className="bg-slate-800 p-2 flex justify-between items-center cursor-grab active:cursor-grabbing border-b border-slate-700"
      >
        <GripHorizontal size={18} className="text-slate-400" />
        <h2 className="font-bold flex items-center gap-2 text-sm">
          <Users size={16} className="text-blue-400"/>
          Painel TASS
        </h2>
        <div className="text-[10px] bg-slate-700 px-2 py-1 rounded">Sprint 01</div>
      </div>
      
      <div className="p-4">
        <div className="flex flex-col gap-3 mb-4">
          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center gap-2">👨‍💻 Carlos</span>
            <span className="flex items-center gap-1 text-green-400"><div className="w-2 h-2 rounded-full bg-green-400"></div> Working</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center gap-2">👩‍🔬 Júlia</span>
            <span className="flex items-center gap-1 text-yellow-400"><div className="w-2 h-2 rounded-full bg-yellow-400"></div> Testing</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center gap-2">👨‍🏫 Marcos</span>
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

        <div className="flex flex-col gap-2">
          {!isRunning && (
            <button 
              onClick={handleSetupScenario}
              disabled={isSettingUp}
              className="w-full py-2 rounded flex justify-center items-center gap-2 font-bold transition bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm"
            >
              <Box size={16}/> 
              {isSettingUp ? 'Injetando Cards...' : 'Injetar Cenário Base'}
            </button>
          )}

          <button 
            onClick={onToggle}
            className={\`w-full py-2 rounded flex justify-center items-center gap-2 font-bold transition \${isRunning ? 'bg-red-900/50 text-red-400 hover:bg-red-800/50 border border-red-700/50' : 'bg-blue-600 text-white hover:bg-blue-700'}\`}
          >
            {isRunning ? <><Pause size={18}/> Pausar Simulação</> : <><Play size={18}/> Iniciar Simulação</>}
          </button>
        </div>
      </div>
    </div>
  );
}
`,

  'src/simulation/events/EventEngine.ts': `
import { TrelloDomAdapter } from '../../content/adapters/TrelloDomAdapter';

export class EventEngine {
  private adapter = new TrelloDomAdapter();

  private async sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async setupScenario() {
    console.log('[EventEngine] Preparando cenário de Delivery App...');
    const listNames = ["BACKLOG", "TO DO", "TODO", "A FAZER", "LISTA DE TAREFAS"];
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
      alert("Para iniciar, crie uma lista chamada 'BACKLOG' no seu Trello!");
      return;
    }

    // Apagar cards existentes na lista seria intrusivo demais via DOM e o Trello oculta a exclusão.
    // O foco do MVP será injetar os cards do cenário do TASS na lista existente.
    const scenarioCards = [
      "[TASS] Cadastro de Usuário",
      "[TASS] Login via OAuth",
      "[TASS] Catálogo de Produtos",
      "[TASS] Carrinho de Compras"
    ];

    for (const cardTitle of scenarioCards) {
      await this.injectCard(listNameFound, listElement as HTMLElement, cardTitle);
      await this.sleep(800); // Aguarda o Trello processar cada card para evitar bloqueio do DOM
    }
    console.log('[EventEngine] Cenário carregado com sucesso!');
  }

  private async injectCard(listName: string, listElement: HTMLElement, cardTitle: string) {
    const addBtn = this.adapter.findAddCardButton(listName) || listElement.querySelector('[data-testid="list-add-card-button"]');
    
    if (addBtn) {
      (addBtn as HTMLElement).click();
      await this.sleep(400);
      
      const textArea = document.querySelector('textarea[data-testid="list-card-composer-textarea"]') as HTMLTextAreaElement;
      if (textArea) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
        nativeInputValueSetter?.call(textArea, cardTitle);
        textArea.dispatchEvent(new Event('input', { bubbles: true }));
        
        await this.sleep(200);
        const saveBtn = document.querySelector('[data-testid="list-card-composer-add-card-button"]') as HTMLElement;
        if (saveBtn) saveBtn.click();
      }
    }
  }

  async generateBug(agentName: string) {
    console.log(\`[EventEngine] Injetando bug do agente \${agentName} no Trello...\`);
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

    if (!listElement) return;

    const bugId = Math.floor(Math.random() * 900) + 100;
    await this.injectCard(listNameFound, listElement as HTMLElement, \`[TASS] BUG-\${bugId}: Falha crítica injetada por \${agentName}\`);
  }
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
console.log('Draggable HUD and Scenario Injector added.');
