import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PeintureService } from '../../services/peinture.service';
import { NotificationService } from '../../services/notification.service';
import { Peinture } from '../../models/peinture.model';

@Component({
  selector: 'app-dashboard-artiste',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="dashboard-page">
      <!-- Header avec statistiques -->
      <div class="dashboard-header">
        <div class="header-content">
          <div class="title-section">
            <h1>Mon Atelier Numérique</h1>
            <p>Gérez vos créations artistiques et suivez vos performances</p>
          </div>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ peintures.length }}</div>
                <div class="stat-label">Œuvres totales</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ getAvailableCount() }}</div>
                <div class="stat-label">Disponibles</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                </svg>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ getTotalValue() | currency:'EUR':'symbol':'1.0-0' }}</div>
                <div class="stat-label">Valeur totale</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions et filtres -->
      <div class="actions-section">
        <div class="actions-content">
          <div class="primary-actions">
            <button class="btn-create" (click)="create()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              Créer une nouvelle œuvre
            </button>
          </div>
          <div class="filters-section">
            <div class="search-bar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z"/>
              </svg>
              <input type="text" 
                     placeholder="Rechercher une œuvre..."
                     [(ngModel)]="searchTerm"
                     (input)="applyFilters()"
                     class="search-input">
            </div>
            <div class="filter-options">
              <select [(ngModel)]="filterStatus" (change)="applyFilters()" class="filter-select">
                <option value="ALL">Toutes les œuvres</option>
                <option value="AVAILABLE">Disponibles</option>
                <option value="UNAVAILABLE">Non disponibles</option>
              </select>
            </div>
            <div class="view-toggle">
              <button class="view-btn" 
                      [class.active]="viewMode === 'grid'"
                      (click)="setViewMode('grid')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z"/>
                </svg>
              </button>
              <button class="view-btn" 
                      [class.active]="viewMode === 'list'"
                      (click)="setViewMode('list')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 3h18v4H3V3zm0 7h18v4H3v-4zm0 7h18v4H3v-4z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading state -->
      <div *ngIf="isLoading" class="loading-section">
        <div class="loading-spinner"></div>
        <p>Chargement de vos œuvres...</p>
      </div>

      <!-- Contenu principal -->
      <div *ngIf="!isLoading" class="content-section">
        <!-- Vue grille -->
        <div *ngIf="viewMode === 'grid' && filteredPeintures.length > 0" class="artworks-grid">
          <div *ngFor="let peinture of filteredPeintures" class="artwork-card">
            <div class="artwork-image">
              <img [src]="peinture.imageUrl || getPlaceholderImage()" [alt]="peinture.titre">
              <div class="artwork-overlay">
                <button class="btn-action btn-edit" (click)="edit(peinture)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button class="btn-action btn-delete" (click)="confirmDelete(peinture)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                  </svg>
                </button>
              </div>
              <div class="artwork-status" [class]="getStatusClass(peinture)">
                {{ getStatusLabel(peinture) }}
              </div>
            </div>
            <div class="artwork-info">
              <h3 class="artwork-title">{{ peinture.titre }}</h3>
              <div class="artwork-meta">
                <span class="artwork-price">{{ peinture.prix | currency:'EUR':'symbol':'1.0-0' }}</span>
                <span class="artwork-category">{{ peinture.categorieLibelle }}</span>
              </div>
              <div class="artwork-details">
                <span class="artwork-stock">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2z"/>
                  </svg>
                  {{ peinture.stock }} en stock
                </span>
                <span class="artwork-date">{{ formatDate(peinture.dateCreation) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Vue liste -->
        <div *ngIf="viewMode === 'list' && filteredPeintures.length > 0" class="artworks-list">
          <div class="list-header">
            <div class="list-col">Œuvre</div>
            <div class="list-col">Prix</div>
            <div class="list-col">Stock</div>
            <div class="list-col">Catégorie</div>
            <div class="list-col">Statut</div>
            <div class="list-col">Actions</div>
          </div>
          <div *ngFor="let peinture of filteredPeintures" class="list-item">
            <div class="list-col artwork-info-col">
              <div class="artwork-thumbnail">
                <img [src]="peinture.imageUrl || getPlaceholderImage()" [alt]="peinture.titre">
              </div>
              <div class="artwork-details">
                <h4>{{ peinture.titre }}</h4>
                <span class="artwork-date">{{ formatDate(peinture.dateCreation) }}</span>
              </div>
            </div>
            <div class="list-col">{{ peinture.prix | currency:'EUR':'symbol':'1.0-0' }}</div>
            <div class="list-col">
              <span class="stock-badge" [class]="getStockClass(peinture.stock)">
                {{ peinture.stock }}
              </span>
            </div>
            <div class="list-col">{{ peinture.categorieLibelle }}</div>
            <div class="list-col">
              <span class="status-badge" [class]="getStatusClass(peinture)">
                {{ getStatusLabel(peinture) }}
              </span>
            </div>
            <div class="list-col">
              <div class="action-buttons">
                <button class="btn-action-small btn-edit" (click)="edit(peinture)" title="Modifier">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button class="btn-action-small btn-delete" (click)="confirmDelete(peinture)" title="Supprimer">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- État vide -->
        <div *ngIf="filteredPeintures.length === 0" class="empty-state">
          <div class="empty-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" stroke="currentColor" stroke-width="1.5" opacity="0.3"/>
            </svg>
          </div>
          <h3>{{ getEmptyStateTitle() }}</h3>
          <p>{{ getEmptyStateMessage() }}</p>
          <button *ngIf="hasActiveFilters()" class="btn-reset" (click)="clearFilters()">
            Effacer les filtres
          </button>
          <button *ngIf="!hasActiveFilters()" class="btn-create" (click)="create()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Créer votre première œuvre
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }
    
    .dashboard-header {
      background: white;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }
    
    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .title-section {
      margin-bottom: 2rem;
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
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }
    
    .stat-card {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
    }
    
    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
    }
    
    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    
    .stat-info {
      flex: 1;
    }
    
    .stat-number {
      font-size: 1.75rem;
      font-weight: 700;
      color: #2c3e50;
      line-height: 1;
    }
    
    .stat-label {
      font-size: 0.875rem;
      color: #6c757d;
      margin-top: 0.25rem;
    }
    
    .actions-section {
      background: white;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      margin-bottom: 2rem;
    }
    
    .actions-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 1.5rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
    }
    
    .primary-actions {
      flex-shrink: 0;
    }
    
    .btn-create {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 12px;
      padding: 0.875rem 1.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      font-size: 0.875rem;
    }
    
    .btn-create:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    }
    
    .filters-section {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      flex: 1;
    }
    
    .search-bar {
      position: relative;
      flex: 1;
      max-width: 300px;
    }
    
    .search-bar svg {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #6c757d;
    }
    
    .search-input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 3rem;
      border: 2px solid #e1e5e9;
      border-radius: 12px;
      font-size: 0.875rem;
      transition: all 0.3s ease;
    }
    
    .search-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    .filter-options {
      flex-shrink: 0;
    }
    
    .filter-select {
      padding: 0.75rem 1rem;
      border: 2px solid #e1e5e9;
      border-radius: 12px;
      font-size: 0.875rem;
      background: white;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .filter-select:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    .view-toggle {
      display: flex;
      gap: 0.25rem;
      background: #f8f9fa;
      padding: 0.25rem;
      border-radius: 8px;
    }
    
    .view-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: transparent;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      color: #6c757d;
      transition: all 0.3s ease;
    }
    
    .view-btn.active {
      background: white;
      color: #667eea;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
    
    .content-section {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem 2rem;
    }
    
    .artworks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 2rem;
    }
    
    .artwork-card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
    }
    
    .artwork-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
    }
    
    .artwork-image {
      position: relative;
      height: 200px;
      overflow: hidden;
    }
    
    .artwork-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    
    .artwork-card:hover .artwork-image img {
      transform: scale(1.05);
    }
    
    .artwork-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .artwork-card:hover .artwork-overlay {
      opacity: 1;
    }
    
    .btn-action {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .btn-edit {
      background: #28a745;
      color: white;
    }
    
    .btn-edit:hover {
      background: #218838;
      transform: scale(1.1);
    }
    
    .btn-delete {
      background: #dc3545;
      color: white;
    }
    
    .btn-delete:hover {
      background: #c82333;
      transform: scale(1.1);
    }
    
    .artwork-status {
      position: absolute;
      top: 1rem;
      right: 1rem;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      color: white;
    }
    
    .status-available {
      background: #28a745;
    }
    
    .status-low-stock {
      background: #ffc107;
      color: #212529;
    }
    
    .status-out-of-stock {
      background: #6c757d;
    }
    
    .status-unavailable {
      background: #dc3545;
    }
    
    .artwork-info {
      padding: 1.5rem;
    }
    
    .artwork-title {
      font-size: 1.125rem;
      font-weight: 700;
      color: #2c3e50;
      margin: 0 0 0.75rem 0;
      line-height: 1.3;
    }
    
    .artwork-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }
    
    .artwork-price {
      font-size: 1.25rem;
      font-weight: 700;
      color: #667eea;
    }
    
    .artwork-category {
      background: #f8f9fa;
      color: #6c757d;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    
    .artwork-details {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.875rem;
      color: #6c757d;
    }
    
    .artwork-stock {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .artwork-date {
      font-size: 0.75rem;
    }
    
    .artworks-list {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    }
    
    .list-header {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
      gap: 1rem;
      padding: 1rem 1.5rem;
      background: #f8f9fa;
      font-weight: 600;
      font-size: 0.875rem;
      color: #495057;
      border-bottom: 1px solid #e1e5e9;
    }
    
    .list-item {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
      gap: 1rem;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #f1f3f4;
      align-items: center;
      transition: background 0.3s ease;
    }
    
    .list-item:hover {
      background: #f8f9fa;
    }
    
    .list-item:last-child {
      border-bottom: none;
    }
    
    .list-col {
      display: flex;
      align-items: center;
    }
    
    .artwork-info-col {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .artwork-thumbnail {
      width: 60px;
      height: 60px;
      border-radius: 8px;
      overflow: hidden;
      flex-shrink: 0;
    }
    
    .artwork-thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .artwork-details h4 {
      margin: 0 0 0.25rem 0;
      font-size: 0.875rem;
      font-weight: 600;
      color: #2c3e50;
    }
    
    .artwork-details .artwork-date {
      font-size: 0.75rem;
      color: #6c757d;
    }
    
    .stock-badge, .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    
    .stock-good {
      background: #d4edda;
      color: #155724;
    }
    
    .stock-low {
      background: #fff3cd;
      color: #856404;
    }
    
    .stock-empty {
      background: #f8d7da;
      color: #721c24;
    }
    
    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }
    
    .btn-action-small {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .btn-action-small.btn-edit {
      background: #e3f2fd;
      color: #1976d2;
    }
    
    .btn-action-small.btn-edit:hover {
      background: #1976d2;
      color: white;
    }
    
    .btn-action-small.btn-delete {
      background: #ffebee;
      color: #d32f2f;
    }
    
    .btn-action-small.btn-delete:hover {
      background: #d32f2f;
      color: white;
    }
    
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #6c757d;
    }
    
    .empty-icon {
      margin-bottom: 2rem;
      opacity: 0.5;
    }
    
    .empty-state h3 {
      font-size: 1.5rem;
      color: #495057;
      margin-bottom: 0.75rem;
    }
    
    .empty-state p {
      font-size: 1rem;
      margin-bottom: 2rem;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .btn-reset {
      background: #6c757d;
      color: white;
      border: none;
      border-radius: 12px;
      padding: 0.75rem 1.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-right: 1rem;
    }
    
    .btn-reset:hover {
      background: #5a6268;
      transform: translateY(-2px);
    }
    
    @media (max-width: 1024px) {
      .stats-grid {
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 1rem;
      }
      
      .stat-card {
        padding: 1.25rem;
      }
      
      .stat-number {
        font-size: 1.5rem;
      }
      
      .actions-content {
        flex-direction: column;
        align-items: stretch;
        gap: 1.5rem;
      }
      
      .filters-section {
        flex-direction: column;
        gap: 1rem;
      }
      
      .search-bar {
        max-width: none;
      }
      
      .artworks-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1.5rem;
      }
    }
    
    @media (max-width: 768px) {
      .header-content {
        padding: 1.5rem 1rem;
      }
      
      .title-section {
        margin-bottom: 1.5rem;
        text-align: center;
      }
      
      .title-section h1 {
        font-size: 2rem;
      }
      
      .title-section p {
        font-size: 1rem;
      }
      
      .stats-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      
      .stat-card {
        padding: 1rem;
        flex-direction: column;
        text-align: center;
        gap: 0.75rem;
      }
      
      .stat-icon {
        width: 40px;
        height: 40px;
      }
      
      .stat-number {
        font-size: 1.5rem;
      }
      
      .content-section {
        padding: 0 1rem 2rem;
      }
      
      .actions-content {
        padding: 1rem;
        flex-direction: column;
        gap: 1rem;
      }
      
      .primary-actions {
        text-align: center;
      }
      
      .btn-create {
        width: 100%;
        justify-content: center;
        padding: 1rem 1.5rem;
        font-size: 1rem;
      }
      
      .filters-section {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }
      
      .search-input {
        padding: 0.875rem 1rem 0.875rem 2.5rem;
        font-size: 0.875rem;
      }
      
      .search-bar svg {
        left: 0.75rem;
        width: 18px;
        height: 18px;
      }
      
      .filter-select {
        padding: 0.875rem 1rem;
        font-size: 0.875rem;
      }
      
      .view-toggle {
        justify-content: center;
        margin: 0 auto;
      }
      
      .view-btn {
        width: 44px;
        height: 44px;
      }
      
      .artworks-grid {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1.5rem;
      }
      
      .artwork-card {
        margin: 0;
      }
      
      .artwork-image {
        height: 180px;
      }
      
      .artwork-info {
        padding: 1.25rem;
      }
      
      .artwork-title {
        font-size: 1rem;
      }
      
      .artwork-price {
        font-size: 1.125rem;
      }
      
      .artwork-overlay {
        gap: 0.75rem;
      }
      
      .btn-action {
        width: 36px;
        height: 36px;
      }
      
      .list-header {
        display: none;
      }
      
      .list-item {
        display: block;
        padding: 1rem;
        border-radius: 12px;
        margin-bottom: 1rem;
        background: white !important;
      }
      
      .artwork-info-col {
        margin-bottom: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #f1f3f4;
      }
      
      .list-col {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
        font-size: 0.875rem;
      }
      
      .list-col:last-child {
        margin-bottom: 0;
        justify-content: center;
      }
      
      .list-col:before {
        content: attr(data-label);
        font-weight: 600;
        color: #6c757d;
        font-size: 0.8rem;
      }
      
      .action-buttons {
        justify-content: center;
        gap: 0.75rem;
      }
      
      .btn-action-small {
        width: 36px;
        height: 36px;
      }
      
      .empty-state {
        padding: 2rem 1rem;
      }
      
      .empty-state h3 {
        font-size: 1.25rem;
      }
      
      .empty-state p {
        font-size: 0.875rem;
      }
    }
    
    @media (max-width: 480px) {
      .header-content {
        padding: 1rem 0.75rem;
      }
      
      .title-section h1 {
        font-size: 1.75rem;
      }
      
      .stats-grid {
        gap: 0.75rem;
      }
      
      .stat-card {
        padding: 0.875rem;
      }
      
      .stat-icon {
        width: 36px;
        height: 36px;
      }
      
      .stat-number {
        font-size: 1.25rem;
      }
      
      .stat-label {
        font-size: 0.8rem;
      }
      
      .content-section {
        padding: 0 0.75rem 1rem;
      }
      
      .actions-content {
        padding: 0.75rem;
      }
      
      .btn-create {
        padding: 0.875rem 1.25rem;
        font-size: 0.875rem;
      }
      
      .artworks-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      
      .artwork-image {
        height: 160px;
      }
      
      .artwork-info {
        padding: 1rem;
      }
      
      .artwork-overlay {
        gap: 0.5rem;
      }
      
      .btn-action {
        width: 32px;
        height: 32px;
      }
      
      .btn-action svg {
        width: 14px;
        height: 14px;
      }
      
      .list-item {
        padding: 0.875rem;
      }
      
      .action-buttons {
        gap: 0.5rem;
      }
      
      .btn-action-small {
        width: 32px;
        height: 32px;
      }
      
      .btn-action-small svg {
        width: 12px;
        height: 12px;
      }
      
      .empty-state {
        padding: 1.5rem 0.75rem;
      }
      
      .empty-icon svg {
        width: 60px;
        height: 60px;
      }
    }
  `]
})
export class DashboardArtisteComponent implements OnInit {
  peintures: Peinture[] = [];
  filteredPeintures: Peinture[] = [];
  isLoading = false;
  searchTerm = '';
  filterStatus = 'ALL';
  viewMode: 'grid' | 'list' = 'grid';

  constructor(
    private peintureService: PeintureService, 
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    console.log('Loading artworks for current artist...');
    
    // Test both endpoints to compare
    this.peintureService.getAllPeintures().subscribe({
      next: (allData) => {
        console.log('All artworks in database:', allData);
        
        // Now try to get only current artist's artworks
        this.peintureService.getMyArtworks().subscribe({
          next: (data) => {
            console.log('My artworks:', data);
            this.peintures = data;
            this.applyFilters();
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Erreur chargement mes peintures:', err);
            console.error('Error details:', {
              status: err.status,
              message: err.message,
              error: err.error
            });
            this.notificationService.showError('Erreur', 'Impossible de charger vos œuvres');
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error('Erreur chargement toutes les peintures:', err);
      }
    });
  }

  create(): void {
    this.router.navigateByUrl('/dashboard/artiste/nouveau');
  }

  edit(peinture: Peinture): void {
    this.router.navigateByUrl(`/dashboard/artiste/${peinture.id}`);
  }

  confirmDelete(peinture: Peinture): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${peinture.titre}" ?\nCette action est irréversible.`)) {
      this.remove(peinture);
    }
  }

  remove(peinture: Peinture): void {
    this.peintureService.deletePeinture(peinture.id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Succès', `"${peinture.titre}" a été supprimée`);
        this.load();
      },
      error: (err) => {
        console.error('Erreur suppression:', err);
        this.notificationService.showError('Erreur', 'Impossible de supprimer cette œuvre');
      }
    });
  }

  // Filtres et recherche
  applyFilters(): void {
    let filtered = [...this.peintures];

    // Recherche textuelle
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.titre.toLowerCase().includes(term) ||
        p.categorieLibelle.toLowerCase().includes(term)
      );
    }

    // Filtre par statut
    if (this.filterStatus === 'AVAILABLE') {
      filtered = filtered.filter(p => p.disponible && p.stock > 0);
    } else if (this.filterStatus === 'UNAVAILABLE') {
      filtered = filtered.filter(p => !p.disponible || p.stock === 0);
    }

    this.filteredPeintures = filtered;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filterStatus = 'ALL';
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return this.searchTerm !== '' || this.filterStatus !== 'ALL';
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  // Utilitaires
  getAvailableCount(): number {
    return this.peintures.filter(p => p.disponible && p.stock > 0).length;
  }

  getTotalValue(): number {
    return this.peintures.reduce((total, p) => total + (p.prix * p.stock), 0);
  }

  getStatusClass(peinture: Peinture): string {
    if (!peinture.disponible) return 'status-unavailable';
    if (peinture.stock === 0) return 'status-out-of-stock';
    if (peinture.stock <= 3) return 'status-low-stock';
    return 'status-available';
  }

  getStatusLabel(peinture: Peinture): string {
    if (!peinture.disponible) return 'Non disponible';
    if (peinture.stock === 0) return 'Épuisé';
    if (peinture.stock <= 3) return 'Stock faible';
    return 'Disponible';
  }

  getStockClass(stock: number): string {
    if (stock === 0) return 'stock-empty';
    if (stock <= 3) return 'stock-low';
    return 'stock-good';
  }

  getPlaceholderImage(): string {
    return 'https://via.placeholder.com/300x200/f8f9fa/6c757d?text=Aucune+Image';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getEmptyStateTitle(): string {
    if (this.hasActiveFilters()) {
      return 'Aucun résultat trouvé';
    }
    return 'Aucune œuvre créée';
  }

  getEmptyStateMessage(): string {
    if (this.hasActiveFilters()) {
      return 'Essayez de modifier vos critères de recherche.';
    }
    return 'Commencez à créer vos premières œuvres d\'art pour enrichir votre galerie.';
  }
}


