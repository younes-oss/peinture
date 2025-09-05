import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Artiste {
  id: number;
  nom: string;
  specialite: string;
  bio: string;
  imageUrl: string;
  nombreOeuvres: number;
  pays: string;
}

@Component({
  selector: 'app-artiste-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="artiste-card">
      <div class="artiste-image">
        <img [src]="artiste.imageUrl" [alt]="artiste.nom" />
      </div>
      <div class="artiste-info">
        <h3 class="artiste-nom">{{ artiste.nom }}</h3>
        <p class="artiste-specialite">{{ artiste.specialite }}</p>
        <p class="artiste-pays">{{ artiste.pays }}</p>
        <p class="artiste-bio">{{ artiste.bio }}</p>
        <div class="artiste-stats">
          <span class="oeuvres-count">{{ artiste.nombreOeuvres }} œuvres</span>
        </div>
        <button class="btn-voir-oeuvres">Voir ses œuvres</button>
      </div>
    </div>
  `,
  styles: [`
    .artiste-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      overflow: hidden;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .artiste-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    }
    
    .artiste-image {
      height: 200px;
      overflow: hidden;
    }
    
    .artiste-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .artiste-info {
      padding: 20px;
    }
    
    .artiste-nom {
      margin: 0 0 8px 0;
      font-size: 22px;
      font-weight: 700;
      color: #333;
    }
    
    .artiste-specialite {
      margin: 0 0 4px 0;
      color: #fbbf24;
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .artiste-pays {
      margin: 0 0 12px 0;
      color: #666;
      font-size: 14px;
    }
    
    .artiste-bio {
      margin: 0 0 16px 0;
      color: #555;
      font-size: 14px;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .artiste-stats {
      margin-bottom: 16px;
    }
    
    .oeuvres-count {
      background: #f0f0f0;
      color: #666;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }
    
    .btn-voir-oeuvres {
      width: 100%;
      background: #333;
      color: white;
      border: none;
      padding: 12px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.3s ease;
    }
    
    .btn-voir-oeuvres:hover {
      background: #555;
    }
  `]
})
export class ArtisteCardComponent {
  @Input() artiste!: Artiste;
} 