import { Injectable } from '@angular/core';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications: Notification[] = [];
  
  // Observable pour que les composants puissent s'abonner aux notifications
  get notifications$() {
    return this.notifications;
  }

  /**
   * Afficher une notification de succès
   */
  showSuccess(title: string, message: string, duration: number = 5000): void {
    this.addNotification('success', title, message, duration);
  }

  /**
   * Afficher une notification d'erreur
   */
  showError(title: string, message: string, duration: number = 8000): void {
    this.addNotification('error', title, message, duration);
  }

  /**
   * Afficher une notification d'avertissement
   */
  showWarning(title: string, message: string, duration: number = 6000): void {
    this.addNotification('warning', title, message, duration);
  }

  /**
   * Afficher une notification d'information
   */
  showInfo(title: string, message: string, duration: number = 5000): void {
    this.addNotification('info', title, message, duration);
  }

  /**
   * Supprimer une notification
   */
  removeNotification(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  /**
   * Supprimer toutes les notifications
   */
  clearAll(): void {
    this.notifications = [];
  }

  private addNotification(type: Notification['type'], title: string, message: string, duration?: number): void {
    const notification: Notification = {
      id: this.generateId(),
      type,
      title,
      message,
      duration
    };

    this.notifications.push(notification);

    // Auto-suppression après la durée spécifiée
    if (duration && duration > 0) {
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, duration);
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}