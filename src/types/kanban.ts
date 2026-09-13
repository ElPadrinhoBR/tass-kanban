export type CardCategory =
  | 'FRONTEND'
  | 'BACKEND'
  | 'UI/UX'
  | 'DATABASE'
  | 'SECURITY'
  | 'API'
  | 'DEVOPS'
  | 'CLOUD'
  | 'BUG';

export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  category: CardCategory;
  color: string;
  status: string; // List ID
  assignedTo?: string; // Agent name
  storyPoints: number;
  createdAt: string;
  completedAt?: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  color: string;
}

export interface AgentMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'Idle' | 'Working' | 'Reviewing' | 'Testing' | 'Blocked';
  currentTask?: string;
  color: string;
}

export interface SimulationLogEntry {
  id: string;
  timestamp: string;
  tick: number;
  sprint: number;
  agentName: string;
  action: 'MOVE_CARD' | 'CREATE_BUG' | 'DAILY_REPORT' | 'DECISION_MADE' | 'SPRINT_START' | 'SPRINT_COMPLETE' | 'IDLE';
  cardTitle?: string;
  fromColumn?: string;
  toColumn?: string;
  reason: string;
  aiPromptSummary?: string;
  metadata?: Record<string, any>;
}

export interface DailyReport {
  agentName: string;
  avatar: string;
  role: string;
  doneYesterday: string;
  doingToday: string;
  blockers: string;
}

export interface ManagerQuestionOption {
  text: string;
  impact: string; // e.g. "Moral +10%, Risco -5%"
  moraleDelta: number;
  riskDelta: number;
  velocityDelta: number;
  approachType: 'SERVANT_LEADERSHIP' | 'PRAGMATIC_TRADE_OFF' | 'COMMAND_CONTROL';
  scrumGuidePrinciple: string;
  realWorldExplanation: string;
  teamImpactDetails: string;
  xpReward: number;
}

export interface ManagerQuestion {
  id: string;
  agentName: string;
  avatar: string;
  title: string;
  context: string;
  options: ManagerQuestionOption[];
}
