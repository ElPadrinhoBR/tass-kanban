export interface ScrumMasterLevel {
  level: number;
  title: string;
  minXp: number;
  maxXp: number;
  description: string;
  badge: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  unlockedAt?: string;
}

export const SCRUM_LEVELS: ScrumMasterLevel[] = [
  {
    level: 1,
    title: 'Trainee Agilista',
    minXp: 0,
    maxXp: 200,
    description: 'Aprendendo os fundamentos de fluxo, papéis do time e Daily Scrum.',
    badge: '🌱',
  },
  {
    level: 2,
    title: 'Junior Scrum Master',
    minXp: 200,
    maxXp: 500,
    description: 'Facilitando cerimônias, removendo bloqueios simples e limitando o WIP.',
    badge: '🥉',
  },
  {
    level: 3,
    title: 'Pleno Scrum Master',
    minXp: 500,
    maxXp: 1000,
    description: 'Mediando conflitos entre Dev e QA, gerenciando débitos técnicos e qualidade.',
    badge: '🥈',
  },
  {
    level: 4,
    title: 'Senior Agile Coach',
    minXp: 1000,
    maxXp: 2000,
    description: 'Protegendo a equipe contra pressões externas, evitando burnout e otimizando métricas.',
    badge: '🥇',
  },
  {
    level: 5,
    title: 'Enterprise Agile Leader',
    minXp: 2000,
    maxXp: 4000,
    description: 'Transformação ágil sistêmica, equilíbrio entre valor de negócio e sustentabilidade.',
    badge: '💎',
  },
  {
    level: 6,
    title: 'Scrum Master Sensei',
    minXp: 4000,
    maxXp: 99999,
    description: 'Mestria absoluta em agilidade, servant leadership e times de alta performance.',
    badge: '👑',
  },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_daily',
    title: 'Facilitador de Cerimônias',
    description: 'Conduziu sua primeira Daily Scrum com o time de desenvolvimento.',
    icon: '🗣️',
    xpReward: 50,
  },
  {
    id: 'wip_guardian',
    title: 'Mestre do Limite de WIP',
    description: 'Manteve o trabalho em progresso equilibrado sem sobrecarregar a esteira.',
    icon: '🎯',
    xpReward: 75,
  },
  {
    id: 'blocker_slayer',
    title: 'Zerador de Impedimentos',
    description: 'Removeu um bloqueio crítico relatado por um membro do time.',
    icon: '🛡️',
    xpReward: 100,
  },
  {
    id: 'quality_first',
    title: 'Guardião da Qualidade',
    description: 'Apoiou a homologação e evitou que bugs chegassem em produção.',
    icon: '🧪',
    xpReward: 120,
  },
  {
    id: 'high_morale',
    title: 'Cultura & Segurança Psicológica',
    description: 'Manteve o Moral da equipe acima de 90% ao longo de um ciclo ágil.',
    icon: '🧘',
    xpReward: 150,
  },
  {
    id: 'sprint_champion',
    title: 'Sprint de Ouro',
    description: 'Concluiu com sucesso todas as histórias planejadas para a entrega.',
    icon: '🏆',
    xpReward: 200,
  },
];

const SM_STORAGE_KEY = 'tass_scrum_master_progression_v1';

export class ScrumMasterProgressionManager {
  private xp = 0;
  private achievements: Achievement[] = INITIAL_ACHIEVEMENTS;
  private decisionsCount = 0;

  constructor() {
    this.load();
  }

  private load() {
    try {
      const data = localStorage.getItem(SM_STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        this.xp = parsed.xp ?? 0;
        this.decisionsCount = parsed.decisionsCount ?? 0;
        if (parsed.achievements) {
          this.achievements = parsed.achievements;
        }
      }
    } catch {
      this.xp = 0;
    }
  }

  private save() {
    try {
      localStorage.setItem(
        SM_STORAGE_KEY,
        JSON.stringify({
          xp: this.xp,
          decisionsCount: this.decisionsCount,
          achievements: this.achievements,
        })
      );
    } catch {
      // Ignora falhas de gravação
    }
  }

  getXp(): number {
    return this.xp;
  }

  getDecisionsCount(): number {
    return this.decisionsCount;
  }

  getCurrentLevel(): ScrumMasterLevel {
    for (let i = SCRUM_LEVELS.length - 1; i >= 0; i--) {
      if (this.xp >= SCRUM_LEVELS[i].minXp) {
        return SCRUM_LEVELS[i];
      }
    }
    return SCRUM_LEVELS[0];
  }

  getNextLevel(): ScrumMasterLevel | null {
    const current = this.getCurrentLevel();
    const nextIdx = SCRUM_LEVELS.findIndex((l) => l.level === current.level) + 1;
    return SCRUM_LEVELS[nextIdx] || null;
  }

  addXp(amount: number): { oldLevel: ScrumMasterLevel; newLevel: ScrumMasterLevel; leveledUp: boolean } {
    const oldLevel = this.getCurrentLevel();
    this.xp += amount;
    this.decisionsCount += 1;
    const newLevel = this.getCurrentLevel();
    this.save();

    return {
      oldLevel,
      newLevel,
      leveledUp: newLevel.level > oldLevel.level,
    };
  }

  unlockAchievement(id: string): Achievement | null {
    const ach = this.achievements.find((a) => a.id === id);
    if (ach && !ach.unlockedAt) {
      ach.unlockedAt = new Date().toISOString();
      this.addXp(ach.xpReward);
      this.save();
      return ach;
    }
    return null;
  }

  getAchievements(): Achievement[] {
    return [...this.achievements];
  }

  reset() {
    this.xp = 0;
    this.decisionsCount = 0;
    this.achievements = INITIAL_ACHIEVEMENTS.map((a) => ({ ...a, unlockedAt: undefined }));
    this.save();
  }
}
