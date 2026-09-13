import React, { useState } from 'react';
import { KanbanColumn, KanbanCard, CardCategory } from '../types/kanban';
import { KanbanCardItem } from './KanbanCardItem';
import { Plus, X } from 'lucide-react';
import { ThemeConfig } from '../data/themePresets';
import { useLanguageStore } from '../i18n/useLanguage';

interface Props {
  column: KanbanColumn;
  cards: KanbanCard[];
  onDragStart: (e: React.DragEvent, cardId: string) => void;
  onDrop: (e: React.DragEvent, columnId: string) => void;
  onAddCard: (columnId: string, title: string, category: CardCategory, storyPoints: number) => void;
  onDeleteCard: (cardId: string) => void;
  theme?: ThemeConfig;
}

export const KanbanColumnItem: React.FC<Props> = ({
  column,
  cards,
  onDragStart,
  onDrop,
  onAddCard,
  onDeleteCard,
  theme,
}) => {
  const { t } = useLanguageStore();
  const [isOver, setIsOver] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<CardCategory>('FRONTEND');
  const [newPoints, setNewPoints] = useState(3);

  const isLightTheme = theme?.id === 'classic-trello' || theme?.id === 'jira-enterprise';

  const colBg = theme ? theme.columnBg : 'bg-slate-900/90';
  const colBorder = theme ? theme.columnBorder : 'border-slate-800';
  const titleColor = isLightTheme ? 'text-slate-800 font-bold' : 'text-slate-200 font-bold';
  const headerBorder = isLightTheme ? 'border-slate-300/80' : 'border-slate-800/80';
  const countBadgeBg = isLightTheme
    ? 'bg-slate-200/80 text-slate-700 border-slate-300'
    : 'bg-slate-800 text-slate-400 border-slate-700/60';
  const addBtnClass = isLightTheme
    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 border-t border-slate-300/70'
    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border-t border-slate-800/60';

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDropInternal = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    onDrop(e, column.id);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddCard(column.id, newTitle.trim(), newCategory, newPoints);
    setNewTitle('');
    setIsAdding(false);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDropInternal}
      className={`flex flex-col flex-shrink-0 w-72 ${colBg} rounded-xl border ${
        isOver ? 'border-blue-500 ring-2 ring-blue-500/30' : colBorder
      } shadow-md max-h-[calc(100vh-185px)] transition-colors`}
    >
      {/* Header da Coluna */}
      <div className={`p-3 border-b ${headerBorder} flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: column.color }}
          />
          <h3 className={`text-xs uppercase tracking-wider ${titleColor}`}>
            {column.title}
          </h3>
        </div>
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${countBadgeBg}`}>
          {cards.length}
        </span>
      </div>

      {/* Lista de Cartões (Rolável) */}
      <div className="p-2.5 flex-1 overflow-y-auto flex flex-col gap-2.5 scrollbar-thin scrollbar-thumb-slate-400/40">
        {cards.map((card) => (
          <KanbanCardItem
            key={card.id}
            card={card}
            onDragStart={onDragStart}
            onDelete={onDeleteCard}
            theme={theme}
          />
        ))}

        {cards.length === 0 && !isAdding && (
          <div className={`py-8 text-center text-xs italic border-2 border-dashed rounded-lg ${
            isLightTheme ? 'text-slate-400 border-slate-300' : 'text-slate-600 border-slate-800/60'
          }`}>
            Arraste um cartão aqui
          </div>
        )}

        {/* Formulário Inline de Criação de Card */}
        {isAdding && (
          <form onSubmit={handleCreate} className={`p-2.5 rounded-lg border flex flex-col gap-2 shadow-lg animate-in fade-in duration-150 ${
            isLightTheme ? 'bg-white border-slate-300' : 'bg-slate-800 border-slate-700'
          }`}>
            <textarea
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Insira um título para este cartão..."
              rows={2}
              className={`w-full border rounded p-2 text-xs placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none ${
                isLightTheme ? 'bg-slate-50 border-slate-300 text-slate-800' : 'bg-slate-900 border-slate-700 text-slate-100'
              }`}
            />
            <div className="flex items-center gap-2">
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as CardCategory)}
                className={`border text-[11px] rounded px-2 py-1 flex-1 focus:outline-none ${
                  isLightTheme ? 'bg-slate-50 border-slate-300 text-slate-800' : 'bg-slate-900 border-slate-700 text-slate-300'
                }`}
              >
                <option value="FRONTEND">🟢 FRONTEND</option>
                <option value="BACKEND">🔵 BACKEND</option>
                <option value="UI/UX">🟣 UI/UX</option>
                <option value="DATABASE">🟡 DATABASE</option>
                <option value="SECURITY">🔴 SECURITY</option>
                <option value="API">🟠 API</option>
                <option value="DEVOPS">🟢 DEVOPS</option>
                <option value="CLOUD">🔵 CLOUD</option>
                <option value="BUG">🔴 CRITICAL BUG</option>
              </select>

              <input
                type="number"
                min={1}
                max={13}
                value={newPoints}
                onChange={(e) => setNewPoints(Number(e.target.value))}
                title="Story Points"
                className={`w-14 border text-[11px] rounded px-2 py-1 text-center focus:outline-none ${
                  isLightTheme ? 'bg-slate-50 border-slate-300 text-slate-800' : 'bg-slate-900 border-slate-700 text-slate-300'
                }`}
              />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-1.5 rounded transition"
              >
                Adicionar
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-200/50"
              >
                <X size={14} />
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Rodapé: Botão Adicionar Cartão */}
      {!isAdding && (
        <div className={`p-2 ${addBtnClass}`}>
          <button
            onClick={() => setIsAdding(true)}
            className="w-full py-1.5 px-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
          >
            <Plus size={14} /> {t.columns.addCard}
          </button>
        </div>
      )}
    </div>
  );
};
