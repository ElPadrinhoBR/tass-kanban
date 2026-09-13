import { Settings, PlayCircle, BarChart2 } from 'lucide-react';

export function Popup() {
  const openOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <div className="w-80 p-4 bg-slate-900 text-slate-100 flex flex-col gap-4">
      <div className="flex items-center gap-3 border-b border-slate-700 pb-3">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-xl font-bold">
          T
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight">TASS</h1>
          <p className="text-xs text-slate-400">Agile Software Simulator</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 p-3 rounded-md transition-colors text-left w-full">
          <PlayCircle size={18} className="text-blue-400" />
          <span className="text-sm font-medium">Ir para o Trello</span>
        </button>
        
        <button onClick={openOptions} className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 p-3 rounded-md transition-colors text-left w-full">
          <BarChart2 size={18} className="text-green-400" />
          <span className="text-sm font-medium">Abrir Dashboard TASS</span>
        </button>

        <button 
          onClick={openOptions}
          className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 p-3 rounded-md transition-colors text-left w-full"
        >
          <Settings size={18} className="text-slate-400" />
          <span className="text-sm font-medium">Configurações</span>
        </button>
      </div>
    </div>
  );
}
