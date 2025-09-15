import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PanierItemComponent, PanierItem } from '../../components/panier/panier-item/panier-item.component';
import { PanierService, PanierDto, PanierItemDto } from '../../services/panier.service';
import { CommandeService } from '../../services/commande.service';
import { CreerCommandeRequest } from '../../models/commande.model';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [CommonModule, FormsModule, PanierItemComponent],
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
          <button class="btn-commander" 
                  [disabled]="panierItems.length === 0 || isCreatingCommande"
                  (click)="showCommandeForm = true">
            <span *ngIf="!isCreatingCommande">Passer la commande</span>
            <span *ngIf="isCreatingCommande">Création en cours...</span>
          </button>
        </div>
      </div>

      <!-- Modal de commande -->
      <div *ngIf="showCommandeForm" class="modal-overlay" (click)="closeCommandeForm()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Finaliser votre commande</h3>
            <button class="btn-close" (click)="closeCommandeForm()">&times;</button>
          </div>
          
          <div class="modal-body">
            <form (ngSubmit)="passerCommande()" #commandeForm="ngForm">
              <div class="form-group">
                <label for="adresse">Adresse de livraison *</label>
                <textarea id="adresse" 
                         name="adresse"
                         [(ngModel)]="commandeRequest.adresseLivraison"
                         required
                         placeholder="Entrez votre adresse complète de livraison"
                         class="form-control"></textarea>
              </div>
              
              <div class="form-group">
                <label for="commentaire">Commentaire (optionnel)</label>
                <textarea id="commentaire" 
                         name="commentaire"
                         [(ngModel)]="commandeRequest.commentaire"
                         placeholder="Instructions spéciales pour la livraison"
                         class="form-control"></textarea>
              </div>
              
              <div class="resume-commande">
                <h4>Résumé de votre commande</h4>
                <div class="resume-item">
                  <span>Articles ({{ getTotalArticles() }})</span>
                  <span>{{ getSousTotal() | currency:'EUR' }}</span>
                </div>
                <div class="resume-item">
                  <span>Livraison</span>
                  <span>{{ getFraisLivraison() | currency:'EUR' }}</span>
                </div>
                <div class="resume-item total">
                  <span>Total</span>
                  <span>{{ getTotal() | currency:'EUR' }}</span>
                </div>
              </div>
              
              <div class="modal-actions">
                <button type="button" 
                        class="btn-secondary" 
                        (click)="closeCommandeForm()">Annuler</button>
                <button type="submit" 
                        class="btn-primary"
                        [disabled]="!commandeForm.valid || isCreatingCommande">
                  <span *ngIf="!isCreatingCommande">Confirmer la commande</span>
                  <span *ngIf="isCreatingCommande">Création...</span>
                </button>
              </div>
            </form>
          </div>
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
    
    /* Styles pour le modal */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    
    .modal-content {
      background: white;
      border-radius: 12px;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px;
      border-bottom: 1px solid #eee;
    }
    
    .modal-header h3 {
      margin: 0;
      color: #333;
      font-size: 20px;
    }
    
    .btn-close {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #666;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.2s;
    }
    
    .btn-close:hover {
      background: #f5f5f5;
      color: #333;
    }
    
    .modal-body {
      padding: 24px;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #333;
    }
    
    .form-control {
      width: 100%;
      padding: 12px;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 14px;
      transition: border-color 0.2s;
      resize: vertical;
      min-height: 100px;
    }
    
    .form-control:focus {
      outline: none;
      border-color: #fbbf24;
    }
    
    .resume-commande {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin: 24px 0;
    }
    
    .resume-commande h4 {
      margin: 0 0 16px 0;
      color: #333;
      font-size: 16px;
    }
    
    .resume-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      padding: 4px 0;
    }
    
    .resume-item.total {
      border-top: 2px solid #333;
      margin-top: 12px;
      padding-top: 12px;
      font-weight: 700;
      font-size: 16px;
    }
    
    .modal-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }
    
    .btn-secondary {
      background: #f8f9fa;
      color: #333;
      border: 2px solid #e1e5e9;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
    }
    
    .btn-secondary:hover {
      background: #e9ecef;
    }
    
    .btn-primary {
      background: #fbbf24;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
    }
    
    .btn-primary:hover:not(:disabled) {
      background: #f59e0b;
    }
    
    .btn-primary:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  `]
})
export class PanierComponent implements OnInit {
  panierItems: PanierItem[] = [];
  panier: PanierDto | null = null;
  showCommandeForm = false;
  isCreatingCommande = false;
  commandeRequest: CreerCommandeRequest = {
    adresseLivraison: '',
    commentaire: ''
  };

  constructor(
    private panierService: PanierService,
    private commandeService: CommandeService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPanier();
  }

  loadPanier(): void {
    this.panierService.getMyPanier().subscribe({
      next: (panier: PanierDto) => {
        this.panier = panier;
        this.panierItems = this.convertToPanierItems(panier.items);
      },
      error: (err) => {
        console.error('Erreur chargement panier:', err);
        this.panierItems = [];
      }
    });
  }

  private convertToPanierItems(items: PanierItemDto[]): PanierItem[] {
    return items.map((item, index) => ({
      id: index + 1, // ID temporaire pour le composant
      peinture: {
        id: item.peintureId,
        titre: item.peintureTitre,
        artiste: '', // Pas d'info artiste dans PanierItemDto
        prix: item.prixUnitaire,
        imageUrl: item.imageUrl
      },
      quantite: item.quantite
    }));
  }

  updateQuantite(change: {id: number, quantite: number}) {
    const item = this.panierItems.find(i => i.id === change.id);
    if (item) {
      this.panierService.updateQuantity(item.peinture.id, change.quantite).subscribe({
        next: () => {
          this.loadPanier();
          this.notificationService.showInfo(
            'Panier mis à jour',
            'La quantité a été modifiée avec succès'
          );
        },
        error: (err) => {
          console.error('Erreur mise à jour quantité:', err);
          this.notificationService.showError(
            'Erreur de mise à jour',
            'Impossible de modifier la quantité. Veuillez réessayer.'
          );
        }
      });
    }
  }

  removeItem(id: number) {
    const item = this.panierItems.find(i => i.id === id);
    if (item) {
      this.panierService.removeItem(item.peinture.id).subscribe({
        next: () => {
          this.loadPanier();
          this.notificationService.showInfo(
            'Article supprimé',
            `"${item.peinture.titre}" a été retiré de votre panier`
          );
        },
        error: (err) => {
          console.error('Erreur suppression:', err);
          this.notificationService.showError(
            'Erreur de suppression',
            'Impossible de supprimer l\'article. Veuillez réessayer.'
          );
        }
      });
    }
  }

  getSousTotal(): number {
    return this.panier?.total || 0;
  }

  getFraisLivraison(): number {
    return this.panierItems.length > 0 ? 50 : 0;
  }

  getTotal(): number {
    return this.getSousTotal() + this.getFraisLivraison();
  }

  getTotalArticles(): number {
    return this.panierItems.reduce((total, item) => total + item.quantite, 0);
  }

  closeCommandeForm(): void {
    this.showCommandeForm = false;
    this.commandeRequest = {
      adresseLivraison: '',
      commentaire: ''
    };
  }

  passerCommande(): void {
    if (!this.commandeRequest.adresseLivraison.trim()) {
      this.notificationService.showWarning(
        'Adresse manquante', 
        'Veuillez saisir une adresse de livraison'
      );
      return;
    }

    this.isCreatingCommande = true;

    this.commandeService.creerCommande(this.commandeRequest).subscribe({
      next: (commande) => {
        console.log('Commande créée avec succès:', commande);
        this.notificationService.showSuccess(
          'Commande créée !',
          `Votre commande #${commande.id} a été créée avec succès. Vous allez être redirigé vers vos commandes.`
        );
        this.closeCommandeForm();
        // Rediriger vers la page des commandes après un petit délai
        setTimeout(() => {
          this.router.navigate(['/commandes']);
        }, 1500);
      },
      error: (error) => {
        console.error('Erreur lors de la création de la commande:', error);
        let errorMessage = 'Une erreur s\'est produite lors de la création de votre commande.';
        
        if (error.error && typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        this.notificationService.showError(
          'Erreur de commande',
          errorMessage + ' Veuillez réessayer.'
        );
        this.isCreatingCommande = false;
      }
    });
  }
} 