import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtisteCardComponent, Artiste } from '../../components/artiste/artiste-card/artiste-card.component';

@Component({
  selector: 'app-artistes',
  standalone: true,
  imports: [CommonModule, ArtisteCardComponent],
  template: `
    <div class="artistes-page">
      <div class="page-header">
        <h1>Nos Artistes</h1>
        <p>Découvrez les talents derrière nos œuvres</p>
      </div>
      
      <div class="artistes-grid">
        <app-artiste-card 
          *ngFor="let artiste of artistes" 
          [artiste]="artiste">
        </app-artiste-card>
      </div>
    </div>
  `,
  styles: [`
    .artistes-page {
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
    
    .artistes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
    }
  `]
})
export class ArtistesComponent {
  artistes: Artiste[] = [
    {
      id: 1,
      nom: "Claude Monet",
      specialite: "Impressionnisme",
      bio: "Pionnier de l'impressionnisme français, Monet est célèbre pour ses séries de peintures de nymphéas et ses paysages en plein air.",
      imageUrl: "https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Claude+Monet",
      nombreOeuvres: 15,
      pays: "France"
    },
    {
      id: 2,
      nom: "Vincent van Gogh",
      specialite: "Post-impressionnisme",
      bio: "Artiste néerlandais dont l'œuvre expressive et colorée a profondément influencé l'art du XXe siècle.",
      imageUrl: "https://via.placeholder.com/300x200/8B4513/FFFFFF?text=Van+Gogh",
      nombreOeuvres: 12,
      pays: "Pays-Bas"
    },
    {
      id: 3,
      nom: "Salvador Dalí",
      specialite: "Surréalisme",
      bio: "Maître du surréalisme espagnol, Dalí est connu pour ses œuvres oniriques et son style unique.",
      imageUrl: "https://via.placeholder.com/300x200/FFD700/000000?text=Salvador+Dali",
      nombreOeuvres: 8,
      pays: "Espagne"
    }
  ];
} 