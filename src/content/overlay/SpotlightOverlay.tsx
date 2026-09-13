import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

interface SpotlightProps {
  targetElement: HTMLElement | null;
  message: string;
  step: string;
  onNext?: () => void;
}

export function SpotlightOverlay({ targetElement, message, step, onNext }: SpotlightProps) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!targetElement) return;
    const updateRect = () => setRect(targetElement.getBoundingClientRect());
    updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);
    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [targetElement]);

  if (!rect) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      <div className="absolute inset-0 bg-black/60 transition-opacity" />
      <div 
        className="absolute border-4 border-blue-500 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] pointer-events-auto transition-all duration-300"
        style={{
          top: rect.top - 4,
          left: rect.left - 4,
          width: rect.width + 8,
          height: rect.height + 8
        }}
      >
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-slate-800 text-white p-4 rounded-lg shadow-xl w-64 border border-slate-700 pointer-events-auto">
          <div className="text-xs text-blue-400 font-bold mb-1">{step}</div>
          <p className="text-sm mb-4">{message}</p>
          {onNext && (
            <button onClick={onNext} className="bg-blue-600 hover:bg-blue-700 w-full py-2 rounded text-sm font-bold">
              Continuar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}