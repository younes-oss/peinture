import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PeintureService } from '../../services/peinture.service';
import { PanierService } from '../../services/panier.service';
import { NotificationService } from '../../services/notification.service';
import { Peinture, Categorie } from '../../models/peinture.model';
import { PaintingCardComponent } from '../../components/shared/painting-card/painting-card.component';

@Component({
  selector: 'app-peintures',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PaintingCardComponent],
  template: `
    <div class="peintures-page">
      <!-- Header avec titre et statistiques -->
      <div class="page-header">
        <div class="header-content">
          <div class="title-section">
            <h1>Galerie d'Art</h1>
            <p>Découvrez notre collection unique de {{ peintures.length }} œuvres d'art</p>
          </div>
          <div class="view-toggle">
            <button class="view-btn" 
                    [class.active]="viewMode === 'grid'"
                    (click)="setViewMode('grid')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z"/>
              </svg>
              Grille
            </button>
            <button class="view-btn" 
                    [class.active]="viewMode === 'list'"
                    (click)="setViewMode('list')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 3h18v4H3V3zm0 7h18v4H3v-4zm0 7h18v4H3v-4z"/>
              </svg>
              Liste
            </button>
          </div>
        </div>
      </div>
      
      <!-- Filtres et recherche -->
      <div class="filters-section">
        <div class="filters-container">
          <!-- Filtres par catégorie (en premier, horizontal) -->
          <div class="category-filters">
            <button class="filter-chip" 
                    [class.active]="selectedCategory === 'ALL'"
                    (click)="setCategory('ALL')">
              Toutes ({{ peintures.length }})
            </button>
            <button *ngFor="let category of categories" 
                    class="filter-chip" 
                    [class.active]="selectedCategory === category.code"
                    (click)="setCategory(category.code)">
              {{ category.libelle }} ({{ getCategoryCount(category.code) }})
            </button>
          </div>
          
          <!-- Deuxième ligne: Recherche, Prix, Tri -->
          <div class="top-filters">
            <!-- Barre de recherche -->
            <div class="search-bar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z"/>
              </svg>
              <input type="text" 
                     placeholder="Rechercher par titre, artiste ou catégorie..."
                     [(ngModel)]="searchTerm"
                     (input)="onSearchChange()"
                     class="search-input">
              <button *ngIf="searchTerm" 
                      class="clear-search" 
                      (click)="clearSearch()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
            
            <!-- Filtres par prix -->
            <div class="price-filters">
              <label>Gamme de prix:</label>
              <div class="price-range">
                <select [(ngModel)]="priceRange" (change)="applyFilters()" class="price-select">
                  <option value="ALL">Tous les prix</option>
                  <option value="0-500">0 € - 500 €</option>
                  <option value="500-1000">500 € - 1 000 €</option>
                  <option value="1000-2000">1 000 € - 2 000 €</option>
                  <option value="2000-5000">2 000 € - 5 000 €</option>
                  <option value="5000+">5 000 € et plus</option>
                </select>
              </div>
            </div>
            
            <!-- Tri -->
            <div class="sort-options">
              <label>Trier par:</label>
              <select [(ngModel)]="sortBy" (change)="applySorting()" class="sort-select">
                <option value="date_desc">Plus récentes</option>
                <option value="date_asc">Plus anciennes</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
                <option value="title_asc">Titre A-Z</option>
                <option value="title_desc">Titre Z-A</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Loading state -->
      <div *ngIf="isLoading" class="loading-section">
        <div class="loading-spinner"></div>
        <p>Chargement de la galerie...</p>
      </div>
      
      <!-- Résultats -->
      <div *ngIf="!isLoading" class="results-section">
        <div class="results-header">
          <span class="results-count">
            {{ getFilteredPeintures().length }} œuvre(s) trouvée(s)
            <span *ngIf="searchTerm || selectedCategory !== 'ALL' || priceRange !== 'ALL'"> 
              (filtré{{ getFilteredPeintures().length > 1 ? 's' : '' }} sur {{ peintures.length }})
            </span>
          </span>
          <button *ngIf="hasActiveFilters()" class="clear-filters" (click)="clearAllFilters()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
            Effacer les filtres
          </button>
        </div>
        
        <!-- Galerie de peintures -->
        <div class="paintings-gallery" [class]="viewMode">
          <app-painting-card 
            *ngFor="let peinture of getPaginatedPeintures()"
            [peinture]="peinture"
            context="client">
          </app-painting-card>
        </div>
        
        <!-- Pagination -->
        <div *ngIf="getTotalPages() > 1" class="pagination-section">
          <div class="pagination-info">
            <span>Page {{ currentPage }} sur {{ getTotalPages() }} 
              ({{ getStartIndex() + 1 }}-{{ getEndIndex() }} sur {{ getFilteredPeintures().length }})</span>
          </div>
          <div class="pagination-controls">
            <button class="pagination-btn" 
                    [disabled]="currentPage <= 1"
                    (click)="goToPage(currentPage - 1)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
              </svg>
              Précédent
            </button>
            
            <div class="pagination-numbers">
              <button *ngFor="let page of getVisiblePages()" 
                      class="page-btn" 
                      [class.active]="page === currentPage"
                      (click)="goToPage(page)">
                {{ page }}
              </button>
            </div>
            
            <button class="pagination-btn" 
                    [disabled]="currentPage >= getTotalPages()"
                    (click)="goToPage(currentPage + 1)">
              Suivant
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>
            </button>
          </div>
          
          <div class="items-per-page">
            <label>Résultats par page:</label>
            <select [(ngModel)]="itemsPerPage" (change)="onItemsPerPageChange()" class="items-select">
              <option [value]="12">12</option>
              <option [value]="24">24</option>
              <option [value]="48">48</option>
              <option [value]="96">96</option>
            </select>
          </div>
        </div>
        
        <!-- État vide -->
        <div *ngIf="getFilteredPeintures().length === 0" class="empty-state">
          <div class="empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
          </div>
          <h3>{{ getEmptyStateTitle() }}</h3>
          <p>{{ getEmptyStateMessage() }}</p>
          <button *ngIf="hasActiveFilters()" class="btn-reset" (click)="clearAllFilters()">
            Voir toutes les peintures
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .peintures-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }
    
    .page-header {
      background: white;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }
    
    .header-content {
      max-width: 1400px;
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
    
    .view-toggle {
      display: flex;
      gap: 0.5rem;
      background: #f8f9fa;
      padding: 0.5rem;
      border-radius: 12px;
    }
    
    .view-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: transparent;
      border: none;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      color: #6c757d;
      transition: all 0.3s ease;
    }
    
    .view-btn.active {
      background: white;
      color: #667eea;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .filters-section {
      background: white;
      margin-bottom: 2rem;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    }
    
    .filters-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .top-filters {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 2rem;
      align-items: start;
    }
    
    .category-filters {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      justify-content: flex-start;
      align-items: center;
      order: -1;
    }
    
    .search-bar {
      position: relative;
      display: flex;
      align-items: center;
    }
    
    .search-bar svg:first-child {
      position: absolute;
      left: 1rem;
      color: #6c757d;
      z-index: 1;
    }
    
    .search-input {
      width: 100%;
      padding: 1rem 1rem 1rem 3rem;
      border: 2px solid #e1e5e9;
      border-radius: 50px;
      font-size: 1rem;
      transition: all 0.3s ease;
    }
    
    .search-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    .clear-search {
      position: absolute;
      right: 1rem;
      background: none;
      border: none;
      color: #6c757d;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 50%;
      transition: all 0.2s ease;
    }
    
    .clear-search:hover {
      background: #f8f9fa;
      color: #495057;
    }
    
    .filter-chip {
      background: #f8f9fa;
      border: 2px solid #e1e5e9;
      border-radius: 50px;
      padding: 0.75rem 1.25rem;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 600;
      color: #495057;
      transition: all 0.3s ease;
      white-space: nowrap;
      flex-shrink: 0;
      min-width: auto;
    }
    
    .filter-chip.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-color: transparent;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
    
    .filter-chip:hover:not(.active) {
      border-color: #667eea;
      color: #667eea;
    }
    
    .price-filters, .sort-options {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .price-filters label, .sort-options label {
      font-weight: 600;
      color: #495057;
      font-size: 0.875rem;
    }
    
    .price-select, .sort-select {
      padding: 0.75rem;
      border: 2px solid #e1e5e9;
      border-radius: 12px;
      font-size: 0.875rem;
      background: white;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .price-select:focus, .sort-select:focus {
      outline: none;
      border-color: #667eea;
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
    
    .results-section {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem 2rem;
    }
    
    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding: 1.5rem;
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
    
    .results-count {
      font-weight: 600;
      color: #495057;
    }
    
    .clear-filters {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #f8d7da;
      color: #721c24;
      border: none;
      border-radius: 8px;
      padding: 0.5rem 1rem;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.875rem;
      transition: all 0.3s ease;
    }
    
    .clear-filters:hover {
      background: #f5c6cb;
    }
    
    .paintings-gallery {
      display: grid;
      gap: 2rem;
    }
    
    .paintings-gallery.grid {
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    }
    
    .paintings-gallery.list {
      grid-template-columns: 1fr;
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
    
    .btn-reset {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 50px;
      padding: 1rem 2rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .btn-reset:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 40px rgba(102, 126, 234, 0.4);
    }
    
    .pagination-section {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      margin-top: 2rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
    }
    
    .pagination-info {
      color: #6c757d;
      font-weight: 600;
    }
    
    .pagination-controls {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .pagination-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #f8f9fa;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      padding: 0.75rem 1rem;
      cursor: pointer;
      font-weight: 600;
      color: #495057;
      transition: all 0.3s ease;
    }
    
    .pagination-btn:hover:not(:disabled) {
      background: #667eea;
      border-color: #667eea;
      color: white;
    }
    
    .pagination-btn:disabled {
      background: #e9ecef;
      border-color: #dee2e6;
      color: #adb5bd;
      cursor: not-allowed;
    }
    
    .pagination-numbers {
      display: flex;
      gap: 0.25rem;
    }
    
    .page-btn {
      width: 40px;
      height: 40px;
      background: #f8f9fa;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      color: #495057;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .page-btn.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-color: transparent;
      color: white;
      transform: scale(1.1);
    }
    
    .page-btn:hover:not(.active) {
      background: #e9ecef;
      border-color: #667eea;
      color: #667eea;
    }
    
    .items-per-page {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .items-per-page label {
      font-weight: 600;
      color: #495057;
      font-size: 0.875rem;
      white-space: nowrap;
    }
    
    .items-select {
      padding: 0.5rem;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      background: white;
      cursor: pointer;
      font-weight: 600;
      min-width: 80px;
    }
    
    .items-select:focus {
      outline: none;
      border-color: #667eea;
    }
    
    @media (max-width: 1200px) {
      .filters-container {
        gap: 1.5rem;
      }
      
      .top-filters {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
      
      .category-filters {
        justify-content: center;
        gap: 0.5rem;
      }
      
      .filter-chip {
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
      }
    }
    
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 1.5rem;
        text-align: center;
        padding: 1.5rem 1rem;
      }
      
      .title-section h1 {
        font-size: 2rem;
      }
      
      .title-section p {
        font-size: 1rem;
      }
      
      .view-toggle {
        justify-content: center;
      }
      
      .view-btn {
        padding: 0.75rem;
        font-size: 0.875rem;
      }
      
      .filters-container {
        padding: 1rem;
        gap: 1rem;
      }
      
      .top-filters {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      
      .category-filters {
        justify-content: flex-start;
        gap: 0.5rem;
        padding-bottom: 0.5rem;
        overflow-x: auto;
        scrollbar-width: none;
        -ms-overflow-style: none;
      }
      
      .category-filters::-webkit-scrollbar {
        display: none;
      }
      
      .filter-chip {
        padding: 0.5rem 0.875rem;
        font-size: 0.8rem;
        flex-shrink: 0;
        min-width: max-content;
      }
      
      .search-input {
        padding: 0.875rem 1rem 0.875rem 2.5rem;
        font-size: 0.875rem;
      }
      
      .search-bar svg:first-child {
        left: 0.75rem;
        width: 18px;
        height: 18px;
      }
      
      .paintings-gallery.grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1.5rem;
      }
      
      .results-section {
        padding: 0 1rem 2rem;
      }
      
      .results-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
        padding: 1rem;
      }
      
      .results-count {
        font-size: 0.875rem;
      }
      
      .pagination-section {
        flex-direction: column;
        gap: 1.5rem;
        text-align: center;
      }
      
      .pagination-controls {
        flex-direction: column;
        gap: 1rem;
      }
      
      .pagination-btn {
        order: 1;
        padding: 0.75rem 1rem;
        font-size: 0.875rem;
      }
      
      .pagination-numbers {
        order: 2;
        justify-content: center;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
      
      .page-btn {
        min-width: 44px;
        height: 44px;
        font-size: 0.875rem;
      }
      
      .items-per-page {
        order: 3;
      }
    }
    
    @media (max-width: 480px) {
      .header-content {
        padding: 1rem 0.75rem;
      }
      
      .title-section h1 {
        font-size: 1.75rem;
      }
      
      .filters-container {
        padding: 0.75rem;
      }
      
      .paintings-gallery.grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      
      .results-section {
        padding: 0 0.75rem 1rem;
      }
      
      .empty-state {
        padding: 2rem 1rem;
      }
      
      .pagination-numbers {
        gap: 0.25rem;
      }
      
      .page-btn {
        min-width: 40px;
        height: 40px;
        font-size: 0.8rem;
      }
    }
  `]
})
export class PeinturesComponent implements OnInit {
  // Données
  peintures: Peinture[] = [];
  filteredPeintures: Peinture[] = [];
  categories: Categorie[] = [];
  
  // États
  isLoading = true;
  viewMode: 'grid' | 'list' = 'grid';
  
  // Filtres
  searchTerm = '';
  selectedCategory = 'ALL';
  priceRange = 'ALL';
  sortBy = 'date_desc';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 24;
  
  constructor(
    private peintureService: PeintureService,
    private panierService: PanierService,
    private notificationService: NotificationService
  ) {}
  
  ngOnInit(): void {
    this.loadCategories();
    this.loadPeintures();
  }
  
  /**
   * Charger toutes les peintures depuis l'API
   */
  loadPeintures(): void {
    this.isLoading = true;
    this.peintureService.getAllPeintures().subscribe({
      next: (peintures) => {
        this.peintures = peintures;
        this.applyFilters();
        this.isLoading = false;
        
        if (peintures.length === 0) {
          this.notificationService.showInfo(
            'Galerie vide',
            'Aucune peinture disponible pour le moment.'
          );
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des peintures:', error);
        this.isLoading = false;
        this.peintures = [];
        this.filteredPeintures = [];
        
        let errorMessage = 'Impossible de charger la galerie.';
        if (error.status === 0) {
          errorMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion.';
        }
        
        this.notificationService.showError(
          'Erreur de chargement',
          errorMessage
        );
      }
    });
  }
  
  /**
   * Charger les catégories disponibles
   */
  loadCategories(): void {
    this.categories = [
      { code: 'ABSTRACTION', libelle: 'Abstraction', imageUrl: '', count: 0 },
      { code: 'REALISME', libelle: 'Réalisme', imageUrl: '', count: 0 },
      { code: 'IMPRESSIONNISME', libelle: 'Impressionnisme', imageUrl: '', count: 0 },
      { code: 'POST_IMPRESSIONNISME', libelle: 'Post-impressionnisme', imageUrl: '', count: 0 },
      { code: 'SURREALISME', libelle: 'Surréalisme', imageUrl: '', count: 0 },
      { code: 'CONTEMPORAIN', libelle: 'Contemporain', imageUrl: '', count: 0 },
      { code: 'CLASSIQUE', libelle: 'Classique', imageUrl: '', count: 0 },
      { code: 'MODERNE', libelle: 'Moderne', imageUrl: '', count: 0 }
    ];
  }
  
  /**
   * Obtenir les peintures filtrées et triées
   */
  getFilteredPeintures(): Peinture[] {
    return this.filteredPeintures;
  }
  
  /**
   * Appliquer tous les filtres
   */
  applyFilters(): void {
    let filtered = [...this.peintures];
    
    // Filtre par recherche
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(peinture => 
        peinture.titre.toLowerCase().includes(term) ||
        `${peinture.artiste.prenom} ${peinture.artiste.nom}`.toLowerCase().includes(term) ||
        peinture.categorieLibelle.toLowerCase().includes(term)
      );
    }
    
    // Filtre par catégorie
    if (this.selectedCategory !== 'ALL') {
      filtered = filtered.filter(peinture => peinture.categorie === this.selectedCategory);
    }
    
    // Filtre par prix
    if (this.priceRange !== 'ALL') {
      filtered = filtered.filter(peinture => this.isPriceInRange(peinture.prix, this.priceRange));
    }
    
    // Appliquer le tri
    this.filteredPeintures = this.sortPeintures(filtered);
    
    // Reset pagination à la première page lors du filtrage
    this.currentPage = 1;
  }
  
  /**
   * Vérifier si un prix est dans la gamme sélectionnée
   */
  isPriceInRange(prix: number, range: string): boolean {
    switch (range) {
      case '0-500': return prix >= 0 && prix <= 500;
      case '500-1000': return prix > 500 && prix <= 1000;
      case '1000-2000': return prix > 1000 && prix <= 2000;
      case '2000-5000': return prix > 2000 && prix <= 5000;
      case '5000+': return prix > 5000;
      default: return true;
    }
  }
  
  /**
   * Trier les peintures selon le critère sélectionné
   */
  sortPeintures(peintures: Peinture[]): Peinture[] {
    const sorted = [...peintures];
    
    switch (this.sortBy) {
      case 'date_desc':
        return sorted.sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime());
      case 'date_asc':
        return sorted.sort((a, b) => new Date(a.dateCreation).getTime() - new Date(b.dateCreation).getTime());
      case 'price_asc':
        return sorted.sort((a, b) => a.prix - b.prix);
      case 'price_desc':
        return sorted.sort((a, b) => b.prix - a.prix);
      case 'title_asc':
        return sorted.sort((a, b) => a.titre.localeCompare(b.titre));
      case 'title_desc':
        return sorted.sort((a, b) => b.titre.localeCompare(a.titre));
      default:
        return sorted;
    }
  }
  
  /**
   * Gestionnaire de changement de recherche
   */
  onSearchChange(): void {
    this.applyFilters();
  }
  
  /**
   * Effacer la recherche
   */
  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }
  
  /**
   * Sélectionner une catégorie
   */
  setCategory(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }
  
  /**
   * Appliquer le tri
   */
  applySorting(): void {
    this.applyFilters();
  }
  
  /**
   * Changer le mode d'affichage
   */
  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }
  
  /**
   * Obtenir le nombre de peintures par catégorie
   */
  getCategoryCount(categoryCode: string): number {
    return this.peintures.filter(p => p.categorie === categoryCode).length;
  }
  
  /**
   * Vérifier s'il y a des filtres actifs
   */
  hasActiveFilters(): boolean {
    return this.searchTerm.trim() !== '' || 
           this.selectedCategory !== 'ALL' || 
           this.priceRange !== 'ALL';
  }
  
  /**
   * Effacer tous les filtres
   */
  clearAllFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = 'ALL';
    this.priceRange = 'ALL';
    this.sortBy = 'date_desc';
    this.applyFilters();
    
    this.notificationService.showInfo(
      'Filtres effacés',
      'Tous les filtres ont été réinitialisés.'
    );
  }
  
  /**
   * Obtenir le titre de l'état vide
   */
  getEmptyStateTitle(): string {
    if (this.hasActiveFilters()) {
      return 'Aucun résultat trouvé';
    }
    return 'Galerie vide';
  }
  
  /**
   * Obtenir le message de l'état vide
   */
  getEmptyStateMessage(): string {
    if (this.hasActiveFilters()) {
      return 'Aucune peinture ne correspond à vos critères de recherche. Essayez de modifier vos filtres.';
    }
    return 'Aucune peinture n\'est disponible pour le moment. Revenez plus tard pour découvrir de nouvelles œuvres.';
  }
  
  // Méthodes de pagination
  
  /**
   * Obtenir les peintures pour la page actuelle
   */
  getPaginatedPeintures(): Peinture[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredPeintures.slice(startIndex, endIndex);
  }
  
  /**
   * Obtenir le nombre total de pages
   */
  getTotalPages(): number {
    return Math.ceil(this.filteredPeintures.length / this.itemsPerPage);
  }
  
  /**
   * Obtenir l'index de début pour l'affichage
   */
  getStartIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }
  
  /**
   * Obtenir l'index de fin pour l'affichage
   */
  getEndIndex(): number {
    const endIndex = this.currentPage * this.itemsPerPage;
    return Math.min(endIndex, this.filteredPeintures.length);
  }
  
  /**
   * Aller à une page spécifique
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
      // Faire défiler vers le haut de la galerie
      document.querySelector('.results-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  /**
   * Obtenir les pages visibles pour la pagination
   */
  getVisiblePages(): number[] {
    const totalPages = this.getTotalPages();
    const visiblePages: number[] = [];
    
    if (totalPages <= 7) {
      // Afficher toutes les pages si moins de 7
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      // Logique pour afficher les pages avec ellipses
      if (this.currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          visiblePages.push(i);
        }
      } else if (this.currentPage >= totalPages - 3) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          visiblePages.push(i);
        }
      } else {
        for (let i = this.currentPage - 2; i <= this.currentPage + 2; i++) {
          visiblePages.push(i);
        }
      }
    }
    
    return visiblePages;
  }
  
  /**
   * Gestionnaire de changement du nombre d'éléments par page
   */
  onItemsPerPageChange(): void {
    this.currentPage = 1; // Reset à la première page
  }
}
