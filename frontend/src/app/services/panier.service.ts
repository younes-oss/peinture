import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PanierItemDto {
  peintureId: number;
  peintureTitre: string;
  imageUrl: string;
  quantite: number;
  prixUnitaire: number;
  prixTotal: number;
}

export interface PanierDto {
  id: number;
  clientId: number;
  nombreArticles: number;
  total: number;
  items: PanierItemDto[];
}

@Injectable({ providedIn: 'root' })
export class PanierService {
  private apiUrl = 'http://localhost:8081/api/panier';

  constructor(private http: HttpClient) {}

  getMyPanier(): Observable<PanierDto> {
    return this.http.get<PanierDto>(`${this.apiUrl}`);
  }

  addItem(peintureId: number, quantite: number = 1): Observable<PanierDto> {
    return this.http.post<PanierDto>(`${this.apiUrl}/add`, null, {
      params: { peintureId: peintureId.toString(), quantite: quantite.toString() }
    });
  }

  updateQuantity(peintureId: number, quantite: number): Observable<PanierDto> {
    return this.http.put<PanierDto>(`${this.apiUrl}/update`, null, {
      params: { peintureId: peintureId.toString(), quantite: quantite.toString() }
    });
  }

  removeItem(peintureId: number): Observable<PanierDto> {
    return this.http.delete<PanierDto>(`${this.apiUrl}/remove`, {
      params: { peintureId: peintureId.toString() }
    });
  }

  clear(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/clear`);
  }
}




