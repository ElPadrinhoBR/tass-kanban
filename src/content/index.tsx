import { createRoot } from 'react-dom/client';
import { useState, useEffect } from 'react';
import { SimulationOverlay } from './overlay/SimulationOverlay';

function applyCardColors() {
  try {
    const cardTitles = document.querySelectorAll<HTMLElement>(
      '[data-testid="card-name"], .list-card-title, a.list-card'
    );
    cardTitles.forEach(el => {
      const text = el.textContent || '';
      if (!text.includes('[TASS]')) return;

      const cardContainer = el.closest<HTMLElement>('[data-testid="trello-card"], .list-card, a.list-card');
      if (!cardContainer || !(cardContainer instanceof HTMLElement)) return;

      cardContainer.style.transition = 'border-left 0.2s ease, background-color 0.2s ease';

      if (text.includes('[FRONTEND]')) {
        cardContainer.style.borderLeft = '6px solid #10b981';
      } else if (text.includes('[BACKEND]')) {
        cardContainer.style.borderLeft = '6px solid #3b82f6';
      } else if (text.includes('[UI/UX]')) {
        cardContainer.style.borderLeft = '6px solid #8b5cf6';
      } else if (text.includes('[DATABASE]')) {
        cardContainer.style.borderLeft = '6px solid #f59e0b';
      } else if (text.includes('[SECURITY]')) {
        cardContainer.style.borderLeft = '6px solid #ef4444';
      } else if (text.includes('[API]')) {
        cardContainer.style.borderLeft = '6px solid #f97316';
      } else if (text.includes('[DEVOPS]')) {
        cardContainer.style.borderLeft = '6px solid #06b6d4';
      } else if (text.includes('[CLOUD]')) {
        cardContainer.style.borderLeft = '6px solid #6366f1';
      } else if (text.includes('BUG')) {
        cardContainer.style.borderLeft = '6px solid #dc2626';
        cardContainer.style.backgroundColor = 'rgba(220, 38, 38, 0.08)';
      }
    });
  } catch {
    // Ignora falhas de estilo não-críticas
  }
}

function App() {
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    // Aplica cores nos cards a cada 2 segundos
    applyCardColors();
    const interval = setInterval(applyCardColors, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SimulationOverlay
      isRunning={isRunning}
      onToggle={() => setIsRunning(prev => !prev)}
    />
  );
}

function mountTass() {
  try {
    if (document.getElementById('tass-extension-root')) return;

    const parent = document.body || document.documentElement;
    if (!parent) return;

    const host = document.createElement('div');
    host.id = 'tass-extension-root';
    host.style.cssText = 'position:fixed;top:0;left:0;width:0;height:0;z-index:2147483647;';
    parent.appendChild(host);

    const root = createRoot(host);
    root.render(<App />);
    console.log('[TASS] ✅ Painel do simulador montado com sucesso!');
  } catch (err) {
    console.error('[TASS] Erro ao montar painel:', err);
  }
}

// Monta imediatamente se DOM estiver pronto, ou aguarda com múltiplos fallbacks
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  mountTass();
} else {
  document.addEventListener('DOMContentLoaded', mountTass);
  window.addEventListener('load', mountTass);
}

// Garante que monta mesmo se eventos passarem despercebidos
setTimeout(mountTass, 500);
setTimeout(mountTass, 1500);
