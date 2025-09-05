import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PanierItem {
  id: number;
  peinture: {
    id: number;
    titre: string;
    artiste: string;
    prix: number;
    imageUrl: string;
  };
  quantite: number;
}

@Component({
  selector: 'app-panier-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="panier-item">
      <div class="item-image">
        <img [src]="item.peinture.imageUrl" [alt]="item.peinture.titre" />
      </div>
      
      <div class="item-details">
        <h4 class="item-titre">{{ item.peinture.titre }}</h4>
        <p class="item-artiste">{{ item.peinture.artiste }}</p>
        <p class="item-prix">{{ item.peinture.prix | currency:'EUR' }}</p>
      </div>
      
      <div class="item-quantite">
        <button class="btn-quantite" (click)="decreaseQuantite()">-</button>
        <span class="quantite-value">{{ item.quantite }}</span>
        <button class="btn-quantite" (click)="increaseQuantite()">+</button>
      </div>
      
      <div class="item-total">
        <span class="total-price">{{ getTotalPrice() | currency:'EUR' }}</span>
      </div>
      
      <div class="item-actions">
        <button class="btn-remove" (click)="removeItem()">
          <span class="remove-icon">×</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .panier-item {
      display: flex;
      align-items: center;
      padding: 16px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 12px;
      gap: 16px;
    }
    
    .item-image {
      width: 80px;
      height: 80px;
      border-radius: 6px;
      overflow: hidden;
      flex-shrink: 0;
    }
    
    .item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .item-details {
      flex: 1;
      min-width: 0;
    }
    
    .item-titre {
      margin: 0 0 4px 0;
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
    
    .item-artiste {
      margin: 0 0 4px 0;
      font-size: 14px;
      color: #666;
    }
    
    .item-prix {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #fbbf24;
    }
    
    .item-quantite {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }
    
    .btn-quantite {
      width: 32px;
      height: 32px;
      border: 1px solid #ddd;
      background: white;
      border-radius: 4px;
      cursor: pointer;
      font-size: 18px;
      font-weight: 600;
      color: #333;
      transition: all 0.3s ease;
    }
    
    .btn-quantite:hover {
      background: #f0f0f0;
      border-color: #ccc;
    }
    
    .quantite-value {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      min-width: 24px;
      text-align: center;
    }
    
    .item-total {
      flex-shrink: 0;
      text-align: right;
    }
    
    .total-price {
      font-size: 18px;
      font-weight: 700;
      color: #333;
    }
    
    .item-actions {
      flex-shrink: 0;
    }
    
    .btn-remove {
      width: 32px;
      height: 32px;
      border: none;
      background: #ff4757;
      color: white;
      border-radius: 50%;
      cursor: pointer;
      font-size: 20px;
      font-weight: 600;
      transition: background 0.3s ease;
    }
    
    .btn-remove:hover {
      background: #ff3742;
    }
    
    .remove-icon {
      line-height: 1;
    }
  `]
})
export class PanierItemComponent {
  @Input() item!: PanierItem;
  @Output() quantiteChange = new EventEmitter<{id: number, quantite: number}>();
  @Output() remove = new EventEmitter<number>();

  increaseQuantite() {
    this.quantiteChange.emit({
      id: this.item.id,
      quantite: this.item.quantite + 1
    });
  }

  decreaseQuantite() {
    if (this.item.quantite > 1) {
      this.quantiteChange.emit({
        id: this.item.id,
        quantite: this.item.quantite - 1
      });
    }
  }

  removeItem() {
    this.remove.emit(this.item.id);
  }

  getTotalPrice(): number {
    return this.item.peinture.prix * this.item.quantite;
  }
} 