import { useEffect, useState } from 'react';
import { db, type PlayerProgress, type Agent } from '../storage/db';
import { BarChart2, ShieldAlert, Zap, TrendingUp, Users } from 'lucide-react';

export function Dashboard() {
  const [progress, setProgress] = useState<PlayerProgress | undefined>();
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    db.progress.get(1).then(setProgress);
    db.agents.toArray().then(setAgents);
  }, []);
  
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-3xl font-black flex items-center gap-3">
              <BarChart2 className="text-blue-500" size={32} />
              Dashboard TASS
            </h1>
            <p className="text-slate-400 mt-1">Visão Geral da Simulação e Gestão da Equipe</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-400">Nível Atual</div>
            <div className="text-3xl font-black text-blue-400">Nível {progress?.level || 0}</div>
            <div className="text-sm font-bold text-blue-300 mt-1">{progress?.xp || 0} XP acumulados</div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 flex flex-col gap-2 shadow-lg">
            <div className="flex justify-between text-slate-400">
              <span className="font-bold">Velocity (Última Sprint)</span>
              <TrendingUp size={20} className="text-green-400" />
            </div>
            <div className="text-4xl font-black">24 <span className="text-xl font-normal text-slate-500">pts</span></div>
          </div>
          
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 flex flex-col gap-2 shadow-lg">
            <div className="flex justify-between text-slate-400">
              <span className="font-bold">Bugs / Incidentes</span>
              <ShieldAlert size={20} className="text-red-400" />
            </div>
            <div className="text-4xl font-black">2 <span className="text-xl font-normal text-slate-500">abertos</span></div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 flex flex-col gap-2 shadow-lg">
            <div className="flex justify-between text-slate-400">
              <span className="font-bold">Eficiência do Time</span>
              <Zap size={20} className="text-yellow-400" />
            </div>
            <div className="text-4xl font-black">82<span className="text-xl font-normal text-slate-500">%</span></div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Users className="text-blue-400" size={24} />
            Equipe Virtual (Agentes de IA)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {agents.map(agent => (
              <div key={agent.id} className="bg-slate-900 p-5 rounded-lg border border-slate-700 shadow-inner">
                <div className="font-black text-lg">{agent.name}</div>
                <div className="text-sm font-bold text-blue-400 mb-4">{agent.role}</div>
                <div className="text-sm flex justify-between items-center border-t border-slate-800 pt-3">
                  <span className="text-slate-400">Estado</span>
                  <span className="font-bold text-slate-900 bg-green-400 px-3 py-1 rounded-full text-xs uppercase tracking-wider">{agent.state}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}