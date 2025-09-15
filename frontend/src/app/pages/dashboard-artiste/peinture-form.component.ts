import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PeintureService } from '../../services/peinture.service';
import { NotificationService } from '../../services/notification.service';
import { Peinture } from '../../models/peinture.model';

@Component({
  selector: 'app-peinture-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="form-wrapper">
      <div class="form-card">
        <div class="form-header">
          <h2>{{ isEdit ? 'Modifier' : 'Créer' }} une peinture</h2>
          <p class="subtitle">Complétez les informations ci-dessous puis validez.</p>
        </div>

        <form class="grid" [formGroup]="form" (ngSubmit)="submit()">
          <div class="field">
            <label>Titre</label>
            <input formControlName="titre" placeholder="Ex: Nymphéas au crépuscule" />
            <small class="error" *ngIf="form.get('titre')?.touched && form.get('titre')?.invalid">
              Le titre est requis (255 caractères max).
            </small>
          </div>

          <div class="field">
            <label>Prix (€)</label>
            <input type="number" formControlName="prix" min="0" placeholder="Ex: 1200" />
            <small class="error" *ngIf="form.get('prix')?.touched && form.get('prix')?.invalid">
              Prix invalide.
            </small>
          </div>

          <div class="field">
            <label>Stock</label>
            <input type="number" formControlName="stock" min="0" placeholder="Ex: 3" />
            <small class="error" *ngIf="form.get('stock')?.touched && form.get('stock')?.invalid">
              Stock invalide.
            </small>
          </div>

          <div class="field">
            <label>Catégorie</label>
            <select formControlName="categorie">
              <option value="" disabled>Choisir...</option>
              <option value="IMPRESSIONNISME">Impressionnisme</option>
              <option value="POST_IMPRESSIONNISME">Post-impressionnisme</option>
              <option value="SURREALISME">Surréalisme</option>
              <option value="ABSTRACTION">Abstraction</option>
              <option value="REALISME">Réalisme</option>
              <option value="CONTEMPORAIN">Contemporain</option>
              <option value="CLASSIQUE">Classique</option>
              <option value="MODERNE">Moderne</option>
            </select>
            <small class="error" *ngIf="form.get('categorie')?.touched && form.get('categorie')?.invalid">
              Catégorie requise.
            </small>
          </div>

          <div class="field col-span-2">
            <label>Description</label>
            <textarea rows="4" formControlName="description" placeholder="Décrivez l'œuvre..."></textarea>
          </div>

          <div class="field col-span-2">
            <label>URL image</label>
            <input formControlName="imageUrl" placeholder="https://..." (input)="onImageChange()" />
          </div>

          <div class="preview col-span-2" *ngIf="imagePreview">
            <img [src]="imagePreview" alt="Prévisualisation" />
          </div>

          <div class="switch col-span-2">
            <label>
              <input type="checkbox" formControlName="disponible" /> Disponible à la vente
            </label>
          </div>

          <div class="actions col-span-2">
            <button type="button" class="btn secondary" (click)="cancel()">Annuler</button>
            <button type="submit" class="btn primary" [disabled]="form.invalid">
              {{ isEdit ? 'Mettre à jour' : 'Créer' }}
            </button>
          </div>
        </form>
      </div>
    </section>
  `,
  styles: [`
    .form-wrapper {
      display: flex;
      justify-content: center;
      padding: 1.5rem;
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }
    
    .form-card {
      width: min(960px, 100%);
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0,0,0,.08);
      padding: 2rem;
      align-self: flex-start;
    }
    
    .form-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .form-header h2 {
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
      font-weight: 700;
      color: #2c3e50;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .subtitle {
      color: #6c757d;
      margin: 0;
      font-size: 1rem;
    }
    
    .grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }
    
    .field {
      display: flex;
      flex-direction: column;
    }
    
    .field label {
      font-weight: 600;
      color: #495057;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
    }
    
    .field input,
    .field select,
    .field textarea {
      border: 2px solid #e1e5e9;
      border-radius: 12px;
      padding: 0.875rem 1rem;
      font-size: 1rem;
      outline: none;
      transition: all 0.3s ease;
      background: white;
    }
    
    .field input:focus,
    .field select:focus,
    .field textarea:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      transform: scale(1.01);
    }
    
    .field select {
      cursor: pointer;
      background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23666"><path d="M7 10l5 5 5-5z"/></svg>');
      background-repeat: no-repeat;
      background-position: right 1rem center;
      background-size: 16px;
      -webkit-appearance: none;
      appearance: none;
      padding-right: 3rem;
    }
    
    .field textarea {
      resize: vertical;
      min-height: 100px;
      font-family: inherit;
    }
    
    .error {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.5rem;
      font-weight: 500;
    }
    
    .col-span-2 {
      grid-column: span 2;
    }
    
    .preview {
      border: 2px dashed #e1e5e9;
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #f8f9fa;
      min-height: 200px;
    }
    
    .preview img {
      max-height: 220px;
      max-width: 100%;
      border-radius: 8px;
      object-fit: cover;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .switch {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 12px;
      border: 2px solid transparent;
      transition: all 0.3s ease;
    }
    
    .switch:hover {
      border-color: #e1e5e9;
    }
    
    .switch input[type="checkbox"] {
      width: 20px;
      height: 20px;
      margin: 0;
    }
    
    .switch label {
      margin: 0;
      font-weight: 600;
      color: #495057;
      cursor: pointer;
      user-select: none;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1.5rem;
    }
    
    .btn {
      border: none;
      border-radius: 12px;
      padding: 0.875rem 1.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 1rem;
      min-width: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .btn.primary {
      color: #fff;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
    
    .btn.primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
    }
    
    .btn.secondary {
      background: #f8f9fa;
      color: #495057;
      border: 2px solid #e1e5e9;
    }
    
    .btn.secondary:hover {
      background: #e9ecef;
      transform: translateY(-1px);
    }
    
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none !important;
    }
    
    /* Mobile optimizations */
    @media (max-width: 768px) {
      .form-wrapper {
        padding: 1rem;
      }
      
      .form-card {
        padding: 1.5rem;
      }
      
      .form-header h2 {
        font-size: 1.75rem;
      }
      
      .grid {
        grid-template-columns: 1fr;
        gap: 1.25rem;
      }
      
      .col-span-2 {
        grid-column: auto;
      }
      
      .field input,
      .field select,
      .field textarea {
        font-size: 16px; /* Prevents zoom on iOS */
        padding: 1rem;
        min-height: 44px;
      }
      
      .field textarea {
        min-height: 120px;
      }
      
      .actions {
        flex-direction: column-reverse;
        gap: 0.75rem;
      }
      
      .btn {
        width: 100%;
        min-height: 48px;
        font-size: 1rem;
        padding: 1rem 1.5rem;
      }
      
      .switch {
        padding: 1.25rem;
        flex-direction: column;
        text-align: center;
        gap: 1rem;
      }
      
      .switch input[type="checkbox"] {
        width: 24px;
        height: 24px;
      }
      
      .preview {
        min-height: 150px;
        padding: 1rem;
      }
    }
    
    @media (max-width: 480px) {
      .form-wrapper {
        padding: 0.75rem;
      }
      
      .form-card {
        padding: 1rem;
      }
      
      .form-header {
        margin-bottom: 1.5rem;
      }
      
      .form-header h2 {
        font-size: 1.5rem;
      }
      
      .grid {
        gap: 1rem;
      }
    }
    
    /* Touch device optimizations */
    @media (hover: none) and (pointer: coarse) {
      .btn:hover {
        transform: none;
      }
      
      .field input:focus,
      .field select:focus,
      .field textarea:focus {
        transform: none;
      }
    }
  `]
})
export class PeintureFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private peintureService = inject(PeintureService);
  private notificationService = inject(NotificationService);

  form!: FormGroup;
  isEdit = false;
  id!: number;
  imagePreview: string | null = null;

  ngOnInit(): void {
    this.form = this.fb.group({
      titre: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''],
      prix: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      imageUrl: [''],
      categorie: ['', Validators.required],
      disponible: [true]
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'nouveau') {
      this.isEdit = true;
      this.id = Number(idParam);
      this.peintureService.getPeintureById(this.id).subscribe({
        next: (p: Peinture) => {
          this.form.patchValue({
            titre: p.titre,
            description: p.description,
            prix: p.prix,
            stock: p.stock,
            imageUrl: p.imageUrl,
            categorie: p.categorie,
            disponible: p.disponible
          });
          this.imagePreview = p.imageUrl || null;
        },
        error: (err) => {
          console.error('Erreur chargement peinture:', err);
          this.notificationService.showError('Erreur', 'Impossible de charger cette œuvre ou vous n\'avez pas l\'autorisation');
          this.router.navigateByUrl('/dashboard/artiste');
        }
      });
    }
  }

  submit(): void {
    if (this.form.invalid) return;
    const payload = this.form.value as Partial<Peinture>;
    const request$ = this.isEdit
      ? this.peintureService.updatePeinture(this.id, payload)
      : this.peintureService.createPeinture(payload);
    
    request$.subscribe({
      next: () => {
        const message = this.isEdit ? 'Œuvre modifiée avec succès' : 'Œuvre créée avec succès';
        this.notificationService.showSuccess('Succès', message);
        this.router.navigateByUrl('/dashboard/artiste');
      },
      error: (err) => {
        console.error('Erreur soumission:', err);
        if (err.status === 400 && err.error && typeof err.error === 'string' && err.error.includes('propres')) {
          this.notificationService.showError('Erreur d\'autorisation', 'Vous ne pouvez modifier que vos propres œuvres');
        } else {
          this.notificationService.showError('Erreur', 'Impossible de sauvegarder cette œuvre');
        }
      }
    });
  }

  cancel(): void {
    this.router.navigateByUrl('/dashboard/artiste');
  }

  onImageChange(): void {
    const url = this.form.get('imageUrl')?.value as string;
    this.imagePreview = url && url.startsWith('http') ? url : null;
  }
}


