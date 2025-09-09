import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { RegisterRequest } from '../../../models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="register-overlay" (click)="onClose()">
      <div class="register-modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Créer un compte</h2>
          <button class="close-btn" (click)="onClose()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
          <div class="form-row">
            <div class="form-group">
              <label for="prenom">Prénom</label>
              <input 
                type="text" 
                id="prenom" 
                formControlName="prenom" 
                placeholder="Votre prénom"
                [class.error]="registerForm.get('prenom')?.invalid && registerForm.get('prenom')?.touched">
              <div class="error-message" *ngIf="registerForm.get('prenom')?.invalid && registerForm.get('prenom')?.touched">
                <span *ngIf="registerForm.get('prenom')?.errors?.['required']">Le prénom est requis</span>
              </div>
            </div>

            <div class="form-group">
              <label for="nom">Nom</label>
              <input 
                type="text" 
                id="nom" 
                formControlName="nom" 
                placeholder="Votre nom"
                [class.error]="registerForm.get('nom')?.invalid && registerForm.get('nom')?.touched">
              <div class="error-message" *ngIf="registerForm.get('nom')?.invalid && registerForm.get('nom')?.touched">
                <span *ngIf="registerForm.get('nom')?.errors?.['required']">Le nom est requis</span>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              formControlName="email" 
              placeholder="votre@email.com"
              [class.error]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
            <div class="error-message" *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
              <span *ngIf="registerForm.get('email')?.errors?.['required']">L'email est requis</span>
              <span *ngIf="registerForm.get('email')?.errors?.['email']">Format d'email invalide</span>
            </div>
          </div>

          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input 
              type="password" 
              id="password" 
              formControlName="password" 
              placeholder="Minimum 6 caractères"
              [class.error]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
            <div class="error-message" *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
              <span *ngIf="registerForm.get('password')?.errors?.['required']">Le mot de passe est requis</span>
              <span *ngIf="registerForm.get('password')?.errors?.['minlength']">Minimum 6 caractères</span>
            </div>
          </div>

          <div class="form-group">
            <label for="role">Type de compte</label>
            <select 
              id="role" 
              formControlName="role" 
              [class.error]="registerForm.get('role')?.invalid && registerForm.get('role')?.touched">
              <option value="">Sélectionnez votre type de compte</option>
              <option value="CLIENT">Client - Acheter des œuvres</option>
              <option value="ARTISTE">Artiste - Vendre mes œuvres</option>
            </select>
            <div class="error-message" *ngIf="registerForm.get('role')?.invalid && registerForm.get('role')?.touched">
              <span *ngIf="registerForm.get('role')?.errors?.['required']">Le type de compte est requis</span>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-register" [disabled]="registerForm.invalid || isLoading">
              <span *ngIf="!isLoading">Créer mon compte</span>
              <span *ngIf="isLoading" class="loading-spinner"></span>
            </button>
          </div>

          <div class="form-footer">
            <p>Déjà un compte ? <button type="button" class="link-btn" (click)="onSwitchToLogin()">Se connecter</button></p>
          </div>

          <div class="error-message" *ngIf="errorMessage" class="global-error">
            {{ errorMessage }}
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .register-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(4px);
    }

    .register-modal {
      background: white;
      border-radius: 20px;
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2rem 2rem 1rem;
      border-bottom: 1px solid #e9ecef;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: #2c3e50;
    }

    .close-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 50%;
      color: #6c757d;
      transition: all 0.2s ease;
    }

    .close-btn:hover {
      background: #f8f9fa;
      color: #2c3e50;
    }

    .register-form {
      padding: 2rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #2c3e50;
    }

    .form-group input,
    .form-group select {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 2px solid #e9ecef;
      border-radius: 12px;
      font-size: 1rem;
      transition: all 0.3s ease;
      box-sizing: border-box;
    }

    .form-group input:focus,
    .form-group select:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-group input.error,
    .form-group select.error {
      border-color: #e74c3c;
    }

    .error-message {
      color: #e74c3c;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .global-error {
      background: #fee;
      border: 1px solid #fcc;
      color: #c33;
      padding: 0.75rem;
      border-radius: 8px;
      margin-top: 1rem;
      text-align: center;
    }

    .form-actions {
      margin-bottom: 1.5rem;
    }

    .btn-register {
      width: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 12px;
      padding: 0.875rem 1rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .btn-register:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    }

    .btn-register:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .loading-spinner {
      width: 20px;
      height: 20px;
      border: 2px solid transparent;
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .form-footer {
      text-align: center;
      color: #6c757d;
    }

    .link-btn {
      background: none;
      border: none;
      color: #667eea;
      cursor: pointer;
      font-weight: 600;
      text-decoration: underline;
    }

    .link-btn:hover {
      color: #764ba2;
    }

    @media (max-width: 600px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 480px) {
      .register-modal {
        width: 95%;
        margin: 1rem;
      }
      
      .modal-header, .register-form {
        padding: 1.5rem;
      }
    }
  `]
})
export class RegisterComponent {
  @Output() close = new EventEmitter<void>();
  @Output() switchToLogin = new EventEmitter<void>();

  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      prenom: ['', [Validators.required]],
      nom: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const userData: RegisterRequest = this.registerForm.value;
      
      this.authService.register(userData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.onClose();
          // L'utilisateur est automatiquement connecté via le service
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error || 'Erreur lors de la création du compte';
        }
      });
    }
  }

  onClose() {
    this.close.emit();
  }

  onSwitchToLogin() {
    this.switchToLogin.emit();
  }
}
