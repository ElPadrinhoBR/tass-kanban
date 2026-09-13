import { CardCategory } from './kanban';

export type ChannelId = 'geral' | 'desenvolvimento' | 'duvidas-scrum-master' | 'alertas-bloqueios';

export interface ChatChannel {
  id: ChannelId;
  name: string;
  description: string;
  unreadCount: number;
  iconName: 'hash' | 'code' | 'help' | 'alert';
}

export type KanbanEffectType =
  | 'CREATE_CARD'
  | 'MOVE_CARDS'
  | 'SPLIT_CARD'
  | 'ADD_TAG_OR_RENAME'
  | 'TRADE_OFF_SWAP';

export interface BoardEffect {
  type: KanbanEffectType;
  description: string;
  newCard?: {
    title: string;
    description: string;
    category: CardCategory;
    color: string;
    status: string;
    storyPoints: number;
    assignedTo?: string;
  };
  fromColumn?: string;
  toColumn?: string;
  count?: number;
  splitTargetStatus?: string;
  newCards?: {
    title: string;
    description: string;
    category: CardCategory;
    color: string;
    status: string;
    storyPoints: number;
    assignedTo?: string;
  }[];
  swapIn?: {
    title: string;
    description: string;
    category: CardCategory;
    color: string;
    status: string;
    storyPoints: number;
  };
  swapOutFromStatus?: string;
  swapOutToStatus?: string;
  tagToAdd?: string;
  targetCardTitleKeyword?: string;
}

export interface ChatDilemmaOption {
  id: string;
  label: string;
  approachType: 'SERVANT_LEADERSHIP' | 'PRAGMATIC_TRADEOFF' | 'ANTI_PATTERN_COMMAND';
  xpReward: number;
  moraleDelta: number;
  riskDelta: number;
  responseReaction: string;
  pedagogicalReason: string;
  scrumGuideReference: string;
  boardEffect?: BoardEffect;
}

export interface ChatMessage {
  id: string;
  channelId: ChannelId;
  senderName: string;
  senderRole: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  taggedRole?: string; // e.g. '@Scrum Master'
  isScrumMasterDecision?: boolean;
  dilemmaOptions?: ChatDilemmaOption[];
  isResolved?: boolean;
  chosenOptionId?: string;
  isFromUser?: boolean;
}

/** Template de dilema usado no pool CHAT_DILEMMAS_POOL */
export interface DilemmaTemplate {
  id: string;
  channelId: ChannelId;
  senderName: string;
  senderRole: string;
  senderAvatar: string;
  content: string;
  dilemmaOptions: ChatDilemmaOption[];
}
