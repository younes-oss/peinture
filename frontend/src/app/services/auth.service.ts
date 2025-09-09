import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, RegisterRequest, AuthResponse, User, AuthState } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  private authState = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null
  });

  public authState$ = this.authState.asObservable();

  constructor(private http: HttpClient) {
    this.initializeAuth();
  }

  private initializeAuth() {
    // Vérifier si nous sommes côté client (browser)
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem(this.TOKEN_KEY);
      const userStr = localStorage.getItem(this.USER_KEY);
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          this.authState.next({
            isAuthenticated: true,
            user,
            token
          });
        } catch (error) {
          this.clearAuth();
        }
      }
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          const user: User = {
            id: 0, // L'ID sera récupéré depuis le token ou une autre API
            email: response.email,
            nom: response.nom,
            prenom: response.prenom,
            role: response.role as 'CLIENT' | 'ARTISTE' | 'ADMIN',
            actif: true
          };
          
          this.setAuth(response.token, user);
        })
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, userData)
      .pipe(
        tap(response => {
          const user: User = {
            id: 0,
            email: response.email,
            nom: response.nom,
            prenom: response.prenom,
            role: response.role as 'CLIENT' | 'ARTISTE' | 'ADMIN',
            actif: true
          };
          
          this.setAuth(response.token, user);
        })
      );
  }

  logout(): void {
    this.clearAuth();
  }

  private setAuth(token: string, user: User): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
    
    this.authState.next({
      isAuthenticated: true,
      user,
      token
    });
  }

  private clearAuth(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    
    this.authState.next({
      isAuthenticated: false,
      user: null,
      token: null
    });
  }

  getToken(): string | null {
    return this.authState.value.token;
  }

  getCurrentUser(): User | null {
    return this.authState.value.user;
  }

  isAuthenticated(): boolean {
    return this.authState.value.isAuthenticated;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  isArtiste(): boolean {
    return this.hasRole('ARTISTE');
  }

  isClient(): boolean {
    return this.hasRole('CLIENT');
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }
}
