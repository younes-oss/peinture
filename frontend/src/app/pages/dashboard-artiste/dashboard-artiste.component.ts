import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PeintureService } from '../../services/peinture.service';
import { Peinture } from '../../models/peinture.model';

@Component({
  selector: 'app-dashboard-artiste',
  standalone: true,
  imports: [CommonModule,RouterLink],
  template: `
    <section class="container">
      <h2>Mes peintures</h2>
      <button (click)="create()">+ Nouvelle peinture</button>
      <table *ngIf="peintures.length; else empty">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Prix</th>
            <th>Stock</th>
            <th>Catégorie</th>
            <th>Disponible</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let p of peintures">
            <td>{{ p.titre }}</td>
            <td>{{ p.prix | number:'1.0-0' }} €</td>
            <td>{{ p.stock }}</td>
            <td>{{ p.categorieLibelle }}</td>
            <td>{{ p.disponible ? 'Oui' : 'Non' }}</td>
            <td>
              <button (click)="edit(p)">Modifier</button>
              <button (click)="remove(p)" style="color:#c00">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
      <ng-template #empty>
        <p>Aucune peinture pour le moment.</p>
      </ng-template>
    </section>
  `
})
export class DashboardArtisteComponent implements OnInit {
  peintures: Peinture[] = [];

  constructor(private peintureService: PeintureService, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.peintureService.getAllPeintures().subscribe(data => this.peintures = data);
  }

  create(): void {
    this.router.navigateByUrl('/dashboard/artiste/nouveau');
  }

  edit(p: Peinture): void {
    this.router.navigateByUrl(`/dashboard/artiste/${p.id}`);
  }

  remove(p: Peinture): void {
    if (!confirm(`Supprimer "${p.titre}" ?`)) return;
    this.peintureService.deletePeinture(p.id).subscribe(() => this.load());
  }
}


