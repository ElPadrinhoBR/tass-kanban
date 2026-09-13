import React from 'react';
import { Sparkles, BookOpen, Users, Award, ArrowRight, Lightbulb } from 'lucide-react';
import { ScrumMasterLevel } from '../gamification/ScrumMasterProgression';
import { parseWithGlossary } from '../utils/parseWithGlossary';
import { ThemeConfig } from '../data/themePresets';

export interface DecisionFeedbackData {
  decisionTitle: string;
  chosenText: string;
  scrumGuidePrinciple: string;
  realWorldExplanation: string;
  teamImpactDetails: string;
  xpEarned: number;
  unlockedBadge?: string;
  currentLevel: ScrumMasterLevel;
  leveledUp?: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: DecisionFeedbackData | null;
  theme?: ThemeConfig;
}

export const DecisionFeedbackModal: React.FC<Props> = ({ isOpen, onClose, data, theme }) => {
  if (!isOpen || !data) return null;

  const isLightTheme = theme?.id === 'classic-trello' || theme?.id === 'jira-enterprise';

  // Cores dinâmicas de acordo com o tema selecionado
  const modalBg = isLightTheme
    ? 'bg-[#fafbfc] border border-slate-300 shadow-2xl text-slate-800'
    : 'bg-slate-900 border border-slate-700 shadow-2xl text-slate-100';

  const headerBg = isLightTheme
    ? theme?.id === 'classic-trello'
      ? 'bg-gradient-to-r from-[#026aa7] to-[#0079bf] text-white border-b border-[#005a8e]'
      : 'bg-gradient-to-r from-[#0747a6] to-[#0052cc] text-white border-b border-[#003884]'
    : 'bg-gradient-to-r from-blue-900/60 via-indigo-900/60 to-purple-900/60 border-b border-slate-700/80';

  const decisionCardBg = isLightTheme
    ? 'bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm'
    : 'bg-slate-950 p-3.5 rounded-xl border border-slate-800';

  const decisionTextColor = isLightTheme ? 'text-slate-800' : 'text-slate-200';

  const guideCardBg = isLightTheme
    ? 'bg-blue-50/70 p-4 rounded-xl border border-blue-200 space-y-1.5'
    : 'bg-slate-850 p-4 rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-950/20 to-slate-900 space-y-1.5';

  const guideTextColor = isLightTheme ? 'text-slate-700' : 'text-slate-300';

  const impactCardBg = isLightTheme
    ? 'bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 space-y-1.5'
    : 'bg-slate-850 p-4 rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 to-slate-900 space-y-1.5';

  const impactTextColor = isLightTheme ? 'text-slate-700' : 'text-slate-300';

  const footerBg = isLightTheme
    ? 'p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between'
    : 'p-4 bg-slate-850 border-t border-slate-800 flex items-center justify-between';

  const footerMuted = isLightTheme ? 'text-slate-500' : 'text-slate-400';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className={`rounded-2xl max-w-xl w-full overflow-hidden flex flex-col ${modalBg}`}>
        {/* Header com comemoração de XP */}
        <div className={`p-5 flex items-center justify-between ${headerBg}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 text-xl shadow">
              <Lightbulb size={22} />
            </div>
            <div>
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                isLightTheme ? 'bg-white/20 text-white border border-white/30' : 'bg-amber-950/60 text-amber-300 border border-amber-700/50'
              }`}>
                Feedback Pedagógico do Scrum Master
              </span>
              <h2 className="text-base font-bold text-white mt-1">
                Análise da Decisão do Agilista
              </h2>
            </div>
          </div>

          <div className="text-right">
            <span className={`text-xs block font-medium ${isLightTheme ? 'text-white/80' : 'text-slate-400'}`}>Recompensa</span>
            <span className="text-sm font-black text-emerald-300 font-mono flex items-center gap-1 justify-end">
              <Sparkles size={14} /> +{data.xpEarned} XP
            </span>
          </div>
        </div>

        {/* Notificação de Level Up se aplicável */}
        {data.leveledUp && (
          <div className="bg-gradient-to-r from-amber-600 to-yellow-500 text-slate-950 font-bold px-4 py-2 text-xs flex items-center justify-center gap-2 shadow-inner">
            <Award size={16} /> Parabéns! Você subiu para o Nível {data.currentLevel.level}: {data.currentLevel.title}!
          </div>
        )}

        {/* Conteúdo Didático */}
        <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh] text-xs">
          {/* Decisão Selecionada */}
          <div className={decisionCardBg}>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
              Sua Ação Como Scrum Master:
            </span>
            <p className={`font-semibold italic leading-relaxed ${decisionTextColor}`}>
              "{parseWithGlossary(data.chosenText, 'chosen')}"
            </p>
          </div>

          {/* O que diz o Scrum Guide */}
          <div className={guideCardBg}>
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-[11px] uppercase tracking-wider">
              <BookOpen size={14} />
              O Que o Scrum Guide &amp; Boas Práticas Ensinam:
            </div>
            <p className={`leading-relaxed text-[11.5px] ${guideTextColor}`}>
              {parseWithGlossary(data.scrumGuidePrinciple, 'guide')}
            </p>
          </div>

          {/* Impacto Prático na Equipe */}
          <div className={impactCardBg}>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] uppercase tracking-wider">
              <Users size={14} />
              Dinâmica Real do Time de Engenharia:
            </div>
            <p className={`leading-relaxed text-[11.5px] ${impactTextColor}`}>
              {parseWithGlossary(data.teamImpactDetails, 'impact')}
            </p>
          </div>

          {/* Conquista Desbloqueada */}
          {data.unlockedBadge && (
            <div className={`p-3 rounded-xl flex items-center gap-3 border ${
              isLightTheme
                ? 'bg-purple-50 border-purple-200'
                : 'bg-gradient-to-r from-purple-950/40 to-slate-900 border-purple-500/40'
            }`}>
              <span className="text-2xl">🏆</span>
              <div>
                <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                  Nova Conquista Desbloqueada!
                </span>
                <h4 className={`text-xs font-bold ${isLightTheme ? 'text-slate-800' : 'text-slate-100'}`}>{data.unlockedBadge}</h4>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé de Ação */}
        <div className={footerBg}>
          <span className={`text-[11px] ${footerMuted}`}>
            {data.currentLevel.badge} Nível {data.currentLevel.level}: {data.currentLevel.title}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition"
          >
            Continuar Simulação <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
