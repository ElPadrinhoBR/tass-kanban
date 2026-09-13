export type ThemeId =
  | 'classic-trello'
  | 'jira-enterprise'
  | 'linear-clean'
  | 'nordic-frost'
  | 'midnight-pro';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  subtitle: string;
  previewColors: string[]; // 3 cores para visualização no seletor
  bgApp: string;           // Fundo da aplicação
  bgNavbar: string;        // Barra superior
  borderNavbar: string;    // Borda da barra superior
  bgSubbar: string;        // Sub-barra de métricas
  bgBoard: string;         // Fundo da área do quadro
  columnBg: string;        // Fundo das colunas
  columnBorder: string;    // Borda das colunas
  cardBg: string;          // Fundo dos cartões
  cardBorder: string;      // Borda dos cartões
  textColor: string;       // Cor principal do texto
  textMuted: string;       // Cor de texto secundário
  accentColor: string;     // Cor de destaque (botão ativo, etc.)
  
  // Customização Completa do Chat Teams / Slack
  chatAsideBg: string;      // Fundo principal da sidebar do chat
  chatHeaderBg: string;     // Header do chat
  chatChannelsBg: string;   // Barra de canais
  chatChannelActive: string;// Canal ativo
  chatChannelInactive: string; // Canal inativo
  chatMsgBg: string;        // Fundo das mensagens normais
  chatMsgBorder: string;    // Borda das mensagens
  chatInputBg: string;      // Campo de texto de mensagem
  chatInputText: string;    // Cor do texto do input
  chatInputBorder: string;  // Borda do input
  chatTextPrimary: string;  // Cor primária do texto no chat
  chatTextSecondary: string;// Cor secundária do texto no chat
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  'classic-trello': {
    id: 'classic-trello',
    name: 'Atlassian Blue (Estilo Trello)',
    subtitle: 'O clássico visual azul royal do Trello tradicional de produtividade.',
    previewColors: ['#0079bf', '#026aa7', '#ebecf0'],
    bgApp: 'bg-[#0079bf]',
    bgNavbar: 'bg-[#026aa7]',
    borderNavbar: 'border-[#005a8e]',
    bgSubbar: 'bg-[#025b90]/90 border-[#005a8e]',
    bgBoard: 'bg-[#0079bf]',
    columnBg: 'bg-[#ebecf0]/95',
    columnBorder: 'border-slate-300',
    cardBg: 'bg-white',
    cardBorder: 'border-slate-200',
    textColor: 'text-slate-900',
    textMuted: 'text-slate-600',
    accentColor: 'bg-blue-600',

    // Chat estilo Trello / Atlassian Clean
    chatAsideBg: 'bg-[#f4f5f7] border-l border-slate-300',
    chatHeaderBg: 'bg-[#026aa7] text-white border-b border-[#005a8e]',
    chatChannelsBg: 'bg-[#ebecf0] border-b border-slate-300',
    chatChannelActive: 'bg-[#0079bf] text-white shadow-sm',
    chatChannelInactive: 'text-slate-700 hover:bg-slate-200/80',
    chatMsgBg: 'bg-white border-slate-200 shadow-sm',
    chatMsgBorder: 'border-slate-200',
    chatInputBg: 'bg-white border-slate-300 focus:border-blue-600',
    chatInputText: 'text-slate-900 placeholder-slate-400',
    chatInputBorder: 'border-slate-300',
    chatTextPrimary: 'text-slate-800',
    chatTextSecondary: 'text-slate-500',
  },
  'jira-enterprise': {
    id: 'jira-enterprise',
    name: 'Jira Software Clean',
    subtitle: 'Visual corporativo sóbrio, limpo e profissional de engenharia corporativa.',
    previewColors: ['#0747a6', '#f4f5f7', '#ffffff'],
    bgApp: 'bg-[#f4f5f7]',
    bgNavbar: 'bg-[#0747a6]',
    borderNavbar: 'border-[#003884]',
    bgSubbar: 'bg-white border-slate-200 shadow-sm',
    bgBoard: 'bg-[#f4f5f7]',
    columnBg: 'bg-[#ebecf0]',
    columnBorder: 'border-slate-300/80',
    cardBg: 'bg-white',
    cardBorder: 'border-slate-200 shadow-sm',
    textColor: 'text-slate-800',
    textMuted: 'text-slate-500',
    accentColor: 'bg-blue-700',

    // Chat estilo Jira Software
    chatAsideBg: 'bg-[#fafbfc] border-l border-slate-200',
    chatHeaderBg: 'bg-[#0747a6] text-white border-b border-[#003884]',
    chatChannelsBg: 'bg-[#ebecf0] border-b border-slate-300',
    chatChannelActive: 'bg-[#0052cc] text-white shadow-sm',
    chatChannelInactive: 'text-slate-600 hover:bg-slate-200',
    chatMsgBg: 'bg-white border-slate-200 shadow-sm',
    chatMsgBorder: 'border-slate-200',
    chatInputBg: 'bg-white border-slate-300 focus:border-blue-600',
    chatInputText: 'text-slate-900 placeholder-slate-400',
    chatInputBorder: 'border-slate-300',
    chatTextPrimary: 'text-slate-900',
    chatTextSecondary: 'text-slate-500',
  },
  'linear-clean': {
    id: 'linear-clean',
    name: 'Linear Dark Minimalist',
    subtitle: 'Interface escura moderna, elegante, sem excesso de neon ou saturação.',
    previewColors: ['#121316', '#5e6ad2', '#222326'],
    bgApp: 'bg-[#121316]',
    bgNavbar: 'bg-[#18191c]',
    borderNavbar: 'border-neutral-800',
    bgSubbar: 'bg-[#151619] border-neutral-800/80',
    bgBoard: 'bg-[#121316]',
    columnBg: 'bg-[#1c1d21]/90',
    columnBorder: 'border-neutral-800',
    cardBg: 'bg-[#222328]',
    cardBorder: 'border-neutral-700/60',
    textColor: 'text-neutral-100',
    textMuted: 'text-neutral-400',
    accentColor: 'bg-indigo-600',

    // Chat estilo Linear Dark
    chatAsideBg: 'bg-[#16171b] border-l border-neutral-800',
    chatHeaderBg: 'bg-[#18191c] text-neutral-100 border-b border-neutral-800',
    chatChannelsBg: 'bg-[#141518] border-b border-neutral-800/80',
    chatChannelActive: 'bg-[#5e6ad2] text-white shadow-sm',
    chatChannelInactive: 'text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200',
    chatMsgBg: 'bg-[#1f2025] border-neutral-800/80',
    chatMsgBorder: 'border-neutral-800',
    chatInputBg: 'bg-[#1c1d21] border-neutral-800 focus:border-[#5e6ad2]',
    chatInputText: 'text-neutral-100 placeholder-neutral-500',
    chatInputBorder: 'border-neutral-800',
    chatTextPrimary: 'text-neutral-100',
    chatTextSecondary: 'text-neutral-400',
  },
  'nordic-frost': {
    id: 'nordic-frost',
    name: 'Nordic Slate & Ice',
    subtitle: 'Tons de ardósia ártica fria, refinados e confortáveis para longas sessões.',
    previewColors: ['#2e3440', '#88c0d0', '#4c566a'],
    bgApp: 'bg-[#2e3440]',
    bgNavbar: 'bg-[#242933]',
    borderNavbar: 'border-[#3b4252]',
    bgSubbar: 'bg-[#2b303c] border-[#3b4252]',
    bgBoard: 'bg-[#2e3440]',
    columnBg: 'bg-[#3b4252]/90',
    columnBorder: 'border-[#434c5e]',
    cardBg: 'bg-[#434c5e]',
    cardBorder: 'border-[#4c566a]',
    textColor: 'text-[#eceff4]',
    textMuted: 'text-[#d8dee9]',
    accentColor: 'bg-[#88c0d0]',

    // Chat estilo Nordic Slate
    chatAsideBg: 'bg-[#242933] border-l border-[#3b4252]',
    chatHeaderBg: 'bg-[#1f232a] text-[#eceff4] border-b border-[#3b4252]',
    chatChannelsBg: 'bg-[#2b303c] border-b border-[#3b4252]',
    chatChannelActive: 'bg-[#4c566a] text-[#88c0d0] border border-[#88c0d0]/40 shadow-sm',
    chatChannelInactive: 'text-[#d8dee9] hover:bg-[#3b4252]',
    chatMsgBg: 'bg-[#2e3440] border-[#3b4252]',
    chatMsgBorder: 'border-[#3b4252]',
    chatInputBg: 'bg-[#2e3440] border-[#434c5e] focus:border-[#88c0d0]',
    chatInputText: 'text-[#eceff4] placeholder-[#4c566a]',
    chatInputBorder: 'border-[#434c5e]',
    chatTextPrimary: 'text-[#eceff4]',
    chatTextSecondary: 'text-[#d8dee9]',
  },
  'midnight-pro': {
    id: 'midnight-pro',
    name: 'Midnight Pro (Original)',
    subtitle: 'Tema escuro focado em contraste alto para visualização rápida de status.',
    previewColors: ['#020617', '#3b82f6', '#0f172a'],
    bgApp: 'bg-slate-950',
    bgNavbar: 'bg-slate-900',
    borderNavbar: 'border-slate-800',
    bgSubbar: 'bg-slate-900/60 border-slate-800/80',
    bgBoard: 'bg-slate-950',
    columnBg: 'bg-slate-900/90',
    columnBorder: 'border-slate-800',
    cardBg: 'bg-slate-800/90',
    cardBorder: 'border-slate-700/60',
    textColor: 'text-slate-100',
    textMuted: 'text-slate-400',
    accentColor: 'bg-blue-600',

    // Chat estilo Midnight Pro
    chatAsideBg: 'bg-slate-900 border-l border-slate-800',
    chatHeaderBg: 'bg-slate-950 border-b border-slate-800',
    chatChannelsBg: 'bg-slate-950/60 border-b border-slate-800/80',
    chatChannelActive: 'bg-indigo-600 text-white shadow',
    chatChannelInactive: 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60',
    chatMsgBg: 'bg-slate-950/50 border-slate-800/80',
    chatMsgBorder: 'border-slate-800/80',
    chatInputBg: 'bg-slate-900 border-slate-800 focus:border-indigo-500',
    chatInputText: 'text-slate-200 placeholder-slate-500',
    chatInputBorder: 'border-slate-800',
    chatTextPrimary: 'text-slate-200',
    chatTextSecondary: 'text-slate-400',
  },
};
