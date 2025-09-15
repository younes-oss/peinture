import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ArtisteDto {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  biographie?: string;
  boutique?: string;
  specialite?: string;
  pays?: string;
  ville?: string;
  nombreOeuvres?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ArtisteService {
  private apiUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient) { }

  getAllArtistes(): Observable<ArtisteDto[]> {
    return this.http.get<ArtisteDto[]>(`${this.apiUrl}/artistes`);
  }

  getArtisteById(id: number): Observable<ArtisteDto> {
    return this.http.get<ArtisteDto>(`${this.apiUrl}/artistes/${id}`);
  }

  updateArtiste(id: number, artiste: Partial<ArtisteDto>): Observable<ArtisteDto> {
    return this.http.put<ArtisteDto>(`${this.apiUrl}/artistes/${id}`, artiste);
  }
}