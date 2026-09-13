import { db } from '../storage/db';

const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 4000];
const LEVEL_TITLES = [
  'Aprendiz de Kanban',
  'Agile Practitioner',
  'Scrum Practitioner',
  'Tech Lead',
  'Project Manager',
  'IT Manager',
  'Technology Leader'
];

export class GamificationEngine {
  async addXp(amount: number) {
    let progress = await db.progress.get(1);
    if (!progress) {
      progress = { id: 1, xp: 0, level: 0 };
    }
    
    progress.xp += amount;
    
    let newLevel = progress.level;
    for (let i = progress.level + 1; i < LEVEL_THRESHOLDS.length; i++) {
      if (progress.xp >= LEVEL_THRESHOLDS[i]) {
        newLevel = i;
      } else {
        break;
      }
    }
    
    progress.level = newLevel;
    await db.progress.put(progress);
    
    return { 
      xp: progress.xp, 
      level: progress.level, 
      title: LEVEL_TITLES[progress.level] || 'Leader'
    };
  }

  async unlockAchievement(id: string, title: string) {
    const existing = await db.achievements.get(id);
    if (!existing) {
      await db.achievements.add({ id, title, unlockedAt: Date.now() });
      console.log(`🏆 Conquista Desbloqueada: ${title}`);
    }
  }
}