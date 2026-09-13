import React, { useState, useRef, useEffect } from 'react';
import {
  ChatChannel,
  ChatMessage,
  ChannelId,
  ChatDilemmaOption,
} from '../types/chat';
import {
  Hash,
  Code2,
  HelpCircle,
  AlertOctagon,
  Send,
  Sparkles,
  Users,
  ChevronRight,
  ChevronLeft,
  X,
  Coffee,
  CheckCircle2,
  Shield,
  Zap,
  Info,
} from 'lucide-react';
import { parseWithGlossary } from '../utils/parseWithGlossary';
import { ThemeConfig } from '../data/themePresets';

interface TeamChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  channels: ChatChannel[];
  activeChannelId: ChannelId;
  onSelectChannel: (channelId: ChannelId) => void;
  messages: ChatMessage[];
  onSendMessage: (text: string, channelId: ChannelId) => void;
  onSelectDilemmaOption: (messageId: string, option: ChatDilemmaOption) => void;
  onTriggerNewDilemma: () => void;
  onTriggerCoffeeBreak: () => void;
  theme?: ThemeConfig;
}

export const TeamChatSidebar: React.FC<TeamChatSidebarProps> = ({
  isOpen,
  onClose,
  channels,
  activeChannelId,
  onSelectChannel,
  messages,
  onSendMessage,
  onSelectDilemmaOption,
  onTriggerNewDilemma,
  onTriggerCoffeeBreak,
  theme,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll para a última mensagem ao receber novidades
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChannelId]);

  if (!isOpen) return null;

  const currentChannel = channels.find((c) => c.id === activeChannelId) || channels[0];
  const channelMessages = messages.filter((m) => m.channelId === activeChannelId);

  const isLightTheme = theme?.id === 'classic-trello' || theme?.id === 'jira-enterprise';

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim(), activeChannelId);
    setInputText('');
  };

  const getChannelIcon = (name: string) => {
    switch (name) {
      case 'code':
        return <Code2 size={14} className={isLightTheme ? 'text-blue-600' : 'text-blue-400'} />;
      case 'help':
        return <HelpCircle size={14} className={isLightTheme ? 'text-amber-600' : 'text-amber-400'} />;
      case 'alert':
        return <AlertOctagon size={14} className="text-rose-500" />;
      default:
        return <Hash size={14} className={isLightTheme ? 'text-slate-500' : 'text-slate-400'} />;
    }
  };

  // Cores dinâmicas com fallback
  const asideBg = theme ? theme.chatAsideBg : 'bg-slate-900 border-l border-slate-800';
  const headerBg = theme ? theme.chatHeaderBg : 'bg-slate-950 border-b border-slate-800';
  const channelsBg = theme ? theme.chatChannelsBg : 'bg-slate-950/60 border-b border-slate-800/80';
  const channelActive = theme ? theme.chatChannelActive : 'bg-indigo-600 text-white shadow';
  const channelInactive = theme ? theme.chatChannelInactive : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60';
  const msgCardBg = theme ? theme.chatMsgBg : 'bg-slate-950/50 border-slate-800/80';
  const inputBg = theme ? theme.chatInputBg : 'bg-slate-900 border-slate-800 focus:border-indigo-500';
  const inputTextClass = theme ? theme.chatInputText : 'text-slate-200 placeholder-slate-500';
  const textPrimary = theme ? theme.chatTextPrimary : 'text-slate-200';
  const textSecondary = theme ? theme.chatTextSecondary : 'text-slate-400';

  return (
    <aside className={`w-96 flex-shrink-0 ${asideBg} flex flex-col h-full z-20 shadow-2xl transition-colors duration-200`}>
      {/* ─── Header estilo Teams / Slack ────────────────────────────────────── */}
      <div className={`${headerBg} px-4 py-3 flex items-center justify-between transition-colors duration-200`}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 font-bold text-sm shadow">
            💬
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black uppercase tracking-wider">
                Chat da Equipe
              </span>
              <span className="text-[10px] bg-white/10 px-1.5 py-0.2 rounded font-mono">
                Teams / Slack
              </span>
            </div>
            <p className={`text-[11px] ${isLightTheme ? 'text-white/80' : 'text-slate-400'}`}>
              Comunicação &amp; Decisões em Tempo Real
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          title="Recolher Chat"
        >
          <X size={18} />
        </button>
      </div>

      {/* ─── Canais de Comunicação ──────────────────────────────────────────── */}
      <div className={`${channelsBg} px-2 py-2 flex items-center gap-1 overflow-x-auto scrollbar-none transition-colors duration-200`}>
        {channels.map((channel) => {
          const isActive = channel.id === activeChannelId;
          return (
            <button
              key={channel.id}
              onClick={() => onSelectChannel(channel.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition relative ${
                isActive ? channelActive : channelInactive
              }`}
            >
              {getChannelIcon(channel.iconName)}
              <span>#{channel.name}</span>
              {channel.unreadCount > 0 && !isActive && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse ml-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* ─── Descrição do Canal Ativo & Ações Rápidas do Scrum Master ───────── */}
      <div className={`px-3 py-2 flex items-center justify-between text-[11px] border-b ${
        isLightTheme ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-slate-900/90 border-slate-800 text-slate-400'
      }`}>
        <div className="flex items-center gap-1.5 truncate mr-2">
          <Info size={12} className="flex-shrink-0 opacity-70" />
          <span className="truncate">{currentChannel.description}</span>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={onTriggerNewDilemma}
            className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition shadow-sm ${
              isLightTheme
                ? 'bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-900'
                : 'bg-amber-950/40 hover:bg-amber-900/60 border border-amber-600/50 text-amber-300'
            }`}
            title="Provocar um dilema ágil para você tomar decisões e ganhar XP"
          >
            <Zap size={11} className={isLightTheme ? 'text-amber-700' : 'text-amber-400'} /> Provocar Decisão
          </button>
          <button
            onClick={onTriggerCoffeeBreak}
            className={`p-1 rounded border transition ${
              isLightTheme
                ? 'bg-white hover:bg-slate-200 border-slate-300 text-slate-700'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
            }`}
            title="Pausa do Café Virtual"
          >
            <Coffee size={12} />
          </button>
        </div>
      </div>

      {/* ─── Feed de Mensagens ──────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3.5 scrollbar-thin scrollbar-thumb-slate-400/40">
        {channelMessages.length === 0 ? (
          <div className={`h-full flex flex-col items-center justify-center text-center p-6 ${textSecondary}`}>
            <Hash size={32} className="mb-2 opacity-50" />
            <p className="text-xs font-semibold">Nenhuma mensagem neste canal ainda.</p>
            <p className="text-[11px] mt-1 opacity-70">
              Envie uma mensagem ou inicie a simulação para o time começar a interagir!
            </p>
          </div>
        ) : (
          channelMessages.map((msg) => {
            const isUser = msg.isFromUser;
            const hasDilemma = msg.isScrumMasterDecision && msg.dilemmaOptions && msg.dilemmaOptions.length > 0;

            let cardBg = msgCardBg;
            if (hasDilemma && !msg.isResolved) {
              cardBg = isLightTheme
                ? 'bg-amber-50/90 border-amber-300 shadow-md ring-1 ring-amber-400/40'
                : 'bg-amber-950/20 border-amber-500/40 shadow-lg shadow-amber-950/30';
            } else if (isUser) {
              cardBg = isLightTheme
                ? 'bg-blue-50 border-blue-200 shadow-sm'
                : 'bg-indigo-950/30 border-indigo-500/30';
            }

            return (
              <div
                key={msg.id}
                className={`flex flex-col gap-1 rounded-xl p-3 border transition ${cardBg}`}
              >
                {/* Remetente & Horário */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{msg.senderAvatar}</span>
                    <span className={`text-xs font-bold ${textPrimary}`}>{msg.senderName}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                      isLightTheme ? 'bg-slate-200 text-slate-700' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {msg.senderRole}
                    </span>
                  </div>
                  <span className={`text-[10px] font-mono ${textSecondary}`}>{msg.timestamp}</span>
                </div>

                {/* Conteúdo da Mensagem */}
                <div className={`text-xs leading-relaxed pl-6 whitespace-pre-wrap ${textPrimary}`}>
                  {msg.taggedRole && (
                    <span className={`inline-flex items-center gap-1 font-bold px-1.5 py-0.5 rounded mr-1.5 border ${
                      isLightTheme
                        ? 'text-amber-800 bg-amber-100 border-amber-300'
                        : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                    }`}>
                      <Shield size={10} /> {msg.taggedRole}
                    </span>
                  )}
                  {parseWithGlossary(msg.content, msg.id)}
                </div>

                {/* ─── Bloco de Decisão do Scrum Master (Interativo) ─────────────── */}
                {hasDilemma && (
                  <div className={`mt-2.5 pl-6 border-t pt-2.5 ${isLightTheme ? 'border-slate-200' : 'border-slate-800/80'}`}>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Zap size={13} className="text-amber-500" />
                      <span className={`text-[11px] font-bold uppercase tracking-wider ${
                        isLightTheme ? 'text-amber-800' : 'text-amber-300'
                      }`}>
                        {msg.isResolved ? 'Decisão Tomada:' : 'Sua Decisão como Scrum Master:'}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {msg.dilemmaOptions?.map((opt) => {
                        const isChosen = msg.chosenOptionId === opt.id;
                        const isResolved = msg.isResolved;

                        let badgeColor = isLightTheme
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : 'bg-blue-500/20 text-blue-300 border-blue-500/30';
                        let badgeLabel = 'Liderança Servidora';

                        if (opt.approachType === 'PRAGMATIC_TRADEOFF') {
                          badgeColor = isLightTheme
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
                          badgeLabel = 'Trade-off Pragmático';
                        } else if (opt.approachType === 'ANTI_PATTERN_COMMAND') {
                          badgeColor = isLightTheme
                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/30';
                          badgeLabel = 'Anti-Padrão';
                        }

                        let buttonThemeClass = '';
                        if (isChosen) {
                          buttonThemeClass = isLightTheme
                            ? 'bg-blue-50 border-blue-500 shadow-md text-slate-900'
                            : 'bg-indigo-900/50 border-indigo-500 shadow-md text-white';
                        } else if (isResolved) {
                          buttonThemeClass = isLightTheme
                            ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-60'
                            : 'bg-slate-900/40 border-slate-800/40 text-slate-500 opacity-60';
                        } else {
                          buttonThemeClass = isLightTheme
                            ? 'bg-white hover:bg-slate-50 border-slate-300 hover:border-blue-500 text-slate-800 shadow-sm'
                            : 'bg-slate-900/80 hover:bg-slate-800 border-slate-700/70 hover:border-indigo-500 text-slate-200';
                        }

                        return (
                          <button
                            key={opt.id}
                            disabled={isResolved}
                            onClick={() => onSelectDilemmaOption(msg.id, opt)}
                            className={`w-full text-left p-2.5 rounded-lg border text-xs transition relative flex flex-col gap-1.5 ${buttonThemeClass}`}
                          >
                            <div className="flex items-center justify-between">
                              <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${badgeColor}`}>
                                {badgeLabel}
                              </span>
                              <span className="text-[10px] font-mono font-bold text-amber-500">
                                +{opt.xpReward} XP
                              </span>
                            </div>

                            <p className="text-[11px] font-medium leading-snug">
                              {parseWithGlossary(opt.label, opt.id + '_label')}
                            </p>

                            {isChosen && (
                              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                                <CheckCircle2 size={12} /> Decisão Aplicada ao Time!
                              </div>
                            )}

                            {/* Razão pedagógica visível APÓS escolher */}
                            {isChosen && opt.pedagogicalReason && (
                              <div className={`mt-1.5 rounded-lg p-2 text-[10px] leading-relaxed border ${
                                isLightTheme
                                  ? 'bg-blue-50/80 border-blue-200 text-blue-900'
                                  : 'bg-indigo-950/50 border-indigo-500/30 text-indigo-200'
                              }`}>
                                <span className="font-bold block mb-0.5">📚 Por que essa decisão?</span>
                                {parseWithGlossary(opt.pedagogicalReason, opt.id + '_reason')}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ─── Barra de Envio de Mensagem ─────────────────────────────────────── */}
      <form
        onSubmit={handleSend}
        className={`p-2.5 flex items-center gap-2 border-t transition-colors duration-200 ${
          isLightTheme ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'
        }`}
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Conversar em #${currentChannel.name} como Scrum Master...`}
            className={`w-full rounded-lg px-3 py-2 text-xs focus:outline-none transition border ${inputBg} ${inputTextClass}`}
          />
        </div>
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white transition shadow"
          title="Enviar Mensagem"
        >
          <Send size={14} />
        </button>
      </form>
    </aside>
  );
};
