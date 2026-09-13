import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuração do Vite compatível com execução local e GitHub Pages
export default defineConfig({
  plugins: [react()],
  // Permite servir tanto na raiz (localhost) quanto em subdiretórios no GitHub Pages
  base: process.env.GITHUB_PAGES === 'true' ? './' : '/',
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
