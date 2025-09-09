import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PeintureService } from '../../services/peinture.service';
import { Peinture, Categorie } from '../../models/peinture.model';
import { HeroComponent } from '../../components/shared/hero/hero.component';
import { CategoryCardComponent } from '../../components/shared/category-card/category-card.component';
import { PaintingCardComponent } from '../../components/shared/painting-card/painting-card.component';
import { LoginComponent } from '../../components/auth/login/login.component';
import { RegisterComponent } from '../../components/auth/register/register.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, HeroComponent, CategoryCardComponent, PaintingCardComponent, LoginComponent, RegisterComponent],
  template: `
    <div class="home-page">
      <!-- Hero Section -->
      <app-hero 
        (login)="showLoginModal = true"
        (register)="showRegisterModal = true">
      </app-hero>

      <!-- Login Modal -->
      <app-login 
        *ngIf="showLoginModal"
        (close)="showLoginModal = false"
        (switchToRegister)="switchToRegister()">
      </app-login>

      <!-- Register Modal -->
      <app-register 
        *ngIf="showRegisterModal"
        (close)="showRegisterModal = false"
        (switchToLogin)="switchToLogin()">
      </app-register>

      <!-- Categories Section -->
      <section class="categories-section">
        <div class="container">
          <div class="section-header">
            <h2>Explorez par catégorie</h2>
            <p>Découvrez nos collections organisées par style et mouvement artistique</p>
          </div>
          <div class="categories-grid">
            <app-category-card 
              *ngFor="let categorie of categories" 
              [categorie]="categorie">
            </app-category-card>
          </div>
        </div>
      </section>

      <!-- Featured Paintings Section -->
      <section class="featured-section">
        <div class="container">
          <div class="section-header">
            <h2>Nos meilleures ventes</h2>
            <p>Des œuvres uniques pour tous les budgets. De l'inspiration sans limite, à portée de clic.</p>
          </div>
          <div class="paintings-grid" *ngIf="featuredPaintings.length > 0; else loadingPaintings">
            <app-painting-card 
              *ngFor="let peinture of featuredPaintings" 
              [peinture]="peinture">
            </app-painting-card>
          </div>
          <ng-template #loadingPaintings>
            <div class="loading-state">
              <div class="loading-spinner"></div>
              <p>Chargement des œuvres...</p>
            </div>
          </ng-template>
          <div class="section-footer">
            <button class="btn-view-all" routerLink="/peintures">
              Voir toutes les œuvres
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

      <!-- Artists Section -->
      <section class="artists-section">
        <div class="container">
          <div class="section-header">
            <h2>Découvrez nos artistes</h2>
            <p>Rencontrez les créateurs talentueux qui façonnent l'art contemporain</p>
          </div>
          <div class="artists-preview">
            <div class="artist-card" *ngFor="let artiste of featuredArtists">
              <div class="artist-avatar">
                <img [src]="getArtistAvatar(artiste)" [alt]="artiste.prenom + ' ' + artiste.nom">
              </div>
              <div class="artist-info">
                <h3>{{ artiste.prenom }} {{ artiste.nom }}</h3>
                <p>{{ artiste.specialite || 'Artiste' }}</p>
                <span class="artist-location">{{ artiste.ville }}, {{ artiste.pays }}</span>
              </div>
            </div>
          </div>
          <div class="section-footer">
            <button class="btn-view-all" routerLink="/artistes">
              Voir tous les artistes
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

      <!-- Newsletter Section -->
      <section class="newsletter-section">
        <div class="container">
          <div class="newsletter-content">
            <h2>Restez informé de nos nouveautés</h2>
            <p>Recevez en exclusivité les dernières œuvres de nos artistes et nos offres spéciales</p>
            <form class="newsletter-form">
              <input type="email" placeholder="Votre adresse email" class="newsletter-input">
              <button type="submit" class="newsletter-btn">S'abonner</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-page {
      min-height: 100vh;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .section-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .section-header h2 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #2c3e50;
      margin-bottom: 1rem;
    }

    .section-header p {
      font-size: 1.125rem;
      color: #6c757d;
      max-width: 600px;
      margin: 0 auto;
    }

    .categories-section {
      padding: 5rem 0;
      background: #f8f9fa;
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .featured-section {
      padding: 5rem 0;
      background: white;
    }

    .paintings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .loading-state {
      text-align: center;
      padding: 3rem;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .section-footer {
      text-align: center;
    }

    .btn-view-all {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 50px;
      padding: 1rem 2rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-view-all:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
    }

    .artists-section {
      padding: 5rem 0;
      background: #f8f9fa;
    }

    .artists-preview {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .artist-card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
    }

    .artist-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    }

    .artist-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      overflow: hidden;
      margin: 0 auto 1rem;
      border: 4px solid #667eea;
    }

    .artist-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .artist-info h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: #2c3e50;
    }

    .artist-info p {
      margin: 0 0 0.5rem 0;
      color: #6c757d;
      font-size: 0.9rem;
    }

    .artist-location {
      font-size: 0.8rem;
      color: #adb5bd;
    }

    .newsletter-section {
      padding: 5rem 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .newsletter-content {
      text-align: center;
      max-width: 600px;
      margin: 0 auto;
    }

    .newsletter-content h2 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .newsletter-content p {
      font-size: 1.125rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }

    .newsletter-form {
      display: flex;
      gap: 1rem;
      max-width: 400px;
      margin: 0 auto;
    }

    .newsletter-input {
      flex: 1;
      padding: 1rem;
      border: none;
      border-radius: 50px;
      font-size: 1rem;
    }

    .newsletter-input:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
    }

    .newsletter-btn {
      background: white;
      color: #667eea;
      border: none;
      border-radius: 50px;
      padding: 1rem 2rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .newsletter-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    }

    @media (max-width: 768px) {
      .container {
        padding: 0 1rem;
      }

      .section-header h2 {
        font-size: 2rem;
      }

      .newsletter-form {
        flex-direction: column;
      }

      .newsletter-input, .newsletter-btn {
        border-radius: 12px;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  featuredPaintings: Peinture[] = [];
  featuredArtists: any[] = [];
  categories: Categorie[] = [];
  
  showLoginModal = false;
  showRegisterModal = false;

  constructor(private peintureService: PeintureService) {}

  ngOnInit() {
    this.loadFeaturedPaintings();
    this.loadCategories();
    this.loadFeaturedArtists();
  }

  loadFeaturedPaintings() {
    this.peintureService.getAllPeintures().subscribe({
      next: (paintings) => {
        this.featuredPaintings = paintings.slice(0, 6); // Afficher les 6 premières
      },
      error: (error) => {
        console.error('Erreur lors du chargement des peintures:', error);
      }
    });
  }

  loadCategories() {
    this.categories = [
      {
        code: 'ABSTRACTION',
        libelle: 'Abstraction',
        imageUrl: 'assets/images/abstraction.jpg',
        count: 45
      },
      {
        code: 'REALISME',
        libelle: 'Réalisme',
        imageUrl: 'assets/images/realisme.jpg',
        count: 32
      },
      {
        code: 'IMPRESSIONNISME',
        libelle: 'Impressionnisme',
        imageUrl: 'assets/images/impressionnisme.jpg',
        count: 28
      },
      {
        code: 'SURREALISME',
        libelle: 'Surréalisme',
        imageUrl: 'assets/images/surrealisme.jpg',
        count: 19
      },
      {
        code: 'CONTEMPORAIN',
        libelle: 'Contemporain',
        imageUrl: 'assets/images/contemporain.jpg',
        count: 67
      },
      {
        code: 'CLASSIQUE',
        libelle: 'Classique',
        imageUrl: 'assets/images/classique.jpg',
        count: 23
      }
    ];
  }

  loadFeaturedArtists() {
    // Données mockées pour l'instant
    this.featuredArtists = [
      {
        prenom: 'Jean',
        nom: 'Dupont',
        specialite: 'Peinture abstraite',
        ville: 'Paris',
        pays: 'France'
      },
      {
        prenom: 'Marie',
        nom: 'Martin',
        specialite: 'Portrait',
        ville: 'Lyon',
        pays: 'France'
      },
      {
        prenom: 'Pierre',
        nom: 'Durand',
        specialite: 'Paysage',
        ville: 'Marseille',
        pays: 'France'
      }
    ];
  }

  getArtistAvatar(artiste: any): string {
    // Placeholder pour l'avatar de l'artiste
    return `https://ui-avatars.com/api/?name=${artiste.prenom}+${artiste.nom}&background=667eea&color=fff&size=200`;
  }

  switchToRegister() {
    this.showLoginModal = false;
    this.showRegisterModal = true;
  }

  switchToLogin() {
    this.showRegisterModal = false;
    this.showLoginModal = true;
  }
} 