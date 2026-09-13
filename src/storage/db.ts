import Dexie, { type Table } from 'dexie';

export interface Agent { id: string; name: string; role: string; state: string; }
export interface PlayerProgress { id: number; xp: number; level: number; }
export interface Achievement { id: string; title: string; unlockedAt: number; }
export interface Metric { id: string; velocity: number; bugs: number; }

export class TassDatabase extends Dexie {
  agents!: Table<Agent>;
  metrics!: Table<Metric>;
  progress!: Table<PlayerProgress>;
  achievements!: Table<Achievement>;

  constructor() {
    super('TassDB');
    this.version(2).stores({
      agents: 'id, name, role',
      metrics: 'id',
      progress: 'id',
      achievements: 'id'
    });
  }
}

export const db = new TassDatabase();