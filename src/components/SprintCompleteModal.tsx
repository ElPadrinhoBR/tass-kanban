import React, { useEffect, useState } from 'react';
import { Trophy, Star, Zap, TrendingUp, CheckCircle2, RefreshCcw, Download } from 'lucide-react';

interface SprintSummary {
  doneCards: number;
  totalCards: number;
  sprintNumber: number;
  totalXp: number;
  levelTitle: string;
  levelBadge: string;
  velocity: number;
  decisionsCount: number;
  morale: number;
}

interface SprintCompleteModalProps {
  isOpen: boolean;
  summary: SprintSummary;
  onNewSprint: () => void;
  onExportLog: () => void;
}

const TEAM_CELEBRATION = [
  { avatar: '👩‍💼', name: 'Ana Oliveira', role: 'Product Owner', msg: 'INCRÍVEL! Entregamos 100% do Sprint Goal! Os stakeholders vão adorar! 🎉' },
  { avatar: '👨‍💻', name: 'Carlos Silva', role: 'Dev', msg: 'Que sprint épica! Zero bugs em produção e código limpo. Valeu time! 🚀' },
  { avatar: '👨‍🏫', name: 'Marcos Souza', role: 'Tech Lead', msg: 'Cobertura de testes acima de 85%! A arquitetura ficou sólida demais. 💪' },
  { avatar: '👩‍🔬', name: 'Júlia Mendes', role: 'QA', msg: 'Todos os critérios de aceite validados em staging! Retrospectiva vai ser breve 😄' },
];

const Confetti: React.FC = () => {
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 1.5}s`,
    color: ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444', '#f472b6'][i % 6],
    size: `${6 + Math.random() * 8}px`,
    duration: `${2 + Math.random() * 1.5}s`,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute top-0 animate-confetti rounded-sm opacity-80"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  );
};

export const SprintCompleteModal: React.FC<SprintCompleteModalProps> = ({
  isOpen,
  summary,
  onNewSprint,
  onExportLog,
}) => {
  const [visible, setVisible] = useState(false);
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setMsgIdx(0);
      const interval = setInterval(() => {
        setMsgIdx((prev) => (prev < TEAM_CELEBRATION.length - 1 ? prev + 1 : prev));
      }, 900);
      return () => clearInterval(interval);
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  if (!isOpen && !visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="relative bg-slate-900 border border-emerald-500/40 rounded-2xl shadow-2xl shadow-emerald-500/20 w-full max-w-lg mx-4 overflow-hidden">
        <Confetti />

        {/* Header de Celebração */}
        <div className="relative bg-gradient-to-br from-emerald-900/60 to-blue-900/60 p-6 text-center border-b border-emerald-500/20">
          <div className="flex justify-center mb-3">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center animate-bounce-slow">
              <Trophy size={40} className="text-amber-400 drop-shadow-lg" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-white mb-1">
            🎉 Sprint {summary.sprintNumber} Concluída!
          </h2>
          <p className="text-emerald-300 font-semibold text-sm">
            {summary.doneCards}/{summary.totalCards} histórias entregues com sucesso
          </p>
          <div className="mt-2 inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 rounded-full px-4 py-1.5">
            <span className="text-lg">{summary.levelBadge}</span>
            <span className="text-emerald-300 font-bold text-sm">{summary.levelTitle}</span>
          </div>
        </div>

        {/* Métricas da Sprint */}
        <div className="p-5 grid grid-cols-2 gap-3">
          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700 flex items-center gap-3">
            <Zap size={20} className="text-amber-400 flex-shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">XP Ganho</div>
              <div className="text-xl font-black text-amber-400">+{summary.totalXp}</div>
            </div>
          </div>
          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700 flex items-center gap-3">
            <TrendingUp size={20} className="text-blue-400 flex-shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Velocity</div>
              <div className="text-xl font-black text-blue-400">{summary.velocity} pts</div>
            </div>
          </div>
          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700 flex items-center gap-3">
            <Star size={20} className="text-purple-400 flex-shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Decisões Tomadas</div>
              <div className="text-xl font-black text-purple-400">{summary.decisionsCount}</div>
            </div>
          </div>
          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700 flex items-center gap-3">
            <CheckCircle2 size={20} className="text-emerald-400 flex-shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Moral Final</div>
              <div className="text-xl font-black text-emerald-400">{summary.morale}%</div>
            </div>
          </div>
        </div>

        {/* Mensagens do Time com Rolagem */}
        <div className="px-5 pb-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1">💬 Time comemorando no chat</span>
            <span className="text-[10px] text-slate-500 font-normal">Role para ver todos ↕️</span>
          </div>
          <div className="space-y-2 max-h-44 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-850">
            {TEAM_CELEBRATION.slice(0, msgIdx + 1).map((m, i) => (
              <div
                key={i}
                className="flex items-start gap-2 animate-slide-in-left text-sm"
              >
                <span className="text-base flex-shrink-0">{m.avatar}</span>
                <div className="bg-slate-800 rounded-lg px-3 py-1.5 border border-slate-700 flex-1">
                  <span className="font-bold text-slate-200 text-xs">{m.name} </span>
                  <span className="text-slate-400 text-xs">({m.role})</span>
                  <p className="text-slate-300 text-xs mt-0.5">{m.msg}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ações */}
        <div className="px-5 pb-5 flex gap-3 pt-2 border-t border-slate-800/60">
          <button
            onClick={onExportLog}
            className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition"
          >
            <Download size={15} /> Exportar Log
          </button>
          <button
            onClick={onNewSprint}
            className="flex-2 flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-700/30"
          >
            <RefreshCcw size={15} /> Nova Sprint 🚀
          </button>
        </div>
      </div>
    </div>
  );
};
