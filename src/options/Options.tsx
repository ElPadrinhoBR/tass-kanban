import { useState, useEffect } from 'react';
import '../styles/globals.css';

export function Options() {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get(['geminiApiKey'], (result: Record<string, string>) => {
      if (result.geminiApiKey) setApiKey(result.geminiApiKey);
    });
  }, []);

  const handleSave = () => {
    chrome.storage.sync.set({ geminiApiKey: apiKey }, () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  };

  const handleReset = () => {
    if (confirm('Apagar todos os dados locais do TASS? Esta ação não pode ser desfeita.')) {
      chrome.storage.sync.clear();
      indexedDB.deleteDatabase('TassDB');
      alert('Dados resetados. Recarregue o Trello.');
    }
  };

  return (
    <div style={{
      maxWidth: 600, margin: '0 auto', padding: '40px 24px',
      fontFamily: 'system-ui, sans-serif', background: '#0f172a',
      minHeight: '100vh', color: '#f1f5f9',
    }}>
      <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>⚙️ Configurações do TASS</h1>
      <p style={{ color: '#64748b', marginBottom: 32 }}>Trello Agile Software Simulator</p>

      {/* Gemini API */}
      <div style={{
        background: '#1e293b', borderRadius: 12, padding: 24, marginBottom: 20,
        border: '1px solid #334155',
      }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#60a5fa', marginBottom: 8 }}>
          🤖 Gemini AI — Controle dos Bots
        </h2>
        <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 16 }}>
          Os agentes virtuais usam Gemini AI para tomar decisões autônomas sobre movimentação de cards,
          criação de bugs e geração de eventos realistas. Cole sua chave da API do Google AI Studio abaixo.
        </p>
        <label style={{ fontSize: 12, color: '#64748b', fontWeight: 700, display: 'block', marginBottom: 6 }}>
          GEMINI_API_KEY
        </label>
        <input
          type="password"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          placeholder="AIza..."
          style={{
            width: '100%', padding: '10px 12px', borderRadius: 8,
            background: '#0f172a', border: '1px solid #334155',
            color: '#f1f5f9', fontSize: 14, boxSizing: 'border-box', marginBottom: 12,
          }}
        />
        <button onClick={handleSave} style={{
          padding: '10px 24px', borderRadius: 8, border: 'none',
          background: saved ? '#14532d' : '#2563eb', color: '#fff',
          fontSize: 13, fontWeight: 700, cursor: 'pointer',
        }}>
          {saved ? '✅ Salvo!' : 'Salvar API Key'}
        </button>
        <p style={{ fontSize: 11, color: '#475569', marginTop: 10 }}>
          A chave é armazenada localmente via chrome.storage.sync. Nunca é enviada para servidores externos.
          Obtenha sua chave em: <a href="https://aistudio.google.com/apikey" target="_blank" style={{ color: '#60a5fa' }}>aistudio.google.com</a>
        </p>
      </div>

      {/* Integração Trello */}
      <div style={{
        background: '#1e293b', borderRadius: 12, padding: 24, marginBottom: 20,
        border: '1px solid #334155',
      }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#a78bfa', marginBottom: 8 }}>
          🟦 Integração Trello
        </h2>
        <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 12 }}>
          A extensão manipula diretamente o DOM do Trello para criar listas, cards e mover tarefas.
          Nenhuma credencial do Trello é necessária no modo DOM padrão.
        </p>
        <div style={{ fontSize: 12, color: '#4ade80', display: 'flex', alignItems: 'center', gap: 6 }}>
          ✅ Modo DOM ativo — sem necessidade de API Key do Trello
        </div>
      </div>

      {/* Zona de perigo */}
      <div style={{
        background: '#1e293b', borderRadius: 12, padding: 24,
        border: '1px solid #7f1d1d',
      }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f87171', marginBottom: 8 }}>
          🗑️ Zona de Perigo
        </h2>
        <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 16 }}>
          Apaga todo o progresso do tutorial, campanhas e histórico de simulações armazenado localmente.
        </p>
        <button onClick={handleReset} style={{
          padding: '10px 24px', borderRadius: 8,
          border: '1px solid #7f1d1d', background: 'rgba(127,29,29,0.3)',
          color: '#f87171', fontSize: 13, fontWeight: 700, cursor: 'pointer',
        }}>
          Resetar Todos os Dados Locais
        </button>
      </div>
    </div>
  );
}
