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
    <section class="container">
      <h2>{{ isEdit ? 'Modifier' : 'Créer' }} une peinture</h2>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <div>
          <label>Titre</label>
          <input formControlName="titre" />
        </div>
        <div>
          <label>Description</label>
          <textarea formControlName="description"></textarea>
        </div>
        <div>
          <label>Prix (€)</label>
          <input type="number" formControlName="prix" />
        </div>
        <div>
          <label>Stock</label>
          <input type="number" formControlName="stock" />
        </div>
        <div>
          <label>URL image</label>
          <input formControlName="imageUrl" />
        </div>
        <div>
          <label>Catégorie</label>
          <select formControlName="categorie">
            <option value="IMPRESSIONNISME">Impressionnisme</option>
            <option value="POST_IMPRESSIONNISME">Post-impressionnisme</option>
            <option value="SURREALISME">Surréalisme</option>
            <option value="ABSTRACTION">Abstraction</option>
            <option value="REALISME">Réalisme</option>
            <option value="CONTEMPORAIN">Contemporain</option>
            <option value="CLASSIQUE">Classique</option>
            <option value="MODERNE">Moderne</option>
          </select>
        </div>
        <div>
          <label>Disponible</label>
          <input type="checkbox" formControlName="disponible" />
        </div>
        <button type="submit" [disabled]="form.invalid">{{ isEdit ? 'Mettre à jour' : 'Créer' }}</button>
        <button type="button" (click)="cancel()">Annuler</button>
      </form>
    </section>
  `
})
export class PeintureFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private peintureService = inject(PeintureService);

  form!: FormGroup;
  isEdit = false;
  id!: number;

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
}


