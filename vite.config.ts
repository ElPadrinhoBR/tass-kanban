import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuração do Vite compatível com execução local e GitHub Pages
export default defineConfig({
  plugins: [react()],
  // Base relativa garante compatibilidade tanto em desenvolvimento local quanto em subpastas no GitHub Pages
  base: './',
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
