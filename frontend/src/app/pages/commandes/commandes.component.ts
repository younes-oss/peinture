import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommandeService } from '../../services/commande.service';
import { Commande, StatutInfo } from '../../models/commande.model';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-commandes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="commandes-page">
      <!-- Header avec titre et statistiques -->
      <div class="page-header">
        <div class="header-content">
          <div class="title-section">
            <h1>Mes Commandes</h1>
            <p>Suivez vos achats et livraisons</p>
          </div>
          <div class="stats-section">
            <div class="stat-card">
              <div class="stat-number">{{ commandes.length }}</div>
              <div class="stat-label">Commandes</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ getTotalDepense() | currency:'EUR':'symbol':'1.0-0' }}</div>
              <div class="stat-label">Total dépensé</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Filtres -->
      <div class="filters-section">
        <div class="filter-buttons">
          <button class="filter-btn" 
                  [class.active]="filtreStatut === 'TOUS'"
                  (click)="setFiltreStatut('TOUS')">
            Toutes
          </button>
          <button class="filter-btn" 
                  [class.active]="filtreStatut === 'EN_COURS'"
                  (click)="setFiltreStatut('EN_COURS')">
            En cours
          </button>
          <button class="filter-btn" 
                  [class.active]="filtreStatut === 'EXPEDIEE'"
                  (click)="setFiltreStatut('EXPEDIEE')">
            Expédiées
          </button>
          <button class="filter-btn" 
                  [class.active]="filtreStatut === 'LIVREE'"
                  (click)="setFiltreStatut('LIVREE')">
            Livrées
          </button>
        </div>
      </div>
      
      <!-- Loading state -->
      <div *ngIf="isLoading" class="loading-section">
        <div class="loading-spinner"></div>
        <p>Chargement de vos commandes...</p>
      </div>
      
      <!-- Liste des commandes -->
      <div *ngIf="!isLoading" class="commandes-container">
        <div *ngFor="let commande of getCommandesFiltrees()" class="commande-card">
          <!-- En-tête de la commande -->
          <div class="commande-header">
            <div class="commande-info">
              <h3>Commande #{{ commande.id }}</h3>
              <p class="commande-date">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                </svg>
                {{ commandeService.formatDate(commande.dateCommande) }}
              </p>
            </div>
            <div class="statut-badge" 
                 [style.background-color]="commandeService.getStatutInfo(commande.statut).bgColor"
                 [style.color]="commandeService.getStatutInfo(commande.statut).color">
              {{ commandeService.getStatutInfo(commande.statut).label }}
            </div>
          </div>
          
          <!-- Articles de la commande -->
          <div class="commande-articles">
            <div *ngFor="let article of commande.articles" class="article-item">
              <div class="article-image">
                <img [src]="article.imageUrl" [alt]="article.peintureTitre" />
              </div>
              <div class="article-details">
                <h4>{{ article.peintureTitre }}</h4>
                <p>Quantité: {{ article.quantite }}</p>
                <p class="article-prix">{{ article.prixTotal | currency:'EUR' }}</p>
              </div>
            </div>
          </div>
          
          <!-- Footer de la commande -->
          <div class="commande-footer">
            <div class="commande-resume">
              <div class="resume-item">
                <span>{{ commandeService.getTotalArticles(commande) }} article(s)</span>
              </div>
              <div class="resume-item total">
                <strong>Total: {{ commande.total | currency:'EUR' }}</strong>
              </div>
            </div>
            
            <div class="commande-actions">
              <button class="btn-details" (click)="voirDetails(commande.id)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
                Détails
              </button>
              
              <button *ngIf="commande.statut === 'EN_COURS'" 
                      class="btn-annuler" 
                      (click)="annulerCommande(commande.id)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
                Annuler
              </button>
              
              <button *ngIf="commande.statut === 'EXPEDIEE'" 
                      class="btn-suivre">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                </svg>
                Suivre
              </button>
            </div>
          </div>
        </div>
        
        <!-- État vide -->
        <div *ngIf="getCommandesFiltrees().length === 0 && !isLoading" class="empty-state">
          <div class="empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 7h-1V6a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1H1a1 1 0 0 0 0 2h1v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V9h1a1 1 0 0 0 0-2zM6 4h8a2 2 0 0 1 2 2v1H4V6a2 2 0 0 1 2-2zm10 16H5a1 1 0 0 1-1-1V9h12v10a1 1 0 0 1-1 1z"/>
            </svg>
          </div>
          <h3>Aucune commande trouvée</h3>
          <p>{{ getMessageVide() }}</p>
          <button class="btn-shopping" routerLink="/peintures">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
            Découvrir nos peintures
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .commandes-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 2rem 0;
    }
    
    .page-header {
      background: white;
      margin-bottom: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }
    
    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .title-section h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #2c3e50;
      margin: 0 0 0.5rem 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .title-section p {
      font-size: 1.125rem;
      color: #6c757d;
      margin: 0;
    }
    
    .stats-section {
      display: flex;
      gap: 2rem;
    }
    
    .stat-card {
      text-align: center;
      padding: 1.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px;
      color: white;
      min-width: 120px;
    }
    
    .stat-number {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
    }
    
    .stat-label {
      font-size: 0.875rem;
      opacity: 0.9;
    }
    
    .filters-section {
      max-width: 1200px;
      margin: 0 auto 2rem auto;
      padding: 0 2rem;
    }
    
    .filter-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      background: white;
      padding: 1rem;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      justify-content: flex-start;
      align-items: center;
    }
    
    .filter-btn {
      background: transparent;
      border: 2px solid #e1e5e9;
      border-radius: 50px;
      padding: 0.75rem 1.5rem;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
      color: #6c757d;
      white-space: nowrap;
      flex-shrink: 0;
      min-width: auto;
    }
    
    .filter-btn.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-color: transparent;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    }
    
    .filter-btn:hover:not(.active) {
      border-color: #667eea;
      color: #667eea;
    }
    
    .loading-section {
      text-align: center;
      padding: 4rem 2rem;
      color: #6c757d;
    }
    
    .loading-spinner {
      width: 50px;
      height: 50px;
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
    
    .commandes-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }
    
    .commande-card {
      background: white;
      border-radius: 20px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
      margin-bottom: 2rem;
      overflow: hidden;
      transition: all 0.3s ease;
    }
    
    .commande-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    }
    
    .commande-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2rem;
      border-bottom: 1px solid #f1f3f4;
    }
    
    .commande-info h3 {
      margin: 0 0 0.5rem 0;
      color: #2c3e50;
      font-size: 1.25rem;
      font-weight: 700;
    }
    
    .commande-date {
      margin: 0;
      color: #6c757d;
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .statut-badge {
      padding: 0.5rem 1rem;
      border-radius: 50px;
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: capitalize;
    }
    
    .commande-articles {
      padding: 1.5rem 2rem;
    }
    
    .article-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 0;
      border-bottom: 1px solid #f8f9fa;
    }
    
    .article-item:last-child {
      border-bottom: none;
    }
    
    .article-image {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      overflow: hidden;
      flex-shrink: 0;
    }
    
    .article-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .article-details {
      flex: 1;
    }
    
    .article-details h4 {
      margin: 0 0 0.25rem 0;
      color: #2c3e50;
      font-size: 1rem;
      font-weight: 600;
    }
    
    .article-details p {
      margin: 0.125rem 0;
      color: #6c757d;
      font-size: 0.875rem;
    }
    
    .article-prix {
      color: #667eea !important;
      font-weight: 600 !important;
    }
    
    .commande-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 2rem;
      background: #f8f9fa;
    }
    
    .commande-resume {
      display: flex;
      gap: 2rem;
      align-items: center;
    }
    
    .resume-item {
      color: #6c757d;
      font-size: 0.875rem;
    }
    
    .resume-item.total {
      color: #2c3e50;
      font-size: 1.125rem;
    }
    
    .commande-actions {
      display: flex;
      gap: 1rem;
    }
    
    .btn-details, .btn-annuler, .btn-suivre {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 50px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.875rem;
      transition: all 0.3s ease;
    }
    
    .btn-details {
      background: #f8f9fa;
      color: #6c757d;
      border: 2px solid #e1e5e9;
    }
    
    .btn-details:hover {
      background: #e9ecef;
      color: #495057;
    }
    
    .btn-suivre {
      background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
      color: white;
    }
    
    .btn-suivre:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(23, 162, 184, 0.3);
    }
    
    .btn-annuler {
      background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
      color: white;
    }
    
    .btn-annuler:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(220, 53, 69, 0.3);
    }
    
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #6c757d;
    }
    
    .empty-icon {
      margin-bottom: 2rem;
      color: #dee2e6;
    }
    
    .empty-state h3 {
      margin: 0 0 1rem 0;
      color: #495057;
      font-size: 1.5rem;
    }
    
    .empty-state p {
      margin: 0 0 2rem 0;
      font-size: 1.125rem;
      max-width: 500px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .btn-shopping {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 50px;
      padding: 1rem 2rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
    }
    
    .btn-shopping:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 40px rgba(102, 126, 234, 0.4);
    }
    
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 2rem;
        text-align: center;
      }
      
      .stats-section {
        gap: 1rem;
      }
      
      .stat-card {
        min-width: 100px;
        padding: 1rem;
      }
      
      .filter-buttons {
        flex-wrap: wrap;
        gap: 0.75rem;
        justify-content: center;
        padding: 1rem 0.5rem;
      }
      
      .filter-btn {
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
        min-width: auto;
        flex: 0 0 auto;
      }
      
      .commande-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
      
      .commande-footer {
        flex-direction: column;
        gap: 1rem;
      }
      
      .commande-actions {
        justify-content: center;
        flex-wrap: wrap;
      }
    }
  `]
})
export class CommandesComponent implements OnInit {
  commandes: Commande[] = [];
  isLoading = true;
  filtreStatut: string = 'TOUS';

  constructor(
    public commandeService: CommandeService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadCommandes();
  }

  loadCommandes(): void {
    this.isLoading = true;
    this.commandeService.getMesCommandes().subscribe({
      next: (commandes) => {
        this.commandes = commandes;
        this.isLoading = false;
        
        if (commandes.length === 0) {
          this.notificationService.showInfo(
            'Aucune commande',
            'Vous n\'avez pas encore passé de commande. Découvrez notre collection !'
          );
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des commandes:', error);
        this.isLoading = false;
        this.commandes = [];
        
        let errorMessage = 'Impossible de charger vos commandes.';
        if (error.status === 401) {
          errorMessage = 'Vous devez être connecté pour voir vos commandes.';
        } else if (error.status === 403) {
          errorMessage = 'Vous n\'avez pas l\'autorisation d\'accéder à ces données.';
        } else if (error.status === 0) {
          errorMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion.';
        }
        
        this.notificationService.showError(
          'Erreur de chargement',
          errorMessage
        );
      }
    });
  }

  getCommandesFiltrees(): Commande[] {
    if (this.filtreStatut === 'TOUS') {
      return this.commandes;
    }
    return this.commandes.filter(commande => commande.statut === this.filtreStatut);
  }

  setFiltreStatut(statut: string): void {
    this.filtreStatut = statut;
  }

  getTotalDepense(): number {
    return this.commandes.reduce((total, commande) => total + commande.total, 0);
  }

  getMessageVide(): string {
    if (this.filtreStatut === 'TOUS') {
      return 'Vous n\'avez pas encore passé de commande. Découvrez notre collection de peintures !';
    }
    const statutInfo = this.commandeService.getStatutInfo(this.filtreStatut as any);
    return `Aucune commande ${statutInfo.label.toLowerCase()} trouvée.`;
  }

  voirDetails(commandeId: number): void {
    // TODO: Naviguer vers page de détails ou ouvrir modal
    console.log('Voir détails commande:', commandeId);
  }

  annulerCommande(commandeId: number): void {
    const commande = this.commandes.find(c => c.id === commandeId);
    const commandeNumero = commande ? `#${commande.id}` : `#${commandeId}`;
    
    if (confirm(`Êtes-vous sûr de vouloir annuler la commande ${commandeNumero} ?`)) {
      this.commandeService.annulerCommande(commandeId).subscribe({
        next: (commandeAnnulee) => {
          console.log('Commande annulée:', commandeAnnulee);
          this.notificationService.showSuccess(
            'Commande annulée',
            `La commande ${commandeNumero} a été annulée avec succès.`
          );
          // Recharger les commandes
          this.loadCommandes();
        },
        error: (error) => {
          console.error('Erreur lors de l\'annulation:', error);
          
          let errorMessage = 'Impossible d\'annuler cette commande.';
          if (error.error && typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.status === 400) {
            errorMessage = 'Cette commande ne peut plus être annulée.';
          }
          
          this.notificationService.showError(
            'Erreur d\'annulation',
            errorMessage
          );
        }
      });
    }
  }
}