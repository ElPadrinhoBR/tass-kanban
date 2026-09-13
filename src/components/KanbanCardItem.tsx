import React from 'react';
import { KanbanCard } from '../types/kanban';
import { Sparkles, Trash2, User } from 'lucide-react';
import { parseWithGlossary } from '../utils/parseWithGlossary';
import { ThemeConfig } from '../data/themePresets';

interface Props {
  card: KanbanCard;
  onDragStart: (e: React.DragEvent, cardId: string) => void;
  onDelete: (cardId: string) => void;
  theme?: ThemeConfig;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; label: string }> = {
  FRONTEND: { bg: 'bg-emerald-950/40', text: 'text-emerald-400', border: 'border-emerald-500', label: '🟢 FRONTEND' },
  BACKEND: { bg: 'bg-blue-950/40', text: 'text-blue-400', border: 'border-blue-500', label: '🔵 BACKEND' },
  'UI/UX': { bg: 'bg-purple-950/40', text: 'text-purple-400', border: 'border-purple-500', label: '🟣 UI/UX' },
  DATABASE: { bg: 'bg-amber-950/40', text: 'text-amber-400', border: 'border-amber-500', label: '🟡 DATABASE' },
  SECURITY: { bg: 'bg-rose-950/40', text: 'text-rose-400', border: 'border-rose-500', label: '🔴 SECURITY' },
  API: { bg: 'bg-orange-950/40', text: 'text-orange-400', border: 'border-orange-500', label: '🟠 API' },
  DEVOPS: { bg: 'bg-cyan-950/40', text: 'text-cyan-400', border: 'border-cyan-500', label: '🟢 DEVOPS' },
  CLOUD: { bg: 'bg-indigo-950/40', text: 'text-indigo-400', border: 'border-indigo-500', label: '🔵 CLOUD' },
  BUG: { bg: 'bg-red-950/60', text: 'text-red-400', border: 'border-red-600', label: '🔴 CRITICAL BUG' },
};

export const KanbanCardItem: React.FC<Props> = ({ card, onDragStart, onDelete, theme }) => {
  const catStyle = CATEGORY_COLORS[card.category] || CATEGORY_COLORS.FRONTEND;

  // Se o tema for claro (ex: Trello clássico ou Jira), ajustamos as classes para visual limpo
  const isLightTheme = theme?.id === 'classic-trello' || theme?.id === 'jira-enterprise';

  const cardBgClass = theme ? theme.cardBg : 'bg-slate-800/90';
  const cardBorderClass = theme ? theme.cardBorder : 'border-slate-700/60';
  const titleColor = isLightTheme ? 'text-slate-800 font-semibold' : 'text-slate-100 font-semibold';
  const descColor = isLightTheme ? 'text-slate-600' : 'text-slate-400';
  const footerBorder = isLightTheme ? 'border-slate-200' : 'border-slate-700/40';
  const footerText = isLightTheme ? 'text-slate-500' : 'text-slate-400';
  const tagBadgeBg = isLightTheme
    ? 'bg-slate-100 border-slate-300 text-slate-700'
    : `${catStyle.bg} ${catStyle.text} border-slate-700`;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, card.id)}
      className={`group relative ${cardBgClass} rounded-lg p-3 shadow-sm border-l-4 ${catStyle.border} border-t border-r border-b ${cardBorderClass} cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-150 flex flex-col gap-2`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tagBadgeBg}`}>
          {catStyle.label}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onDelete(card.id)}
            title="Excluir Cartão"
            className="text-slate-400 hover:text-red-500 p-1 rounded hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <h4 className={`text-xs leading-snug ${titleColor}`}>
        {parseWithGlossary(card.title, `card_${card.id}_title`)}
      </h4>

      {card.description && (
        <p className={`text-[11px] leading-relaxed ${descColor}`}>
          {parseWithGlossary(card.description, `card_${card.id}_desc`)}
        </p>
      )}

      <div className={`flex items-center justify-between mt-1 pt-2 border-t ${footerBorder} text-[10px] ${footerText}`}>
        <div className="flex items-center gap-1.5">
          {card.assignedTo ? (
            <span className={`flex items-center gap-1 font-medium px-1.5 py-0.5 rounded ${
              isLightTheme ? 'bg-slate-100 text-slate-700' : 'bg-slate-700/60 text-slate-300'
            }`}>
              <User size={11} className="text-blue-500" />
              {card.assignedTo}
            </span>
          ) : (
            <span className="text-slate-400 italic">Livre</span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <span className={`px-1.5 py-0.5 rounded font-mono font-bold ${
            isLightTheme ? 'bg-slate-100 text-slate-700 border border-slate-200' : 'bg-slate-900/80 text-slate-300'
          }`} title="Story Points">
            {card.storyPoints} pts
          </span>
          {card.status === 'DONE' && (
            <span className="text-emerald-500 flex items-center gap-0.5 font-bold">
              <Sparkles size={11} /> Pronto
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
