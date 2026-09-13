// Web Worker inline para garantir que o timer NUNCA congele mesmo com a aba em segundo plano
export class BackgroundTimer {
  private worker: Worker | null = null;
  private onTickCallback: () => void;

  constructor(onTick: () => void) {
    this.onTickCallback = onTick;
  }

  start(intervalMs: number) {
    this.stop();

    // Cria um Web Worker inline via Blob para escapar do throttling de abas inativas do Chrome
    const workerCode = `
      let intervalId = null;
      self.onmessage = function(e) {
        if (e.data.action === 'start') {
          if (intervalId) clearInterval(intervalId);
          intervalId = setInterval(function() {
            self.postMessage('tick');
          }, e.data.interval);
        } else if (e.data.action === 'stop') {
          if (intervalId) clearInterval(intervalId);
          intervalId = null;
        }
      };
    `;

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    this.worker = new Worker(workerUrl);

    this.worker.onmessage = (e) => {
      if (e.data === 'tick') {
        this.onTickCallback();
      }
    };

    this.worker.postMessage({ action: 'start', interval: intervalMs });
  }

  updateInterval(intervalMs: number) {
    if (this.worker) {
      this.worker.postMessage({ action: 'start', interval: intervalMs });
    }
  }

  stop() {
    if (this.worker) {
      this.worker.postMessage({ action: 'stop' });
      this.worker.terminate();
      this.worker = null;
    }
  }
}
