import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class=\"notification-container\">
      <div *ngFor=\"let notification of notifications\" 
           class=\"notification notification-{{ notification.type }}\"
           [@slideIn]>
        <div class=\"notification-content\">
          <div class=\"notification-icon\">
            <svg *ngIf=\"notification.type === 'success'\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"currentColor\">
              <path d=\"M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z\"/>
            </svg>
            <svg *ngIf=\"notification.type === 'error'\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"currentColor\">
              <path d=\"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z\"/>
            </svg>
            <svg *ngIf=\"notification.type === 'warning'\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"currentColor\">
              <path d=\"M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z\"/>
            </svg>
            <svg *ngIf=\"notification.type === 'info'\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"currentColor\">
              <path d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z\"/>
            </svg>
          </div>
          <div class=\"notification-text\">
            <div class=\"notification-title\">{{ notification.title }}</div>
            <div class=\"notification-message\">{{ notification.message }}</div>
          </div>
        </div>
        <button class=\"notification-close\" (click)=\"removeNotification(notification.id)\">
          <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"currentColor\">
            <path d=\"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z\"/>
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 120px;
      right: 20px;
      z-index: 9999;
      max-width: 400px;
    }
    
    .notification {
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      margin-bottom: 12px;
      padding: 16px;
      display: flex;
      align-items: flex-start;
      gap: 12px;
      border-left: 4px solid;
      animation: slideIn 0.3s ease-out;
    }
    
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    .notification-success {
      border-left-color: #10b981;
      background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%);
    }
    
    .notification-error {
      border-left-color: #ef4444;
      background: linear-gradient(135deg, #fef2f2 0%, #fef2f2 100%);
    }
    
    .notification-warning {
      border-left-color: #f59e0b;
      background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
    }
    
    .notification-info {
      border-left-color: #3b82f6;
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    }
    
    .notification-content {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      flex: 1;
    }
    
    .notification-icon {
      flex-shrink: 0;
      width: 20px;
      height: 20px;
      margin-top: 2px;
    }
    
    .notification-success .notification-icon {
      color: #10b981;
    }
    
    .notification-error .notification-icon {
      color: #ef4444;
    }
    
    .notification-warning .notification-icon {
      color: #f59e0b;
    }
    
    .notification-info .notification-icon {
      color: #3b82f6;
    }
    
    .notification-text {
      flex: 1;
    }
    
    .notification-title {
      font-weight: 600;
      font-size: 14px;
      color: #1f2937;
      margin-bottom: 4px;
    }
    
    .notification-message {
      font-size: 13px;
      color: #6b7280;
      line-height: 1.4;
    }
    
    .notification-close {
      background: none;
      border: none;
      color: #9ca3af;
      cursor: pointer;
      padding: 4px;
      border-radius: 6px;
      transition: all 0.2s;
      flex-shrink: 0;
    }
    
    .notification-close:hover {
      background: rgba(0, 0, 0, 0.05);
      color: #6b7280;
    }
    
    @media (max-width: 640px) {
      .notification-container {
        top: 100px;
        left: 20px;
        right: 20px;
        max-width: none;
      }
    }
  `]
})
export class NotificationComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    // Récupérer les notifications depuis le service
    this.notifications = this.notificationService.notifications$;
  }

  removeNotification(id: string): void {
    this.notificationService.removeNotification(id);
  }
}