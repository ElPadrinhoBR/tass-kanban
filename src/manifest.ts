import { defineManifest } from '@crxjs/vite-plugin';

export default defineManifest({
  manifest_version: 3,
  name: 'Trello Agile Software Simulator',
  short_name: 'TASS',
  description: 'Extens\u00E3o de navegador para treinamento, simula\u00E7\u00E3o e gamifica\u00E7\u00E3o de Gest\u00E3o de TI dentro do Trello',
  version: '1.0.0',
  permissions: ['storage', 'activeTab', 'scripting'],
  host_permissions: ['*://trello.com/*'],
  icons: {
    '16': 'icons/icon16.png',
    '32': 'icons/icon32.png',
    '48': 'icons/icon48.png',
    '128': 'icons/icon128.png',
  },
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['*://trello.com/*'],
      js: ['src/content/index.tsx'],
    },
  ],
  action: {
    default_popup: 'src/popup/index.html',
    default_title: 'TASS Dashboard',
    default_icon: {
      '16': 'icons/icon16.png',
      '32': 'icons/icon32.png',
      '48': 'icons/icon48.png',
      '128': 'icons/icon128.png',
    },
  },
  options_page: 'src/options/index.html',
});
