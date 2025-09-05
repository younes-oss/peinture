import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Peinture {
  id: number;
  titre: string;
  artiste: string;
  prix: number;
  imageUrl: string;
  description: string;
  categorie: string;
}

@Component({
  selector: 'app-peinture-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="peinture-card">
      <div class="peinture-image">
        <img [src]="peinture.imageUrl" [alt]="peinture.titre" />
        <div class="peinture-overlay">
          <button class="btn-details">Voir détails</button>
        </div>
      </div>
      <div class="peinture-info">
        <h3 class="peinture-titre">{{ peinture.titre }}</h3>
        <p class="peinture-artiste">{{ peinture.artiste }}</p>
        <p class="peinture-categorie">{{ peinture.categorie }}</p>
        <div class="peinture-prix">{{ peinture.prix | currency:'EUR' }}</div>
        <button class="btn-ajouter-panier">Ajouter au panier</button>
      </div>
    </div>
  `,
  styles: [`
    .peinture-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .peinture-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
    }
    
    .peinture-image {
      position: relative;
      height: 200px;
      overflow: hidden;
    }
    
    .peinture-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .peinture-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .peinture-card:hover .peinture-overlay {
      opacity: 1;
    }
    
    .btn-details {
      background: #fbbf24;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-weight: 500;
    }
    
    .peinture-info {
      padding: 16px;
    }
    
    .peinture-titre {
      margin: 0 0 8px 0;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
    
    .peinture-artiste {
      margin: 0 0 4px 0;
      color: #666;
      font-size: 14px;
    }
    
    .peinture-categorie {
      margin: 0 0 12px 0;
      color: #888;
      font-size: 12px;
      text-transform: uppercase;
    }
    
    .peinture-prix {
      font-size: 20px;
      font-weight: 700;
      color: #fbbf24;
      margin-bottom: 12px;
    }
    
    .btn-ajouter-panier {
      width: 100%;
      background: #333;
      color: white;
      border: none;
      padding: 10px;
      border-radius: 5px;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.3s ease;
    }
    
    .btn-ajouter-panier:hover {
      background: #555;
    }
  `]
})
export class PeintureCardComponent {
  @Input() peinture!: Peinture;
} 