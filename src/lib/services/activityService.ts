import { AgriculturalActivity, ActivityStatus } from '../../types';
import { INITIAL_ACTIVITIES } from '../../data/mock-data';

const STORAGE_KEY = 'agriia_activities_v1';

export class ActivityService {
  private static load(): AgriculturalActivity[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch {}
    this.save(INITIAL_ACTIVITIES);
    return INITIAL_ACTIVITIES;
  }

  private static save(activities: AgriculturalActivity[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
    } catch (e) {
      console.error(e);
    }
  }

  static getAll(): AgriculturalActivity[] {
    return this.load();
  }

  static getByFarmId(farmId: string): AgriculturalActivity[] {
    return this.load().filter((a) => a.farmId === farmId);
  }

  static create(data: Omit<AgriculturalActivity, 'id' | 'status'> & { status?: ActivityStatus }): AgriculturalActivity {
    const activities = this.load();
    const newActivity: AgriculturalActivity = {
      ...data,
      id: `act-${Date.now()}`,
      status: data.status || 'Pendente',
    };
    activities.unshift(newActivity);
    this.save(activities);
    return newActivity;
  }

  static update(id: string, updates: Partial<AgriculturalActivity>): AgriculturalActivity | null {
    const activities = this.load();
    const index = activities.findIndex((a) => a.id === id);
    if (index === -1) return null;

    activities[index] = { ...activities[index], ...updates };
    this.save(activities);
    return activities[index];
  }

  static toggleStatus(id: string): AgriculturalActivity | null {
    const activities = this.load();
    const item = activities.find((a) => a.id === id);
    if (!item) return null;

    const nextStatus: Record<ActivityStatus, ActivityStatus> = {
      Pendente: 'Em Progresso',
      'Em Progresso': 'Concluída',
      Concluída: 'Pendente',
      Atrasada: 'Em Progresso',
    };

    item.status = nextStatus[item.status] || 'Pendente';
    if (item.status === 'Concluída') {
      item.completedAt = new Date().toISOString();
    } else {
      delete item.completedAt;
    }

    this.save(activities);
    return item;
  }

  static delete(id: string): boolean {
    const activities = this.load();
    const filtered = activities.filter((a) => a.id !== id);
    if (filtered.length === activities.length) return false;
    this.save(filtered);
    return true;
  }
}
