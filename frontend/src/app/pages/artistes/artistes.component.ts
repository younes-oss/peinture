import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ArtisteService, ArtisteDto } from '../../services/artiste.service';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-artistes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="artistes-page">
      <!-- Header avec recherche et filtres -->
      <div class="page-header">
        <div class="header-content">
          <div class="title-section">
            <h1>Nos Artistes Talentueux</h1>
            <p>Découvrez {{ artistes.length }} artistes passionnés et leurs créations uniques</p>
          </div>
          <div class="header-actions">
            <!-- Actions pour artistes connectés -->
            <div *ngIf="isArtiste" class="artist-quick-actions">
              <a routerLink="/dashboard/artiste/nouveau" class="btn-create-artwork">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
                Créer une œuvre
              </a>
              <a routerLink="/dashboard/artiste" class="btn-manage-artworks">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Gérer mes œuvres
              </a>
            </div>
            
            <!-- Vue toggle pour clients -->
            <div *ngIf="!isArtiste && artistes.length > 0" class="view-toggle">
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
      </div>

      <!-- Filtres et recherche -->
      <div *ngIf="!isLoading && artistes.length > 0" class="filters-section">
        <div class="filters-container">
          <!-- Barre de recherche -->
          <div class="search-bar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z"/>
            </svg>
            <input type="text" 
                   placeholder="Rechercher par nom, spécialité ou ville..."
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

          <!-- Filtres spécialités -->
          <div class="specialty-filters">
            <button class="filter-chip" 
                    [class.active]="selectedSpecialty === 'ALL'"
                    (click)="setSpecialty('ALL')">
              Toutes spécialités ({{ artistes.length }})
            </button>
            <button *ngFor="let specialty of specialties" 
                    class="filter-chip" 
                    [class.active]="selectedSpecialty === specialty"
                    (click)="setSpecialty(specialty)">
              {{ specialty }} ({{ getSpecialtyCount(specialty) }})
            </button>
          </div>

          <!-- Tri -->
          <div class="sort-options">
            <label>Trier par:</label>
            <select [(ngModel)]="sortBy" (change)="applySorting()" class="sort-select">
              <option value="nom_asc">Nom A-Z</option>
              <option value="nom_desc">Nom Z-A</option>
              <option value="oeuvres_desc">Plus d'œuvres</option>
              <option value="oeuvres_asc">Moins d'œuvres</option>
              <option value="specialite_asc">Spécialité A-Z</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading state -->
      <div *ngIf="isLoading" class="loading-section">
        <div class="loading-spinner"></div>
        <p>Chargement des artistes...</p>
      </div>

      <!-- Résultats -->
      <div *ngIf="!isLoading && artistes.length > 0" class="results-section">
        <div class="results-header">
          <span class="results-count">
            {{ getFilteredArtistes().length }} artiste(s) trouvé(s)
            <span *ngIf="searchTerm || selectedSpecialty !== 'ALL'"> 
              (filtré{{ getFilteredArtistes().length > 1 ? 's' : '' }} sur {{ artistes.length }})
            </span>
          </span>
          <button *ngIf="hasActiveFilters()" class="clear-filters" (click)="clearAllFilters()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
            Effacer les filtres
          </button>
        </div>

        <!-- Galerie d'artistes -->
        <div class="artistes-gallery" [class]="viewMode">
          <div *ngFor="let artiste of getPaginatedArtistes()" 
               class="artiste-card" 
               [class.list-view]="viewMode === 'list'">
            
            <!-- Vue grille -->
            <div *ngIf="viewMode === 'grid'" class="card-grid">
              <div class="artiste-avatar">
                <img [src]="getArtisteAvatar(artiste)" [alt]="artiste.prenom + ' ' + artiste.nom">
                <div class="artiste-badge" *ngIf="artiste.nombreOeuvres && artiste.nombreOeuvres > 10">
                  Top Artiste
                </div>
              </div>
              <div class="artiste-info">
                <h3 class="artiste-nom">{{ artiste.prenom }} {{ artiste.nom }}</h3>
                <p class="artiste-specialite">{{ artiste.specialite || 'Artiste' }}</p>
                <p class="artiste-location" *ngIf="artiste.ville || artiste.pays">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  {{ artiste.ville }}{{ artiste.ville && artiste.pays ? ', ' : '' }}{{ artiste.pays }}
                </p>
                <p class="artiste-bio" *ngIf="artiste.biographie">{{ artiste.biographie }}</p>
                <div class="artiste-stats">
                  <span class="oeuvres-count">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                    </svg>
                    {{ artiste.nombreOeuvres || 0 }} œuvre{{ (artiste.nombreOeuvres || 0) !== 1 ? 's' : '' }}
                  </span>
                </div>
                <div class="artiste-actions">
                  <button class="btn-voir-oeuvres" (click)="voirOeuvres(artiste)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                    Voir les œuvres
                  </button>
                  <button class="btn-contact" (click)="contacterArtiste(artiste)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                    Contacter
                  </button>
                </div>
              </div>
            </div>

            <!-- Vue liste -->
            <div *ngIf="viewMode === 'list'" class="card-list">
              <div class="artiste-avatar-small">
                <img [src]="getArtisteAvatar(artiste)" [alt]="artiste.prenom + ' ' + artiste.nom">
              </div>
              <div class="artiste-details">
                <div class="artiste-main">
                  <h3 class="artiste-nom">{{ artiste.prenom }} {{ artiste.nom }}</h3>
                  <span class="artiste-specialite">{{ artiste.specialite || 'Artiste' }}</span>
                </div>
                <div class="artiste-meta">
                  <span class="artiste-location" *ngIf="artiste.ville || artiste.pays">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    {{ artiste.ville }}{{ artiste.ville && artiste.pays ? ', ' : '' }}{{ artiste.pays }}
                  </span>
                  <span class="oeuvres-count">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                    </svg>
                    {{ artiste.nombreOeuvres || 0 }} œuvre{{ (artiste.nombreOeuvres || 0) !== 1 ? 's' : '' }}
                  </span>
                </div>
                <p class="artiste-bio" *ngIf="artiste.biographie">{{ artiste.biographie }}</p>
              </div>
              <div class="artiste-actions-list">
                <button class="btn-voir-oeuvres" (click)="voirOeuvres(artiste)">
                  Voir les œuvres
                </button>
                <button class="btn-contact" (click)="contacterArtiste(artiste)">
                  Contacter
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- État vide avec filtres actifs -->
        <div *ngIf="getFilteredArtistes().length === 0 && hasActiveFilters()" class="empty-state">
          <div class="empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2c2.21 0 4 1.79 4 4 0 2.21-1.79 4-4 4s-4-1.79-4-4c0-2.21 1.79-4 4-4zm0 14c2.6 0 5.35.46 7.14 1.18.9.36 1.36 1.18 1.36 2.27V20c0 .55-.45 1-1 1H5.5c-.55 0-1-.45-1-1v-.55c0-1.09.46-1.91 1.36-2.27C7.65 16.46 10.4 16 12.5 16z"/>
            </svg>
          </div>
          <h3>{{ getEmptyStateTitle() }}</h3>
          <p>{{ getEmptyStateMessage() }}</p>
          <button class="btn-reset" (click)="clearAllFilters()">
            Voir tous les artistes
          </button>
        </div>
      </div>
      
      <!-- Message quand aucun artiste dans la base -->
      <div *ngIf="!isLoading && artistes.length === 0" class="no-artists-section">
        <div class="no-artists-content">
          <div class="no-artists-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
              <path d="M12 2c2.21 0 4 1.79 4 4 0 2.21-1.79 4-4 4s-4-1.79-4-4c0-2.21 1.79-4 4-4zm0 14c2.6 0 5.35.46 7.14 1.18.9.36 1.36 1.18 1.36 2.27V20c0 .55-.45 1-1 1H5.5c-.55 0-1-.45-1-1v-.55c0-1.09.46-1.91 1.36-2.27C7.65 16.46 10.4 16 12.5 16z" stroke="currentColor" stroke-width="1.5" opacity="0.3"/>
            </svg>
          </div>
          <h2>Bienvenue dans notre galerie d'artistes</h2>
          <p>Nous préparons une sélection exceptionnelle d'artistes talentueux.<br>
             Revenez bientôt pour découvrir leurs créations uniques !</p>
        </div>
      </div>

      <!-- Actions pour artistes connectés -->
      <div *ngIf="isArtiste" class="artist-actions-section">
        <h2>Mon espace artiste</h2>
        <div class="actions-grid">
          <a routerLink="/dashboard/artiste/nouveau" class="action-card">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            <span>Créer une nouvelle œuvre</span>
          </a>
          <a routerLink="/dashboard/artiste" class="action-card">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span>Gérer mes œuvres</span>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .artistes-page {
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
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .artist-quick-actions {
      display: flex;
      gap: 0.75rem;
    }
    
    .btn-create-artwork, .btn-manage-artworks {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.875rem;
      transition: all 0.3s ease;
      border: none;
      cursor: pointer;
    }
    
    .btn-create-artwork {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }
    
    .btn-create-artwork:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    }
    
    .btn-manage-artworks {
      background: white;
      color: #667eea;
      border: 2px solid #667eea;
    }
    
    .btn-manage-artworks:hover {
      background: #667eea;
      color: white;
      transform: translateY(-2px);
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
    
    .search-bar {
      position: relative;
      display: flex;
      align-items: center;
      max-width: 500px;
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
    
    .specialty-filters {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      justify-content: flex-start;
      align-items: center;
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
    
    .sort-options {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-left: auto;
    }
    
    .sort-options label {
      font-weight: 600;
      color: #495057;
      font-size: 0.875rem;
    }
    
    .sort-select {
      padding: 0.75rem;
      border: 2px solid #e1e5e9;
      border-radius: 12px;
      font-size: 0.875rem;
      background: white;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .sort-select:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    .loading-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem;
      color: #6c757d;
    }
    
    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
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
    }
    
    .results-count {
      font-size: 1.125rem;
      font-weight: 600;
      color: #495057;
    }
    
    .clear-filters {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      padding: 0.5rem 1rem;
      color: #6c757d;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .clear-filters:hover {
      background: #e9ecef;
      color: #495057;
    }
    
    .artistes-gallery.grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 2rem;
    }
    
    .artistes-gallery.list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .artiste-card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
    }
    
    .artiste-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    }
    
    .card-grid {
      display: flex;
      flex-direction: column;
    }
    
    .artiste-avatar {
      position: relative;
      height: 200px;
      overflow: hidden;
    }
    
    .artiste-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .artiste-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: linear-gradient(135deg, #ffc107 0%, #ff8c00 100%);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    
    .artiste-info {
      padding: 1.5rem;
    }
    
    .artiste-nom {
      margin: 0 0 0.5rem 0;
      font-size: 1.25rem;
      font-weight: 700;
      color: #2c3e50;
    }
    
    .artiste-specialite {
      color: #667eea;
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0 0 0.75rem 0;
    }
    
    .artiste-location {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #6c757d;
      font-size: 0.875rem;
      margin: 0 0 1rem 0;
    }
    
    .artiste-bio {
      color: #495057;
      font-size: 0.875rem;
      line-height: 1.5;
      margin: 0 0 1rem 0;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .artiste-stats {
      margin-bottom: 1.5rem;
    }
    
    .oeuvres-count {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #f8f9fa;
      color: #495057;
      padding: 0.5rem 0.75rem;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      width: fit-content;
    }
    
    .artiste-actions {
      display: flex;
      gap: 0.75rem;
    }
    
    .btn-voir-oeuvres, .btn-contact {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.875rem;
    }
    
    .btn-voir-oeuvres {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    
    .btn-voir-oeuvres:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    }
    
    .btn-contact {
      background: #f8f9fa;
      color: #495057;
      border: 1px solid #dee2e6;
    }
    
    .btn-contact:hover {
      background: #e9ecef;
      transform: translateY(-2px);
    }
    
    .card-list {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 1.5rem;
    }
    
    .artiste-avatar-small {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;
    }
    
    .artiste-avatar-small img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .artiste-details {
      flex: 1;
    }
    
    .artiste-main {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 0.5rem;
    }
    
    .artiste-meta {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 0.5rem;
    }
    
    .artiste-actions-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      min-width: 150px;
    }
    
    .artiste-actions-list .btn-voir-oeuvres,
    .artiste-actions-list .btn-contact {
      justify-content: center;
      padding: 0.5rem 1rem;
    }
    
    .empty-state {
      text-align: center;
      padding: 4rem;
      color: #6c757d;
    }
    
    .empty-icon {
      margin-bottom: 1.5rem;
      opacity: 0.5;
    }
    
    .empty-state h3 {
      font-size: 1.5rem;
      color: #495057;
      margin-bottom: 0.75rem;
    }
    
    .empty-state p {
      font-size: 1rem;
      margin-bottom: 1.5rem;
    }
    
    .btn-reset {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 12px;
      padding: 0.75rem 1.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .btn-reset:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    }
    
    .no-artists-section {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      padding: 4rem 2rem;
    }
    
    .no-artists-content {
      text-align: center;
      max-width: 500px;
    }
    
    .no-artists-icon {
      margin-bottom: 2rem;
      color: #e9ecef;
    }
    
    .no-artists-content h2 {
      font-size: 2rem;
      font-weight: 700;
      color: #2c3e50;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .no-artists-content p {
      font-size: 1.125rem;
      color: #6c757d;
      line-height: 1.6;
      margin: 0;
    }
    
    .artist-actions-section {
      max-width: 1400px;
      margin: 3rem auto 0;
      padding: 0 2rem;
    }
    
    .artist-actions-section h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #2c3e50;
      margin-bottom: 1.5rem;
      text-align: center;
    }
    
    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .action-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      background: white;
      padding: 2rem;
      border-radius: 16px;
      text-decoration: none;
      color: #495057;
      transition: all 0.3s ease;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }
    
    .action-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
      color: #667eea;
    }
    
    .action-card svg {
      color: #667eea;
    }
    
    .action-card span {
      font-weight: 600;
      text-align: center;
    }
    
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 1.5rem;
        padding: 1.5rem 1rem;
        text-align: center;
      }
      
      .title-section h1 {
        font-size: 2rem;
      }
      
      .title-section p {
        font-size: 1rem;
      }
      
      .header-actions {
        width: 100%;
        justify-content: center;
      }
      
      .artist-quick-actions {
        flex-direction: column;
        gap: 0.75rem;
        width: 100%;
        max-width: 300px;
      }
      
      .btn-create-artwork,
      .btn-manage-artworks {
        padding: 0.875rem 1rem;
        font-size: 0.875rem;
        justify-content: center;
      }
      
      .view-toggle {
        justify-content: center;
      }
      
      .filters-container {
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
      }
      
      .search-bar {
        max-width: 100%;
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
      
      .specialty-filters {
        justify-content: flex-start;
        gap: 0.5rem;
        overflow-x: auto;
        padding-bottom: 0.5rem;
        scrollbar-width: none;
        -ms-overflow-style: none;
      }
      
      .specialty-filters::-webkit-scrollbar {
        display: none;
      }
      
      .filter-chip {
        padding: 0.5rem 0.875rem;
        font-size: 0.8rem;
        flex-shrink: 0;
        min-width: max-content;
      }
      
      .sort-options {
        margin-left: 0;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }
      
      .results-section {
        padding: 0 1rem 2rem;
      }
      
      .results-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
      
      .results-count {
        font-size: 1rem;
      }
      
      .artistes-gallery.grid {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1.5rem;
      }
      
      .artiste-card {
        margin: 0;
      }
      
      .artiste-info {
        padding: 1.25rem;
      }
      
      .artiste-nom {
        font-size: 1.125rem;
      }
      
      .artiste-actions {
        flex-direction: column;
        gap: 0.5rem;
      }
      
      .btn-voir-oeuvres,
      .btn-contact {
        padding: 0.75rem;
        font-size: 0.875rem;
      }
      
      .card-list {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
        padding: 1.25rem;
      }
      
      .artiste-avatar-small {
        width: 100px;
        height: 100px;
        margin: 0 auto;
      }
      
      .artiste-main {
        flex-direction: column;
        gap: 0.5rem;
        text-align: center;
      }
      
      .artiste-meta {
        flex-direction: column;
        gap: 0.5rem;
        text-align: center;
      }
      
      .artiste-actions-list {
        flex-direction: row;
        gap: 0.75rem;
        min-width: auto;
        width: 100%;
      }
      
      .artiste-actions-list .btn-voir-oeuvres,
      .artiste-actions-list .btn-contact {
        flex: 1;
        padding: 0.75rem;
        font-size: 0.875rem;
      }
      
      .empty-state {
        padding: 2rem 1rem;
      }
      
      .empty-state h3 {
        font-size: 1.25rem;
      }
      
      .no-artists-section {
        padding: 2rem 1rem;
        min-height: 50vh;
      }
      
      .no-artists-content h2 {
        font-size: 1.75rem;
      }
      
      .no-artists-content p {
        font-size: 1rem;
      }
      
      .artist-actions-section {
        padding: 0 1rem;
        margin-top: 2rem;
      }
      
      .actions-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      
      .action-card {
        padding: 1.5rem;
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
      
      .artistes-gallery.grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      
      .artiste-info {
        padding: 1rem;
      }
      
      .results-section {
        padding: 0 0.75rem 1rem;
      }
      
      .empty-state {
        padding: 1.5rem 0.75rem;
      }
      
      .no-artists-section {
        padding: 1.5rem 0.75rem;
      }
      
      .no-artists-content h2 {
        font-size: 1.5rem;
      }
    }
        flex-direction: column;
        gap: 1.5rem;
        text-align: center;
      }
      
      .header-actions {
        flex-direction: column;
        gap: 1rem;
        width: 100%;
      }
      
      .artist-quick-actions {
        flex-direction: column;
        width: 100%;
      }
      
      .btn-create-artwork, .btn-manage-artworks {
        justify-content: center;
        width: 100%;
      }
      
      .filters-container {
        padding: 1.5rem;
      }
      
      .sort-options {
        margin-left: 0;
        flex-direction: column;
        align-items: flex-start;
      }
      
      .artistes-gallery.grid {
        grid-template-columns: 1fr;
      }
      
      .card-list {
        flex-direction: column;
        text-align: center;
      }
      
      .artiste-main {
        flex-direction: column;
        gap: 0.5rem;
      }
      
      .artiste-meta {
        flex-direction: column;
        gap: 0.5rem;
      }
      
      .artiste-actions-list {
        flex-direction: row;
        min-width: auto;
      }
    }
  `]
})
export class ArtistesComponent implements OnInit {
  artistes: ArtisteDto[] = [];
  filteredArtistes: ArtisteDto[] = [];
  isLoading = false;
  isArtiste = false;
  
  // Filtres
  searchTerm = '';
  selectedSpecialty = 'ALL';
  specialties: string[] = [];
  sortBy = 'nom_asc';
  
  // Vue et pagination
  viewMode: 'grid' | 'list' = 'grid';
  currentPage = 1;
  itemsPerPage = 9;

  constructor(
    private artisteService: ArtisteService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.isArtiste = this.authService.isArtiste();
    this.loadArtistes();
  }

  private loadArtistes(): void {
    this.isLoading = true;
    this.artisteService.getAllArtistes().subscribe({
      next: (artistes) => {
        this.artistes = artistes;
        this.extractSpecialties();
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement artistes:', err);
        this.notificationService.showError('Erreur', 'Impossible de charger les artistes');
        this.isLoading = false;
      }
    });
  }

  private extractSpecialties(): void {
    const specialtySet = new Set<string>();
    this.artistes.forEach(artiste => {
      if (artiste.specialite && artiste.specialite !== 'Non spécifié') {
        specialtySet.add(artiste.specialite);
      }
    });
    this.specialties = Array.from(specialtySet).sort();
  }

  // Filtres et recherche
  onSearchChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.onSearchChange();
  }

  setSpecialty(specialty: string): void {
    this.selectedSpecialty = specialty;
    this.currentPage = 1;
    this.applyFilters();
  }

  getSpecialtyCount(specialty: string): number {
    return this.artistes.filter(a => a.specialite === specialty).length;
  }

  applyFilters(): void {
    let filtered = [...this.artistes];

    // Recherche textuelle
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(artiste => 
        `${artiste.prenom} ${artiste.nom}`.toLowerCase().includes(term) ||
        (artiste.specialite && artiste.specialite.toLowerCase().includes(term)) ||
        (artiste.ville && artiste.ville.toLowerCase().includes(term)) ||
        (artiste.pays && artiste.pays.toLowerCase().includes(term))
      );
    }

    // Filtre spécialité
    if (this.selectedSpecialty !== 'ALL') {
      filtered = filtered.filter(artiste => artiste.specialite === this.selectedSpecialty);
    }

    this.filteredArtistes = filtered;
    this.applySorting();
  }

  applySorting(): void {
    this.filteredArtistes.sort((a, b) => {
      switch (this.sortBy) {
        case 'nom_asc':
          return `${a.prenom} ${a.nom}`.localeCompare(`${b.prenom} ${b.nom}`);
        case 'nom_desc':
          return `${b.prenom} ${b.nom}`.localeCompare(`${a.prenom} ${a.nom}`);
        case 'oeuvres_desc':
          return (b.nombreOeuvres || 0) - (a.nombreOeuvres || 0);
        case 'oeuvres_asc':
          return (a.nombreOeuvres || 0) - (b.nombreOeuvres || 0);
        case 'specialite_asc':
          return (a.specialite || '').localeCompare(b.specialite || '');
        default:
          return 0;
      }
    });
  }

  hasActiveFilters(): boolean {
    return this.searchTerm !== '' || this.selectedSpecialty !== 'ALL';
  }

  clearAllFilters(): void {
    this.searchTerm = '';
    this.selectedSpecialty = 'ALL';
    this.currentPage = 1;
    this.applyFilters();
  }

  // Vue et pagination
  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  getFilteredArtistes(): ArtisteDto[] {
    return this.filteredArtistes;
  }

  getPaginatedArtistes(): ArtisteDto[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredArtistes.slice(start, end);
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredArtistes.length / this.itemsPerPage);
  }

  getStartIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  getEndIndex(): number {
    return Math.min(this.getStartIndex() + this.itemsPerPage, this.filteredArtistes.length);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
    }
  }

  getVisiblePages(): number[] {
    const totalPages = this.getTotalPages();
    const maxVisible = 5;
    const current = this.currentPage;
    
    if (totalPages <= maxVisible) {
      return Array.from({length: totalPages}, (_, i) => i + 1);
    }
    
    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    return Array.from({length: end - start + 1}, (_, i) => start + i);
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1;
  }

  // États vides
  getEmptyStateTitle(): string {
    if (this.searchTerm) {
      return 'Aucun artiste trouvé';
    }
    if (this.selectedSpecialty !== 'ALL') {
      return `Aucun artiste en ${this.selectedSpecialty}`;
    }
    return 'Aucun artiste disponible';
  }

  getEmptyStateMessage(): string {
    if (this.searchTerm) {
      return `Aucun résultat pour "${this.searchTerm}". Essayez avec d'autres mots-clés.`;
    }
    if (this.selectedSpecialty !== 'ALL') {
      return 'Essayez une autre spécialité ou effacez les filtres.';
    }
    return 'Les artistes seront bientôt disponibles.';
  }

  // Actions
  getArtisteAvatar(artiste: ArtisteDto): string {
    return `https://ui-avatars.com/api/?name=${artiste.prenom}+${artiste.nom}&background=667eea&color=fff&size=200`;
  }

  voirOeuvres(artiste: ArtisteDto): void {
    // TODO: Implémenter la navigation vers les œuvres de l'artiste
    this.notificationService.showInfo('Info', `Voir les œuvres de ${artiste.prenom} ${artiste.nom}`);
  }

  contacterArtiste(artiste: ArtisteDto): void {
    // TODO: Implémenter le système de contact
    this.notificationService.showInfo('Contact', `Contacter ${artiste.prenom} ${artiste.nom}`);
  }
}