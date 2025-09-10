import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PeintureService } from '../../services/peinture.service';
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
    .form-wrapper { display:flex; justify-content:center; padding:24px; }
    .form-card { width: min(960px, 100%); background:#fff; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,.08); padding:24px; }
    .form-header h2 { margin:0 0 4px 0; }
    .subtitle { color:#6c757d; margin:0 0 16px 0; }
    .grid { display:grid; grid-template-columns: repeat(2, 1fr); gap:16px; }
    .field { display:flex; flex-direction:column; }
    .field input, .field select, .field textarea { border:1px solid #e5e7eb; border-radius:10px; padding:10px 12px; font-size:14px; outline:none; transition:border .2s, box-shadow .2s; }
    .field input:focus, .field select:focus, .field textarea:focus { border-color:#7c3aed; box-shadow:0 0 0 3px rgba(124,58,237,.15); }
    .error { color:#dc3545; font-size:12px; margin-top:6px; }
    .col-span-2 { grid-column: span 2; }
    .preview { border:1px dashed #e5e7eb; border-radius:12px; padding:12px; display:flex; justify-content:center; align-items:center; background:#fafafa; }
    .preview img { max-height:220px; border-radius:8px; object-fit:cover; }
    .switch { display:flex; align-items:center; }
    .actions { display:flex; justify-content:flex-end; gap:12px; margin-top:8px; }
    .btn { border:none; border-radius:10px; padding:10px 16px; font-weight:600; cursor:pointer; transition:transform .15s, box-shadow .15s; }
    .btn.primary { color:#fff; background:linear-gradient(135deg,#667eea 0%, #764ba2 100%); box-shadow:0 8px 20px rgba(102,126,234,.25); }
    .btn.secondary { background:#f1f3f5; color:#343a40; }
    .btn:hover { transform: translateY(-1px); }
    @media (max-width: 720px) { .grid { grid-template-columns: 1fr; } .col-span-2 { grid-column: auto; } }
  `]
})
export class PeintureFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private peintureService = inject(PeintureService);

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
      this.peintureService.getPeintureById(this.id).subscribe((p: Peinture) => {
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
      });
    }
  }

  submit(): void {
    if (this.form.invalid) return;
    const payload = this.form.value as Partial<Peinture>;
    const request$ = this.isEdit
      ? this.peintureService.updatePeinture(this.id, payload)
      : this.peintureService.createPeinture(payload);
    request$.subscribe(() => this.router.navigateByUrl('/artistes'));
  }

  cancel(): void {
    this.router.navigateByUrl('/artistes');
  }

  onImageChange(): void {
    const url = this.form.get('imageUrl')?.value as string;
    this.imagePreview = url && url.startsWith('http') ? url : null;
  }
}


