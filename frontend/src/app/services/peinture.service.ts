import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Peinture } from '../models/peinture.model';

@Injectable({
  providedIn: 'root'
})
export class PeintureService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  getAllPeintures(): Observable<Peinture[]> {
    return this.http.get<Peinture[]>(`${this.apiUrl}/peintures`);
  }

  getPeintureById(id: number): Observable<Peinture> {
    return this.http.get<Peinture>(`${this.apiUrl}/peintures/${id}`);
  }

  createPeinture(peinture: Partial<Peinture>): Observable<Peinture> {
    return this.http.post<Peinture>(`${this.apiUrl}/peintures`, peinture);
  }

  updatePeinture(id: number, peinture: Partial<Peinture>): Observable<Peinture> {
    return this.http.put<Peinture>(`${this.apiUrl}/peintures/${id}`, peinture);
  }

  deletePeinture(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/peintures/${id}`);
  }
}
