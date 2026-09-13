import React, { useState } from 'react';
import { BookOpen, X, Layers, Users, Calendar, BarChart3, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AgileHandbookModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'fundamentos' | 'papeis' | 'cerimonias' | 'metricas'>('fundamentos');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="bg-slate-850 p-4 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <BookOpen size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/50">
                Didática & Aprendizado Ágil
              </span>
              <h2 className="text-base font-bold text-slate-100 mt-0.5">
                Guia de Bolso do Scrum Master (Básico ao Avançado)
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800">
            <X size={18} />
          </button>
        </div>

        {/* Abas de Navegação */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-950 border-b border-slate-800 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('fundamentos')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
              activeTab === 'fundamentos'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Layers size={13} /> 1. Fundamentos & WIP
          </button>
          <button
            onClick={() => setActiveTab('papeis')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
              activeTab === 'papeis'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Users size={13} /> 2. Papéis do Time
          </button>
          <button
            onClick={() => setActiveTab('cerimonias')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
              activeTab === 'cerimonias'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Calendar size={13} /> 3. Cerimônias & Daily
          </button>
          <button
            onClick={() => setActiveTab('metricas')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
              activeTab === 'metricas'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BarChart3 size={13} /> 4. Métricas & Crises
          </button>
        </div>

        {/* Conteúdo da Aba Selecionada */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs text-slate-300 leading-relaxed scrollbar-thin scrollbar-thumb-slate-800">
          {activeTab === 'fundamentos' && (
            <div className="space-y-4">
              <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 space-y-2">
                <h3 className="text-sm font-bold text-blue-400 flex items-center gap-2">
                  <CheckCircle2 size={16} /> O Princípio Central: Pare de Começar, Comece a Terminar
                </h3>
                <p>
                  No Kanban, o trabalho é <strong>puxado</strong> e não empurrado. Um dos maiores erros de equipes iniciantes é iniciar muitas tarefas ao mesmo tempo. Isso gera troca constante de contexto (*multitasking*), aumentando o tempo de entrega de tudo.
                </p>
              </div>

              <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 space-y-2">
                <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                  <AlertCircle size={16} /> Limites de WIP (Work In Progress) e a Lei de Little
                </h3>
                <p>
                  <strong>WIP</strong> é a quantidade máxima de cartões permitidos simultaneamente em uma coluna (por exemplo, no máximo 3 cartões em <em>Em Desenvolvimento</em>).
                </p>
                <p className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300">
                  Lei de Little: Tempo de Entrega (Lead Time) = WIP ÷ Taxa de Vazão (Throughput)
                </p>
                <p>
                  Ou seja: se você dobrar o número de itens abertos simultaneamente sem aumentar a equipe, o tempo para cada item ficar pronto também dobrará!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'papeis' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-slate-850 p-3.5 rounded-xl border border-purple-500/30">
                <div className="flex items-center gap-2 text-purple-400 font-bold mb-1">
                  <span className="text-lg">👩</span> Product Owner (Ana)
                </div>
                <p className="text-[11px] text-slate-400">
                  Responsável pelo <strong>VALOR</strong>. Define o <em>Backlog</em>, prioriza o que é mais importante para os usuários e define os critérios de aceite. Não deve impor soluções técnicas aos desenvolvedores.
                </p>
              </div>

              <div className="bg-slate-850 p-3.5 rounded-xl border border-blue-500/30">
                <div className="flex items-center gap-2 text-blue-400 font-bold mb-1">
                  <span className="text-lg">👨‍💻</span> Desenvolvedor (Carlos)
                </div>
                <p className="text-[11px] text-slate-400">
                  Responsável pelo <strong>COMO</strong>. Constrói o software com código limpo, testes automatizados e arquitetura sustentável. Puxa itens da coluna <em>TODO</em> para <em>Em Desenvolvimento</em>.
                </p>
              </div>

              <div className="bg-slate-850 p-3.5 rounded-xl border border-pink-500/30">
                <div className="flex items-center gap-2 text-pink-400 font-bold mb-1">
                  <span className="text-lg">👩‍🔬</span> QA Engineer (Júlia)
                </div>
                <p className="text-[11px] text-slate-400">
                  Responsável pela <strong>QUALIDADE</strong>. Não apenas caça bugs no final, mas atua desde o refinamento prevenindo erros, validando cenários de borda e garantindo estabilidade antes de mover para <em>Done</em>.
                </p>
              </div>

              <div className="bg-slate-850 p-3.5 rounded-xl border border-amber-500/30">
                <div className="flex items-center gap-2 text-amber-400 font-bold mb-1">
                  <span className="text-lg">👨‍🏫</span> Tech Lead (Marcos)
                </div>
                <p className="text-[11px] text-slate-400">
                  Responsável pela <strong>SUSTENTABILIDADE TÉCNICA</strong>. Conduz Code Reviews, combate débitos técnicos, orienta desenvolvedores juniores e garante a segurança da arquitetura.
                </p>
              </div>

              <div className="col-span-full bg-gradient-to-r from-blue-950/40 to-indigo-950/40 p-4 rounded-xl border border-blue-500/40">
                <div className="flex items-center gap-2 text-blue-300 font-bold mb-1">
                  <span className="text-lg">🎓</span> Seu Papel: Scrum Master (Agile Coach)
                </div>
                <p className="text-[11px] text-slate-300">
                  Você <strong>não é o chefe</strong> que dá ordens. Você é o <em>Líder Servidor (Servant Leader)</em>. Seu papel é proteger o time de interrupções, remover barreiras operacionais, garantir a aderência às cerimônias e promover segurança psicológica.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'cerimonias' && (
            <div className="space-y-3">
              <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 space-y-1.5">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Calendar size={15} className="text-blue-400" /> A Daily Scrum (15 Minutos)
                </h3>
                <p className="text-[11.5px] text-slate-400">
                  A Daily não é uma reunião de prestação de contas para o gestor. É uma reunião <strong>do time para o time</strong> sincronizar o plano de ataque para as próximas 24 horas.
                </p>
                <div className="grid grid-cols-3 gap-2 pt-2 text-[11px]">
                  <div className="bg-slate-900 p-2 rounded border border-slate-800 text-center">
                    <span className="font-bold text-slate-200 block mb-1">1. O que fiz?</span>
                    O que entreguei ontem que ajudou a meta da sprint?
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800 text-center">
                    <span className="font-bold text-slate-200 block mb-1">2. O que farei?</span>
                    O que vou concluir hoje para avançar a meta?
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800 text-center text-amber-400">
                    <span className="font-bold block mb-1">3. Há bloqueios?</span>
                    Existe algum impedimento travando meu trabalho?
                  </div>
                </div>
              </div>

              <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <h4 className="text-xs font-bold text-slate-200">Sprint Planning vs Review vs Retrospectiva</h4>
                <p className="text-[11px] text-slate-400">
                  • <strong>Planning:</strong> Define o objetivo da sprint e o que cabe no ciclo.<br />
                  • <strong>Review:</strong> Demonstração do software funcional para os stakeholders.<br />
                  • <strong>Retrospective:</strong> O time analisa o processo e decide melhorias para o próximo ciclo.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'metricas' && (
            <div className="space-y-3">
              <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 space-y-2">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <BarChart3 size={15} className="text-emerald-400" /> Métricas que Todo Agilista Precisa Conhecer
                </h3>
                <div className="space-y-2 text-[11.5px]">
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <strong className="text-emerald-400">Velocidade (Velocity):</strong> Quantidade média de Story Points entregues em cada Sprint. Ajuda na previsibilidade, mas <em>nunca</em> deve ser usada para comparar equipes diferentes.
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <strong className="text-blue-400">Lead Time vs Cycle Time:</strong> Lead Time é o tempo desde a ideia no Backlog até a entrega. Cycle Time é o tempo ativo de desenvolvimento.
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <strong className="text-pink-400">Moral da Equipe:</strong> Segurança psicológica é o maior preditor de alta performance. Times com moral baixa escondem erros e evitam inovar.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé */}
        <div className="p-4 bg-slate-850 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Você pode consultar este guia em qualquer momento da simulação.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition"
          >
            Entendido, Voltar ao Quadro
          </button>
        </div>
      </div>
    </div>
  );
};
