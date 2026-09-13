import React, { useState } from 'react';
import { Key, RotateCcw, X, Check, Sliders, Palette, CheckCircle2 } from 'lucide-react';
import { ThemeId, THEMES } from '../data/themePresets';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
  onResetScenario: () => void;
  currentTheme: ThemeId;
  onSelectTheme: (themeId: ThemeId) => void;
}

export const SettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
  onResetScenario,
  currentTheme,
  onSelectTheme,
}) => {
  const [currentKey, setCurrentKey] = useState(apiKey);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveApiKey(currentKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const themeList = Object.values(THEMES);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200 select-none">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-850 p-4 px-6 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Sliders size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">Configurações &amp; Temas Visuais</h2>
              <p className="text-[11px] text-slate-400">Personalize a identidade visual e parâmetros do simulador</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Conteúdo com Rolagem */}
        <div className="p-6 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
          {/* Seção 1: Seleção de Templates de Estilo / Cor */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
                <Palette size={15} className="text-indigo-400" />
                Templates de Estilo e Tema Visual
              </label>
              <span className="text-[10px] text-slate-500 font-mono">5 Estilos</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Alterne entre interfaces corporativas e limpas (estilo <strong>Trello clássico</strong>, <strong>Jira corporativo</strong>, <strong>Linear moderno</strong>, etc.) sem saturações exageradas:
            </p>

            <div className="grid grid-cols-1 gap-2.5">
              {themeList.map((t) => {
                const isSelected = t.id === currentTheme;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onSelectTheme(t.id)}
                    className={`p-3 rounded-2xl border text-left transition flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-blue-950/40 border-blue-500 shadow-md ring-1 ring-blue-500/50'
                        : 'bg-slate-950/60 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Amostras de cores */}
                      <div className="flex items-center -space-x-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
                        {t.previewColors.map((c, i) => (
                          <div
                            key={i}
                            className="w-5 h-5 rounded-full border border-slate-900 shadow-sm"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-100">{t.name}</h4>
                          {isSelected && (
                            <span className="text-[9px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.2 rounded font-bold uppercase">
                              Ativo
                            </span>
                          )}
                        </div>
                        <p className="text-[10.5px] text-slate-400 mt-0.5 leading-snug">
                          {t.subtitle}
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <CheckCircle2 size={18} className="text-blue-400 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Seção 2: Chave de API Google Gemini */}
          <div className="pt-4 border-t border-slate-800">
            <form onSubmit={handleSave} className="space-y-3">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
                <Key size={14} className="text-amber-400" /> Chave de API Google Gemini (Opcional)
              </label>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                A simulação já conta com um motor heurístico com IA autônoma embutida. Caso deseje conectar sua chave pessoal do Gemini:
              </p>
              <input
                type="password"
                value={currentKey}
                onChange={(e) => setCurrentKey(e.target.value)}
                placeholder="Cole sua chave GEMINI_API_KEY aqui..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
              />
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20"
              >
                {saved ? <><Check size={14} /> Chave Salva com Sucesso!</> : 'Salvar Chave de API'}
              </button>
            </form>
          </div>

          {/* Seção 3: Resetar Cenário Inicial */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
              <RotateCcw size={14} className="text-rose-400" /> Restaurar Cenário Inicial
            </label>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Restaura as 6 colunas, limpa o log e recoloca os 8 cartões originais do projeto Delivery App.
            </p>
            <button
              type="button"
              onClick={() => {
                if (confirm('Deseja restaurar o quadro e as mensagens para o estado inicial?')) {
                  onResetScenario();
                  onClose();
                }
              }}
              className="w-full py-2.5 bg-slate-950 hover:bg-rose-950/40 hover:text-rose-400 border border-slate-800 hover:border-rose-700/50 text-slate-300 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2"
            >
              <RotateCcw size={14} /> Restaurar Quadro e Tarefas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
