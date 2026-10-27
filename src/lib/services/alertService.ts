import { AgriculturalAlert } from '../../types';
import { INITIAL_ALERTS } from '../../data/mock-data';

const STORAGE_KEY = 'agriia_alerts_v1';

export class AlertService {
  private static load(): AgriculturalAlert[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch {}
    this.save(INITIAL_ALERTS);
    return INITIAL_ALERTS;
  }

  private static save(alerts: AgriculturalAlert[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
    } catch (e) {
      console.error(e);
    }
  }

  static getAll(): AgriculturalAlert[] {
    return this.load();
  }

  static getActive(): AgriculturalAlert[] {
    return this.load().filter((a) => a.status === 'Ativo');
  }

  static getByFarmId(farmId: string): AgriculturalAlert[] {
    return this.load().filter((a) => a.farmId === farmId);
  }

  static resolve(id: string): AgriculturalAlert | null {
    const alerts = this.load();
    const item = alerts.find((a) => a.id === id);
    if (!item) return null;
    item.status = 'Resolvido';
    this.save(alerts);
    return item;
  }
}
