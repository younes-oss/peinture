import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Categorie } from '../../../models/peinture.model';

@Component({
  selector: 'app-category-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="category-card" [routerLink]="['/peintures']" [queryParams]="{categorie: categorie.code}">
      <div class="category-image">
        <img [src]="categorie.imageUrl" [alt]="categorie.libelle" loading="lazy">
        <div class="category-overlay">
          <span class="category-count">{{ categorie.count }} œuvres</span>
        </div>
      </div>
      <div class="category-info">
        <h3 class="category-title">{{ categorie.libelle }}</h3>
        <p class="category-description">Découvrez notre sélection de {{ categorie.libelle.toLowerCase() }}</p>
      </div>
    </div>
  `,
  styles: [`
    .category-card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      cursor: pointer;
      text-decoration: none;
      color: inherit;
    }

    .category-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    }

    .category-image {
      position: relative;
      height: 200px;
      overflow: hidden;
    }

    .category-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .category-card:hover .category-image img {
      transform: scale(1.05);
    }

    .category-overlay {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .category-info {
      padding: 1.5rem;
    }

    .category-title {
      margin: 0 0 0.5rem 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #2c3e50;
    }

    .category-description {
      margin: 0;
      color: #6c757d;
      font-size: 0.9rem;
      line-height: 1.4;
    }
  `]
})
export class CategoryCardComponent {
  @Input() categorie!: Categorie;
}
