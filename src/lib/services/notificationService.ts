import { NotificationItem } from '../../types';
import { INITIAL_NOTIFICATIONS } from '../../data/mock-data';

const STORAGE_KEY = 'agriia_notifications_v1';

export class NotificationService {
  private static load(): NotificationItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch {}
    this.save(INITIAL_NOTIFICATIONS);
    return INITIAL_NOTIFICATIONS;
  }

  private static save(items: NotificationItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }

  static getAll(): NotificationItem[] {
    return this.load();
  }

  static markAsRead(id: string): void {
    const items = this.load();
    const item = items.find((n) => n.id === id);
    if (item) {
      item.read = true;
      this.save(items);
    }
  }

  static markAllAsRead(): void {
    const items = this.load();
    items.forEach((n) => {
      n.read = true;
    });
    this.save(items);
  }

  static getUnreadCount(): number {
    return this.load().filter((n) => !n.read).length;
  }
}
