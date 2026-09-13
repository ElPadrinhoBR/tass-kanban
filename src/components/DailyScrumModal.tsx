import React, { useState } from 'react';
import { DailyReport, ManagerQuestion } from '../types/kanban';
import { Clock, CheckCircle2, AlertTriangle, ArrowRight, MessageSquareCheck } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  reports: DailyReport[];
  dilemma: ManagerQuestion | null;
  onResolveDilemma: (optionIndex: number) => void;
}

export const DailyScrumModal: React.FC<Props> = ({
  isOpen,
  onClose,
  reports,
  dilemma,
  onResolveDilemma,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleConfirmDecision = () => {
    if (selectedOption !== null) {
      onResolveDilemma(selectedOption);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950/80 to-purple-950/80 p-5 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Clock size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded-full border border-blue-700/50">
                  Modo 2: Tempo Real
                </span>
                <span className="text-xs text-slate-400 font-mono">18:00</span>
              </div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Reunião Diária de Alinhamento (Daily Scrum)
              </h2>
            </div>
          </div>
        </div>

        {/* Conteúdo com rolagem */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Relatório dos Membros da Equipe */}
          <div>
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">
              Relato da Equipe (O que foi feito / Próximos passos / Bloqueios)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {reports.map((r) => (
                <div
                  key={r.agentName}
                  className="bg-slate-800/80 border border-slate-700/70 rounded-xl p-3.5 flex flex-col justify-between gap-2"
                >
                  <div className="flex items-center gap-2 border-b border-slate-700/50 pb-2">
                    <span className="text-xl">{r.avatar}</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">{r.agentName}</h4>
                      <p className="text-[10px] text-blue-400">{r.role}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-[11px] text-slate-300">
                    <div>
                      <span className="text-slate-500 font-semibold">Ontem/Hoje:</span> {r.doneYesterday}
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold">Próximo:</span> {r.doingToday}
                    </div>
                    {r.blockers && (
                      <div className="text-amber-300/90 font-medium flex items-start gap-1 pt-1">
                        <AlertTriangle size={12} className="flex-shrink-0 mt-0.5 text-amber-400" />
                        <span>{r.blockers}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dilema / Decisão do Scrum Master */}
          {dilemma && (
            <div className="bg-slate-850 border border-amber-500/30 rounded-xl p-4 bg-gradient-to-b from-amber-950/20 to-slate-900">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 text-amber-400">
                  <AlertTriangle size={15} />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Decisão do Scrum Master ({dilemma.agentName})
                  </span>
                </div>
                <span className="text-[10px] bg-blue-950 text-blue-300 font-bold px-2 py-0.5 rounded border border-blue-800/60">
                  Didática Aplicada
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-100 mb-1">{dilemma.title}</h4>
              <p className="text-xs text-slate-400 mb-4">{dilemma.context}</p>

              <div className="space-y-2.5">
                {dilemma.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedOption(idx)}
                    className={`w-full text-left p-3 rounded-xl border transition flex flex-col gap-2 ${
                      selectedOption === idx
                        ? 'bg-blue-600/20 border-blue-500 ring-1 ring-blue-500 text-slate-100'
                        : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center flex-shrink-0 ${
                            selectedOption === idx ? 'border-blue-400 bg-blue-500' : 'border-slate-600'
                          }`}
                        >
                          {selectedOption === idx && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span className="text-xs font-medium leading-relaxed">{opt.text}</span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="text-[10px] font-mono font-bold text-amber-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
                          {opt.impact}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/60">
                          +{opt.xpReward} XP
                        </span>
                      </div>
                    </div>

                    <div className="pl-6 flex items-center gap-2">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          opt.approachType === 'SERVANT_LEADERSHIP'
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60'
                            : opt.approachType === 'PRAGMATIC_TRADE_OFF'
                            ? 'bg-blue-950/80 text-blue-300 border border-blue-700/60'
                            : 'bg-red-950/80 text-red-300 border border-red-700/60'
                        }`}
                      >
                        {opt.approachType === 'SERVANT_LEADERSHIP'
                          ? '🌟 Liderança Servidora (Scrum Guide)'
                          : opt.approachType === 'PRAGMATIC_TRADE_OFF'
                          ? '⚖️ Trade-off Pragmático'
                          : '⚠️ Anti-Padrão (Comando & Controle)'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Rodapé */}
        <div className="p-4 bg-slate-850 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-emerald-400" />
            Todas as métricas serão recalculadas com base na sua escolha
          </div>
          <button
            onClick={handleConfirmDecision}
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition"
          >
            Concluir Daily e Continuar <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
