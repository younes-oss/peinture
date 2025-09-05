import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanierItemComponent, PanierItem } from '../../components/panier/panier-item/panier-item.component';

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [CommonModule, PanierItemComponent],
  template: `
    <div class="panier-page">
      <div class="page-header">
        <h1>Votre Panier</h1>
        <p>Gérez vos articles sélectionnés</p>
      </div>
      
      <div class="panier-content">
        <div class="panier-items">
          <app-panier-item 
            *ngFor="let item of panierItems" 
            [item]="item"
            (quantiteChange)="updateQuantite($event)"
            (remove)="removeItem($event)">
          </app-panier-item>
          
          <div *ngIf="panierItems.length === 0" class="panier-vide">
            <p>Votre panier est vide</p>
            <button class="btn-continuer-achats">Continuer les achats</button>
          </div>
        </div>
        
        <div class="panier-summary">
          <h3>Résumé de la commande</h3>
          <div class="summary-item">
            <span>Sous-total</span>
            <span>{{ getSousTotal() | currency:'EUR' }}</span>
          </div>
          <div class="summary-item">
            <span>Livraison</span>
            <span>{{ getFraisLivraison() | currency:'EUR' }}</span>
          </div>
          <div class="summary-item total">
            <span>Total</span>
            <span>{{ getTotal() | currency:'EUR' }}</span>
          </div>
          <button class="btn-commander" [disabled]="panierItems.length === 0">
            Passer la commande
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .panier-page {
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
    
    .panier-content {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 40px;
    }
    
    .panier-items {
      min-height: 400px;
    }
    
    .panier-vide {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }
    
    .btn-continuer-achats {
      background: #fbbf24;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      margin-top: 20px;
    }
    
    .panier-summary {
      background: white;
      padding: 24px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      height: fit-content;
    }
    
    .panier-summary h3 {
      margin: 0 0 20px 0;
      color: #333;
      font-size: 20px;
    }
    
    .summary-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }
    
    .summary-item.total {
      border-top: 2px solid #333;
      border-bottom: none;
      padding-top: 16px;
      margin-top: 16px;
      font-weight: 700;
      font-size: 18px;
    }
    
    .btn-commander {
      width: 100%;
      background: #fbbf24;
      color: white;
      border: none;
      padding: 16px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      font-size: 16px;
      margin-top: 20px;
      transition: background 0.3s ease;
    }
    
    .btn-commander:hover:not(:disabled) {
      background: #f59e0b;
    }
    
    .btn-commander:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  `]
})
export class PanierComponent {
  panierItems: PanierItem[] = [
    {
      id: 1,
      peinture: {
        id: 1,
        titre: "Le Pont de l'Art",
        artiste: "Claude Monet",
        prix: 2500,
        imageUrl: "https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Peinture+1"
      },
      quantite: 1
    },
    {
      id: 2,
      peinture: {
        id: 2,
        titre: "La Nuit Étoilée",
        artiste: "Vincent van Gogh",
        prix: 3200,
        imageUrl: "https://via.placeholder.com/300x200/8B4513/FFFFFF?text=Peinture+2"
      },
      quantite: 2
    }
  ];

  updateQuantite(change: {id: number, quantite: number}) {
    const item = this.panierItems.find(i => i.id === change.id);
    if (item) {
      item.quantite = change.quantite;
    }
  }

  removeItem(id: number) {
    this.panierItems = this.panierItems.filter(item => item.id !== id);
  }

  getSousTotal(): number {
    return this.panierItems.reduce((total, item) => 
      total + (item.peinture.prix * item.quantite), 0);
  }

  getFraisLivraison(): number {
    return this.panierItems.length > 0 ? 50 : 0;
  }

  getTotal(): number {
    return this.getSousTotal() + this.getFraisLivraison();
  }
} 