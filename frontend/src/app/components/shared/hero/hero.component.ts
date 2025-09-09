import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/auth.model';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          Découvrez l'art qui vous <span class="highlight">ressemble</span>
        </h1>
        <p class="hero-subtitle">
          Explorez notre collection d'œuvres d'art uniques, créées par des artistes talentueux du monde entier
        </p>
        <div class="hero-actions">
          <button class="btn-primary" routerLink="/peintures">
            Explorer la collection
          </button>
          <button class="btn-secondary" routerLink="/artistes">
            Découvrir les artistes
          </button>
        </div>
        
        <!-- Auth Section -->
        <div class="hero-auth" *ngIf="!isAuthenticated">
          <div class="auth-buttons">
            <button class="btn-login" (click)="onLogin()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4m-5-4l5-5-5-5m5 5H3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Se connecter
            </button>
            <button class="btn-register" (click)="onRegister()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM20 8v6M23 11h-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Créer un compte
            </button>
          </div>
          <p class="auth-description">
            Rejoignez notre communauté d'artistes et collectionneurs
          </p>
        </div>

        <!-- User Section -->
        <div class="hero-user" *ngIf="isAuthenticated">
          <div class="user-welcome">
            <h3>Bonjour {{ currentUser?.prenom }} ! 👋</h3>
            <p *ngIf="isArtiste">Prêt à partager vos créations ?</p>
            <p *ngIf="isClient">Découvrez de nouvelles œuvres d'art</p>
          </div>
          <div class="user-actions">
            <button class="btn-primary" routerLink="/peintures" *ngIf="isClient">
              Explorer la collection
            </button>
            <button class="btn-primary" routerLink="/peintures" *ngIf="isArtiste">
              Mes œuvres
            </button>
            <button class="btn-logout" (click)="onLogout()">
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
      <div class="hero-image">
        <div class="artwork-preview">
          <img src="assets/images/énergie.jpg" alt="Œuvre d'art" class="preview-image">
          <div class="artwork-info">
            <h3>Énergie</h3>
            <p>Artiste contemporain</p>
            <span class="price">1 200 €</span>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero-section {
      display: flex;
      align-items: center;
      min-height: 80vh;
      padding: 4rem 2rem;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      gap: 4rem;
    }

    .hero-content {
      flex: 1;
      max-width: 600px;
    }

    .hero-title {
      font-size: 3.5rem;
      font-weight: 700;
      line-height: 1.1;
      margin-bottom: 1.5rem;
      color: #2c3e50;
    }

    .highlight {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      color: #6c757d;
      margin-bottom: 2.5rem;
      line-height: 1.6;
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .btn-primary, .btn-secondary {
      padding: 1rem 2rem;
      border-radius: 50px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s ease;
      border: none;
      cursor: pointer;
      font-size: 1rem;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
    }

    .btn-secondary {
      background: transparent;
      color: #667eea;
      border: 2px solid #667eea;
    }

    .btn-secondary:hover {
      background: #667eea;
      color: white;
      transform: translateY(-2px);
    }

    .hero-auth {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #e9ecef;
    }

    .auth-buttons {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    .btn-login, .btn-register {
      padding: 0.75rem 1.5rem;
      border-radius: 50px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s ease;
      border: none;
      cursor: pointer;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-login {
      background: transparent;
      color: #667eea;
      border: 2px solid #667eea;
    }

    .btn-login:hover {
      background: #667eea;
      color: white;
      transform: translateY(-2px);
    }

    .btn-register {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-register:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    }

    .auth-description {
      color: #6c757d;
      font-size: 0.9rem;
      margin: 0;
    }

    .hero-user {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #e9ecef;
    }

    .user-welcome h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
      color: #2c3e50;
    }

    .user-welcome p {
      margin: 0 0 1.5rem 0;
      color: #6c757d;
    }

    .user-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .btn-logout {
      background: transparent;
      color: #6c757d;
      border: 2px solid #e9ecef;
      padding: 0.75rem 1.5rem;
      border-radius: 50px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-logout:hover {
      background: #e74c3c;
      color: white;
      border-color: #e74c3c;
      transform: translateY(-2px);
    }

    .hero-image {
      flex: 1;
      display: flex;
      justify-content: center;
    }

    .artwork-preview {
      position: relative;
      max-width: 400px;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }

    .artwork-preview:hover {
      transform: translateY(-10px);
    }

    .preview-image {
      width: 100%;
      height: 300px;
      object-fit: cover;
    }

    .artwork-info {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
      color: white;
      padding: 2rem 1.5rem 1.5rem;
    }

    .artwork-info h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .artwork-info p {
      margin: 0 0 0.5rem 0;
      opacity: 0.9;
    }

    .price {
      font-size: 1.25rem;
      font-weight: 700;
      color: #ffd700;
    }

    @media (max-width: 768px) {
      .hero-section {
        flex-direction: column;
        text-align: center;
        padding: 2rem 1rem;
      }

      .hero-title {
        font-size: 2.5rem;
      }

      .hero-actions {
        justify-content: center;
      }
    }
  `]
})
export class HeroComponent {
  @Output() login = new EventEmitter<void>();
  @Output() register = new EventEmitter<void>();

  isAuthenticated = false;
  currentUser: User | null = null;
  isArtiste = false;
  isClient = false;

  constructor(private authService: AuthService) {
    this.authService.authState$.subscribe(state => {
      this.isAuthenticated = state.isAuthenticated;
      this.currentUser = state.user;
      this.isArtiste = this.authService.isArtiste();
      this.isClient = this.authService.isClient();
    });
  }

  onLogin() {
    this.login.emit();
  }

  onRegister() {
    this.register.emit();
  }

  onLogout() {
    this.authService.logout();
  }
}
