import React from 'react';
import { X, Award, CheckCircle2, Lock, RotateCcw } from 'lucide-react';
import { ScrumMasterLevel, Achievement } from '../gamification/ScrumMasterProgression';
import { ThemeConfig } from '../data/themePresets';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: ScrumMasterLevel;
  nextLevel: ScrumMasterLevel | null;
  xp: number;
  decisionsCount: number;
  achievements: Achievement[];
  onResetCareer: () => void;
  theme?: ThemeConfig;
}

export const ScrumMasterProfileModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentLevel,
  nextLevel,
  xp,
  decisionsCount,
  achievements,
  onResetCareer,
  theme,
}) => {
  if (!isOpen) return null;

  const isLightTheme = theme?.id === 'classic-trello' || theme?.id === 'jira-enterprise';

  const currentLevelMin = currentLevel.minXp;
  const currentLevelMax = nextLevel ? nextLevel.minXp : currentLevel.maxXp;
  const xpInCurrentLevel = Math.max(0, xp - currentLevelMin);
  const xpSpan = Math.max(1, currentLevelMax - currentLevelMin);
  const progressPercent = nextLevel ? Math.min(100, Math.round((xpInCurrentLevel / xpSpan) * 100)) : 100;

  const unlockedCount = achievements.filter((a) => a.unlockedAt).length;

  // Estilização temática adaptativa
  const modalContainerClass = isLightTheme
    ? 'bg-[#fafbfc] border border-slate-300 shadow-2xl text-slate-800'
    : 'bg-slate-900 border border-slate-700 shadow-2xl text-slate-100';

  const headerBgClass = isLightTheme
    ? theme?.id === 'classic-trello'
      ? 'bg-gradient-to-r from-[#026aa7] to-[#0079bf] text-white border-b border-[#005a8e]'
      : 'bg-gradient-to-r from-[#0747a6] to-[#0052cc] text-white border-b border-[#003884]'
    : 'bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 border-b border-slate-700 text-white';

  const statsBarClass = isLightTheme
    ? 'grid grid-cols-3 p-4 bg-slate-100 border-b border-slate-200 gap-3 text-center'
    : 'grid grid-cols-3 p-4 bg-slate-950/60 border-b border-slate-800 gap-3 text-center';

  const statCardClass = isLightTheme
    ? 'bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm'
    : 'bg-slate-900 p-2.5 rounded-xl border border-slate-800';

  const statNumberColor = isLightTheme ? 'text-slate-800' : 'text-slate-100';

  const footerClass = isLightTheme
    ? 'p-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs'
    : 'p-3 bg-slate-850 border-t border-slate-800 flex items-center justify-between text-xs';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className={`rounded-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[88vh] ${modalContainerClass}`}>
        {/* Header com Cartão de Carreira */}
        <div className={`p-6 relative ${headerBgClass}`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/15 border-2 border-white/30 flex items-center justify-center text-3xl shadow-lg">
              {currentLevel.badge}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 text-white border border-white/30 px-2 py-0.5 rounded-full">
                  Nível {currentLevel.level} de 6
                </span>
                <span className="text-xs text-white/80 font-mono font-bold">
                  {xp} XP Total
                </span>
              </div>
              <h2 className="text-xl font-black text-white mt-1">
                {currentLevel.title}
              </h2>
              <p className="text-xs text-white/80 mt-0.5">
                {currentLevel.description}
              </p>
            </div>
          </div>

          {/* Barra de Progresso de Nível */}
          <div className="mt-5 space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-white/90 font-medium">Progresso para o próximo nível</span>
              <span className="text-white font-bold font-mono">
                {nextLevel ? `${xp} / ${nextLevel.minXp} XP` : 'Nível Máximo Atingido!'}
              </span>
            </div>
            <div className="w-full h-2.5 bg-black/30 rounded-full overflow-hidden border border-white/20">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Estatísticas Rápidas */}
        <div className={statsBarClass}>
          <div className={statCardClass}>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Decisões Tomadas</span>
            <span className={`text-base font-black font-mono ${statNumberColor}`}>{decisionsCount}</span>
          </div>
          <div className={statCardClass}>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Conquistas</span>
            <span className="text-base font-black text-amber-500 font-mono">{unlockedCount} / {achievements.length}</span>
          </div>
          <div className={statCardClass}>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Raciocínio Ágil</span>
            <span className="text-base font-black text-emerald-500 font-mono">100%</span>
          </div>
        </div>

        {/* Conquistas (Badges) */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3 scrollbar-thin scrollbar-thumb-slate-400/30">
          <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
            isLightTheme ? 'text-slate-600' : 'text-slate-400'
          }`}>
            <Award size={14} className="text-amber-500" /> Medalhas &amp; Conquistas Desbloqueáveis
          </h3>

          <div className="grid grid-cols-1 gap-2.5">
            {achievements.map((ach) => {
              const isUnlocked = Boolean(ach.unlockedAt);

              let badgeCardBg = '';
              if (isUnlocked) {
                badgeCardBg = isLightTheme
                  ? 'bg-amber-50/70 border-amber-300 shadow-sm'
                  : 'bg-slate-850 border-amber-500/30 bg-gradient-to-r from-amber-950/20 to-slate-900';
              } else {
                badgeCardBg = isLightTheme
                  ? 'bg-slate-100/70 border-slate-200 opacity-60'
                  : 'bg-slate-900/60 border-slate-800 opacity-60';
              }

              return (
                <div
                  key={ach.id}
                  className={`p-3 rounded-xl border flex items-center gap-3 transition ${badgeCardBg}`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl border ${
                      isUnlocked
                        ? 'bg-amber-500/20 border-amber-500/40'
                        : isLightTheme ? 'bg-slate-200 border-slate-300 text-slate-400' : 'bg-slate-800 border-slate-700 text-slate-600'
                    }`}
                  >
                    {isUnlocked ? ach.icon : <Lock size={16} />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-xs font-bold ${
                        isUnlocked ? (isLightTheme ? 'text-slate-900' : 'text-slate-100') : 'text-slate-400'
                      }`}>
                        {ach.title}
                      </h4>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                        isLightTheme ? 'text-amber-800 bg-amber-100 border-amber-200' : 'text-amber-400 bg-slate-950 border-slate-800'
                      }`}>
                        +{ach.xpReward} XP
                      </span>
                    </div>
                    <p className={`text-[11px] truncate mt-0.5 ${isLightTheme ? 'text-slate-500' : 'text-slate-400'}`}>
                      {ach.description}
                    </p>
                  </div>

                  {isUnlocked ? (
                    <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 size={13} /> Desbloqueada
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Bloqueada</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Rodapé com botão de reset */}
        <div className={footerClass}>
          <button
            onClick={() => {
              if (confirm('Deseja resetar sua carreira e XP de Scrum Master?')) {
                onResetCareer();
              }
            }}
            className="text-slate-400 hover:text-red-500 flex items-center gap-1.5 transition text-[11px]"
          >
            <RotateCcw size={12} /> Resetar Carreira
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-sm"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
