import React from 'react';
import {
  Bot,
  Play,
  Shield,
  Zap,
  Users,
  MessageSquare,
  Award,
  BookOpen,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  X,
} from 'lucide-react';

interface WelcomeIntroModalProps {
  isOpen: boolean;
  onStartGame: () => void;
  onClose?: () => void;
}

export const WelcomeIntroModal: React.FC<WelcomeIntroModalProps> = ({
  isOpen,
  onStartGame,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200 select-none">
      <div className="relative bg-slate-900 border border-blue-500/40 rounded-3xl max-w-2xl w-full shadow-2xl shadow-blue-500/10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Botão fechar se o usuário já conhecia */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition"
            title="Fechar apresentação"
          >
            <X size={18} />
          </button>
        )}

        {/* Hero Header */}
        <div className="relative bg-gradient-to-br from-blue-900/60 via-indigo-950 to-slate-900 p-6 md:p-8 text-center border-b border-slate-800 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/30 border border-blue-400/50 flex items-center justify-center text-blue-400 mb-3 shadow-lg shadow-blue-600/30">
            <Bot size={36} />
          </div>

          <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-300 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles size={12} className="text-amber-400" />
            Simulador de Scrum Master &amp; Agilidade
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Bem-vindo ao <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300">TASS KANBAN</span>
          </h1>

          <p className="text-xs md:text-sm text-slate-300 mt-2 max-w-lg leading-relaxed">
            Você é o <strong>Scrum Master</strong> de uma equipe ágil autônoma com inteligência artificial. Sua missão é guiar o time, remover bloqueios e entregar valor sem queimar a equipe.
          </p>
        </div>

        {/* Proposta do Jogo & Como Funciona */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs scrollbar-thin scrollbar-thumb-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Card 1: Time Autônomo com IA */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Users size={18} />
              </div>
              <h3 className="text-sm font-bold text-slate-100">1. Equipe com IA Autônoma</h3>
              <p className="text-slate-400 leading-relaxed text-[11.5px]">
                <strong>Ana (PO)</strong>, <strong>Carlos (Dev)</strong>, <strong>Marcos (Tech Lead)</strong> e <strong>Júlia (QA)</strong> movimentam os cartões no quadro Kanban sozinhos conforme o fluxo de trabalho.
              </p>
            </div>

            {/* Card 2: Suas Decisões Destravam o Time */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Shield size={18} />
              </div>
              <h3 className="text-sm font-bold text-slate-100">2. Liderança em Tempo Real</h3>
              <p className="text-slate-400 leading-relaxed text-[11.5px]">
                Quando surge um bloqueio, bug de segurança ou PR reprovado, <strong>o time para e chama você no chat</strong>. Suas decisões alteram o quadro Kanban na prática!
              </p>
            </div>

            {/* Card 3: Gamificação & Carreira */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Award size={18} />
              </div>
              <h3 className="text-sm font-bold text-slate-100">3. Evolução Gamificada (XP)</h3>
              <p className="text-slate-400 leading-relaxed text-[11.5px]">
                Ganhe XP tomando decisões de liderança servidora. Suba de nível (de <em>Iniciante</em> a <em>Agile Coach</em>) e desbloqueie medalhas exclusivas na sua carreira.
              </p>
            </div>

            {/* Card 4: Aprenda com o Scrum Guide */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <BookOpen size={18} />
              </div>
              <h3 className="text-sm font-bold text-slate-100">4. Vocabulário Clicável</h3>
              <p className="text-slate-400 leading-relaxed text-[11.5px]">
                Termos técnicos e em inglês (<em>PR, DoD, WIP, Spike, JWT, Deploy</em>) têm linha pontilhada. <strong>Clique neles a qualquer momento</strong> para aprender seu significado prático.
              </p>
            </div>
          </div>

          {/* Dicas Rápidas */}
          <div className="bg-blue-950/30 border border-blue-500/30 rounded-2xl p-3.5 flex items-center gap-3">
            <CheckCircle2 size={20} className="text-emerald-400 flex-shrink-0" />
            <div className="text-[11px] text-slate-300 leading-snug">
              <span className="font-bold text-blue-300">Dica inicial:</span> Para começar, responda à primeira dúvida do Carlos no canal <span className="font-mono text-amber-300">#duvidas-scrum-master</span> para destravar os devs e ver a mágica acontecer!
            </div>
          </div>
        </div>

        {/* Rodapé com Botão Principal */}
        <div className="p-4 md:p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
            Modo 1: Acelerado &bull; Modo 2: Tempo Real
          </span>

          <button
            onClick={onStartGame}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Play size={16} fill="white" />
            <span>Entrar no Jogo &amp; Assumir como Scrum Master</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
