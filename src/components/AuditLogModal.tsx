import React from 'react';
import { SimulationLogEntry } from '../types/kanban';
import { Download, Trash2, X, Terminal, ShieldCheck, History } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  logs: SimulationLogEntry[];
  onDownload: () => void;
  onClear: () => void;
}

export const AuditLogModal: React.FC<Props> = ({
  isOpen,
  onClose,
  logs,
  onDownload,
  onClear,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="bg-slate-850 p-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                Log de Memória & Rastreabilidade da IA
              </h2>
              <p className="text-[11px] text-slate-400">
                Histórico auditável persistente (Anti-Alucinação) • {logs.length} registros
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onDownload}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition"
              title="Baixar arquivo JSON completo"
            >
              <Download size={13} /> Baixar Log (.json)
            </button>
            <button
              onClick={onClear}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition"
              title="Limpar memória"
            >
              <Trash2 size={15} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition ml-1"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Lista de Logs estilo Terminal / Auditoria */}
        <div className="p-4 overflow-y-auto flex-1 bg-slate-950 font-mono text-[11px] space-y-2 scrollbar-thin scrollbar-thumb-slate-800">
          {logs.length === 0 ? (
            <div className="text-center py-12 text-slate-600 italic">
              Nenhuma ação executada ainda. Inicie a simulação para gerar os primeiros logs.
            </div>
          ) : (
            logs.map((entry) => (
              <div
                key={entry.id}
                className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 flex flex-col gap-1 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-500 border-b border-slate-800/80 pb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400 font-bold">Tick #{entry.tick}</span>
                    <span className="text-purple-400">Sprint {entry.sprint}</span>
                    <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <span className="font-bold text-slate-400 uppercase bg-slate-800 px-1.5 py-0.2 rounded">
                    {entry.action}
                  </span>
                </div>

                <div className="flex items-start gap-2 pt-0.5">
                  <span className="text-slate-300 font-bold">{entry.agentName}:</span>
                  <span className="text-slate-200 flex-1">{entry.reason}</span>
                </div>

                {entry.cardTitle && (
                  <div className="text-[10px] text-emerald-400/90 pl-4 border-l border-slate-800">
                    Cartão: <span className="font-semibold text-slate-300">"{entry.cardTitle}"</span>
                    {entry.fromColumn && entry.toColumn && (
                      <span className="text-slate-500"> ({entry.fromColumn} → {entry.toColumn})</span>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Rodapé informativo */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Terminal size={13} className="text-blue-400" />
            Este arquivo de log é injetado no prompt do Gemini para garantir continuidade sem alucinações.
          </span>
          <span className="text-slate-500 text-[10px]">Persistido em LocalStorage</span>
        </div>
      </div>
    </div>
  );
};
