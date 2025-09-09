import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PeinturesComponent } from './pages/peintures/peintures.component';
import { ArtistesComponent } from './pages/artistes/artistes.component';
import { PanierComponent } from './pages/panier/panier.component';
import { CommandesComponent } from './pages/commandes/commandes.component';
import { canActivateArtist } from './guards/artist.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'peintures', component: PeinturesComponent },
  { path: 'artistes', component: ArtistesComponent },
  { path: 'panier', component: PanierComponent },
  { path: 'commandes', component: CommandesComponent },
  {
    path: 'dashboard/artiste',
    canActivate: [canActivateArtist],
    loadComponent: () => import('./pages/dashboard-artiste/dashboard-artiste.component').then(m => m.DashboardArtisteComponent)
  },
  {
    path: 'dashboard/artiste/nouveau',
    canActivate: [canActivateArtist],
    loadComponent: () => import('./pages/dashboard-artiste/peinture-form.component').then(m => m.PeintureFormComponent)
  },
  {
    path: 'dashboard/artiste/:id',
    canActivate: [canActivateArtist],
    loadComponent: () => import('./pages/dashboard-artiste/peinture-form.component').then(m => m.PeintureFormComponent)
  },
];
