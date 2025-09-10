import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Peinture } from '../../../models/peinture.model';

@Component({
  selector: 'app-painting-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="painting-card">
      <div class="painting-image">
        <img [src]="peinture.imageUrl" [alt]="peinture.titre" loading="lazy">
        <div class="painting-overlay">
          <button class="btn-favorite" (click)="toggleFavorite($event)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                    [attr.fill]="isFavorite ? '#e74c3c' : 'none'" 
                    [attr.stroke]="isFavorite ? '#e74c3c' : 'white'" 
                    stroke-width="2"/>
            </svg>
          </button>
          <button class="btn-quick-view" (click)="quickView($event)">
            Voir détails
          </button>
        </div>
        <div class="painting-badge" *ngIf="peinture.stock <= 3">
          Stock limité
        </div>
      </div>
      <div class="painting-info">
        <h3 class="painting-title">{{ peinture.titre }}</h3>
        <p class="painting-artist">{{ peinture.artiste.prenom }} {{ peinture.artiste.nom }}</p>
        <div class="painting-meta">
          <span class="painting-category">{{ peinture.categorieLibelle }}</span>
          <span class="painting-year">{{ getYear(peinture.dateCreation) }}</span>
        </div>
        <div class="painting-price">
          <span class="price">{{ formatPrice(peinture.prix) }}</span>
          <span class="stock" *ngIf="peinture.stock > 0">{{ peinture.stock }} en stock</span>
          <span class="out-of-stock" *ngIf="peinture.stock === 0">Épuisé</span>
        </div>
        <!-- Boutons pour artiste -->
        <div *ngIf="context === 'artist'" class="artist-actions">
          <button class="btn-edit" (click)="editPeinture($event)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Modifier
          </button>
          <button class="btn-delete" (click)="deletePeinture($event)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Supprimer
          </button>
        </div>
        
        <!-- Bouton panier pour clients -->
        <button *ngIf="context === 'client'" class="btn-add-to-cart" 
                [disabled]="peinture.stock === 0 || !peinture.disponible"
                (click)="addToCart($event)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" 
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Ajouter au panier
        </button>
      </div>
    </div>
  `,
  styles: [`
    .painting-card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      position: relative;
    }

    .painting-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    }

    .painting-image {
      position: relative;
      height: 250px;
      overflow: hidden;
    }

    .painting-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .painting-card:hover .painting-image img {
      transform: scale(1.05);
    }

    .painting-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .painting-card:hover .painting-overlay {
      opacity: 1;
    }

    .btn-favorite, .btn-quick-view {
      background: white;
      border: none;
      border-radius: 50px;
      padding: 0.75rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-favorite {
      width: 44px;
      height: 44px;
    }

    .btn-quick-view {
      padding: 0.75rem 1.5rem;
      font-weight: 600;
      color: #2c3e50;
    }

    .btn-favorite:hover, .btn-quick-view:hover {
      transform: scale(1.1);
    }

    .painting-badge {
      position: absolute;
      top: 1rem;
      left: 1rem;
      background: #e74c3c;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .painting-info {
      padding: 1.5rem;
    }

    .painting-title {
      margin: 0 0 0.5rem 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: #2c3e50;
      line-height: 1.3;
    }

    .painting-artist {
      margin: 0 0 1rem 0;
      color: #6c757d;
      font-size: 0.9rem;
    }

    .painting-meta {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
      font-size: 0.8rem;
    }

    .painting-category {
      background: #f8f9fa;
      color: #495057;
      padding: 0.25rem 0.5rem;
      border-radius: 8px;
    }

    .painting-year {
      color: #6c757d;
    }

    .painting-price {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .price {
      font-size: 1.25rem;
      font-weight: 700;
      color: #2c3e50;
    }

    .stock {
      font-size: 0.8rem;
      color: #28a745;
    }

    .out-of-stock {
      font-size: 0.8rem;
      color: #dc3545;
    }

    .btn-add-to-cart {
      width: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 12px;
      padding: 0.75rem 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .btn-add-to-cart:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    }

    .btn-add-to-cart:disabled {
      background: #6c757d;
      cursor: not-allowed;
    }

    .artist-actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-edit, .btn-delete {
      flex: 1;
      border: none;
      border-radius: 12px;
      padding: 0.75rem 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .btn-edit {
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
      color: white;
    }

    .btn-edit:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(40, 167, 69, 0.3);
    }

    .btn-delete {
      background: linear-gradient(135deg, #dc3545 0%, #e74c3c 100%);
      color: white;
    }

    .btn-delete:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(220, 53, 69, 0.3);
    }
  `]
})
export class PaintingCardComponent {
  @Input() peinture!: Peinture;
  @Output() peintureDeleted = new EventEmitter<number>();
  isFavorite = false;
  @Input() context: 'client' | 'artist' = 'client';

  constructor(private router: Router) {}

  toggleFavorite(event: Event) {
    event.stopPropagation();
    this.isFavorite = !this.isFavorite;
  }

  quickView(event: Event) {
    event.stopPropagation();
    // TODO: Implémenter la vue rapide
    console.log('Vue rapide:', this.peinture.titre);
  }

  addToCart(event: Event) {
    event.stopPropagation();
    // TODO: Implémenter l'ajout au panier
    console.log('Ajouter au panier:', this.peinture.titre);
  }

  editPeinture(event: Event) {
    event.stopPropagation();
    this.router.navigateByUrl(`/dashboard/artiste/${this.peinture.id}`);
  }

  deletePeinture(event: Event) {
    event.stopPropagation();
    if (confirm(`Supprimer "${this.peinture.titre}" ?`)) {
      this.peintureDeleted.emit(this.peinture.id);
    }
  }

  getYear(dateString: string): string {
    return new Date(dateString).getFullYear().toString();
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }
}
