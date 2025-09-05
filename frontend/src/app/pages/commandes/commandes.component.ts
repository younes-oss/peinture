import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Commande {
  id: number;
  date: Date;
  statut: 'En cours' | 'Expédiée' | 'Livrée' | 'Annulée';
  total: number;
  nombreArticles: number;
}

@Component({
  selector: 'app-commandes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="commandes-page">
      <div class="page-header">
        <h1>Vos Commandes</h1>
        <p>Consultez l'historique de vos achats</p>
      </div>
      
      <div class="commandes-content">
        <div *ngFor="let commande of commandes" class="commande-card">
          <div class="commande-header">
            <div class="commande-info">
              <h3>Commande #{{ commande.id }}</h3>
              <p class="commande-date">{{ commande.date | date:'dd/MM/yyyy' }}</p>
            </div>
            <div class="commande-statut" [class]="'statut-' + commande.statut.toLowerCase().replace(' ', '-')">
              {{ commande.statut }}
            </div>
          </div>
          
          <div class="commande-details">
            <div class="detail-item">
              <span>Articles :</span>
              <span>{{ commande.nombreArticles }} peinture(s)</span>
            </div>
            <div class="detail-item total">
              <span>Total :</span>
              <span>{{ commande.total | currency:'EUR' }}</span>
            </div>
          </div>
          
          <div class="commande-actions">
            <button class="btn-details">Voir les détails</button>
            <button class="btn-suivre" *ngIf="commande.statut === 'En cours'">Suivre la commande</button>
          </div>
        </div>
        
        <div *ngIf="commandes.length === 0" class="commandes-vide">
          <p>Aucune commande pour le moment</p>
          <button class="btn-decouvrir">Découvrir nos peintures</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .commandes-page {
      padding: 20px;
    }
    
    .page-header {
      text-align: center;
      margin-bottom: 40px;
    }
    
    .page-header h1 {
      font-size: 32px;
      color: #333;
      margin-bottom: 10px;
    }
    
    .page-header p {
      font-size: 18px;
      color: #666;
    }
    
    .commandes-content {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .commande-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      padding: 20px;
      margin-bottom: 20px;
    }
    
    .commande-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }
    
    .commande-info h3 {
      margin: 0 0 4px 0;
      color: #333;
      font-size: 18px;
    }
    
    .commande-date {
      margin: 0;
      color: #666;
      font-size: 14px;
    }
    
    .commande-statut {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }
    
    .statut-en-cours {
      background: #fff3cd;
      color: #856404;
    }
    
    .statut-expédiée {
      background: #d1ecf1;
      color: #0c5460;
    }
    
    .statut-livrée {
      background: #d4edda;
      color: #155724;
    }
    
    .statut-annulée {
      background: #f8d7da;
      color: #721c24;
    }
    
    .commande-details {
      margin-bottom: 20px;
    }
    
    .detail-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      padding: 4px 0;
    }
    
    .detail-item.total {
      border-top: 1px solid #eee;
      padding-top: 12px;
      margin-top: 12px;
      font-weight: 600;
      font-size: 16px;
    }
    
    .commande-actions {
      display: flex;
      gap: 12px;
    }
    
    .btn-details, .btn-suivre {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.3s ease;
    }
    
    .btn-details {
      background: #f8f9fa;
      color: #333;
      border: 1px solid #ddd;
    }
    
    .btn-details:hover {
      background: #e9ecef;
    }
    
    .btn-suivre {
      background: #fbbf24;
      color: white;
    }
    
    .btn-suivre:hover {
      background: #f59e0b;
    }
    
    .commandes-vide {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }
    
    .btn-decouvrir {
      background: #fbbf24;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      margin-top: 20px;
    }
  `]
})
export class CommandesComponent {
  commandes: Commande[] = [
    {
      id: 1001,
      date: new Date('2024-01-15'),
      statut: 'Livrée',
      total: 5700,
      nombreArticles: 2
    },
    {
      id: 1002,
      date: new Date('2024-01-20'),
      statut: 'En cours',
      total: 2500,
      nombreArticles: 1
    },
    {
      id: 1003,
      date: new Date('2024-01-25'),
      statut: 'Expédiée',
      total: 8000,
      nombreArticles: 3
    }
  ];
} 