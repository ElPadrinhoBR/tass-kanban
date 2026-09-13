/**
 * @file App.tsx
 * @description Orquestrador central do simulador TASS Kanban.
 * Gerencia o ciclo de vida da simulação ágil, eventos do quadro Kanban,
 * chat corporativo da equipe, progressão gamificada de carreira do Scrum Master
 * e propagação de temas visuais corporativos.
 *
 * @author TASS Engineering Team
 * @license MIT
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  KanbanCard,
  KanbanColumn,
  AgentMember,
  CardCategory,
  DailyReport,
  ManagerQuestion,
} from './types/kanban';
import { INITIAL_COLUMNS, INITIAL_AGENTS, SCENARIO_DELIVERY_APP_CARDS } from './data/initialData';
import { KanbanColumnItem } from './components/KanbanColumnItem';
import { DailyScrumModal } from './components/DailyScrumModal';
import { AuditLogModal } from './components/AuditLogModal';
import { SettingsModal } from './components/SettingsModal';
import { DecisionFeedbackModal, DecisionFeedbackData } from './components/DecisionFeedbackModal';
import { AgileHandbookModal } from './components/AgileHandbookModal';
import { ScrumMasterProfileModal } from './components/ScrumMasterProfileModal';
import { ScrumMasterProgressionManager } from './gamification/ScrumMasterProgression';
import { SimulationMemory } from './simulation/SimulationMemory';
import { GeminiBrain } from './simulation/GeminiBrain';
import { BackgroundTimer } from './simulation/realtimeClock';
import {
  Play,
  Pause,
  Clock,
  Zap,
  Sliders,
  FileText,
  AlertTriangle,
  Smile,
  Sparkles,
  Bot,
  Users,
  StepForward,
  BookOpen,
  Award,
  GraduationCap,
  MessageSquare,
} from 'lucide-react';
import { ChannelId, ChatChannel, ChatMessage, ChatDilemmaOption, BoardEffect } from './types/chat';
import {
  INITIAL_CHANNELS,
  INITIAL_CHAT_MESSAGES,
  CHAT_DILEMMAS_POOL,
  TEAM_CASUAL_MESSAGES,
} from './data/teamChatPresets';
import { TeamChatSidebar } from './components/TeamChatSidebar';
import { SprintCompleteModal } from './components/SprintCompleteModal';
import { WelcomeIntroModal } from './components/WelcomeIntroModal';
import { ThemeId, THEMES } from './data/themePresets';
import { useLanguageStore } from './i18n/useLanguage';
import { LANGUAGE_OPTIONS } from './i18n/index';

const memory = new SimulationMemory();
const brain = new GeminiBrain();
const smManager = new ScrumMasterProgressionManager();

const STORAGE_CARDS_KEY = 'tass_kanban_cards_v2';

export const App: React.FC = () => {
  // Estado do Quadro
  const [columns] = useState<KanbanColumn[]>(INITIAL_COLUMNS);
  const [cards, setCards] = useState<KanbanCard[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CARDS_KEY);
      return saved ? JSON.parse(saved) : SCENARIO_DELIVERY_APP_CARDS;
    } catch {
      return SCENARIO_DELIVERY_APP_CARDS;
    }
  });

  // Estado dos Agentes
  const [agents, setAgents] = useState<AgentMember[]>(INITIAL_AGENTS);

  // Gamificação do Scrum Master
  const [smXp, setSmXp] = useState<number>(() => smManager.getXp());
  const [smDecisionsCount, setSmDecisionsCount] = useState<number>(() => smManager.getDecisionsCount());
  const [smAchievements, setSmAchievements] = useState(() => smManager.getAchievements());
  const currentSmLevel = smManager.getCurrentLevel();
  const nextSmLevel = smManager.getNextLevel();

  // Modos de Simulação
  const [mode, setMode] = useState<'MODE_1_TURBO' | 'MODE_2_REALTIME'>('MODE_1_TURBO');
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState<number>(1); // 1x, 2x, 5x, 10x
  const [tick, setTick] = useState<number>(() => memory.getLastTick());
  const [sprint, setSprint] = useState<number>(() => memory.getLastSprint());

  // Métricas do Projeto
  const [morale, setMorale] = useState<number>(85);
  const [risk, setRisk] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [velocity, setVelocity] = useState<number>(24);

  // Relógio do Modo 2 (Tempo Real)
  const [simulatedHour, setSimulatedHour] = useState<string>('09:00');
  const [dailyModalOpen, setDailyModalOpen] = useState(false);
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([]);
  const [currentDilemma, setCurrentDilemma] = useState<ManagerQuestion | null>(null);

  // Modais de Apoio e Aprendizado
  const [welcomeModalOpen, setWelcomeModalOpen] = useState<boolean>(() => {
    try {
      const seen = localStorage.getItem('tass_intro_seen_v1');
      return seen !== 'true'; // Se ainda não viu, abre a tela de abertura
    } catch {
      return true;
    }
  });
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [handbookModalOpen, setHandbookModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackData, setFeedbackData] = useState<DecisionFeedbackData | null>(null);
  const [aiStatus, setAiStatus] = useState<string>('Pronto para iniciar');

  // Tema Visual Selecionado
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(() => {
    try {
      const savedTheme = localStorage.getItem('tass_theme_v1');
      return (savedTheme as ThemeId) || 'classic-trello';
    } catch {
      return 'classic-trello';
    }
  });

  const activeTheme = THEMES[currentTheme] || THEMES['classic-trello'];

  // Internacionalização (PT / EN / ES)
  const { lang, t, setLang } = useLanguageStore();

  useEffect(() => {
    try {
      localStorage.setItem('tass_theme_v1', currentTheme);
    } catch {
      // ignore
    }
  }, [currentTheme]);

  // Drag and drop temporário
  const draggedCardIdRef = useRef<string | null>(null);
  const timerRef = useRef<BackgroundTimer | null>(null);

  // Estado do Chat de Equipe (Teams/Slack)
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [chatChannels, setChatChannels] = useState<ChatChannel[]>(INITIAL_CHANNELS);
  const [activeChannelId, setActiveChannelId] = useState<ChannelId>('duvidas-scrum-master');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('tass_chat_messages_v3');
      return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
    } catch {
      return INITIAL_CHAT_MESSAGES;
    }
  });

  // Controle de Dilemas Usados (Para NUNCA repetir perguntas)
  const [usedDilemmaIds, setUsedDilemmaIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tass_used_dilemmas_v2');
      return saved ? JSON.parse(saved) : ['msg_init_dilemma_1'];
    } catch {
      return ['msg_init_dilemma_1'];
    }
  });

  // Salva cards no localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_CARDS_KEY, JSON.stringify(cards));
  }, [cards]);

  // Salva mensagens do chat no localStorage
  useEffect(() => {
    localStorage.setItem('tass_chat_messages_v3', JSON.stringify(chatMessages));
  }, [chatMessages]);

  // Salva dilemas usados no localStorage
  useEffect(() => {
    localStorage.setItem('tass_used_dilemmas_v2', JSON.stringify(usedDilemmaIds));
  }, [usedDilemmaIds]);

  // Modal de Conclusão do Projeto / Sprint
  const [sprintCompleteOpen, setSprintCompleteOpen] = useState(false);
  const [sprintCompleteShown, setSprintCompleteShown] = useState(false);

  // Detecta quando TODOS os cards chegam em DONE → dispara evento especial
  useEffect(() => {
    const totalNonEmpty = cards.length;
    const done = cards.filter((c) => c.status === 'DONE').length;
    if (totalNonEmpty > 0 && done === totalNonEmpty && !sprintCompleteShown) {
      setIsRunning(false);
      setSprintCompleteShown(true);

      // Mensagens de celebração da equipe no chat antes de abrir o modal
      const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const celebrations: ChatMessage[] = [
        { id: 'cel_1_' + Date.now(), channelId: 'geral', senderName: 'Ana Oliveira', senderRole: 'Product Owner', senderAvatar: '👩‍💼', content: '🎉🎉🎉 TODOS os cards no DONE! Sprint Goal 100% atingida! Os clientes vão adorar esse incremento!', timestamp: ts },
        { id: 'cel_2_' + Date.now(), channelId: 'geral', senderName: 'Carlos Silva', senderRole: 'Full-Stack Dev', senderAvatar: '👨‍💻', content: 'QUE SPRINT ÉPICA! Zero regressões em produção! Valeu @Scrum Master pela liderança! 🚀', timestamp: ts },
        { id: 'cel_3_' + Date.now(), channelId: 'geral', senderName: 'Marcos Souza', senderRole: 'Tech Lead', senderAvatar: '👨‍🏫', content: 'Código limpo, testes passando, arquitetura sólida. O DoD foi respeitado do início ao fim! 💪', timestamp: ts },
        { id: 'cel_4_' + Date.now(), channelId: 'geral', senderName: 'Júlia Mendes', senderRole: 'QA Specialist', senderAvatar: '👩‍🔬', content: 'Homologação aprovada em todos os cenários! Retrospectiva vai ser breve e positiva 😄🧪', timestamp: ts },
      ];
      setChatMessages((prev) => [...prev, ...celebrations]);
      setActiveChannelId('geral');
      setIsChatOpen(true);
      setAiStatus('🏆 SPRINT CONCLUÍDA! Todos os cards entregues com sucesso!');

      setTimeout(() => setSprintCompleteOpen(true), 1200);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards, sprintCompleteShown]);

  // Helper para calcular intervalo em ms baseado no modo e velocidade
  const getIntervalMs = useCallback(() => {
    if (mode === 'MODE_1_TURBO') {
      return Math.round(3000 / speed);
    } else {
      return 4000;
    }
  }, [mode, speed]);

  // ─── Aplicação Direta das Decisões do Scrum Master no Quadro Kanban ───────
  const applyBoardEffect = useCallback((effect?: BoardEffect) => {
    if (!effect) return;

    setCards((prevCards) => {
      let updated = [...prevCards];

      if (effect.type === 'CREATE_CARD' && effect.newCard) {
        const createdCard: KanbanCard = {
          id: 'card_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          title: effect.newCard.title,
          description: effect.newCard.description,
          category: effect.newCard.category,
          color: effect.newCard.color,
          status: effect.newCard.status,
          storyPoints: effect.newCard.storyPoints,
          assignedTo: effect.newCard.assignedTo,
          createdAt: new Date().toISOString(),
        };
        updated = [createdCard, ...updated];
      } else if (effect.type === 'MOVE_CARDS' && effect.fromColumn && effect.toColumn) {
        const countToMove = effect.count || 1;
        let movedCount = 0;
        updated = updated.map((card) => {
          if (card.status === effect.fromColumn && movedCount < countToMove) {
            movedCount++;
            return {
              ...card,
              status: effect.toColumn!,
              title: effect.tagToAdd ? `${card.title} ${effect.tagToAdd}` : card.title,
              completedAt: effect.toColumn === 'DONE' ? new Date().toISOString() : card.completedAt,
            };
          }
          return card;
        });
      } else if (effect.type === 'SPLIT_CARD' && effect.newCards) {
        const targetStatus = effect.splitTargetStatus || 'CODE REVIEW';
        const targetIndex = updated.findIndex((c) => c.status === targetStatus);
        if (targetIndex !== -1) {
          updated.splice(targetIndex, 1);
        }
        const splitCards: KanbanCard[] = effect.newCards.map((nc, idx) => ({
          id: 'split_' + Date.now() + '_' + idx,
          title: nc.title,
          description: nc.description,
          category: nc.category,
          color: nc.color,
          status: nc.status,
          storyPoints: nc.storyPoints,
          createdAt: new Date().toISOString(),
        }));
        updated = [...splitCards, ...updated];
      } else if (effect.type === 'TRADE_OFF_SWAP' && effect.swapIn) {
        const inCard: KanbanCard = {
          id: 'swap_in_' + Date.now(),
          title: effect.swapIn.title,
          description: effect.swapIn.description,
          category: effect.swapIn.category,
          color: effect.swapIn.color,
          status: effect.swapIn.status,
          storyPoints: effect.swapIn.storyPoints,
          createdAt: new Date().toISOString(),
        };
        let swappedOut = false;
        updated = updated.map((card) => {
          if (!swappedOut && card.status === (effect.swapOutFromStatus || 'TODO')) {
            swappedOut = true;
            return {
              ...card,
              status: effect.swapOutToStatus || 'BACKLOG',
              title: `${card.title} (Despriorizado)`,
            };
          }
          return card;
        });
        updated = [inCard, ...updated];
      } else if (effect.type === 'ADD_TAG_OR_RENAME' && effect.tagToAdd) {
        let tagged = false;
        updated = updated.map((card) => {
          if (!tagged && (card.status === 'EM DESENVOLVIMENTO' || card.status === 'CODE REVIEW' || card.status === 'QA')) {
            tagged = true;
            return {
              ...card,
              title: `${card.title} ${effect.tagToAdd}`,
            };
          }
          return card;
        });
      }

      return updated;
    });

    setAiStatus(`🎯 Decisão aplicada ao quadro Kanban: ${effect.description}`);
  }, []);

  // ─── Execução de 1 Passo da Simulação (Modo 1 ou Modo 2) ──────────────────
  const executeSimulationStep = useCallback(async () => {
    // 0. CHECAGEM DE TELA DE FEEDBACK PEDAGÓGICO: Os bots param e aguardam o usuário ler e sair da tela
    if (feedbackModalOpen) {
      setIsRunning(false);
      return;
    }

    // 1. CHECAGEM CRÍTICA: Se houver qualquer dúvida ou bloqueio pendente, o time PARA e aguarda!
    const hasPendingDecision = chatMessages.some(
      (m) => m.isScrumMasterDecision && !m.isResolved
    );

    if (hasPendingDecision) {
      setIsRunning(false);
      setAgents((prev) => prev.map((a) => ({ ...a, status: 'Blocked' })));
      setAiStatus('⏸️ TIME BLOQUEADO: Responda à dúvida no Chat (#duvidas-scrum-master) para o time andar!');
      return;
    }

    setTick((prev) => {
      const nextTick = prev + 1;

      // Seleciona o agente da vez de forma rotativa
      const agentIndex = (nextTick - 1) % agents.length;
      const currentAgent = agents[agentIndex];

      setAiStatus(`🤖 ${currentAgent.name} pensando...`);

      // Atualiza status visual do agente
      setAgents((prevAgents) =>
        prevAgents.map((a, idx) => ({
          ...a,
          status: idx === agentIndex ? 'Working' : 'Idle',
        }))
      );

      // Consulta IA com memória persistente
      brain
        .decideAgentStep(currentAgent, cards, memory, sprint, nextTick)
        .then((decision) => {
          const currentTimestamp =
            mode === 'MODE_2_REALTIME'
              ? simulatedHour
              : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          if (decision.action === 'MOVE_CARD' && decision.cardId && decision.toColumn) {
            setCards((prevCards) => {
              const updated = prevCards.map((c) =>
                c.id === decision.cardId
                  ? { ...c, status: decision.toColumn!, assignedTo: currentAgent.name }
                  : c
              );
              return updated;
            });

            // Registra no arquivo de log da memória anti-alucinação
            memory.addEntry({
              tick: nextTick,
              sprint,
              agentName: currentAgent.name,
              action: 'MOVE_CARD',
              cardTitle: decision.cardTitle,
              fromColumn: decision.fromColumn,
              toColumn: decision.toColumn,
              reason: decision.reason,
            });

            // Envia mensagem no chat da equipe no estilo Slack/Teams
            let targetChannel: ChannelId = 'desenvolvimento';
            let chatText = '';
            if (decision.toColumn === 'EM DESENVOLVIMENTO') {
              chatText = `Puxei o card "${decision.cardTitle}" para desenvolvimento. Mãos à obra! 🛠️`;
            } else if (decision.toColumn === 'CODE REVIEW') {
              chatText = `PR aberto para "${decision.cardTitle}". @Marcos pode dar uma olhada no código quando puder? 👀`;
            } else if (decision.toColumn === 'QA') {
              chatText = `Build gerado com sucesso! Card "${decision.cardTitle}" pronto para homologação em Staging. @Júlia tá contigo! 🧪`;
            } else if (decision.toColumn === 'DONE') {
              targetChannel = 'geral';
              chatText = `🎉 Card "${decision.cardTitle}" homologado e concluído! Mais um incremento pronto para entrega! 🚀`;
            } else {
              chatText = `Movi o card "${decision.cardTitle}" para ${decision.toColumn}. Motivo: ${decision.reason}`;
            }

            const agentChatMsg: ChatMessage = {
              id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
              channelId: targetChannel,
              senderName: currentAgent.name,
              senderRole: currentAgent.role,
              senderAvatar: currentAgent.avatar,
              content: chatText,
              timestamp: currentTimestamp,
            };
            setChatMessages((prev) => [...prev, agentChatMsg]);

            // Conquista: WIP controlado
            const inDevCount = cards.filter((c) => c.status === 'EM DESENVOLVIMENTO').length;
            if (inDevCount <= 3) {
              const ach = smManager.unlockAchievement('wip_guardian');
              if (ach) {
                setSmXp(smManager.getXp());
                setSmAchievements(smManager.getAchievements());
              }
            }

            setAiStatus(`✅ ${currentAgent.name}: ${decision.reason}`);
          } else if (decision.action === 'CREATE_BUG') {
            const bugCard: KanbanCard = {
              id: 'bug_' + Date.now(),
              title: `[BUG] ${decision.cardTitle || 'Falha de validação'}`,
              category: 'BUG',
              color: '#dc2626',
              status: 'TODO',
              assignedTo: currentAgent.name,
              storyPoints: 5,
              createdAt: new Date().toISOString(),
            };

            setCards((prev) => [bugCard, ...prev]);

            memory.addEntry({
              tick: nextTick,
              sprint,
              agentName: currentAgent.name,
              action: 'CREATE_BUG',
              cardTitle: bugCard.title,
              fromColumn: 'QA',
              toColumn: 'TODO',
              reason: decision.reason,
            });

            // Alerta crítico no canal de alertas e bugs do Teams/Slack
            const bugChatMsg: ChatMessage = {
              id: 'msg_bug_' + Date.now(),
              channelId: 'alertas-bloqueios',
              senderName: currentAgent.name,
              senderRole: currentAgent.role,
              senderAvatar: currentAgent.avatar,
              content: `🚨 [ALERTA DE REGRESSÃO] Encontrei uma falha crítica em "${decision.cardTitle}". Um card de BUG prioritário foi aberto no quadro!`,
              timestamp: currentTimestamp,
            };
            setChatMessages((prev) => [...prev, bugChatMsg]);

            setRisk('HIGH');
            setAiStatus(`🚨 ${currentAgent.name}: Novo bug detectado!`);
          } else {
            memory.addEntry({
              tick: nextTick,
              sprint,
              agentName: currentAgent.name,
              action: 'IDLE',
              reason: decision.reason,
            });
            setAiStatus(`⏳ ${currentAgent.name}: ${decision.reason}`);
          }

          // A cada 10 passos da simulação, se não houver dilema pendente e houver dilema inédito:
          if (nextTick % 10 === 0) {
            setChatMessages((prev) => {
              const hasUnresolved = prev.some((m) => m.isScrumMasterDecision && !m.isResolved);
              if (hasUnresolved) return prev;

              // Procura um dilema que NUNCA foi exibido antes
              const nextUnusedDilemma = CHAT_DILEMMAS_POOL.find(
                (d) => !usedDilemmaIds.includes(d.id)
              );

              // Se todos já foram respondidos, não repete nada!
              if (!nextUnusedDilemma) return prev;

              // Registra como usado para nunca mais aparecer
              setUsedDilemmaIds((prevIds) => [...prevIds, nextUnusedDilemma.id]);

              // PAUSA IMEDIATA: O time literalmente para e espera o Scrum Master!
              setIsRunning(false);
              setIsChatOpen(true);
              setActiveChannelId(nextUnusedDilemma.channelId);
              setAgents((prevA) => prevA.map((a) => ({ ...a, status: 'Blocked' })));
              setAiStatus(`⏸️ TIME BLOQUEADO: ${nextUnusedDilemma.senderName} aguarda sua decisão no Chat para o time andar!`);

              const newDilemmaMsg: ChatMessage = {
                id: 'dilemma_msg_' + Date.now(),
                channelId: nextUnusedDilemma.channelId,
                senderName: nextUnusedDilemma.senderName,
                senderRole: nextUnusedDilemma.senderRole,
                senderAvatar: nextUnusedDilemma.senderAvatar,
                content: nextUnusedDilemma.content,
                timestamp: currentTimestamp,
                taggedRole: '@Scrum Master',
                isScrumMasterDecision: true,
                isResolved: false,
                dilemmaOptions: nextUnusedDilemma.dilemmaOptions,
              };

              setChatChannels((prevCh) =>
                prevCh.map((ch) =>
                  ch.id === nextUnusedDilemma.channelId
                    ? { ...ch, unreadCount: ch.unreadCount + 1 }
                    : ch
                )
              );

              return [...prev, newDilemmaMsg];
            });
          }
        });

      // No Modo 2: Avanço do relógio simulado até 18:00
      if (mode === 'MODE_2_REALTIME') {
        setSimulatedHour((prevHour) => {
          const [h, m] = prevHour.split(':').map(Number);
          let newM = m + 30;
          let newH = h;
          if (newM >= 60) {
            newH = (newH + 1) % 24;
            newM = 0;
          }
          const formatted = `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;

          if (formatted === '18:00' || (h < 18 && newH >= 18)) {
            triggerDailyScrum();
          }
          return formatted;
        });
      }

      return nextTick;
    });
  }, [agents, cards, mode, sprint, feedbackModalOpen, chatMessages]);

  // Disparo da Daily Scrum das 18:00
  const triggerDailyScrum = useCallback(async () => {
    setIsRunning(false);
    const reports = await brain.generateDailyReports(agents, cards);
    const dilemma = brain.generateManagerDilemma(tick);
    setDailyReports(reports);
    setCurrentDilemma(dilemma);
    setDailyModalOpen(true);
  }, [agents, cards, tick]);

  // Resolve dilema do Scrum Master com Feedback Pedagógico Completo
  const handleResolveDilemma = (optionIndex: number) => {
    if (!currentDilemma) return;
    const chosen = currentDilemma.options[optionIndex];
    if (!chosen) return;

    // Atualiza métricas
    setMorale((m) => Math.min(100, Math.max(20, m + chosen.moraleDelta)));
    setVelocity((v) => Math.max(10, v + chosen.velocityDelta));
    setRisk((r) => (chosen.riskDelta > 0 ? 'HIGH' : chosen.riskDelta < 0 ? 'LOW' : r));

    // Conquistas
    const dailyAch = smManager.unlockAchievement('first_daily');
    let unlockedBadgeName: string | undefined = dailyAch?.title;

    if (chosen.approachType === 'SERVANT_LEADERSHIP') {
      const blockerAch = smManager.unlockAchievement('blocker_slayer');
      if (blockerAch) unlockedBadgeName = blockerAch.title;
    }

    if (morale > 90) {
      const moraleAch = smManager.unlockAchievement('high_morale');
      if (moraleAch) unlockedBadgeName = moraleAch.title;
    }

    // Adiciona XP e verifica Level Up
    const levelResult = smManager.addXp(chosen.xpReward);
    setSmXp(smManager.getXp());
    setSmDecisionsCount(smManager.getDecisionsCount());
    setSmAchievements(smManager.getAchievements());

    // Registra na memória persistente
    memory.addEntry({
      tick,
      sprint,
      agentName: 'Scrum Master (Você)',
      action: 'DECISION_MADE',
      reason: `Decisão tomada: ${chosen.text}`,
    });

    // Abre modal didático com feedback imediato
    setFeedbackData({
      decisionTitle: currentDilemma.title,
      chosenText: chosen.text,
      scrumGuidePrinciple: chosen.scrumGuidePrinciple,
      realWorldExplanation: chosen.realWorldExplanation,
      teamImpactDetails: chosen.teamImpactDetails,
      xpEarned: chosen.xpReward,
      unlockedBadge: unlockedBadgeName,
      currentLevel: levelResult.newLevel,
      leveledUp: levelResult.leveledUp,
    });
    setFeedbackModalOpen(true);
  };

  // ─── Chat Interativo: Resolução de Decisões pelo Scrum Master ────────────
  const handleSelectChatDilemmaOption = (messageId: string, opt: ChatDilemmaOption) => {
    // 1. Marca dilema como resolvido
    setChatMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, isResolved: true, chosenOptionId: opt.id } : m))
    );

    // 2. APLICAÇÃO DIRETA NO QUADRO KANBAN
    if (opt.boardEffect) {
      applyBoardEffect(opt.boardEffect);
    }

    // 3. Destrava os agentes da equipe (o reinício da IA ocorrerá quando o usuário fechar o modal de feedback pedagógico)
    setAgents((prev) => prev.map((a) => ({ ...a, status: 'Idle' })));
    setIsRunning(false);
    setAiStatus('⏸️ Pausado para leitura do feedback pedagógico.');

    // 4. Pontuação e Gamificação
    const xpResult = smManager.addXp(opt.xpReward);
    setSmXp(smManager.getXp());
    setSmDecisionsCount(smManager.getDecisionsCount());

    // 5. Impacto nas Métricas
    setMorale((m) => Math.min(100, Math.max(20, m + opt.moraleDelta)));
    if (opt.riskDelta > 0) setRisk('HIGH');
    else if (opt.riskDelta < 0) setRisk('LOW');

    // 6. Registro no Log Anti-Alucinação com a modificação no quadro
    memory.addEntry({
      tick,
      sprint,
      agentName: 'Scrum Master',
      action: 'DECISION_MADE',
      reason: `Decisão no Chat: "${opt.label}" [${opt.approachType}] -> ${opt.boardEffect ? opt.boardEffect.description : 'Métricas ajustadas'}`,
    });

    // 7. Reação imediata do time no chat celebrando o destravamento
    const currentTimestamp =
      mode === 'MODE_2_REALTIME'
        ? simulatedHour
        : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const teamReactionMsg: ChatMessage = {
      id: 'react_' + Date.now(),
      channelId: activeChannelId,
      senderName: 'Equipe',
      senderRole: 'Time de Dev',
      senderAvatar: '👥',
      content: `${opt.responseReaction}\n\n🔓 *Time destravado pelo Scrum Master! Quadro Kanban atualizado.*`,
      timestamp: currentTimestamp,
    };
    setChatMessages((prev) => [...prev, teamReactionMsg]);

    // 8. Exibe feedback didático
    setFeedbackData({
      decisionTitle: 'Decisão Ágil Aplicada ao Quadro Kanban',
      chosenText: `${opt.label}\n\n📌 Efeito no Quadro: ${opt.boardEffect ? opt.boardEffect.description : 'Parâmetros de entrega ajustados'}`,
      scrumGuidePrinciple: opt.scrumGuideReference,
      realWorldExplanation: opt.pedagogicalReason,
      teamImpactDetails: opt.responseReaction,
      xpEarned: opt.xpReward,
      currentLevel: xpResult.newLevel,
      leveledUp: xpResult.leveledUp,
    });
    setFeedbackModalOpen(true);
    setAiStatus('✅ Decisão aplicada! Quadro Kanban atualizado e time destravado.');
  };

  // Envio de Mensagem customizada pelo Scrum Master
  const handleSendChatMessage = (text: string, channelId: ChannelId) => {
    const currentTimestamp =
      mode === 'MODE_2_REALTIME'
        ? simulatedHour
        : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: ChatMessage = {
      id: 'user_msg_' + Date.now(),
      channelId,
      senderName: 'Você',
      senderRole: 'Scrum Master',
      senderAvatar: '🛡️',
      content: text,
      timestamp: currentTimestamp,
      isFromUser: true,
    };

    setChatMessages((prev) => [...prev, userMsg]);

    // Bônus de Liderança Ativa: +10 XP
    smManager.addXp(10);
    setSmXp(smManager.getXp());

    // Resposta imediata de um dos membros virtuais
    setTimeout(() => {
      const responses = [
        { agent: agents[1], text: `Entendido @Scrum Master! Excelente ponto, já estou aplicando isso no código.` },
        { agent: agents[0], text: `Show de bola @Scrum Master! Vou alinhar isso com os clientes para garantir transparência.` },
        { agent: agents[3], text: `Muito bom @Scrum Master, a arquitetura e os testes agradecem esse direcionamento!` },
        { agent: agents[2], text: `Perfeito @Scrum Master! Já atualizei os critérios de validação em Staging.` },
      ];
      const selected = responses[Math.floor(Math.random() * responses.length)];
      const replyMsg: ChatMessage = {
        id: 'reply_' + Date.now(),
        channelId,
        senderName: selected.agent.name,
        senderRole: selected.agent.role,
        senderAvatar: selected.agent.avatar,
        content: selected.text,
        timestamp: currentTimestamp,
      };
      setChatMessages((prev) => [...prev, replyMsg]);
    }, 600);
  };

  // Gatilho Manual: "⚡ Provocar Decisão"
  const handleTriggerNewDilemma = () => {
    const currentTimestamp =
      mode === 'MODE_2_REALTIME'
        ? simulatedHour
        : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Busca um dilema que ainda não foi exibido
    const nextUnusedDilemma = CHAT_DILEMMAS_POOL.find(
      (d) => !usedDilemmaIds.includes(d.id)
    );

    if (!nextUnusedDilemma) {
      // Se todos os dilemas já foram respondidos, congratula o Scrum Master no canal geral
      const celebrationMsg: ChatMessage = {
        id: 'celebrate_' + Date.now(),
        channelId: 'geral',
        senderName: 'Ana Oliveira',
        senderRole: 'Product Owner',
        senderAvatar: '👩‍💼',
        content: '🎉 Parabéns @Scrum Master! Você já orientou o time em todos os cenários e dilemas críticos da esteira. O time está sem nenhum impedimento e focado em entregar os cards no quadro!',
        timestamp: currentTimestamp,
      };
      setChatMessages((prev) => [...prev, celebrationMsg]);
      setActiveChannelId('geral');
      setIsChatOpen(true);
      setAiStatus('🏆 Todos os dilemas foram superados com sucesso!');
      return;
    }

    setUsedDilemmaIds((prevIds) => [...prevIds, nextUnusedDilemma.id]);

    // Pausa a simulação na hora para aguardar a decisão do Scrum Master
    setIsRunning(false);
    setAgents((prev) => prev.map((a) => ({ ...a, status: 'Blocked' })));

    const newDilemmaMsg: ChatMessage = {
      id: 'dilemma_manual_' + Date.now(),
      channelId: nextUnusedDilemma.channelId,
      senderName: nextUnusedDilemma.senderName,
      senderRole: nextUnusedDilemma.senderRole,
      senderAvatar: nextUnusedDilemma.senderAvatar,
      content: nextUnusedDilemma.content,
      timestamp: currentTimestamp,
      taggedRole: '@Scrum Master',
      isScrumMasterDecision: true,
      isResolved: false,
      dilemmaOptions: nextUnusedDilemma.dilemmaOptions,
    };

    setChatMessages((prev) => [...prev, newDilemmaMsg]);
    setActiveChannelId(nextUnusedDilemma.channelId);
    setIsChatOpen(true);
    setAiStatus(`⚡ ${nextUnusedDilemma.senderName} enviou uma dúvida urgente no chat!`);
  };

  // Gatilho Manual: "☕ Pausa do Café"
  const handleTriggerCoffeeBreak = () => {
    const currentTimestamp =
      mode === 'MODE_2_REALTIME'
        ? simulatedHour
        : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const casual = TEAM_CASUAL_MESSAGES[Math.floor(Math.random() * TEAM_CASUAL_MESSAGES.length)];
    const coffeeMsg: ChatMessage = {
      id: 'coffee_' + Date.now(),
      channelId: casual.channelId,
      senderName: casual.agentName,
      senderRole: casual.role,
      senderAvatar: casual.avatar,
      content: casual.text,
      timestamp: currentTimestamp,
    };

    setChatMessages((prev) => [...prev, coffeeMsg]);
    setActiveChannelId(casual.channelId);
    setIsChatOpen(true);
  };

  // Timer Web Worker (Segundo plano)
  useEffect(() => {
    if (isRunning) {
      timerRef.current = new BackgroundTimer(executeSimulationStep);
      timerRef.current.start(getIntervalMs());
    } else {
      timerRef.current?.stop();
    }

    return () => timerRef.current?.stop();
  }, [isRunning, getIntervalMs, executeSimulationStep]);

  // Drag and Drop
  const handleDragStart = (_e: React.DragEvent, cardId: string) => {
    draggedCardIdRef.current = cardId;
  };

  const handleDrop = (_e: React.DragEvent, targetColumnId: string) => {
    const cardId = draggedCardIdRef.current;
    if (!cardId) return;

    setCards((prevCards) =>
      prevCards.map((c) => {
        if (c.id === cardId) {
          const updated = {
            ...c,
            status: targetColumnId,
            completedAt: targetColumnId === 'DONE' ? new Date().toISOString() : undefined,
          };

          memory.addEntry({
            tick,
            sprint,
            agentName: 'Scrum Master (Manual)',
            action: 'MOVE_CARD',
            cardTitle: c.title,
            fromColumn: c.status,
            toColumn: targetColumnId,
            reason: 'Movimentação manual pelo Scrum Master via Drag-and-Drop',
          });

          return updated;
        }
        return c;
      })
    );

    draggedCardIdRef.current = null;
  };

  const handleAddCard = (
    columnId: string,
    title: string,
    category: CardCategory,
    storyPoints: number
  ) => {
    const newCard: KanbanCard = {
      id: 'card_' + Date.now(),
      title,
      category,
      color: '#3b82f6',
      status: columnId,
      storyPoints,
      createdAt: new Date().toISOString(),
    };
    setCards((prev) => [...prev, newCard]);

    memory.addEntry({
      tick,
      sprint,
      agentName: 'Scrum Master',
      action: 'SPRINT_START',
      cardTitle: title,
      toColumn: columnId,
      reason: 'Novo cartão criado pelo Scrum Master',
    });
  };

  const handleDeleteCard = (cardId: string) => {
    setCards((prev) => prev.filter((c) => c.id !== cardId));
  };

  const handleResetScenario = () => {
    setCards(SCENARIO_DELIVERY_APP_CARDS);
    setTick(0);
    setSprint(1);
    setMorale(85);
    setRisk('MEDIUM');
    setVelocity(24);
    setSimulatedHour('09:00');
    memory.clearMemory();
    setChatMessages(INITIAL_CHAT_MESSAGES);
    setUsedDilemmaIds(['msg_init_dilemma_1']);
    setSprintCompleteShown(false);
    setSprintCompleteOpen(false);
    setAiStatus('Cenário Delivery App resetado!');
  };

  // Reset Completo da Campanha
  const handleResetCampaign = () => {
    smManager.reset();
    setSmXp(0);
    setSmDecisionsCount(0);
    setSmAchievements([]);
    setCards(SCENARIO_DELIVERY_APP_CARDS);
    localStorage.setItem(STORAGE_CARDS_KEY, JSON.stringify(SCENARIO_DELIVERY_APP_CARDS));
    setAgents(INITIAL_AGENTS);
    setIsRunning(false);
    setTick(0);
    setSprint(1);
    setMorale(85);
    setRisk('MEDIUM');
    setVelocity(24);
    setSimulatedHour('09:00');
    memory.clearMemory();
    setChatMessages(INITIAL_CHAT_MESSAGES);
    localStorage.setItem('tass_chat_messages_v3', JSON.stringify(INITIAL_CHAT_MESSAGES));
    setUsedDilemmaIds(['msg_init_dilemma_1']);
    localStorage.setItem('tass_used_dilemmas_v2', JSON.stringify(['msg_init_dilemma_1']));
    setSprintCompleteShown(false);
    setSprintCompleteOpen(false);
    setAiStatus(lang === 'en' ? 'Campaign completely reset!' : lang === 'es' ? '¡Campaña completamente reiniciada!' : 'Campanha completamente resetada do zero!');
  };

  const getColumnTitle = (colId: string) => {
    switch (colId) {
      case 'BACKLOG':
        return t.columns.backlog;
      case 'IN_PROGRESS':
        return t.columns.inProgress;
      case 'REVIEW_QA':
        return t.columns.codeReview;
      case 'DONE':
        return t.columns.done;
      default:
        return colId;
    }
  };

  // Estatísticas de Conclusão
  const totalCards = cards.length;
  const doneCards = cards.filter((c) => c.status === 'DONE').length;
  const progressPercent = totalCards > 0 ? Math.round((doneCards / totalCards) * 100) : 0;
  const pendingDilemmasCount = chatMessages.filter((m) => m.isScrumMasterDecision && !m.isResolved).length;

  // Cálculo de XP e progresso para barra no Topo
  const currentMin = currentSmLevel.minXp;
  const currentMax = nextSmLevel ? nextSmLevel.minXp : currentSmLevel.maxXp;
  const smProgressPercent = nextSmLevel
    ? Math.min(100, Math.round(((smXp - currentMin) / Math.max(1, currentMax - currentMin)) * 100))
    : 100;

  return (
    <div className={`h-screen w-screen flex flex-col ${activeTheme.bgApp} ${activeTheme.textColor} overflow-hidden font-sans select-none transition-colors duration-200`}>
      {/* ─── Top Navbar com Perfil do Scrum Master & Gamificação ────────────── */}
      <header className={`${activeTheme.bgNavbar} border-b ${activeTheme.borderNavbar} px-4 py-2 flex items-center justify-between shadow-md flex-shrink-0 transition-colors duration-200`}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setWelcomeModalOpen(true)}
            className="flex items-center gap-2 font-black text-sm text-blue-400 hover:text-blue-300 transition group p-1 rounded-lg hover:bg-slate-800/60"
            title="Clique para rever a apresentação e proposta do jogo"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 group-hover:bg-blue-500 flex items-center justify-center text-white shadow-md transition">
              <Bot size={18} />
            </div>
            <div className="flex flex-col text-left">
              <span className="leading-none">TASS KANBAN</span>
              <span className="text-[9px] text-slate-500 group-hover:text-slate-400 font-normal">{t.app.subtitle}</span>
            </div>
          </button>

          <div className="h-5 w-px bg-slate-800" />

          {/* Perfil Gamificado do Scrum Master (Clicável) */}
          <button
            onClick={() => setProfileModalOpen(true)}
            className="flex items-center gap-2.5 bg-slate-950/80 hover:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800/90 transition group text-left"
            title="Clique para ver sua carreira e conquistas de Scrum Master"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-sm shadow">
              {currentSmLevel.badge}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                  Scrum Master
                </span>
                <span className="text-[10px] text-slate-500">• Nível {currentSmLevel.level}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-100 group-hover:text-blue-300 transition">
                  {currentSmLevel.title}
                </span>
                <div className="w-14 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${smProgressPercent}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono font-bold text-amber-400">
                  {smXp} XP
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Seletor de Modo (Modo 1 vs Modo 2) */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              setMode('MODE_1_TURBO');
              setIsRunning(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
              mode === 'MODE_1_TURBO'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap size={14} /> {t.app.mode1}
          </button>
          <button
            onClick={() => {
              setMode('MODE_2_REALTIME');
              setIsRunning(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
              mode === 'MODE_2_REALTIME'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock size={14} /> {t.app.mode2}
          </button>
        </div>

        {/* Controles da Simulação e Botões Educativos */}
        <div className="flex items-center gap-2">
          {/* Botão Chat Teams / Slack */}
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow relative ${
              isChatOpen
                ? 'bg-indigo-600 text-white shadow-indigo-600/30'
                : 'bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-700/50 text-indigo-300'
            }`}
            title="Abrir/Recolher Chat da Equipe estilo Teams/Slack"
          >
            <MessageSquare size={14} />
            <span>{t.app.chatButton}</span>
            {pendingDilemmasCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse ml-0.5" />
            )}
          </button>

          {/* Botão Guia Ágil do Scrum Master */}
          <button
            onClick={() => setHandbookModalOpen(true)}
            className="px-2.5 py-1.5 bg-indigo-950/50 hover:bg-indigo-900/60 border border-indigo-700/50 text-indigo-300 rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow"
            title="Abrir Guia de Bolso do Scrum Master com lições do básico ao avançado"
          >
            <BookOpen size={14} /> {t.app.handbookButton}
          </button>

          {/* Botão Conquistas */}
          <button
            onClick={() => setProfileModalOpen(true)}
            className="px-2.5 py-1.5 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-700/50 text-amber-300 rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow"
            title="Ver Conquistas e Medalhas"
          >
            <Award size={14} /> {t.app.achievementsButton}
          </button>

          <div className="h-5 w-px bg-slate-800 mx-0.5" />

          {mode === 'MODE_1_TURBO' && (
            <div className="flex items-center bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-xs gap-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase mr-1">{t.app.speed}:</span>
              {[1, 2, 5, 10].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-1.5 py-0.5 rounded font-mono text-[11px] font-bold ${
                    speed === s ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          )}

          {mode === 'MODE_2_REALTIME' && (
            <div className="flex items-center gap-2">
              <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
                <Clock size={13} /> {simulatedHour}
              </div>
              <button
                onClick={triggerDailyScrum}
                className="px-2.5 py-1.5 bg-purple-950/40 hover:bg-purple-900/60 border border-purple-700/50 text-purple-300 rounded-lg text-xs font-bold transition flex items-center gap-1"
              >
                Simular 18:00
              </button>
            </div>
          )}

          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isRunning ? (
              <>
                <Pause size={14} /> {t.app.pause}
              </>
            ) : (
              <>
                <Play size={14} /> {t.app.start}
              </>
            )}
          </button>

          {!isRunning && (
            <button
              onClick={executeSimulationStep}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title={t.app.step}
            >
              <StepForward size={15} />
            </button>
          )}

          {/* Botão Log Anti-Alucinação */}
          <button
            onClick={() => setAuditModalOpen(true)}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
            title="Ver e Baixar Log da IA"
          >
            <FileText size={14} className="text-emerald-400" /> {t.navigation.auditLog}
          </button>

          {/* Seletor de Idioma (PT / EN / ES) */}
          <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 gap-0.5">
            {LANGUAGE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setLang(opt.id)}
                className={`px-2 py-1 rounded text-[10px] font-bold transition ${lang === opt.id ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                title={opt.label}
              >
                {opt.flag} {opt.id.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Configurações */}
          <button
            onClick={() => setSettingsModalOpen(true)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title={t.navigation.settings}
          >
            <Sliders size={15} />
          </button>
        </div>
      </header>

      {/* ─── Sub-Barra: Equipe Ágil, Métricas com Tooltips e Progresso ────────── */}
      <div className={`border-b px-4 py-2 flex items-center justify-between text-xs flex-shrink-0 transition-all duration-300 ${
        pendingDilemmasCount > 0
          ? 'bg-red-950/40 border-red-700/60 animate-pulse-red'
          : activeTheme.bgSubbar
      }`}>
        {/* Membros da Equipe Ágil */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <Users size={12} /> {t.app.team}
          </span>
          {agents.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700/50 text-[11px] text-slate-200"
              title={`${a.name} (${a.role}) - Status: ${a.status}`}
            >
              <span>{a.avatar}</span>
              <span className="font-semibold">{a.name}</span>
              <span className="text-slate-400 text-[10px]">({a.role.split(' ')[0]})</span>
              <span
                className={`w-2 h-2 rounded-full ml-0.5 ${
                  a.status === 'Working'
                    ? 'bg-green-400 animate-pulse'
                    : a.status === 'Blocked'
                    ? 'bg-red-400 animate-pulse'
                    : 'bg-slate-500'
                }`}
              />
            </div>
          ))}
          {/* Alerta de Bloqueio */}
          {pendingDilemmasCount > 0 && (
            <div className="flex items-center gap-1.5 bg-red-950/60 border border-red-600/60 text-red-300 px-3 py-1 rounded-lg text-[11px] font-bold animate-pulse">
              <AlertTriangle size={12} className="text-red-400" />
              ⏸️ TIME BLOQUEADO — Responda no Chat para continuar!
            </div>
          )}
        </div>

        {/* Status atual da IA */}
        <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1 rounded-lg border border-slate-700/50 text-slate-300 font-mono text-[11px] max-w-sm truncate">
          <Sparkles size={12} className="text-blue-400 flex-shrink-0" />
          <span className="truncate">{aiStatus}</span>
        </div>

        {/* Métricas Ágeis Didáticas */}
        <div className="flex items-center gap-4">
          <div
            className="flex items-center gap-1.5 text-[11px] cursor-help"
            title="Moral da Equipe: mede a segurança psicológica e motivação do time."
          >
            <Smile size={13} className="text-green-400" />
            <span className="text-slate-400">{t.app.morale}:</span>
            <span className="font-bold text-green-400">{morale}%</span>
          </div>

          <div
            className="flex items-center gap-1.5 text-[11px] cursor-help"
            title="Nível de Risco: probabilidade de atrasos ou bugs graves em produção."
          >
            <AlertTriangle size={13} className={risk === 'HIGH' ? 'text-red-400' : 'text-yellow-400'} />
            <span className="text-slate-400">{t.app.risk}:</span>
            <span
              className={`font-bold ${
                risk === 'HIGH' ? 'text-red-400' : risk === 'MEDIUM' ? 'text-yellow-400' : 'text-green-400'
              }`}
            >
              {t.risks[risk.toLowerCase() as 'low'|'medium'|'high'] || risk}
            </span>
          </div>

          <div
            className="flex items-center gap-2 cursor-help"
            title="Progresso da Sprint: percentual de histórias concluídas (DONE)."
          >
            <span className="text-[11px] text-slate-400">{t.app.completion}:</span>
            <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${doneCards === totalCards && totalCards > 0 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className={`text-[11px] font-bold font-mono ${doneCards === totalCards && totalCards > 0 ? 'text-emerald-400' : 'text-blue-400'}`}>
              {progressPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* ─── Área Principal: Quadro Kanban + Chat da Equipe (Teams/Slack) ──── */}
      <div className={`flex-1 flex overflow-hidden ${activeTheme.bgBoard} transition-colors duration-200`}>
        <main className="flex-1 p-4 overflow-x-auto overflow-y-hidden flex items-start gap-4 scrollbar-thin scrollbar-thumb-slate-500/30">
          {columns.map((col) => {
            const colCards = cards.filter((c) => c.status === col.id);
            return (
              <KanbanColumnItem
                key={col.id}
                column={{ ...col, title: getColumnTitle(col.id) }}
                cards={colCards}
                onDragStart={handleDragStart}
                onDrop={handleDrop}
                onAddCard={handleAddCard}
                onDeleteCard={handleDeleteCard}
                theme={activeTheme}
              />
            );
          })}
        </main>

        {/* Barra Lateral do Chat Teams / Slack */}
        <TeamChatSidebar
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          channels={chatChannels}
          activeChannelId={activeChannelId}
          onSelectChannel={(chId) => {
            setActiveChannelId(chId);
            setChatChannels((prev) =>
              prev.map((c) => (c.id === chId ? { ...c, unreadCount: 0 } : c))
            );
          }}
          messages={chatMessages}
          onSendMessage={handleSendChatMessage}
          onSelectDilemmaOption={handleSelectChatDilemmaOption}
          onTriggerNewDilemma={handleTriggerNewDilemma}
          onTriggerCoffeeBreak={handleTriggerCoffeeBreak}
          theme={activeTheme}
        />
      </div>

      {/* ─── Modais do Sistema ──────────────────────────────────────────────── */}
      <DailyScrumModal
        isOpen={dailyModalOpen}
        onClose={() => setDailyModalOpen(false)}
        reports={dailyReports}
        dilemma={currentDilemma}
        onResolveDilemma={handleResolveDilemma}
      />

      <DecisionFeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => {
          setFeedbackModalOpen(false);
          // Reinicia a simulação com a IA trabalhando somente após o usuário ler e sair da tela
          setIsRunning(true);
          setAiStatus('▶️ Retomando simulação da IA após análise do feedback...');
        }}
        data={feedbackData}
        theme={activeTheme}
      />

      <AgileHandbookModal
        isOpen={handbookModalOpen}
        onClose={() => setHandbookModalOpen(false)}
      />

      <ScrumMasterProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        currentLevel={currentSmLevel}
        nextLevel={nextSmLevel}
        xp={smXp}
        decisionsCount={smDecisionsCount}
        achievements={smAchievements}
        onResetCareer={() => {
          smManager.reset();
          setSmXp(smManager.getXp());
          setSmDecisionsCount(0);
          setSmAchievements(smManager.getAchievements());
        }}
        theme={activeTheme}
      />

      <AuditLogModal
        isOpen={auditModalOpen}
        onClose={() => setAuditModalOpen(false)}
        logs={memory.getEntries()}
        onDownload={() => memory.downloadLogFile()}
        onClear={() => {
          memory.clearMemory();
          setTick(0);
        }}
      />

      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        apiKey={brain.getApiKey()}
        onSaveApiKey={(key) => brain.setApiKey(key)}
        onResetScenario={handleResetScenario}
        onResetCampaign={handleResetCampaign}
        currentTheme={currentTheme}
        onSelectTheme={(themeId) => setCurrentTheme(themeId)}
      />

      {/* ─── Modal de Conclusão da Sprint ─────────────────────────────────── */}
      <SprintCompleteModal
        isOpen={sprintCompleteOpen}
        summary={{
          doneCards,
          totalCards,
          sprintNumber: sprint,
          totalXp: smXp,
          levelTitle: currentSmLevel.title,
          levelBadge: currentSmLevel.badge,
          velocity,
          decisionsCount: smDecisionsCount,
          morale,
        }}
        onNewSprint={() => {
          setSprintCompleteOpen(false);
          handleResetScenario();
          setSprint((prev) => prev + 1);
        }}
        onExportLog={() => {
          setSprintCompleteOpen(false);
          memory.downloadLogFile();
        }}
      />

      {/* ─── Modal de Abertura e Apresentação do Jogo ──────────────────── */}
      <WelcomeIntroModal
        isOpen={welcomeModalOpen}
        onStartGame={() => {
          setWelcomeModalOpen(false);
          try {
            localStorage.setItem('tass_intro_seen_v1', 'true');
          } catch {
            // ignore
          }
        }}
        onClose={() => {
          setWelcomeModalOpen(false);
          try {
            localStorage.setItem('tass_intro_seen_v1', 'true');
          } catch {
            // ignore
          }
        }}
      />
    </div>
  );
};

export default App;
