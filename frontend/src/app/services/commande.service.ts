import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Commande, CreerCommandeRequest, StatutInfo, StatutCommande } from '../models/commande.model';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private apiUrl = 'http://localhost:8081/api/commandes';

  constructor(private http: HttpClient) {}

  /**
   * Créer une nouvelle commande à partir du panier
   */
  creerCommande(request: CreerCommandeRequest): Observable<Commande> {
    return this.http.post<Commande>(this.apiUrl, request);
  }

  /**
   * Récupérer toutes mes commandes
   */
  getMesCommandes(): Observable<Commande[]> {
    return this.http.get<Commande[]>(this.apiUrl);
  }

  /**
   * Récupérer une commande par son ID
   */
  getCommandeById(id: number): Observable<Commande> {
    return this.http.get<Commande>(`${this.apiUrl}/${id}`);
  }

  /**
   * Annuler une commande
   */
  annulerCommande(id: number): Observable<Commande> {
    return this.http.put<Commande>(`${this.apiUrl}/${id}/annuler`, {});
  }

  /**
   * Obtenir les informations de style pour un statut
   */
  getStatutInfo(statut: StatutCommande): StatutInfo {
    const statutsConfig: Record<StatutCommande, StatutInfo> = {
      'EN_COURS': {
        code: 'EN_COURS',
        label: 'En cours',
        color: '#d97706',
        bgColor: '#fef3c7'
      },
      'EXPEDIEE': {
        code: 'EXPEDIEE',
        label: 'Expédiée',
        color: '#0369a1',
        bgColor: '#dbeafe'
      },
      'LIVREE': {
        code: 'LIVREE',
        label: 'Livrée',
        color: '#065f46',
        bgColor: '#d1fae5'
      },
      'ANNULEE': {
        code: 'ANNULEE',
        label: 'Annulée',
        color: '#dc2626',
        bgColor: '#fee2e2'
      }
    };

    return statutsConfig[statut];
  }

  /**
   * Formater une date pour l'affichage
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Calculer le nombre total d'articles dans une commande
   */
  getTotalArticles(commande: Commande): number {
    return commande.articles.reduce((total, article) => total + article.quantite, 0);
  }
}