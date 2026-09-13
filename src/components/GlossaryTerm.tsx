import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { BookOpen, X } from 'lucide-react';
import { GlossaryEntry } from '../data/glossary';

interface GlossaryTermProps {
  entry: GlossaryEntry;
  displayText: string;
}

const categoryColors: Record<string, string> = {
  scrum: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  kanban: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  eng: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  agile: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
};

const categoryLabels: Record<string, string> = {
  scrum: 'Scrum',
  kanban: 'Kanban',
  eng: 'Engenharia',
  agile: 'Ágil',
};

export const GlossaryTerm: React.FC<GlossaryTermProps> = ({ entry, displayText }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number; placeAbove: boolean }>({
    top: 0,
    left: 0,
    placeAbove: true,
  });

  // Atualiza coordenadas na tela para posicionar o popover via Portal
  const updatePosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const popoverWidth = 320;
    const popoverEstimatedHeight = 220;
    const padding = 12;

    // Calcula horizontal: tenta alinhar à esquerda do botão, mas evita vazar da tela
    let left = rect.left;
    if (left + popoverWidth > window.innerWidth - padding) {
      left = window.innerWidth - popoverWidth - padding;
    }
    if (left < padding) {
      left = padding;
    }

    // Calcula vertical: se tiver espaço acima, abre em cima; senão abre embaixo
    const spaceAbove = rect.top;
    const placeAbove = spaceAbove >= popoverEstimatedHeight + padding;

    let top = placeAbove
      ? rect.top - 8 // fica logo acima do elemento
      : rect.bottom + 8; // fica logo abaixo do elemento

    setCoords({ top, left, placeAbove });
  };

  useEffect(() => {
    if (!isOpen) return;
    updatePosition();

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleScrollOrResize = () => {
      updatePosition();
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isOpen]);

  const catColor = categoryColors[entry.category] || categoryColors.eng;
  const catLabel = categoryLabels[entry.category] || 'Técnico';

  return (
    <>
      {/* Botão de texto clicável */}
      <button
        ref={buttonRef}
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen((v) => !v);
        }}
        className={`inline-block font-semibold underline decoration-dotted decoration-1 underline-offset-2 cursor-pointer transition-colors ${
          isOpen
            ? 'text-amber-300 decoration-amber-400 bg-amber-400/10 rounded px-0.5'
            : 'text-sky-300 decoration-sky-500/70 hover:text-amber-300 hover:decoration-amber-400'
        }`}
        title={`Clique para ver o significado de "${entry.term}"`}
      >
        {displayText}
      </button>

      {/* Popover renderizado no body (Portal) para nunca sofrer overflow:hidden dos cards ou chat */}
      {isOpen &&
        createPortal(
          <div
            ref={popoverRef}
            style={{
              position: 'fixed',
              top: coords.placeAbove ? undefined : `${coords.top}px`,
              bottom: coords.placeAbove ? `${window.innerHeight - coords.top}px` : undefined,
              left: `${coords.left}px`,
              width: '320px',
              zIndex: 9999,
            }}
            className="bg-slate-900/98 border border-amber-500/50 rounded-2xl shadow-2xl shadow-black/90 p-4 text-left text-xs backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do Popover */}
            <div className="flex items-start justify-between mb-2.5 gap-2 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0">
                  <BookOpen size={13} />
                </div>
                <span className="text-sm font-black text-white tracking-wide">
                  {entry.term}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${catColor}`}
                >
                  {catLabel}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
                title="Fechar"
              >
                <X size={14} />
              </button>
            </div>

            {/* Definição */}
            <p className="text-xs text-slate-200 leading-relaxed mb-3">
              {entry.definition}
            </p>

            {/* Exemplo Prático */}
            {entry.example && (
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/90 block mb-1 flex items-center gap-1">
                  💡 Exemplo Prático:
                </span>
                <p className="text-[11px] text-slate-300 italic leading-relaxed">
                  "{entry.example}"
                </p>
              </div>
            )}
          </div>,
          document.body
        )}
    </>
  );
};
