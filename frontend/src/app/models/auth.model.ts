export interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: 'CLIENT' | 'ARTISTE' | 'ADMIN';
  actif: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  role: 'CLIENT' | 'ARTISTE' | 'ADMIN';
}

export interface AuthResponse {
  token: string;
  email: string;
  role: string;
  nom: string;
  prenom: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}



