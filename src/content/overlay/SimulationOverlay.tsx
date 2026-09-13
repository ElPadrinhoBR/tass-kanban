import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play, Pause, AlertTriangle, GripHorizontal,
  Box, CheckCircle2, AlertCircle, Loader2, MessageSquare, X
} from 'lucide-react';
import { EventEngine } from '../../simulation/events/EventEngine';
import { SimulationEngine, type Agent, type PendingQuestion } from '../../simulation/engine/SimulationEngine';
import { TrelloDomAdapter } from '../adapters/TrelloDomAdapter';

const adapter = new TrelloDomAdapter();
const eventEngine = new EventEngine();
const simulationEngine = new SimulationEngine();

type SetupStatus = 'idle' | 'running' | 'ok' | 'error';

export function SimulationOverlay({ isRunning, onToggle }: { isRunning: boolean; onToggle: () => void }) {
  const [pos, setPos] = useState<{ x?: number; y?: number }>({});
  const [dragging, setDragging] = useState(false);
  const [setupStatus, setSetupStatus] = useState<SetupStatus>('idle');
  const [log, setLog] = useState<string[]>([]);
  const [listsFound, setListsFound] = useState<string[]>([]);
  const [agents, setAgents] = useState<Agent[]>(simulationEngine.getAgents());
  const [question, setQuestion] = useState<PendingQuestion | null>(null);
  const [tick, setTick] = useState(0);

  const panelRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ sx: 0, sy: 0, ix: 0, iy: 0 });
  const logRef = useRef<HTMLDivElement>(null);

  // Scan listas
  useEffect(() => {
    const scan = () => setListsFound(adapter.getAllListNames());
    scan();
    const t = setInterval(scan, 3000);
    return () => clearInterval(t);
  }, []);

  // Auto-scroll log
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  // Conecta callbacks da engine
  useEffect(() => {
    simulationEngine.setEventCallback(ev => {
      if (ev.type === 'log' && ev.log) setLog(prev => [...prev.slice(-30), ev.log!]);
      if (ev.type === 'tick') { setTick(ev.tick!); setAgents([...simulationEngine.getAgents()]); }
      if (ev.type === 'question' && ev.question) setQuestion(ev.question);
    });
  }, []);

  // Drag
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    const rect = panelRef.current?.getBoundingClientRect();
    const currentX = pos.x !== undefined ? pos.x : (rect?.left ?? (window.innerWidth - 310));
    const currentY = pos.y !== undefined ? pos.y : (rect?.top ?? 80);
    dragRef.current = { sx: e.clientX, sy: e.clientY, ix: currentX, iy: currentY };
  };

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!dragging) return;
      setPos({
        x: Math.max(10, Math.min(window.innerWidth - 300, dragRef.current.ix + e.clientX - dragRef.current.sx)),
        y: Math.max(10, Math.min(window.innerHeight - 80, dragRef.current.iy + e.clientY - dragRef.current.sy)),
      });
    };
    const up = () => setDragging(false);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
  }, [dragging]);

  const handleSetup = async () => {
    setSetupStatus('running');
    setLog([]);
    try {
      await eventEngine.setupScenario(msg => setLog(prev => [...prev, msg]));
      setSetupStatus('ok');
      setListsFound(adapter.getAllListNames());
    } catch (err) {
      setSetupStatus('error');
      setLog(prev => [...prev, `❌ ${(err as Error).message}`]);
    }
  };

  const handleToggle = useCallback(() => {
    if (isRunning) {
      simulationEngine.pause();
    } else {
      simulationEngine.start();
    }
    onToggle();
  }, [isRunning, onToggle]);

  const handleAnswer = (option: string) => {
    setLog(prev => [...prev, `👤 Gestor decidiu: ${option}`]);
    simulationEngine.setUserDecision(option);
    setQuestion(null);
  };

  const css = (obj: React.CSSProperties) => obj;

  return (
    <>
      {/* Painel principal */}
      <div
        ref={panelRef}
        style={css({
          position: 'fixed',
          top: pos.y !== undefined ? pos.y : 80,
          left: pos.x !== undefined ? pos.x : undefined,
          right: pos.x === undefined ? 20 : undefined,
          zIndex: 2147483647,
          width: 292,
          fontFamily: 'system-ui,-apple-system,sans-serif',
          background: '#0f172a',
          color: '#f1f5f9',
          borderRadius: 14,
          boxShadow: '0 24px 64px rgba(0,0,0,0.75)',
          border: '1px solid #1e293b',
          overflow: 'hidden',
          userSelect: dragging ? 'none' : 'auto',
        })}
      >
        {/* Header */}
        <div onMouseDown={onMouseDown} style={css({
          background: '#1e293b', padding: '9px 12px', cursor: dragging ? 'grabbing' : 'grab',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderBottom: '1px solid #0f172a',
        })}>
          <GripHorizontal size={15} color="#475569" />
          <span style={{ fontWeight: 800, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
            🎮 TASS Simulator
          </span>
          <span style={{ fontSize: 10, background: '#0f172a', padding: '2px 8px', borderRadius: 6, color: '#64748b' }}>
            Tick {tick}
          </span>
        </div>

        <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Listas detectadas */}
          <div style={css({ background: '#1e293b', borderRadius: 8, padding: '8px 10px' })}>
            <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700, marginBottom: 5, textTransform: 'uppercase' }}>
              Listas no Board
            </div>
            {listsFound.length > 0
              ? listsFound.map((n, i) => (
                <div key={i} style={{ fontSize: 11, color: '#4ade80', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <CheckCircle2 size={10} /> {n}
                </div>
              ))
              : <div style={{ fontSize: 11, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 5 }}>
                <CheckCircle2 size={10} /> Quadro em branco (0 listas). Pronto para injetar!
              </div>
            }
          </div>

          {/* Agentes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {agents.map(a => (
              <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#cbd5e1' }}>
                <span>{a.emoji} {a.name} <span style={{ color: '#475569', fontSize: 10 }}>{a.role}</span></span>
                <span style={{ color: a.color, display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: a.color, display: 'inline-block' }} />
                  {a.state}
                </span>
              </div>
            ))}
          </div>

          {/* Métricas */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
            {[
              { label: 'Risk', value: 'MEDIUM', color: '#facc15', icon: <AlertTriangle size={10} /> },
              { label: 'Morale', value: '82%', color: '#4ade80', icon: null },
            ].map(m => (
              <div key={m.label} style={css({ background: '#1e293b', borderRadius: 8, padding: '7px', textAlign: 'center' })}>
                <div style={{ fontSize: 10, color: '#64748b' }}>{m.label}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: m.color, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 3 }}>
                  {m.icon}{m.value}
                </div>
              </div>
            ))}
          </div>

          {/* Log */}
          {log.length > 0 && (
            <div ref={logRef} style={css({
              background: '#020617', borderRadius: 8, padding: '7px 9px',
              maxHeight: 90, overflowY: 'auto', fontSize: 10, color: '#94a3b8',
              fontFamily: 'monospace', display: 'flex', flexDirection: 'column', gap: 2,
            })}>
              {log.map((l, i) => <div key={i}>{l}</div>)}
            </div>
          )}

          {/* Botão Setup */}
          {!isRunning && (
            <button onClick={handleSetup} disabled={setupStatus === 'running'}
              style={css({
                width: '100%', padding: '9px 0', borderRadius: 8, border: '1px solid #334155',
                background: setupStatus === 'ok' ? '#14532d' : setupStatus === 'error' ? '#450a0a' : '#1e293b',
                color: setupStatus === 'ok' ? '#4ade80' : setupStatus === 'error' ? '#f87171' : '#94a3b8',
                fontSize: 12, fontWeight: 700, cursor: setupStatus === 'running' ? 'wait' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              })}>
              {setupStatus === 'idle'    && <><Box size={13} /> Injetar Cenário (6 listas + 8 cards)</>}
              {setupStatus === 'running' && <><Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> Injetando...</>}
              {setupStatus === 'ok'      && <><CheckCircle2 size={13} /> Cenário Pronto!</>}
              {setupStatus === 'error'   && <><AlertCircle size={13} /> Falhou — veja o console</>}
            </button>
          )}

          {/* Botão Simulação */}
          <button onClick={handleToggle} style={css({
            width: '100%', padding: '9px 0', borderRadius: 8, border: 'none',
            background: isRunning ? 'rgba(127,29,29,0.6)' : '#2563eb',
            color: isRunning ? '#fca5a5' : '#fff',
            fontSize: 12, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          })}>
            {isRunning ? <><Pause size={14} /> Pausar Simulação</> : <><Play size={14} /> Iniciar Simulação (IA)</>}
          </button>
        </div>

        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>

      {/* Modal de Decisão */}
      {question && (
        <div style={css({
          position: 'fixed', inset: 0, zIndex: 2147483646,
          background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        })}>
          <div style={css({
            background: '#0f172a', border: '1px solid #334155', borderRadius: 16,
            padding: 28, width: 440, boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
            fontFamily: 'system-ui,-apple-system,sans-serif', color: '#f1f5f9',
          })}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: '#60a5fa', fontWeight: 700, marginBottom: 4, textTransform: 'uppercase' }}>
                  <MessageSquare size={12} style={{ display: 'inline', marginRight: 5 }} />
                  Decisão Necessária — {question.agentName}
                </div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>{question.title}</h3>
              </div>
              <button onClick={() => handleAnswer('Ignorar')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {question.options.map((opt, i) => (
                <button key={i} onClick={() => handleAnswer(opt)} style={css({
                  padding: '12px 16px', borderRadius: 10, border: '1px solid #334155',
                  background: '#1e293b', color: '#f1f5f9', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s',
                })}
                  onMouseEnter={e => (e.currentTarget.style.background = '#2563eb')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#1e293b')}
                >
                  {String.fromCharCode(65 + i)}) {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}